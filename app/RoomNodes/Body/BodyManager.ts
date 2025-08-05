
/*
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright(c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright(c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2025

	contributors:
	Lars Engeln - mail@lars-engeln.de
*/

import loadModel from "~/app/Utils/ModelLoader";
import type RoomNodeBase from "../RoomNodeBase";
import RoomNodeManagerBase from "../RoomNodeManagerBase";
import BodyRoomNode from "./BodyRoomNode";
import * as THREE from "three";
import { RoomNodeManagerType } from "../RoomNodeRegistry";

export default class BodyManager extends RoomNodeManagerBase {

	public override setup(): void {
		this.m_roomNodeMgrType = RoomNodeManagerType.RNM_BODY;
	}
	public override getNextAvailableDeviceName(): string {
		return "";
	};

	public override createRoomNode(uid?: string, position?: THREE.Vector3, orientation?: THREE.Quaternion, params: any = {}): RoomNodeBase | undefined {

		if (!params.deviceName) {

			params.deviceName = this.getNextAvailableDeviceName();
		}

		const body = new BodyRoomNode(
			this.m_publisher,
			(roomNode: RoomNodeBase) => {
				this.m_roomNodes.push(roomNode);
				this.m_container3D.add(roomNode.getRawObject3D()!);
			},
			uid,
			position,
			orientation,
		);

		body.fromParams(params);

		return body;
	}
	public override onRoomNodeChanged(roomNode: RoomNodeBase, onstart: Boolean) {

	}

	public override getTemplate3DObject(): Promise<THREE.Object3D<THREE.Object3DEventMap>> {
		return loadModel("/models/input_unidirectional.glb");
	}

	public override toJson(): any {
		let json = { name: "body", roomNodes: [] as any[] };
		json.roomNodes = this.m_roomNodes.map((roomNode: RoomNodeBase) => roomNode.toJson());
	}

	public override fromJson(json: any): void {
		json.nodes.forEach((rn: any) => {
			if (this.getRoomNodeByUID(rn.uid)) {
				this.getRoomNodeByUID(rn.uid)!.fromJson(rn, false);
			} else {
				this.createRoomNode(rn.uid, rn.position, rn.orientation, rn.params);
			}
		})
	}
}
