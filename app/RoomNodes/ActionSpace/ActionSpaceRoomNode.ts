
/*
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright(c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright(c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2024-2025

	contributors:
	Fabian Töpfer - baniaf@uber.space
	Lars Engeln - mail@lars-engeln.de
*/

import type IRoomNodePublisher from "~/app/Network/IRoomNodePublisher";
import RoomNodeBase from "../RoomNodeBase";
import { RoomNodeType, fromRoomNodeType } from "../RoomNodeRegistry";
import * as THREE from "three";
import type { IRoomNodeManagers } from "~/app/RoomManager";
import { ADDITION, Brush, Evaluator, INTERSECTION, SUBTRACTION } from "three-bvh-csg";
import type CameraRoomNode from "../Camera/CameraRoomNode";
import type KinectRoomNode from "../Kinect/KinectRoomNode";

export enum AS_Shape {
	AS_UNKOWN = -1,
	AS_SPHERE = 0,
	AS_CYLINDER,
	AS_CUBOID,
	AS_CONE,
	AS_FREE
}

export default class ActionSpaceRoomNode extends RoomNodeBase {

	private m_shape: AS_Shape = AS_Shape.AS_CUBOID;
	private m_material = new THREE.MeshPhongMaterial({ color: 0xFFD900, transparent: true, opacity: 0.5, side: THREE.BackSide });
	private m_roomNodeManagers = {} as IRoomNodeManagers;

	private m_brushActionSpace = undefined as Brush | undefined;
	private m_brushCaptureDevices = undefined as Brush | undefined
	private m_evaluator = new Evaluator();

	private m_generalShape = undefined as THREE.Mesh | undefined;
	private m_intersectionShape = undefined as THREE.Object3D | undefined;
	private m_differenceShape = undefined as THREE.Object3D | undefined;

	constructor(publisher: IRoomNodePublisher, onLoadCb: { (roomNode: RoomNodeBase): void }, uid?: string, position?: THREE.Vector3, orientation?: THREE.Quaternion) {
		super("actionspace", publisher, onLoadCb, uid, position, orientation);
		this.setup(onLoadCb);
	}

	public override setup(onLoadCb: { (roomNode: RoomNodeBase): void }): void {
		this.m_caption.value = "ActionSpace";
		this.m_roomNodeType = RoomNodeType.RNT_ACTIONSPACE;

		let position = this.m_object3D.position.clone();
		let orientation = this.m_object3D.quaternion.clone();

		this.m_object3D = reactive<THREE.Object3D>(new THREE.Object3D());

		this.m_object3D.name = "ActionSpace";
		this.m_object3D.castShadow = true;
		this.m_object3D.receiveShadow = true;


		this.getRawObject3D().position.copy(position);
		this.getRawObject3D().quaternion.copy(orientation);

		this.setupObject3DWatcher();
		this.setupScale3DWatcher();

		this.setShape(this.m_shape);

		onLoadCb(this);
		this.m_evaluator = new Evaluator();
	}

	public setRoomNodeManagers(roomNodeManagers: IRoomNodeManagers) {
		this.m_roomNodeManagers = roomNodeManagers;
	}

	public setupScale3DWatcher() {
		watch(this.m_object3D.scale, () => {
			if (this.m_isSelected)
				this.publishUpdate({
					scale: {
						x: this.getObject3D().scale.x,
						y: this.getObject3D().scale.y,
						z: this.getObject3D().scale.z
					}
				}, () => { })
		},)
	}


	setShape(shape: AS_Shape) {
		this.m_shape = shape;

		this.m_material = new THREE.MeshPhongMaterial({
			color: 0xFFD900,
			transparent: true,
			opacity: 0.5,
			side: THREE.DoubleSide,
		});

		const rawObject3D = this.getRawObject3D();
		while (rawObject3D.children.length > 0) {
			rawObject3D.remove(rawObject3D.children[0]);
		}

		const geometry = (() => {
			switch (shape) {
				case AS_Shape.AS_CUBOID:
					return new THREE.BoxGeometry(1, 1, 1);
				case AS_Shape.AS_CYLINDER:
					return new THREE.CylinderGeometry(1, 1, 1);
				case AS_Shape.AS_SPHERE:
					return new THREE.SphereGeometry(1, 16, 16);
				default: {
					console.warn("Invalid shape type");
					return new THREE.BoxGeometry(1, 1, 1);
				}
			}
		})();

		rawObject3D.name = "actionspace";

		const generalShape = new THREE.Mesh(geometry, this.m_material.clone());
		Object.assign(generalShape, {
			name: "actionspace_generalshape",
			visible: true,
			castShadow: true,
		});

		const generalMaterial = generalShape.material as THREE.Material;
		generalMaterial.colorWrite = false;
		generalMaterial.depthWrite = false;
		this.m_generalShape = generalShape;
		rawObject3D.add(generalShape);

		const intersectionShape = new THREE.Object3D();
		intersectionShape.name = "actionspace_intersectionshape";

		const intersectionMesh = new THREE.Mesh(geometry, this.m_material.clone());
		intersectionShape.add(intersectionMesh);
		this.m_intersectionShape = intersectionShape;
		rawObject3D.add(intersectionShape);

		const differenceShape = new THREE.Object3D();
		differenceShape.name = "actionspace_differenceshape";
		this.m_differenceShape = differenceShape;
		rawObject3D.add(differenceShape);

	}

