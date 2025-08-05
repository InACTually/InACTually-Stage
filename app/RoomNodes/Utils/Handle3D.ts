
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

import * as THREE from "three";

export default class Handle3D {
	protected m_object3D = reactive<THREE.Mesh>(new THREE.Mesh());
	public name = "Handle";

	constructor(onLoadCb: { (marker: Handle3D): void }, onPosChangedCb: { (pos: THREE.Vector3): void }) {
		this.setup(onLoadCb, onPosChangedCb)
	};

	public setup(onLoadCb: { (marker: Handle3D): void }, onPosChangedCb: { (pos: THREE.Vector3): void }) {
		const geometry = new THREE.SphereGeometry(0.1, 32, 16);
		const material = new THREE.MeshStandardMaterial({ color: 0x44CCFF });

		this.m_object3D = reactive<THREE.Mesh>(new THREE.Mesh(geometry, material));
		this.m_object3D.name = this.name;
		this.m_object3D.position.y -= 1;
		onLoadCb(this);


		watch(this.m_object3D.position, () => {
			onPosChangedCb(this.m_object3D.position);
		})
	};

	public update() {

	};
	public getObject3D() {
		return this.m_object3D;
	}

	public getRawObject3D() {
		return toRaw(this.m_object3D);
	}

	public setColor(color: THREE.Color) {
		(this.m_object3D.material as any).color.copy(color);
	}
	public hit(raycaster: THREE.Raycaster): THREE.Intersection[] {
		return raycaster.intersectObject(this.m_object3D);
	};
}
