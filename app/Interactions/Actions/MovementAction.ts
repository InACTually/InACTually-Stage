
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

import ActionBase from "../ActionBase";
import type IInteractionPublisher from "~/app/Network/IInteractionPublisher";
import type ActionSpaceRoomNode from "~/app/RoomNodes/ActionSpace/ActionSpaceRoomNode";
import { ActionType } from "../ActionRegistry";

export default class MovementAction extends ActionBase {

	private m_movement = 0;

	constructor(publisher: IInteractionPublisher) {
		super(publisher);
		this.setup();
		this.m_type = ActionType.AT_MOVEMENT;
	}

	public override setup(): void {

	}

	public override update(): void {

	}

	public override onData(): void {

	}

	public override getData(): number {
		return this.m_movement
	}

	public override evaluate(): boolean {
		return false;
	}

	public override toJson() {

	}

	public override fromJson(params: any, publish: boolean): void {

	}
}
