/*
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright(c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2023-2025

	contributors:
	Anton Hörig
*/

import * as THREE from "three";

export default class XRHandGestures {

    private m_hand = {} as THREE.XRHandSpace;

    private m_closeGestureActive: boolean = false;
    static readonly closeThreshold = 0.1;
    static readonly openThreshold = 0.14;
    private m_closeGestureTriggered: ((position: THREE.Vector3, orientation: THREE.Quaternion) => any) | undefined;
    private m_closeGestureHeld: ((position: THREE.Vector3, orientation: THREE.Quaternion) => any) | undefined;
    private m_closeGestureReleased: ((position: THREE.Vector3, orientation: THREE.Quaternion) => any) | undefined;

    private m_middleTipDebugMesh: THREE.Object3D | undefined;
	private m_wristDebugMesh: THREE.Object3D | undefined;
    private m_debugMaterial: THREE.MeshStandardMaterial | undefined;

    constructor(hand: THREE.XRHandSpace){
        this.m_hand = hand;
    }

    public addDebugMeshes(middleTipDebug: THREE.Mesh, wristDebug: THREE.Mesh, material: THREE.MeshStandardMaterial){
        this.m_middleTipDebugMesh = middleTipDebug;
        this.m_wristDebugMesh = wristDebug;
        this.m_debugMaterial = material;
    }

    public activateCloseGesture(triggered: (position: THREE.Vector3, orientation: THREE.Quaternion) => any, held: (position: THREE.Vector3, orientation: THREE.Quaternion) => any, released: (position: THREE.Vector3, orientation: THREE.Quaternion) => any ) {
        this.m_closeGestureTriggered = triggered;
        this.m_closeGestureHeld = held;
        this.m_closeGestureReleased = released;
    }

    public update(): void {
        this.updateCloseGesture();
    }

    private updateCloseGesture() {
        if (!this.m_closeGestureReleased || !this.m_closeGestureTriggered || !this.m_closeGestureHeld)
            return;

        let wrist = this.m_hand.joints["wrist"];
		let middleFingerDistal = this.m_hand.joints["middle-finger-phalanx-distal"];
		let ringFingerDistal = this.m_hand.joints["ring-finger-phalanx-distal"];

		if(!wrist || !middleFingerDistal || !ringFingerDistal) 
            return;

        const wristPosition = wrist.getWorldPosition(new THREE.Vector3());
        const wristOrientation = wrist.getWorldQuaternion(new THREE.Quaternion())
        const middleFingerDistalPosition = middleFingerDistal.getWorldPosition(new THREE.Vector3());
        const middleFingerDistalOrientation = middleFingerDistal.getWorldQuaternion(new THREE.Quaternion())
        const ringFingerDistalPosition = ringFingerDistal.getWorldPosition(new THREE.Vector3());
        const ringFingerDistalOrientation = ringFingerDistal.getWorldQuaternion(new THREE.Quaternion())

        
        //check if gesture should end
        let distance = (wristPosition.distanceTo(middleFingerDistalPosition) + wristPosition.distanceTo(ringFingerDistalPosition)) / 2;
        if(distance <= XRHandGestures.closeThreshold) {
            if (!this.m_closeGestureActive){
                this.m_closeGestureActive = true;
                this.m_closeGestureTriggered(middleFingerDistalPosition.clone().lerp(ringFingerDistalPosition, 0.5), middleFingerDistalOrientation.clone().slerp(ringFingerDistalOrientation, 0.5));
            }
        }
        else if (distance >= XRHandGestures.openThreshold) {
            if (this.m_closeGestureActive){
                this.m_closeGestureActive = false;
                this.m_closeGestureReleased(middleFingerDistalPosition.clone().lerp(ringFingerDistalPosition, 0.5), middleFingerDistalOrientation.clone().slerp(ringFingerDistalOrientation, 0.5));
            }
        }

        //call update
        if(this.m_closeGestureActive){
            this.m_closeGestureHeld(middleFingerDistalPosition.clone().lerp(ringFingerDistalPosition, 0.5), middleFingerDistalOrientation.clone().slerp(ringFingerDistalOrientation, 0.5));
        }

        //show Debug meshes
        if (this.m_middleTipDebugMesh && this.m_wristDebugMesh && this.m_debugMaterial) {
            this.m_middleTipDebugMesh.position.set(middleFingerDistalPosition.x, middleFingerDistalPosition.y, middleFingerDistalPosition.z);
            this.m_wristDebugMesh.position.set(wristPosition.x, wristPosition.y, wristPosition.z);
            if(distance <= XRHandGestures.closeThreshold) {
                this.m_debugMaterial.color.set(new THREE.Color(0,1,0));
            }
            else if (distance >= XRHandGestures.openThreshold) {
                this.m_debugMaterial.color.set(new THREE.Color(1,0,0));
            }
            else {
                this.m_debugMaterial.color.set(new THREE.Color(0,0,1));
            }
        }
        
    }

}