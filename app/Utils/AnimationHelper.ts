
/*
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright(c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright(c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2025

	contributors:
	Fabian Töpfer - baniaf@uber.space
*/

import * as THREE from "three";
import * as TWEEN from '@tweenjs/tween.js'

export function animateVector3(vectorToAnimate: THREE.Vector3, target: THREE.Vector3, options: { easing?: any, duration?: any, update?: any, callback?: any }) {
	options = options || {};

	// get targets from options or set to defaults
	var to = target || new THREE.Vector3(),
		easing = options.easing || TWEEN.Easing.Quadratic.Out,
		duration = options.duration || 300;
	// create the tween
	var tweenVector3 = new TWEEN.Tween(vectorToAnimate)
		.to({ x: to.x, y: to.y, z: to.z, }, duration)
		.easing(easing)
		.onUpdate(function (d: any) {
			if (options.update) {
				options.update(d);
			}
		})
		.onComplete(function () {
			if (options.callback) options.callback();
		});
	// start the tween
	tweenVector3.start();
	// return the tween in case we want to manipulate it later on
	return tweenVector3;
}
