
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

import type RoomNodeBase from "../RoomNodeBase";
import RoomNodeManagerBase from "../RoomNodeManagerBase";
import { RoomNodeManagerType, RoomNodeType } from "../RoomNodeRegistry";
import ActionSpaceRoomNode from "./ActionSpaceRoomNode";
import * as THREE from "three";

export default class ActionSpaceManager extends RoomNodeManagerBase {

	public override setup(): void {
		this.m_roomNodeMgrType = RoomNodeManagerType.RNM_ACTIONSPACE;
	}

	public override getNextAvailableDeviceName(): string {
		return "ActionSpace"
	}

	public override createRoomNode(uid?: string, position?: THREE.Vector3, orientation?: THREE.Quaternion, params?: any): RoomNodeBase | undefined {
		const actionSpace = new ActionSpaceRoomNode(
			this.m_publisher,
			(roomNode: RoomNodeBase) => {
				this.m_roomNodes.push(roomNode);
				this.m_container3D.add(roomNode.getRawObject3D()!);
				this.setMarkerForRoomNode(roomNode);
			},
			uid,
			position,
			orientation);

		if (params !== undefined)
			actionSpace.fromParams(params);
		actionSpace.setRoomNodeManagers(this.m_roomNodeManagers);

		return actionSpace;
	}

	public override getTemplate3DObject(): Promise<THREE.Object3D<THREE.Object3DEventMap>> {
		return new Promise<THREE.Object3D>((resolve, reject) => {
			const geometry = new THREE.BoxGeometry(1, 1, 1);
			const material = new THREE.MeshStandardMaterial({ color: 0xFFD900, transparent: true, opacity: 0.5 });
			resolve(new THREE.Mesh(geometry, material));
		});
	}
	public override onRoomNodeChanged(roomNode: RoomNodeBase, onstart: Boolean) {
		if (roomNode.getRoomNodeType() == RoomNodeType.RNT_CAMERA || roomNode.getRoomNodeType() == RoomNodeType.RNT_KINECT)
			(this.m_roomNodes as ActionSpaceRoomNode[]).forEach((a: ActionSpaceRoomNode) => {
				a.evaluateActionSpace();
				if (onstart)
					a.onDragStart();
				else
					a.onDragEnd();
			})
	}

	public override toJson(): any {
		let json = { nodes: [] as any[] };
		json.nodes = this.m_roomNodes.map((roomNode: RoomNodeBase) => roomNode.toJson());
	}

	public override fromJson(json: any): void {
		json.nodes.forEach((rn: any) => {
			if (this.getRoomNodeByUID(rn.uid)) {
				this.getRoomNodeByUID(rn.uid)?.fromJson(rn, false);
			} else {
				this.createRoomNode(rn.uid, rn.position, rn.orientation, rn.params);
			}
		})
	}
}
