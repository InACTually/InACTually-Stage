
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
	Lars Engeln - mail@lars-engeln.de
*/

import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { ShadowMapViewer } from 'three/addons/utils/ShadowMapViewer.js';
import { XRButton } from 'three/addons/webxr/XRButton.js';

export default class Renderer {

	private m_renderer = new THREE.WebGLRenderer;
	private m_stats = {} as Stats;

	constructor(canvas: HTMLElement) {
		this.setup(canvas);
	}


	public setup(canvas: HTMLElement) {
		this.initRenderer(canvas);
		this.initXR();

		this.m_stats = new Stats();
		this.m_stats.showPanel(0);
		document.body.append(this.m_stats.dom);

		this.onResize();

	}

	public update() {

	}

	public draw(drawCB: () => void, scene: THREE.Scene, camera: { value: THREE.Camera }, shadowMapViewer: ShadowMapViewer) {
		this.m_renderer.render(scene, camera.value);


		this.m_renderer.setAnimationLoop((dt) => {
			this.m_stats.begin();
			TWEEN.update(dt);

			this.m_renderer.render(scene, camera.value);

			drawCB();
			this.m_stats.end();
		})
	}

	public onResize(): void {
		this.m_renderer.setSize(window.innerWidth, window.innerHeight);
		this.m_renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	}

	private initRenderer(canvas: HTMLElement) {
		this.m_renderer = new THREE.WebGLRenderer({
			canvas: canvas,
			alpha: true,
			antialias: true,
		});
		this.m_renderer.shadowMap.enabled = true;
		this.m_renderer.shadowMap.type = THREE.VSMShadowMap;

	}

	private initXR() {
		this.m_renderer.xr.enabled = true;

		const sessionInit1 = {
			requiredFeatures: ['hand-tracking', 'hit-test'],
			optionalFeatures: ["dom-overlay"],
			domOverlay: { root: document.body }
		} as XRSessionInit;

		this.m_renderer.xr.addEventListener("sessionstart", (event) => {
			// Handle the session start event
			console.log("WebXR session started!");

		});

		this.m_renderer.xr.addEventListener("sessionend", (event) => {
			// Handle the session start event
			console.log("WebXR session ended!");

		});

		const xr_button_container = document.getElementById("xrbuttoncontainer");

		if (xr_button_container)
			xr_button_container.appendChild(XRButton.createButton(this.m_renderer, sessionInit1));
	}

	public getXR() {
		return this.m_renderer.xr;
	}

	public getDOMElement() {
		return this.m_renderer.domElement;
	}
}
