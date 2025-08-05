
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

import type { Object3D } from "three";
import RoomNodeBase, { RoomNodeState } from "../RoomNodeBase";
import { RoomNodeType, fromRoomNodeType } from "../RoomNodeRegistry";
import * as THREE from "three";
import loadModel from "~/app/Utils/ModelLoader";
import type IRoomNodePublisher from "~/app/Network/IRoomNodePublisher";
import Body, { BodyJointType } from "./Body";

export default class BodyRoomNode extends RoomNodeBase {
	private m_body: Body = {} as Body;
	private m_bodyMap: Map<BodyJointType, THREE.Mesh> = new Map<BodyJointType, THREE.Mesh>();

	constructor(publisher: IRoomNodePublisher, onLoadCb: { (roomNode: RoomNodeBase): void }, uid?: string, position?: THREE.Vector3, orientation?: THREE.Quaternion) {
		super("body", publisher, onLoadCb, uid, position, orientation);
		this.setup(onLoadCb);

	}
	public override setup(onLoadCb: { (roomNode: RoomNodeBase): void }): void {
		this.m_caption.value = "Body";
		this.m_roomNodeType = RoomNodeType.RNT_BODY;

		this.m_body = new Body();

		this.m_object3D.name = "Body";

		this.setupObject3DWatcher();

		this.m_body.m_joints.forEach((joint) => {

			const geometry = new THREE.SphereGeometry(0.06, 16, 16, 0, Math.PI);
			const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1, side: THREE.DoubleSide });
			const sphere = new THREE.Mesh(geometry, material);

			sphere.position.set(joint.position.x, joint.position.y, joint.position.z);
			this.getRawObject3D().add(sphere);
			this.m_bodyMap.set(joint.type, sphere);
		});

		onLoadCb(this);

	}

	public override update(): void {
	}

	public override onDragStart() {
	}
	public override onDragEnd() {
	}

	public override toParams(): any {
		let params = {} as any;

		return params;
	}

	public override fromParams(params: any): void {
		if (params.body === undefined)
			return;

		this.m_body.fromJson(params.body, true);
		this.m_body.m_joints.forEach((joint) => {
			this.m_bodyMap.get(joint.type)!.position.set(joint.position.x, joint.position.y, joint.position.z);
		});
	}
}