	getShape(): AS_Shape {
		return this.m_shape;
	};


	public override update(): void {
		if (this.m_isDragged) {
			this.evaluateActionSpace();
		}
	}
	public evaluateActionSpace(): void {
		const cameras = this.getCaptureDevicesByType<CameraRoomNode>(RoomNodeType.RNT_CAMERA);
		const kinects = this.getCaptureDevicesByType<KinectRoomNode>(RoomNodeType.RNT_KINECT);

		if (cameras.length === 0 && kinects.length === 0)
			return;

		let brushActionSpace = this.createBrush(this.m_generalShape!.geometry.clone(), this.m_material.clone());
		brushActionSpace.scale.copy(this.getRawObject3D().scale);
		brushActionSpace.updateMatrixWorld();

		this.m_brushCaptureDevices = undefined;

		this.processCaptureDevices([...cameras, ...kinects]);

		const intersection = new Brush();
		const difference = new Brush();

		this.m_evaluator.evaluate(brushActionSpace!, this.m_brushCaptureDevices!, INTERSECTION, intersection);
		this.m_evaluator.evaluate(brushActionSpace!, this.m_brushCaptureDevices!, SUBTRACTION, difference);

		this.applyMaterial(difference, new THREE.Color(0.6, 0.6, 0.6));

		this.applyInverseScale(intersection, this.getRawObject3D().scale);
		this.applyInverseScale(difference, this.getRawObject3D().scale);

		intersection.updateMatrixWorld();
		difference.updateMatrixWorld();

		this.updateShapes(intersection, difference);
	}

	private getCaptureDevicesByType<T>(type: RoomNodeType): T[] {
		return this.m_roomNodeManagers.getRoomNodeMgrByRoomNodeType(type)?.getRoomNodes() as T[];
	}

	private processCaptureDevices(nodes: (CameraRoomNode | KinectRoomNode)[]): void {
		nodes.forEach((node: CameraRoomNode | KinectRoomNode) => {
			const captureBrush = this.createBrush(node.getCaptureRange().geometry.clone(), this.m_material.clone());
			this.applyInverseMatrixWorld(captureBrush, node.getCaptureRange().matrixWorld);

			this.m_brushCaptureDevices = this.m_brushCaptureDevices
				? this.m_evaluator.evaluate(this.m_brushCaptureDevices, captureBrush, ADDITION)
				: captureBrush;
		});
	}

	private applyMaterial(brush: Brush, color: THREE.Color): void {
		const mat = this.m_material.clone();
		mat.color = color;
		brush.material = mat;
	}

	private updateShapes(intersection: Brush, difference: Brush): void {
		if (this.m_intersectionShape!.children.length > 0) {
			this.m_intersectionShape!.remove(this.m_intersectionShape!.children[0]);
		}
		if (this.m_differenceShape!.children.length > 0) {
			this.m_differenceShape!.remove(this.m_differenceShape!.children[0]);
		}

		this.m_intersectionShape!.add(intersection);
		this.m_differenceShape!.add(difference);
	}

	private createBrush(geometry: THREE.BufferGeometry, material?: THREE.Material): Brush {
		const brush = new Brush(geometry);
		if (material)
			brush.material = material;
		return brush;
	}

	private applyInverseMatrixWorld(brush: Brush, matrixWorld: THREE.Matrix4): void {
		brush.applyMatrix4(matrixWorld);

		const objectMatrixWorld = this.getRawObject3D().matrixWorld.clone();
		const position = new THREE.Vector3();
		const rotation = new THREE.Quaternion();
		const scale = new THREE.Vector3();

		objectMatrixWorld.decompose(position, rotation, scale);

		const resetScale = new THREE.Vector3(1, 1, 1);
		const resetMatrixWorld = new THREE.Matrix4().compose(position, rotation, resetScale);
		const inverseMatrix = resetMatrixWorld.clone().invert();

		brush.applyMatrix4(inverseMatrix);
		brush.updateMatrixWorld();
	}

	private applyInverseScale(brush: Brush, scale: THREE.Vector3): void {
		const inverseScale = new THREE.Vector3(1 / scale.x, 1 / scale.y, 1 / scale.z);
		brush.scale.multiply(inverseScale);
	}

	public override onDragStart() {

		if (this.m_differenceShape!.children.length > 0) {
			this.m_differenceShape!.children[0].visible = true;
		}
	}
	public override onDragEnd() {

		if (this.m_differenceShape!.children.length > 0) {
			this.m_differenceShape!.children[0].visible = false;
		}
	}

	setSize(x: any, y: any, z: any) {
		this.m_object3D.scale.set(x, y, z);
	}
	getSize(): THREE.Vector3 {
		return new THREE.Vector3(this.m_object3D.scale.x, this.m_object3D.scale.y, this.m_object3D.scale.z);
	}

	public override toParams(): any {
		let params = {} as any;

		params.type = this.m_shape;
		params.size = this.getSize();

		return params;
	}

	public override fromParams(params: any): void {
		if (params.type !== undefined)
			this.setShape(params.type);
		//if (params.typename !== undefined)
		//	this.m_shapeName = params.typename;
		if (params.size !== undefined)
			this.setSize(params.size.x, params.size.y, params.size.z);
	}

}
