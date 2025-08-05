
/*
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright(c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright(c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2023

	contributors:
	Fabian Töpfer - baniaf@uber.space
*/

export default interface IIntersectRoomModel {
	getIntersectionWithRoomModel(origin: THREE.Vector3, dir?: THREE.Vector3): THREE.Intersection[]
}
