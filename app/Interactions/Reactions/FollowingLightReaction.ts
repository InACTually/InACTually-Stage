
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
	}

	public override setup(): void {

	}

	public override update(): void {

	}

	public override toJson() {

	}

	public override fromJson(params: any, publish: boolean): void {

	}

}
