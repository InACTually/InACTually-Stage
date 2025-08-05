
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

import type IRoomNodePublisher from "../Network/IRoomNodePublisher";
import type { IRoomNodeManagers } from "../RoomManager";
import type IIntersectRoomModel from "../View3D/IIntersectRoomModel";
import type RoomNodeBase from "./RoomNodeBase";
import RoomNodeMarker from "./RoomNodeMarker";
import { RoomNodeManagerType } from "./RoomNodeRegistry";
import * as THREE from "three";


export default abstract class RoomNodeManagerBase {

	protected m_roomNodes: RoomNodeBase[] = reactive([]);
	protected m_container3D = new THREE.Object3D();

	protected m_roomNodeMgrType = RoomNodeManagerType.RNM_UNKNOWN;
	protected m_publisher = {} as IRoomNodePublisher;
	protected m_intersectRoomModel = {} as IIntersectRoomModel;
	protected m_roomNodeManagers = {} as IRoomNodeManagers;

	constructor(publisher: IRoomNodePublisher, roomNodeManagers: IRoomNodeManagers, intersectRoomModel: IIntersectRoomModel) {
		this.m_container3D = new THREE.Object3D();
		this.m_publisher = publisher;
		this.m_intersectRoomModel = intersectRoomModel;
		this.m_roomNodeManagers = roomNodeManagers;

		this.setup();
	}

	public getRoomNodes(): RoomNodeBase[] {
		return this.m_roomNodes;
	}

	public abstract createRoomNode(uid?: string, position?: THREE.Vector3, orientation?: THREE.Quaternion, params?: any): RoomNodeBase | undefined;

	public updateRoomNode(uid: string, data: any, publish: boolean): RoomNodeBase | undefined {
		let rn = this.getRoomNodeByUID(uid);
		if (rn) {
			rn.fromJson(data, publish);
		}
		return rn;
	}

	public deleteRoomNode(uid: string, publish: boolean): RoomNodeBase | undefined {
		let rn = this.getRoomNodeByUID(uid);
		if (rn) {
			rn.destroy(
				(msg: any) => {
					this.getContainer3D().remove(rn.getRawObject3D());
					let i = this.m_roomNodes.indexOf(rn);
					this.m_roomNodes.splice(i, 1);
				}, publish);
		}


		return rn;
	};

	public abstract setup(): void;

	public update(): void {
		this.m_roomNodes.forEach((rn: RoomNodeBase) => rn.update());
	};

	public getRoomNodeByUID(uid: string) {
		return toRaw(this.m_roomNodes).find((rn: RoomNodeBase) => rn.getUID() === uid);
	}

	public getRoomNodeMgrType() {
		return this.m_roomNodeMgrType;
	}

	public getContainer3D() {
		return this.m_container3D;
	}

	public setMarkerForRoomNode(roomNode: RoomNodeBase) {
		const marker = new RoomNodeMarker(roomNode, this.m_intersectRoomModel);
		roomNode.setMarker(marker);
		this.m_container3D.add(marker.getObject3D());
	}

	public abstract onRoomNodeChanged(roomNode: RoomNodeBase, onstart: Boolean): void;


	public abstract toJson(): any;

	public abstract fromJson(params: any): void;


	public abstract getNextAvailableDeviceName(): string;

	public abstract getTemplate3DObject(): Promise<THREE.Object3D>;

	public hit(raycaster: THREE.Raycaster): { roomNode: RoomNodeBase, obj3D: THREE.Object3D, distance: number }[] {
		let roomNodesHit = [] as { roomNode: RoomNodeBase, obj3D: THREE.Object3D, distance: number }[];

		this.m_roomNodes.forEach((roomNode: RoomNodeBase) => {
			let intersection = roomNode.hit(raycaster);
			if (intersection.length > 0) {
				roomNodesHit.push(
					{
						roomNode: roomNode,
						obj3D: intersection[0].obj,
						distance: intersection[0].distance
					}
				);
			}
		})
		return roomNodesHit;
	}
}
