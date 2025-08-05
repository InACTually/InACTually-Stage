
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
import RoomNodeBase from "../RoomNodeBase";
import { RoomNodeType, fromRoomNodeType } from "../RoomNodeRegistry";
import * as THREE from "three";
import loadModel from "~/app/Utils/ModelLoader";
import type IRoomNodePublisher from "~/app/Network/IRoomNodePublisher";
import Handle3D from "../Utils/Handle3D";
import Parameter from "../Utils/Parameter";

export default class MovingHeadRoomNode extends RoomNodeBase {

	private m_fixtureIndex = "";
	private m_startAddress = new Parameter<number>("startAddress", 0, 0, 512, this.publishParams.bind(this));
	private m_color = new Parameter<{ r: number, g: number, b: number }>("color", { r: 0, g: 0, b: 0 }, { r: 0, g: 0, b: 0 }, { r: 1, g: 1, b: 1 }, this.publishParams.bind(this));
	private m_lookAtHandle = {} as Handle3D;
	private m_dimmer = new Parameter<number>("dimmer", 0, 0, 1, this.publishParams.bind(this));
	private m_zoom = new Parameter<number>("zoom", 0, 0, 1, this.publishParams.bind(this));
	private m_strobe = new Parameter<number>("strobe", 0, 0, 1, this.publishParams.bind(this));
	private m_UV = new Parameter<number>("uv", 0, 0, 1, this.publishParams.bind(this));
	private m_isPanFlipped = new Parameter<boolean>("isPanFlipped", false, false, true, this.publishParams.bind(this));
	private m_isTiltFlipped = new Parameter<boolean>("isTiltFlipped", false, false, true, this.publishParams.bind(this));


	constructor(publisher: IRoomNodePublisher, onLoadCb: { (roomNode: RoomNodeBase): void }, uid?: string, position?: THREE.Vector3, orientation?: THREE.Quaternion) {
		super("light", publisher, onLoadCb, uid, position, orientation);

		this.m_lookAtHandle = new Handle3D(
			(handle: Handle3D) => {
			}, () => {
				let pos = new THREE.Vector3();
				pos = this.m_lookAtHandle.getRawObject3D().getWorldPosition(pos);
				this.setLookAt(pos.x, pos.y, pos.z);
			})

		this.setup(onLoadCb);

	}
	public override setup(onLoadCb: { (roomNode: RoomNodeBase): void }): void {
		this.m_caption.value = "MovingHead"
		this.m_roomNodeType = RoomNodeType.RNT_MOVINGHEAD;

		this.m_startAddress.value = 0;
		this.m_color.value = { r: 0, g: 0, b: 0 };
		this.m_lookAt = ref<THREE.Vector3>(new THREE.Vector3());
		//this.m_lookAtHandle = {} as Handle3D;
		this.m_fixtureIndex = "";

		loadModel("/models/output_unidirectional.glb").then((model: THREE.Object3D) => {
			model.scale.set(0.5, 0.5, 0.5);
			let container = new THREE.Object3D();

			let position = this.m_object3D.position.clone();
			let orientation = this.m_object3D.quaternion.clone();
			model.name = "MovingHeadDevice"
			container.add(model);

			this.m_object3D = reactive<THREE.Object3D>(container);
			this.m_object3D.name = "MovingHead";

			this.getRawObject3D().position.copy(position);
			this.getRawObject3D().quaternion.copy(orientation);

			let pos = new THREE.Vector3();
			this.m_lookAtHandle.getRawObject3D().getWorldPosition(pos);
			this.setLookAt(this.m_lookAt.value.x, this.m_lookAt.value.y, this.m_lookAt.value.z);

			this.setupObject3DWatcher();

			onLoadCb(this);
		});
	}

	public override update(): void {
	}

	public override setIsSelected(value: boolean): void {
		if (value) {
			this.m_object3D.add(this.m_lookAtHandle.getRawObject3D());
		}
		else {
			if (this.m_object3D.getObjectByName(this.m_lookAtHandle.name))
				this.m_object3D.remove(this.m_lookAtHandle.getRawObject3D());
		}
		this.m_isSelected = value;
	}

	public setDimmer(dimmer: number): void {
		this.m_dimmer.value = dimmer;
	}

	public getDimmer(): Ref<number> {
		return this.m_dimmer.value;
	}

	public setStartAddress(start: number) {
		this.m_startAddress.value = start;
	}

