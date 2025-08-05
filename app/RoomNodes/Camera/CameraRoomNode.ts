
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

import type { Object3D } from "three";
import RoomNodeBase, { RoomNodeState } from "../RoomNodeBase";
import { RoomNodeType, fromRoomNodeType } from "../RoomNodeRegistry";
import * as THREE from "three";
import loadModel from "~/app/Utils/ModelLoader";
import type IRoomNodePublisher from "~/app/Network/IRoomNodePublisher";
import type CaptureDevice from "../ICaptureDevice";

export default class CameraRoomNode extends RoomNodeBase implements CaptureDevice {
	private m_deviceName: string | undefined;
	private m_captureRange: THREE.Mesh = {} as THREE.Mesh;

	constructor(publisher: IRoomNodePublisher, onLoadCb: { (roomNode: RoomNodeBase): void }, uid?: string, position?: THREE.Vector3, orientation?: THREE.Quaternion) {
		super("camera", publisher, onLoadCb, uid, position, orientation);
		this.setup(onLoadCb);

	}
	public override setup(onLoadCb: { (roomNode: RoomNodeBase): void }): void {
		this.m_caption.value = "Camera";
		this.m_roomNodeType = RoomNodeType.RNT_CAMERA;

		loadModel("/models/input_unidirectional.glb").then((model: THREE.Object3D) => {
			//model.scale.set(0.5, 0.5, 0.5);
			let position = this.m_object3D.position.clone();
			let orientation = this.m_object3D.quaternion.clone();

			this.m_object3D = reactive<THREE.Object3D>(model);
			this.m_object3D.name = "Camera";

			this.getRawObject3D().position.copy(position);
			this.getRawObject3D().quaternion.copy(orientation);

			this.setupObject3DWatcher();

			//const geometry = new THREE.SphereGeometry(5, 16, 16, 0, Math.PI);
			const geometry = new THREE.CylinderGeometry(0, 5, 5, 4, 1);
			const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1, side: THREE.DoubleSide });
			const pyramide = new THREE.Mesh(geometry, material);

			pyramide.position.z = 2.5;
			const quaternionX = new THREE.Quaternion();
			quaternionX.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);

			const quaternionZ = new THREE.Quaternion();
			quaternionZ.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 4);


			pyramide.applyQuaternion(quaternionX.multiply(quaternionZ));

			this.m_captureRange = pyramide;
			this.m_captureRange.visible = true;
			this.m_captureRange.layers.set(2);

			this.getRawObject3D().add(this.m_captureRange);

			onLoadCb(this);
		});

	}

	public override update(): void {
	}


	public getDeviceName(): string | undefined {
		return this.m_deviceName;
	}

	public setDeviceName(name: string): void {
		this.m_deviceName = name;
	}

	public getCaptureRange(): THREE.Mesh {
		return this.m_captureRange;
	}
	public override onDragStart() {
		this.showCaptureRange(true);
	}
	public override onDragEnd() {
		this.showCaptureRange(false);
	}

	public showCaptureRange(value: boolean) {
		if (value)
			this.m_captureRange.layers.set(0);
		else
			this.m_captureRange.layers.set(2);
	}


	public override toParams(): any {
		let params = {} as any;

		return params;
	}

	public override fromParams(params: any): void {
		if (params.deviceName !== undefined)
			this.m_deviceName = params.deviceName + "";
	}
}
