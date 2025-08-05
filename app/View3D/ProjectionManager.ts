
/*
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright(c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright(c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2023-2025

	contributors:
	Fabian Töpfer - baniaf@uber.space
*/

import * as THREE from "three";
import { animateVector3 } from "../Utils/AnimationHelper";
import * as TWEEN from '@tweenjs/tween.js'
import { EventEmitter } from 'events';

export enum ProjectionPos {
	NONE,
	FRONT,
	LEFT,
	RIGHT,
	TOP,
	ISO_LEFT,
	ISO_RIGHT
}


export default class ProjectionManager extends EventEmitter {

	private m_orthographicCamera: THREE.OrthographicCamera = {} as THREE.OrthographicCamera;
	private m_perspectiveCamera: THREE.PerspectiveCamera = {} as THREE.PerspectiveCamera;

	private m_currentCamera = { value: {} as THREE.Camera };

	private m_isOrthographic = false;
	private m_projectionPos = ProjectionPos.NONE as ProjectionPos;

	public constructor() {
		super();
		this.setup();
	}

	setup() {

		const near = 0.1;
		const far = 1000;
		const aspect = window.innerWidth / window.innerHeight;
		const fov = 50;

		this.m_perspectiveCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		this.m_perspectiveCamera.position.set(0, 1.7, 10);
		this.m_perspectiveCamera.lookAt(0, 0, 0);


		const distance = this.m_perspectiveCamera.position.distanceTo(new THREE.Vector3(0, 0, 0));
		const visibleHeight = 2 * distance * Math.tan((fov * Math.PI) / 360);

		this.m_orthographicCamera = new THREE.OrthographicCamera(- visibleHeight * aspect / 2, visibleHeight * aspect / 2, visibleHeight / 2, -visibleHeight / 2, 0.1, 1000);
		this.m_orthographicCamera.position.set(0, 1.7, 10);
		this.m_orthographicCamera.rotation.copy(this.m_perspectiveCamera.rotation);

		this.setIsOrthographicProjection(false);
	}

	onResize() {
		const aspect = window.innerWidth / window.innerHeight;
		const distance = this.m_currentCamera.value.position.distanceTo(new THREE.Vector3(0, 0, 0));
		const visibleHeight = 2 * distance * Math.tan((this.m_perspectiveCamera.fov * Math.PI) / 360);

		this.m_orthographicCamera.left = - visibleHeight * aspect / 2
		this.m_orthographicCamera.right = visibleHeight * aspect / 2
		this.m_orthographicCamera.top = visibleHeight / 2
		this.m_orthographicCamera.bottom = -visibleHeight / 2

		this.m_orthographicCamera.updateProjectionMatrix();

		this.m_perspectiveCamera.aspect = aspect;
		this.m_perspectiveCamera.updateProjectionMatrix();
	}

	setIsOrthographicProjection(val: boolean) {
		this.m_isOrthographic = val;
		const aspect = window.innerWidth / window.innerHeight;
		if (val) {

			const distance = this.m_perspectiveCamera.position.distanceTo(new THREE.Vector3(0, 0, 0));
			const visibleHeight = 2 * distance * Math.tan((this.m_perspectiveCamera.fov * Math.PI) / 360);

			this.m_orthographicCamera.left = - visibleHeight * aspect / 2
			this.m_orthographicCamera.right = visibleHeight * aspect / 2
			this.m_orthographicCamera.top = visibleHeight / 2
			this.m_orthographicCamera.bottom = -visibleHeight / 2

			this.m_orthographicCamera.updateProjectionMatrix();

			this.m_orthographicCamera.position.copy(this.m_perspectiveCamera.position);
			this.m_orthographicCamera.rotation.copy(this.m_perspectiveCamera.rotation);
			this.m_currentCamera.value = this.m_orthographicCamera;

		}
		else {
			const distance = this.m_orthographicCamera.position.distanceTo(new THREE.Vector3(0, 0, 0));
			const orthoFrustumHeight = (this.m_orthographicCamera.top - this.m_orthographicCamera.bottom) / this.m_orthographicCamera.zoom;
			const fov = THREE.MathUtils.radToDeg(
				2 * Math.atan((orthoFrustumHeight / 2) / distance)
			);

			this.m_perspectiveCamera.fov = Math.min(fov, 80);

			this.m_perspectiveCamera.aspect = aspect;
			this.m_perspectiveCamera.updateProjectionMatrix();

			this.m_perspectiveCamera.position.copy(this.m_orthographicCamera.position);
			this.m_perspectiveCamera.rotation.copy(this.m_orthographicCamera.rotation);

			this.m_currentCamera.value = this.m_perspectiveCamera;
			this.m_orthographicCamera.zoom = 1.0;
		}
	}
	getIsOrthographicProjection(): boolean {
		return this.m_isOrthographic;
	}

	getCurrentCamera(): { value: THREE.Camera } {
		return this.m_currentCamera;
	}

	get projectionPos(): ProjectionPos {
		return this.m_projectionPos;
	}

	public setProjectionPos(pp: ProjectionPos) {
		if (pp != this.m_projectionPos) {
			this.emit('projectionPosChanged', pp);
		}


		this.m_projectionPos = pp;

		if (pp == ProjectionPos.NONE) {
			return;
		}

		const camera = this.getCurrentCamera().value;

		const startPos = camera.position.clone();
		const targetPos = this.getCameraPosOfProjectionPos(pp);

		const startQuaternion = camera.quaternion.clone();

		camera.position.copy(targetPos);
		camera.lookAt(0, 0, 0);

		const targetQuaternion = camera.quaternion.clone();

		camera.position.copy(startPos);
		camera.quaternion.copy(startQuaternion);

		new TWEEN.Tween({ t: 0 })
			.to({ t: 1.0 }, 700)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onUpdate((d) => {
				camera.position.lerpVectors(startPos, targetPos, d.t);
				camera.quaternion.copy(startQuaternion).slerp(targetQuaternion, d.t);
				camera.updateMatrixWorld();
			}).start();

	}

	public getCameraPosOfProjectionPos(proj: ProjectionPos): THREE.Vector3 {
		let pos = new THREE.Vector3();

		let dist = 20;
		switch (proj) {
			case ProjectionPos.FRONT: {
				pos.set(0, 0, dist);
				break;
			}
			case ProjectionPos.LEFT: {
				pos.set(-dist, 0, 0);
				break;
			}
			case ProjectionPos.RIGHT: {
				pos.set(dist, 0, 0);
				break;
			}
			case ProjectionPos.TOP: {
				pos.set(0, dist, 0);
				break;
			}
			case ProjectionPos.ISO_LEFT: {
				pos.set(-dist / 3, dist / 3, dist / 3);
				break;
			}
			case ProjectionPos.ISO_RIGHT: {
				pos.set(dist / 3, dist / 3, dist / 3);
				break;
			}
			default: {
				pos.set(0, 0, -dist);
			}
		}
		return pos;
	}

	update() {

	}
}
