
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

import ReactionBase from "../ReactionBase";
import type IInteractionPublisher from "~/app/Network/IInteractionPublisher";
import { ReactionType } from "../ReactionRegistry";

export default class FollowingLightReaction extends ReactionBase {
	constructor(publisher: IInteractionPublisher) {
		super(publisher);
		this.setup();
		this.m_type = ReactionType.RT_FOLLOWING_LIGHT;
		this.m_name = "Following Light Reaction";
		this.m_description = "A set of lights follows a human in the room.";
	}

	public override setup(): void {

	}

	public override update(): void {

	}

	public override toJson() {
		return {
			uid:this.m_uid,
			type:this.m_type,
			name:this.m_name
		}
	}

	public override fromJson(params: any, publish: boolean): void {

	}

}
