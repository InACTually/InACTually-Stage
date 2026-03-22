import loadModel from "~/app/Utils/ModelLoader";
import type RoomNodeBase from "../RoomNodeBase";
import RoomNodeManagerBase from "../RoomNodeManagerBase";
import * as THREE from "three";
import { RoomNodeManagerType } from "../RoomNodeRegistry";
import GaussianSplatRoomNode from "./GaussianSplatRoomNode";
import type GaussianSplatManager from "~/app/View3D/GaussianSplatManager.client";

export default class ObjectManager extends RoomNodeManagerBase {
    private m_availableDevices = [] as { deviceName: string }[];
    private m_gaussianSplatManager = undefined as undefined|GaussianSplatManager;

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

        
        object = new GaussianSplatRoomNode(
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
        return loadModel("/models/input_unidirectional.glb");
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
