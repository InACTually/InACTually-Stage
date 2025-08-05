
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
*/

import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import * as THREE from "three";


export default async function loadModel(path: string): Promise<THREE.Object3D> {
	let model = undefined;
	const modelType = path.split(/[. ]+/).pop();
	switch (modelType) {
		case "dae":
			model = await loadCollada(path);
			break;
		case "obj":
			model = await loadObj(path);
			break;
		case "glb":
			model = await loadGLTF(path);
			break;
	}

	return new Promise<THREE.Object3D>((resolve, reject) => {
		resolve(model!);
	})
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

