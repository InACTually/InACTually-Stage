
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
import Renderer from "./Renderer";
import RoomModelManager, { ModelMode } from "./RoomModelManager";
import GridManager, { GridMode } from "./GridManager";
import ProjectionManager from "./ProjectionManager";
import { ShadowMapViewer } from 'three/addons/utils/ShadowMapViewer.js';

export default class Stage {
	private m_lightColor = new THREE.Color(0xf1f1f1);
	private m_darkColor = new THREE.Color(0x2a2a2a);

	private m_scene = new THREE.Scene;
	private m_renderer = undefined as Renderer | undefined;

	public roomModelManager = {} as RoomModelManager;
	public gridManager = {} as GridManager;
	public projectionManager = {} as ProjectionManager;

	public size = { x: 10, y: 10 };
	private dirLight = {} as THREE.DirectionalLight;

	private raymarchMat = {} as THREE.ShaderMaterial;

	public lightShadowMapViewer = {} as ShadowMapViewer;

	constructor(container: THREE.Object3D) {
		this.setup(container);
	}

	public setup(container: THREE.Object3D) {
		this.m_scene = new THREE.Scene;
		this.m_scene.add(container);

		this.setupScene();
		this.setLightTheme();

		this.gridManager = new GridManager(this.m_scene);
		this.projectionManager = new ProjectionManager();
		this.roomModelManager = new RoomModelManager(this.m_scene, this.size)



		// const sdf = this.createTestSDF();
		// this.m_scene.add(sdf);

	}

	public onResize() {
		this.projectionManager.onResize();
		this.m_renderer?.onResize();
	}

	private setupScene() {
		const ambLight = new THREE.AmbientLight(0x404040); // soft white light
		ambLight.intensity = 1;
		this.m_scene.add(ambLight);

		const hemiLight = new THREE.HemisphereLight(0x404040, 0x404040, 2);
		hemiLight.color.setHSL(0.6, 1, 0.7);
		hemiLight.groundColor.setHSL(0.095, 1, 0.85);
		hemiLight.position.set(0, 10, 0);
		this.m_scene.add(hemiLight);


		this.dirLight = new THREE.DirectionalLight(0x404040, 1);
		this.dirLight.position.set(0, 10, 0);

		const d = 10;

		this.dirLight.shadow.camera.top = d;
		this.dirLight.shadow.camera.bottom = - d;
		this.dirLight.shadow.camera.left = - d;
		this.dirLight.shadow.camera.right = d;
		this.dirLight.shadow.camera.near = -0.0001;
		this.dirLight.shadow.camera.far = 50;

		this.dirLight.castShadow = true;

		this.dirLight.shadow.mapSize.width = 2048;
		this.dirLight.shadow.mapSize.height = 2048;

		this.m_scene.add(this.dirLight);

		const axesHelper = new THREE.AxesHelper(1);
		axesHelper.position.set(0, 0.01, 0);
		this.m_scene.add(axesHelper);


	}

	private createTestSDF() {
		this.raymarchMat = new THREE.ShaderMaterial({
			uniforms: {
				uCameraPosition: { value: new THREE.Vector3() },
				uTime: { value: 0 }
			},
			vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
			fragmentShader: `
                varying vec3 vWorldPosition;
                uniform vec3 uCameraPosition;
                uniform float uTime;

                float sphereSDF(vec3 p, vec3 center, float radius) {
                    return length(p - center) - radius;
                }

                float boxSDF(vec3 p, vec3 b) {
                    vec3 q = abs(p) - b;
                    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
                }

                float opSubtraction(float d1, float d2) {
                    return max(-d1, d2);
                }

                float sceneSDF(vec3 p) {
                    float sphere = sphereSDF(p, vec3(0.5, 0.0, 0.0), 0.5);
                    float box = boxSDF(p, vec3(0.3, 0.3, 0.3));
                    return opSubtraction(sphere, box);
                }

                float raymarch(vec3 ro, vec3 rd) {
                    float depth = 0.0;
                    for (int i = 0; i < 100; i++) {
                        vec3 p = ro + rd * depth;
                        float dist = sceneSDF(p);
                        if (dist < 0.001) return depth;
                        depth += dist;
                        if (depth > 50.0) break;
                    }
                    return -1.0;
                }

                void main() {
                    vec3 ro = uCameraPosition;
                    vec3 rd = normalize(vWorldPosition - uCameraPosition);
                    float dist = raymarch(ro, rd);
                    if (dist < 0.0) discard;

                    float intensity = 1.0 - dist / 50.0;
                    gl_FragColor = vec4(1.0,1.0,0.0, 1.0);
                }
            `
		});


		let geo = new THREE.BoxGeometry(1, 1, 1);
		return new THREE.Mesh(geo, this.raymarchMat);
	}

	public setLightTheme() {
		this.m_scene.background = this.m_lightColor;
	}

	public setDarkTheme() {
		this.m_scene.background = this.m_darkColor;
	}

	public getXR() {
		return this.m_renderer?.getXR();
	}

	public getScene() {
		return this.m_scene;
	}

	public getCamera() {
		return this.projectionManager.getCurrentCamera();
	}
	public getDOMElement() {
		return this.m_renderer?.getDOMElement();
	}

	public switchGrid() {
		switch (this.gridManager.getCurrentGridMode()) {
			case GridMode.GM_NONE: {
				this.gridManager.setCurrentGrid(GridMode.GM_LINEAR, this.size.x);
				break;
			}
			case GridMode.GM_LINEAR: {
				this.gridManager.setCurrentGrid(GridMode.GM_RADIAL, this.size.x);
				break;
			}
			case GridMode.GM_RADIAL: {
				this.gridManager.setCurrentGrid(GridMode.GM_NONE, this.size.x);
				break;
			}
		}
		this.roomModelManager.onGridChanged(this.gridManager.getCurrentGridMode());
	}

	public switchRoomModel() {

		switch (this.roomModelManager.getCurrentModelMode()) {
			case ModelMode.ABSTRACT_PLANE: {
				this.roomModelManager.setCurrentModel(ModelMode.ROOM_MODEL);
				break;
			}
			case ModelMode.ROOM_MODEL: {
				this.roomModelManager.setCurrentModel(ModelMode.ABSTRACT_PLANE);
				break;
			}
		}
	}

	public switchProjection() {
		this.projectionManager.setIsOrthographicProjection(!this.projectionManager.getIsOrthographicProjection());
	}

	public draw(canvas: HTMLElement, drawCB: () => void) {
		this.m_renderer = new Renderer(canvas);
		this.m_renderer.draw(drawCB, this.getScene(), this.projectionManager.getCurrentCamera(), this.lightShadowMapViewer);

		//needs to be called again after shadow map is initialized
		this.roomModelManager.setShadowMapParams(this.dirLight.shadow);

	}

	public update() {
		// this.raymarchMat.uniforms.uCameraPosition.value.copy(this.getCamera().value.position);
		// this.raymarchMat.uniforms.uTime.value = performance.now() * 0.001;
	}
}
