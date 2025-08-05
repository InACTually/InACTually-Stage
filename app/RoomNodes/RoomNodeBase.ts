
/*
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright(c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright(c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2023-2025

	contributors:
	Fabian Töpfer - baniaf@uber.space
	Lars Engeln - mail@lars-engeln.de
*/

import { fromRoomNodeType, RoomNodeType } from "./RoomNodeRegistry";
import * as THREE from "three";
import type IRoomNodePublisher from "../Network/IRoomNodePublisher";
import RoomNodeMarker from "./RoomNodeMarker";

export enum RoomNodeState {
	RNS_PENDING,
	RNS_VIRTUAL,
	RNS_CONNECTED,
	RNS_BYPASSED,
	RNS_DISCONNECTED
}

export default abstract class RoomNodeBase {

	protected m_object3D = reactive<THREE.Object3D>(new THREE.Object3D());
	protected m_roomNodeState = ref<RoomNodeState>(RoomNodeState.RNS_PENDING);

	protected m_roomNodeType = RoomNodeType.RNT_UNKOWN;

	protected m_uid = "";
	protected m_name = "";
	protected m_caption = ref<string>("");

	protected m_isFixed = true;
	protected m_isSmoothing = false;

	protected m_lookAt = ref<THREE.Vector3>(new THREE.Vector3());
	protected m_isLookingAt = true;

	protected m_isSelected = false;
	protected m_isHovered = false;
	protected m_isDragged = false;

	protected m_marker = {} as RoomNodeMarker;

	protected m_publisher = {} as IRoomNodePublisher;


	constructor(name: string, publisher: IRoomNodePublisher, onLoadCb: { (roomNode: RoomNodeBase): void }, uid?: string, position?: THREE.Vector3, orientation?: THREE.Quaternion) {
		this.m_name = name;
		this.m_publisher = publisher;

		if (position)
			this.m_object3D.position.copy(position);
		if (orientation)
			this.m_object3D.quaternion.copy(orientation);

		this.m_roomNodeState.value = RoomNodeState.RNS_PENDING;

		if (uid) {
			//roomNode is created in BE or another FE (UID already set) => doesnt need to be published
			this.m_uid = uid;
			this.m_roomNodeState.value = RoomNodeState.RNS_CONNECTED;
			//this.fromJson({position:position,orientation:orientation,params:params},false);

		} else {

			let msg = this.toJson(true);

			if (position)
				msg.position = { x: position.x, y: position.y, z: position.z };

			if (orientation)
				msg.orientation = { w: orientation.w, x: orientation.x, y: orientation.y, z: orientation.z };

			//roomNode is created in this FE and need to be published
			this.m_publisher.createRoomNode(
				msg
				, (data: any) => {
					this.fromJson(data, false);
				})
		}
	}


	public setIsSelected(value: boolean): void {
		this.m_isSelected = value;
	}
	public setIsHovered(value: boolean): void {
		this.m_isHovered = value;
	}

	public setIsDragged(value: boolean) {
		this.m_isDragged = value;
		if (this.m_marker) {
			this.m_marker.update(!value);
		}

		if (value) {
			this.onDragStart()
		}
		else {
			this.onDragEnd();
		}
	}
	public getIsSelected(): boolean {
		return this.m_isSelected
	}

	public getIsHovered(): boolean {
		return this.m_isHovered;
	}

	public getIsDragged(): boolean {
		return this.m_isDragged;
	}

	public getRoomNodeType(): RoomNodeType {
		return this.m_roomNodeType;
	}



	public destroy(cb: { (msg: any): void }, publish: boolean) {

		if (!publish) {
			cb({ uid: this.getUID() });
			return;
		}

		this.m_publisher.deleteRoomNode(
			{
				uid: this.getUID(),
				name: fromRoomNodeType(this.m_roomNodeType)
			},
			cb)
	}

	public publishUpdate(json: any, cb: { (msg: any): void }) {
		json.name = fromRoomNodeType(this.m_roomNodeType);
		json.uid = this.getUID();
		this.m_publisher.updateRoomNode(json, cb);
	}

	public publishParams(params: any) {
		this.publishUpdate({ "params": params }, () => { });
	}

	public getName(): string {
		return this.m_name;
	}

	public getCaption(): string {
		return this.m_caption.value;
	}

	public setCaption(caption: string) {
		this.m_caption.value = caption;
	}

	public getIsFixed(): boolean {
		return this.m_isFixed;
	}

	public setIsFixed(isFixed: boolean) {
		this.m_isFixed = isFixed;
	}

	public getIsSmoothing(): boolean {
		return this.m_isSmoothing;
	}

	public setIsSmoothing(isSmoothing: boolean) {
		this.m_isSmoothing = isSmoothing;
	}

	public getIsLookingAt(): boolean {
		return this.m_isLookingAt;
	}

	public setIsLookingAt(isLookingAt: boolean) {
		this.m_isLookingAt = isLookingAt;
	}

