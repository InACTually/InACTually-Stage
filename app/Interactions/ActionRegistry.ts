
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


import type IInteractionPublisher from "../Network/IInteractionPublisher";
import type ActionBase from "./ActionBase";
import MovementAction from "./Actions/MovementAction";
import type ActionSpaceRoomNode from "../RoomNodes/ActionSpace/ActionSpaceRoomNode";
import { RoomNodeType } from "../RoomNodes/RoomNodeRegistry";

export enum ActionType {
	AT_UNKNOWN,
	AT_MOVEMENT
};

export const ActionTypeName = [
	"UNKNOWN",
	"MOVEMENT"
];

export interface IActionBaseConstructor {
	new(publisher: IInteractionPublisher): ActionBase
}

export const ActionRegistry = new Map<ActionType, IActionBaseConstructor>();
ActionRegistry.set(ActionType.AT_MOVEMENT, MovementAction);

export const ActionRoomNodeMap = new Map<ActionType, RoomNodeType[]>();
ActionRoomNodeMap.set(ActionType.AT_MOVEMENT, [RoomNodeType.RNT_CAMERA, RoomNodeType.RNT_KINECT]);
