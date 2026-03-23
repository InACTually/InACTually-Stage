
/*
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright(c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright(c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2024-2026

	contributors:
	Fabian Töpfer - baniaf@uber.space
*/

import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

import * as THREE from "three";

let gaussianSplatLoadId = 0;

export default async function loadModel(path: string, typeHint?: string): Promise<THREE.Object3D> {
	let model = undefined;
	const modelType = (typeHint ?? path).split(/[. ]+/).pop()?.toLowerCase();
	switch (modelType) {
		case "dae":
			model = await loadCollada(path);
			break;
		case "obj":
			model = await loadObj(path);
			break;
		case "gltf":
		case "glb":
			model = await loadGLTF(path);
			break;
		case "fbx":
			model = await loadFBX(path);
			break;
		case "ply":
		case "spz":
		case "splat":
		case "ksplat":
		case "pcsogs":
		case "pcsogszip":
		case "rad":
			model = await loadGaussianSplat(path);
			break;
	}

	return new Promise<THREE.Object3D>((resolve, reject) => {
		if (!model) {
			reject(new Error(`Unsupported model type for path: ${typeHint ?? path}`));
			return;
		}
		resolve(model);
	});
}

export async function loadImageObject(path: string): Promise<THREE.Object3D> {
	return new Promise((resolve, reject) => {
		const texLoader = new THREE.TextureLoader();
		texLoader.load(path, (tex) => {
			tex.colorSpace = THREE.SRGBColorSpace;
			const material = new THREE.SpriteMaterial({ map: tex, sizeAttenuation: false });

			const sprite = new THREE.Sprite(material);

			sprite.scale.x = sprite.material.map!.image.naturalWidth * 0.002;
			sprite.scale.y = sprite.material.map!.image.naturalHeight * 0.002;

			resolve(sprite)
		})
	})
}


export async function loadCollada(path: string): Promise<THREE.Object3D> {
	return new Promise((resolve, reject) => {
		const loader = new ColladaLoader();
		loader.load(path, (model) => {
			resolve(model.scene);
		})
	})
}

export async function loadGLTF(path: string): Promise<THREE.Object3D> {
	return new Promise((resolve, reject) => {
		const loader = new GLTFLoader();
		loader.load(path, (model) => {
			resolve(model.scene);
		})
	})
}


export async function loadObj(path: string): Promise<THREE.Object3D> {
	return new Promise((resolve, reject) => {
		const loader = new OBJLoader();
		loader.load(path, (model) => {
			resolve(model);
		})
	})
}

export async function loadFBX(path: string): Promise<THREE.Object3D> {
	return new Promise((resolve, reject) => {
		const loader = new FBXLoader();
		loader.load(path, (model) => {
			resolve(model);
		})
	})
}

export async function loadGaussianSplat(path: string): Promise<THREE.Object3D> {
	if (!import.meta.client) {
		throw new Error("Gaussian splats can only be loaded on the client.");
	}

	const { default: GaussianSplatManager } = await import("~/app/View3D/GaussianSplatManager");
	const manager = GaussianSplatManager.getInstance();

	return new Promise((resolve) => {
		const id = `model-loader-splat-${gaussianSplatLoadId++}`;
		const mesh = manager.load({
			id,
			url: path,
			addToScene: false,
			onLoad: (loadedMesh) => {
				loadedMesh.userData.gaussianSplatId = id;
				resolve(loadedMesh as unknown as THREE.Object3D);
			},
		});

		mesh.userData.gaussianSplatId = id;

		if (mesh.isInitialized) {
			resolve(mesh as unknown as THREE.Object3D);
		}
	});
}
