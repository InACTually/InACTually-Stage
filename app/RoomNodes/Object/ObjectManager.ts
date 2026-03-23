
/*
    InACTually
    > interactive theater for actual acts
    > this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

    Copyright(c) 2023–2025 Fabian Töpfer, Lars Engeln
    Copyright(c) 2025 InACTually Community
    Licensed under the MIT License.
    See LICENSE file in the project root for full license information.

    This file is created and substantially modified: 2026

    contributors:
    Fabian Töpfer - baniaf@uber.space
    
*/

import loadModel from "~/app/Utils/ModelLoader";
import type RoomNodeBase from "../RoomNodeBase";
import RoomNodeManagerBase from "../RoomNodeManagerBase";
import * as THREE from "three";
import { RoomNodeManagerType } from "../RoomNodeRegistry";
import ObjectRoomNode from "./ObjectRoomNode";

export default class ObjectManager extends RoomNodeManagerBase {
    private m_availableDevices = [] as { deviceName: string }[];

    public override setup(): void {
        this.m_roomNodeMgrType = RoomNodeManagerType.RNM_OBJECT;
    }

    public override getNextAvailableDeviceName(): string {
        let device = this.m_availableDevices.pop();
        if (device) {
            return device.deviceName;
        }
        return "";
    };

    public override createRoomNode(uid?: string, position?: THREE.Vector3, orientation?: THREE.Quaternion, params: any = {}): RoomNodeBase | undefined {
        var object = undefined;

        
        object = new ObjectRoomNode(
                this.m_publisher,
            (roomNode: RoomNodeBase) => {
                this.m_roomNodes.push(roomNode);
                this.m_container3D.add(roomNode.getRawObject3D()!);

                this.setMarkerForRoomNode(roomNode);
            },

            uid,
            position,
            orientation,
        )

        object.fromParams(params);
       
        
        return object;
    }

    public override getTemplate3DObject(): Promise<THREE.Object3D<THREE.Object3DEventMap>> {
        return loadModel("/models/object.glb");
    }

    
    public override onRoomNodeChanged(roomNode: RoomNodeBase, onstart: Boolean) {
    }
    public override toJson(): any {
        let json = { name: "Object", roomNodes: [] as any[] };
        json.roomNodes = this.m_roomNodes.map((roomNode: RoomNodeBase) => roomNode.toJson());

        return json;
    }

    public override fromJson(params: any): void {

        this.m_availableDevices = params.availableDevices;

        params.nodes.forEach((rn: any) => {
            if (this.getRoomNodeByUID(rn.uid)) {
                this.getRoomNodeByUID(rn.uid)!.fromJson(rn, false);
            } else {
                this.createRoomNode(rn.uid, rn.position, rn.orientation, rn.params);
            }
        })
    }
}