	public getUID() {
		return this.m_uid;
	}

	public getObject3D() {
		return this.m_object3D;
	}

	public getRawObject3D() {
		return toRaw(this.m_object3D);
	}

	public setupObject3DWatcher() {
		watch(this.m_object3D.position, () => {
			if (this.m_isSelected)
				this.publishUpdate({
					position: {
						x: this.getObject3D().position.x,
						y: this.getObject3D().position.y,
						z: this.getObject3D().position.z
					}
				}, () => { })
		},)

		watch(this.m_object3D.quaternion, () => {
			if (this.m_isSelected)
				this.publishUpdate({
					orientation: {
						w: this.getObject3D().quaternion.w,
						x: this.getObject3D().quaternion.x,
						y: this.getObject3D().quaternion.y,
						z: this.getObject3D().quaternion.z
					}
				}, () => { })
		})
	}

	public setPosition(x: number, y: number, z: number) {
		let pos = this.getObject3D().position.set(x, y, z);
	}
	public getPosition(): THREE.Vector3 | undefined {
		return this.getObject3D().position;
	}

	public setRotation(rot: THREE.Euler) {
		let ori = new THREE.Quaternion().setFromEuler(rot);
		this.setOrientation(ori.x, ori.y, ori.z, ori.w);
	}

	public setOrientation(x: number, y: number, z: number, w: number) {
		this.getObject3D().quaternion.set(x, y, z, w);

	}

	public setRotationDegree(x?: number, y?: number, z?: number) {
		let euler = this.getObject3D().rotation.clone();
		if (x != undefined)
			euler.x = THREE.MathUtils.degToRad(x);
		if (y != undefined)
			euler.y = THREE.MathUtils.degToRad(y);
		if (z != undefined)
			euler.z = THREE.MathUtils.degToRad(z);

		this.setRotation(euler);
	}

	public getOrientation(): THREE.Quaternion | undefined {
		return this.getObject3D().quaternion;
	}

	public setLookAt(x: number, y: number, z: number) { this.m_lookAt.value.set(x, y, z); }

	public getLookAt(): THREE.Vector3 { return this.m_lookAt.value; }

	public setMarker(marker: RoomNodeMarker) {
		this.m_marker = marker;
	}

	public getMarker() {
		return this.m_marker;
	}

	public abstract onDragStart(): void;
	public abstract onDragEnd(): void;

	public abstract setup(onLoadCb: { (roomNode: RoomNodeBase): void }, position?: THREE.Vector3, orientation?: THREE.Quaternion): void;
	public abstract update(): void;

	public toJson(withoutParams: boolean = false): any {
		let json = {} as any;

		json.uid = this.getUID();

		json.name = this.getName(); //fromRoomNodeType(this.getRoomNodeType());
		json.caption = this.getCaption();

		let pos = this.getPosition();
		if (pos)
			json.position = { x: pos.x, y: pos.y, z: pos.z };

		let ori = this.getOrientation();
		if (ori)
			json.orientation = { w: ori.w, x: ori.x, y: ori.y, z: ori.z };

		let lAt = this.getLookAt();
		json.lookAt = { x: lAt, y: lAt, z: lAt };

		json.isFixed = this.getIsFixed();
		json.isSmoothing = this.getIsSmoothing();
		json.isLookingAt = this.getIsLookingAt();

		if (!withoutParams)
			json.params = this.toParams();

		return json;
	};

	public fromJson(json: any, publish: boolean = false): void {
		if (json.uid)
			this.m_uid = json.uid;

		if (json.caption !== undefined)
			this.setCaption(json.caption);

		if (json.position !== undefined)
			this.setPosition(json.position.x, json.position.y, json.position.z);
		if (json.orientation !== undefined)
			this.setOrientation(json.orientation.x, json.orientation.y, json.orientation.z, json.orientation.w);
		if (json.lookAt !== undefined)
			this.setLookAt(json.lookAt.x, json.lookAt.y, json.lookAt.z);

		if (json.isFixed !== undefined)
			this.setIsFixed(json.isFixed);
		if (json.isSmoothing !== undefined)
			this.setIsSmoothing(json.isSmoothing);
		if (json.isLookingAt !== undefined)
			this.setIsLookingAt(json.isLookingAt);

		if (json.params !== undefined)
			this.fromParams(json.params);

		if (publish)
			this.publishUpdate(json, () => { });
	};

	public abstract toParams(): any;
	public abstract fromParams(params: any): void;

	public hit(raycaster: THREE.Raycaster): { obj: THREE.Object3D, distance: number }[] {
		let intersections = raycaster.intersectObject(this.m_object3D);
		let i = [] as { obj: THREE.Object3D, distance: number }[];
		intersections.forEach((_i: THREE.Intersection) => i.push({ obj: this.getObject3D(), distance: _i.distance }))
		return i;

	}
}
