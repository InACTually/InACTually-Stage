
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

import RoomNodeBase from "../RoomNodeBase";
import { RoomNodeType, fromRoomNodeType } from "../RoomNodeRegistry";
import * as THREE from "three";
import loadModel from "~/app/Utils/ModelLoader";
import type IRoomNodePublisher from "~/app/Network/IRoomNodePublisher";
import GaussianSplatManager from "~/app/View3D/GaussianSplatManager.client";
 
export default class GaussianSplatRoomNode extends RoomNodeBase {

    private m_deviceName = "";
    private m_captureRange: THREE.Mesh = {} as THREE.Mesh;


    constructor(publisher: IRoomNodePublisher, onLoadCb: { (roomNode: RoomNodeBase): void }, uid?: string, position?: THREE.Vector3, orientation?: THREE.Quaternion) {
        super("gs", publisher, onLoadCb, uid, position, orientation);
        this.setup(onLoadCb);

    }

    public override setup( onLoadCb: { (roomNode: RoomNodeBase): void }): void {
        this.m_caption.value = "3D Photo"
        this.m_roomNodeType = RoomNodeType.RNT_OBJECT;


        var splat =  GaussianSplatManager.getInstance().load({
            id: "stage-environment",
            url: "/models/Stage_Garnisionskirche_11-03-26_FT_cleaned.ply",
            position: new THREE.Vector3(0, 0, 0),
            quaternion: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,0), Math.PI),
            scale:1,
            lod: false,   // Level-of-Detail empfohlen für große Szenen
        });

 
        let position = this.m_object3D.position.clone();
        let orientation = this.m_object3D.quaternion.clone();

        this.m_object3D = reactive<THREE.Object3D>(splat);
        this.m_object3D.name = "3DPhoto";

        this.getRawObject3D().position.copy(position);
        this.getRawObject3D().quaternion.copy(orientation);

        this.setupObject3DWatcher();
    
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
    }
}
