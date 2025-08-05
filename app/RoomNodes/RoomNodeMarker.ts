
/*
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright(c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright(c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2024

	contributors:
	Fabian Töpfer - baniaf@uber.space
*/

import type IIntersectRoomModel from "../View3D/IIntersectRoomModel";
import type RoomNodeBase from "./RoomNodeBase";
import * as THREE from "three"

export default class RoomNodeMarker {

	private m_object3D = {} as THREE.Object3D;
	private m_roomNode = {} as RoomNodeBase;
	private m_intersectRoomModel = {} as IIntersectRoomModel;

	constructor(roomNode: RoomNodeBase, intersectRoomModel: IIntersectRoomModel) {
		this.setup(roomNode, intersectRoomModel);
	}


	setup(roomNode: RoomNodeBase, intersectRoomModel: IIntersectRoomModel) {

		this.m_roomNode = roomNode;
		this.m_intersectRoomModel = intersectRoomModel;

		const geometry = new THREE.SphereGeometry(0.05, 32, 32);
		const mat = new THREE.MeshStandardMaterial({ color: 0x000000 });
		this.m_object3D = new THREE.Mesh(geometry, mat);



		watch(this.m_roomNode.getObject3D().position, () => {
			this.update(false);
		});

		this.update(true);
	}



	public update(raycast: boolean = false) {
		const pos = this.getPositionMarker(raycast);
		if (pos) {
			this.m_object3D.position.copy(pos);
		}
	}


	getPositionMarker(raycast: boolean) {
		if (!raycast) {
			const pos = this.m_roomNode.getObject3D().position.clone();
			pos.y = 0;
			return pos;
		}
		else {
			const intersection = this.m_intersectRoomModel.getIntersectionWithRoomModel(this.m_roomNode.getObject3D().position);

			if (intersection.length > 0) {
				return intersection[0].point;
			}
		}

		return undefined;
	}


	getObject3D() {
		return this.m_object3D;
	}


}
