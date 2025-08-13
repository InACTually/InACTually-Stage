
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
	Lars Engeln - mail@lars-engeln.de
*/

export enum RoomNodeType {
	RNT_UNKOWN,
	RNT_ACTIONSPACE,
	RNT_CAMERA,
	RNT_KINECT,
	RNT_MOVINGHEAD,
	RNT_BODY,
	RNT_PROJECTOR
};

const roomNodeNameToType = new Map<string, RoomNodeType>([
	["unknown", RoomNodeType.RNT_UNKOWN],
	["actionspace", RoomNodeType.RNT_ACTIONSPACE],
	["camera", RoomNodeType.RNT_CAMERA],
	["kinect", RoomNodeType.RNT_KINECT],
	["movinghead", RoomNodeType.RNT_MOVINGHEAD],
	["body", RoomNodeType.RNT_BODY],
	["projector", RoomNodeType.RNT_PROJECTOR],
]);

const roomNodeTypeToName = new Map<RoomNodeType, string>(
	Array.from(roomNodeNameToType, ([key, value]) => [value, key])
);

export function toRoomNodeType(name: string): RoomNodeType {
	let type = roomNodeNameToType.get(name);
	if (type === undefined)
		type = RoomNodeType.RNT_UNKOWN;

	return type;
}

export function fromRoomNodeType(type: RoomNodeType): string {
	let name = roomNodeTypeToName.get(type);
	if (name === undefined)
		name = roomNodeTypeToName.get(RoomNodeType.RNT_UNKOWN) as string;

	return name;
}

export enum RoomNodeManagerType {
	RNM_UNKNOWN,
	RNM_ACTIONSPACE,
	RNM_CAMERA,
	RNM_KINECT,
	RNM_DMX,
	RNM_BODY,
	RNM_PROJECTOR
}

const roomNodeCorrespondence = new Map<RoomNodeType, RoomNodeManagerType>([
	[RoomNodeType.RNT_ACTIONSPACE, RoomNodeManagerType.RNM_ACTIONSPACE],
	[RoomNodeType.RNT_CAMERA, RoomNodeManagerType.RNM_CAMERA],
	[RoomNodeType.RNT_KINECT, RoomNodeManagerType.RNM_KINECT],
	[RoomNodeType.RNT_MOVINGHEAD, RoomNodeManagerType.RNM_DMX],
	[RoomNodeType.RNT_BODY, RoomNodeManagerType.RNM_BODY],
	[RoomNodeType.RNT_PROJECTOR, RoomNodeManagerType.RNM_PROJECTOR],
]);



export default roomNodeCorrespondence
