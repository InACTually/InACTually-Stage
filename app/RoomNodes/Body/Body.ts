
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
	Lars Engeln - mail@lars-engeln.de
*/

import * as THREE from "three";

export enum BodyJointType {
	BJT_UNKNOWN = -1,
	BJT_PELVIS = 0,
	BJT_SPINE_CHEST,
	BJT_NECK,
	BJT_SHOULDER_LEFT,
	BJT_ELBOW_LEFT,
	BJT_HAND_LEFT,
	BJT_SHOULDER_RIGHT,
	BJT_ELBOW_RIGHT,
	BJT_HAND_RIGHT,
	BJT_KNEE_LEFT,
	BJT_FOOT_LEFT,
	BJT_KNEE_RIGHT,
	BJT_FOOT_RIGHT,
	BJT_HEAD,
	BJT_COUNT
}

export const bodyJointParentLookUp: BodyJointType[] = [
	BodyJointType.BJT_PELVIS,
	BodyJointType.BJT_PELVIS,
	BodyJointType.BJT_SPINE_CHEST,
	BodyJointType.BJT_NECK,
	BodyJointType.BJT_SHOULDER_LEFT,
	BodyJointType.BJT_ELBOW_LEFT,
	BodyJointType.BJT_NECK,
	BodyJointType.BJT_SHOULDER_RIGHT,
	BodyJointType.BJT_ELBOW_RIGHT,
	BodyJointType.BJT_PELVIS,
	BodyJointType.BJT_KNEE_LEFT,
	BodyJointType.BJT_PELVIS,
	BodyJointType.BJT_KNEE_RIGHT,
	BodyJointType.BJT_NECK
];

export enum BodyJointConfidence {
	BJC_NONE = -1,     /**< Joint is out of range */
	BJC_UNKNOWN = 0,   /**< Joint is out of range */
	BJC_LOW = 1,       /**< Joint is not observed, predicted joint pose */
	BJC_HIGH = 2       /**< High confidence in observed joint pose */
}

export class BodyJointInfo {
	nextJoint: BodyJointType;
	TPoseDirection: THREE.Vector3;

	constructor(type: BodyJointType, TPoseDirection: THREE.Vector3) {
		this.nextJoint = type;
		this.TPoseDirection = TPoseDirection;
	}

	static create(type: BodyJointType = BodyJointType.BJT_UNKNOWN, position: THREE.Vector3 = new THREE.Vector3(0, 0, 0)): BodyJointInfo {
		return new BodyJointInfo(type, position);
	}
}

const bodyMap: Map<BodyJointType, BodyJointInfo> = new Map([
	[BodyJointType.BJT_PELVIS, BodyJointInfo.create(BodyJointType.BJT_SPINE_CHEST, new THREE.Vector3(0.0, 1.0, 0.0))],
	[BodyJointType.BJT_SPINE_CHEST, BodyJointInfo.create(BodyJointType.BJT_NECK, new THREE.Vector3(0.0, 1.0, 0.0))],
	[BodyJointType.BJT_NECK, BodyJointInfo.create(BodyJointType.BJT_HEAD, new THREE.Vector3(0.0, 1.0, 0.0))],
	[BodyJointType.BJT_SHOULDER_LEFT, BodyJointInfo.create(BodyJointType.BJT_ELBOW_LEFT, new THREE.Vector3(-1.0, 0.0, 0.0))],
	[BodyJointType.BJT_ELBOW_LEFT, BodyJointInfo.create(BodyJointType.BJT_HAND_LEFT, new THREE.Vector3(-1.0, 0.0, 0.0))],
	[BodyJointType.BJT_KNEE_LEFT, BodyJointInfo.create(BodyJointType.BJT_FOOT_LEFT, new THREE.Vector3(0.0, -1.0, 0.0))],
	[BodyJointType.BJT_SHOULDER_RIGHT, BodyJointInfo.create(BodyJointType.BJT_ELBOW_RIGHT, new THREE.Vector3(1.0, 0.0, 0.0))],
	[BodyJointType.BJT_ELBOW_RIGHT, BodyJointInfo.create(BodyJointType.BJT_HAND_RIGHT, new THREE.Vector3(1.0, 0.0, 0.0))],
	[BodyJointType.BJT_KNEE_RIGHT, BodyJointInfo.create(BodyJointType.BJT_FOOT_RIGHT, new THREE.Vector3(0.0, -1.0, 0.0))]
]);

export class BodyJoint {
	type: BodyJointType;
	position: THREE.Vector3;
	orientation: THREE.Quaternion;
	confidenceLevel: BodyJointConfidence;

	constructor(type: BodyJointType = BodyJointType.BJT_UNKNOWN, position: THREE.Vector3 = new THREE.Vector3(0, 0, 0), orientation: THREE.Quaternion = new THREE.Quaternion(0, 0, 0, 1), confidenceLevel: BodyJointConfidence = BodyJointConfidence.BJC_UNKNOWN) {
		this.type = type;
		this.position = position;
		this.orientation = orientation;
		this.confidenceLevel = confidenceLevel;
	}

	static create(type: BodyJointType = BodyJointType.BJT_UNKNOWN, position: THREE.Vector3 = new THREE.Vector3(0, 0, 0), orientation: THREE.Quaternion = new THREE.Quaternion(0, 0, 0, 1), confidenceLevel: BodyJointConfidence = BodyJointConfidence.BJC_UNKNOWN): BodyJoint {
		return new BodyJoint(type, position, orientation, confidenceLevel);
	}

	toJson(): any {
		return {
			type: this.type,
			position: { x: this.position, y: this.position, z: this.position },
			orientation: { x: this.orientation, y: this.orientation, z: this.orientation, w: this.orientation },
			confidenceLevel: this.confidenceLevel
		};
	}

	fromJson(json: any): void {
		if (json.type !== undefined && this.type === BodyJointType.BJT_UNKNOWN) {
			this.type = json.type; // if update, type should not have been changed - only change if it was unknown before
		}
		this.position.set(json.position.x, json.position.y, json.position.z);
		this.orientation.set(json.orientation.x, json.orientation.y, json.orientation.z, json.orientation.w);

		if (json.confidenceLevel !== undefined) {
			this.confidenceLevel = json.confidenceLevel;
		}
	}
}

export default class Body {
	m_joints: BodyJoint[];
	m_uid: string = "";

	constructor() {
		this.m_joints = [];
		for (let i = 0; i < BodyJointType.BJT_COUNT; i++) {
			this.m_joints.push(BodyJoint.create(i as BodyJointType));
		}
	}

	static create(): Body {
		return new Body();
	}

	getPosition(): THREE.Vector3 {
		return this.m_joints[BodyJointType.BJT_SPINE_CHEST].position;
	}

	toJson(): any {
		const jointsJson = this.m_joints.map(joint => joint.toJson());
		return {
			uid: this.m_uid,
			joints: jointsJson
		};
	}

	fromJson(json: any, override: boolean = false): boolean {
		if (!json.uid || !json.joints) {
			return false;
		}
		if (override) {
			this.m_uid = json.uid;
		} else if (this.m_uid !== json.uid) {
			return false;
		}

		for (const jointJson of json.joints) {
			let type = BodyJointType.BJT_UNKNOWN;
			if (jointJson.type !== undefined)
				type = jointJson.type as BodyJointType;
			this.m_joints[type].fromJson(jointJson);
		}
		return true;
	}
}
