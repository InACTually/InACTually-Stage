
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
import { RoomNodeType } from "../RoomNodeRegistry";
import * as THREE from "three";
import loadModel from "~/app/Utils/ModelLoader";
import type IRoomNodePublisher from "~/app/Network/IRoomNodePublisher";
 
export default class ObjectRoomNode extends RoomNodeBase {

    private m_deviceName = "";
    private m_captureRange: THREE.Mesh = {} as THREE.Mesh;
    private m_modelPath = "/models/object.glb";
    private m_modelObject = undefined as THREE.Object3D | undefined;
    private m_runtimeModelUrl = undefined as string | undefined;
    private m_container = {} as THREE.Object3D; 

    constructor(publisher: IRoomNodePublisher, onLoadCb: { (roomNode: RoomNodeBase): void }, uid?: string, position?: THREE.Vector3, orientation?: THREE.Quaternion) {
        super("object", publisher, onLoadCb, uid, position, orientation);
        this.setup(onLoadCb);

    }

    public override setup( onLoadCb: { (roomNode: RoomNodeBase): void }): void {
        this.m_caption.value = "Object"
        this.m_roomNodeType = RoomNodeType.RNT_OBJECT;
        const container = new THREE.Object3D();
        const position = this.m_object3D.position.clone();
        const orientation = this.m_object3D.quaternion.clone();

        this.m_object3D = reactive<THREE.Object3D>(container);
        this.m_object3D.name = "Object";
        this.getRawObject3D().position.copy(position);
        this.getRawObject3D().quaternion.copy(orientation);
        this.setupObject3DWatcher();

        this.m_modelObject = container;

        this.loadModelFromPath(this.m_modelPath).finally(() => {
            onLoadCb(this);
        });
    }

    public override update(): void {
    }

     
    public override onDragStart() {
     }
    public override onDragEnd() {
     }

     

    public override toParams(): any {
        let params = {} as any;
        params.modelPath = this.m_modelPath;

        return params;
    }

    public override fromParams(params: any): void {
        if (params.modelPath) {
            this.m_modelPath = params.modelPath;
            this.loadModelFromPath(this.m_modelPath);
        }
    }

    public getModelPath(): string {
        return this.m_modelPath;
    }

    public setModelPath(modelPath: string) {
        const nextPath = modelPath.trim();

        if (nextPath === "" || nextPath === this.m_modelPath) {
            return;
        }

        this.clearRuntimeModelUrl();
        this.m_modelPath = nextPath;
        this.loadModelFromPath(this.m_modelPath);
        this.publishParams(this.toParams());
    }

    public setModelFile(file: File, displayPath?: string) {
        const nextPath = (displayPath ?? file.name).trim();
        if (nextPath === "") {
            return;
        }

        this.clearRuntimeModelUrl();
        this.m_runtimeModelUrl = URL.createObjectURL(file);
        this.m_modelPath = nextPath;
        this.loadModelFromPath(this.m_runtimeModelUrl, nextPath);
        this.publishParams(this.toParams());
    }

    public async loadModelFromPath(modelPath: string, typeHint?: string): Promise<void> {
        const resolvedPath = this.resolveModelPath(modelPath);
        const model = await loadModel(resolvedPath, typeHint ?? this.m_modelPath);
        model.name = "3DPhotoModel";

        if (this.m_modelObject) {
            this.getObject3D().remove(this.m_modelObject);
        }

        this.m_modelObject = model;
        this.getObject3D().add(model);
    }

    private resolveModelPath(modelPath: string): string {
        if (modelPath.startsWith("file://") || modelPath.startsWith("http://") || modelPath.startsWith("https://")) {
            return modelPath;
        }

        if (modelPath.startsWith("blob:") || modelPath.startsWith("/models/")) {
            return modelPath;
        }

        if (this.isAbsoluteFilePath(modelPath)) {
            const normalizedPath = modelPath.replace(/\\/g, "/");
            const prefix = normalizedPath.startsWith("/") ? "file://" : "file:///";
            return `${prefix}${encodeURI(normalizedPath)}`;
        }

        return modelPath;
    }

    private isAbsoluteFilePath(modelPath: string): boolean {
        return modelPath.startsWith("/") || /^[A-Za-z]:[\\/]/.test(modelPath);
    }

    private clearRuntimeModelUrl() {
        if (!this.m_runtimeModelUrl) {
            return;
        }

        URL.revokeObjectURL(this.m_runtimeModelUrl);
        this.m_runtimeModelUrl = undefined;
    }
}
