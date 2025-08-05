
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

import type IInteractionPublisher from "../Network/IInteractionPublisher";
import type ReactionBase from "./ReactionBase";
import FollowingLightReaction from "./Reactions/FollowingLightReaction";
import type RoomNodeBase from "../RoomNodes/RoomNodeBase";
import { RoomNodeType } from "../RoomNodes/RoomNodeRegistry";

export enum ReactionType {
	RT_UNKNOWN,
	RT_FOLLOWING_LIGHT
};

export const ReactionTypeName = [
	"UNKNOWN",
	"FOLLOWING LIGHT"
];


export interface IReactionBaseConstructor {
	new(publisher: IInteractionPublisher): ReactionBase
}
export const ReactionRegistry = new Map<ReactionType, IReactionBaseConstructor>();
ReactionRegistry.set(ReactionType.RT_FOLLOWING_LIGHT, FollowingLightReaction);


export const ReactionRoomNodeMap = new Map<ReactionType, RoomNodeType[]>();
ReactionRoomNodeMap.set(ReactionType.RT_FOLLOWING_LIGHT, [RoomNodeType.RNT_MOVINGHEAD]);
