import loadModel from "~/app/Utils/ModelLoader";
import type RoomNodeBase from "../RoomNodeBase";
import RoomNodeManagerBase from "../RoomNodeManagerBase";
import KinectRoomNode from "./KinectRoomNode";
import * as THREE from "three";
import { RoomNodeManagerType } from "../RoomNodeRegistry";

export default class KinectManager extends RoomNodeManagerBase {
    private m_availableDevices = [] as { deviceName: string }[];

    public override setup(): void {
        this.m_roomNodeMgrType = RoomNodeManagerType.RNM_KINECT;
    }
    public override getNextAvailableDeviceName(): string {
        let device = this.m_availableDevices.pop();
        if (device) {
            return device.deviceName;
        }
        return "";
    };

    public override createRoomNode(uid?: string, position?: THREE.Vector3, orientation?: THREE.Quaternion, params: any = {}): RoomNodeBase | undefined {

        if (!params.deviceName) {
            params.deviceName = this.getNextAvailableDeviceName();
        };

        const kinect = new KinectRoomNode(
            this.m_publisher,

            (roomNode: RoomNodeBase) => {
                this.m_roomNodes.push(roomNode);
                this.m_container3D.add(roomNode.getRawObject3D()!);
                this.setMarkerForRoomNode(roomNode);
            },
            uid,
            position,
            orientation,
        );

        kinect.fromParams(params);

        return kinect;
    }

    public override getTemplate3DObject(): Promise<THREE.Object3D<THREE.Object3DEventMap>> {
        return loadModel("/models/input_unidirectional.glb");
    }

    public showCaptureRange(value: boolean) {
        (this.m_roomNodes as KinectRoomNode[]).forEach((k: KinectRoomNode) => {
            k.showCaptureRange(value);
        });
    }
    public override onRoomNodeChanged(roomNode: RoomNodeBase, onstart: Boolean) {
    }
    public override toJson(): any {
        let json = { name: "Kinect", roomNodes: [] as any[] };
        json.roomNodes = this.m_roomNodes.map((roomNode: RoomNodeBase) => roomNode.toJson());
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
