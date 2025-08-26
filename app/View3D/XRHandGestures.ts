import * as THREE from "three";

export default class XRHandGestures {

    private m_hand = {} as THREE.XRHandSpace;

    private m_closeGestureActive: boolean = false;
    static readonly closeThreshold = 0.09;
    static readonly openThreshold = 0.14;
    private m_closeGestureTriggered: ((position: THREE.Vector3) => any) | undefined;
    private m_closeGestureReleased: ((position: THREE.Vector3) => any) | undefined;

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

    public activateCloseGesture(triggered: (position: THREE.Vector3) => any, released: (position: THREE.Vector3) => any, ) {
        this.m_closeGestureTriggered = triggered;
        this.m_closeGestureReleased = released;
    }

    public update(): void {
        this.updateCloseGesture();
    }

    private updateCloseGesture() {
        if (!this.m_closeGestureReleased || !this.m_closeGestureTriggered)
            return;

        let wrist = this.m_hand.joints["wrist"];
		let middleFingerTip = this.m_hand.joints["middle-finger-tip"];

		if(!wrist || !middleFingerTip) 
            return;

        let wristPosition = wrist.getWorldPosition(new THREE.Vector3());
        let middleFingerTipPosition = middleFingerTip.getWorldPosition(new THREE.Vector3());
        
        let distance = wristPosition.distanceTo(middleFingerTipPosition);
        if(distance <= XRHandGestures.closeThreshold) {
            if (!this.m_closeGestureActive){
                this.m_closeGestureActive = true;
                this.m_closeGestureTriggered(middleFingerTipPosition);
            }
        }
        else if (distance >= XRHandGestures.openThreshold) {
            if (this.m_closeGestureActive){
                this.m_closeGestureActive = false;
                this.m_closeGestureReleased(middleFingerTipPosition);
            }
        }

        //show Debug meshes
        if (this.m_middleTipDebugMesh && this.m_wristDebugMesh && this.m_debugMaterial) {
            this.m_middleTipDebugMesh.position.set(middleFingerTipPosition.x, middleFingerTipPosition.y, middleFingerTipPosition.z);
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