	public getStartAddress(): Ref<number> {
		return this.m_startAddress.value;
	}

	public setZoom(zoom: number): void {
		this.m_zoom.value = zoom;
	}

	public getZoom(): Ref<number> {
		return this.m_zoom.value;
	}

	public setStrobe(strobe: number): void {
		this.m_strobe.value = strobe;
	}

	public getStrobe(): Ref<number> {
		return this.m_strobe.value;
	}

	public setUV(uv: number): void {
		this.m_UV.value = uv;
	}

	public getUV(): Ref<number> {
		return this.m_UV.value;
	}

	public setIsPanFlipped(isPanFlipped: boolean): void {
		this.m_isPanFlipped.value = isPanFlipped;
	}

	public getIsPanFlipped(): Ref<boolean> {
		return this.m_isPanFlipped.value;
	}

	public setIsTiltFlipped(isTiltFlipped: boolean): void {
		this.m_isTiltFlipped.value = isTiltFlipped;
	}

	public getIsTiltFlipped(): Ref<boolean> {
		return this.m_isTiltFlipped.value;
	}

	public setColor(color: { r: number, g: number, b: number }) {
		this.m_color.value = color;
		if (this.m_lookAtHandle.setColor)
			this.m_lookAtHandle.setColor(new THREE.Color(this.m_color.get().r, this.m_color.get().g, this.m_color.get().b));
	}

	public getColor(): Ref<{ r: number, g: number, b: number }> {
		return this.m_color.value;
	}

	public override setLookAt(x: number, y: number, z: number) {
		this.m_lookAt.value = new THREE.Vector3(x, y, z);
		this.getRawObject3D().getObjectByName("MovingHeadDevice")?.lookAt(this.m_lookAt.value);

		if (typeof this.m_lookAtHandle.getRawObject3D === "function")
			this.m_lookAtHandle.getRawObject3D()?.position.copy(this.m_object3D.worldToLocal(this.m_lookAt.value));

	}

	public override onDragStart() {

	}
	public override onDragEnd() {

	}


	public override hit(raycaster: THREE.Raycaster): { obj: THREE.Object3D, distance: number }[] {
		if (this.m_isSelected) {
			let intersections = raycaster.intersectObject(this.m_lookAtHandle.getObject3D());
			let i = [] as { obj: THREE.Object3D, distance: number }[];
			intersections.forEach((_i: THREE.Intersection) => i.push({ obj: this.m_lookAtHandle.getObject3D(), distance: _i.distance }))

			if (i.length > 0)
				return i;
		}

		let intersections = raycaster.intersectObject(this.m_object3D);
		let i = [] as { obj: THREE.Object3D, distance: number }[];
		intersections.forEach((_i: THREE.Intersection) => i.push({ obj: this.getObject3D(), distance: _i.distance }))
		return i;
	}

	public override toParams(): any {
		let params = {} as any;

		params = {} as any;
		params.startAddress = this.getStartAddress().value;
		params.dimmer = this.getDimmer().value;
		params.color = this.getColor().value;
		params.zoom = this.getZoom().value;
		params.strobe = this.getStrobe().value;
		params.uv = this.getUV().value;
		params.isPanFlipped = this.getIsPanFlipped().value;
		params.isTiltFlipped = this.getIsTiltFlipped().value;

		return params;
	}

	public override fromParams(params: any): void {
		if (params.fixtureIndex !== undefined)
			this.m_fixtureIndex = params.fixtureIndex;
		if (params.startAddress !== undefined)
			this.m_startAddress.value = params.startAddress;
		//if (params.pan !== undefined)
		//	this.m_pan = params.pan;
		//if (params.tilt !== undefined)
		//	this.m_tilt = params.tilt;
		if (params.dimmer !== undefined)
			this.setDimmer(params.dimmer);
		if (params.color !== undefined)
			this.setColor(params.color);
		//if (params.speed !== undefined)
		//	this.m_speed = params.speed;
		if (params.zoom !== undefined)
			this.setZoom(params.zoom);
		if (params.strobe !== undefined)
			this.setStrobe(params.strobe);
		if (params.uv !== undefined)
			this.setUV(params.uv);
		if (params.isPanFlipped !== undefined)
			this.setIsPanFlipped(params.isPanFlipped);
		if (params.isTiltFlipped !== undefined)
			this.setIsTiltFlipped(params.isTiltFlipped);
	}
}
