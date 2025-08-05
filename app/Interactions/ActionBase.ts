
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
import { RoomNodeType } from "../RoomNodes/RoomNodeRegistry";
import type ReactionBase from "./ReactionBase";
import type ActionSpaceRoomNode from "../RoomNodes/ActionSpace/ActionSpaceRoomNode";
import { ActionType } from "./ActionRegistry";

export default abstract class ActionBase {

	protected m_name = "";
	protected m_uid = "";

	protected m_publisher = {} as IInteractionPublisher;
	protected m_reaction = {} as ReactionBase;
	protected m_type = ActionType.AT_UNKNOWN;


	constructor(publisher: IInteractionPublisher) {
		this.m_publisher = publisher;


	}

	public abstract setup(): void;
	public abstract update(): void;

	public abstract onData(): void;
	public abstract evaluate(): boolean;

	public abstract toJson(): any;
	public abstract fromJson(params: any, publish: boolean): void;

	public abstract getData(): any;


	setUID(uid: string) {
		this.m_uid = uid;
	}
	getUID(): string {
		return this.m_uid;
	}

	setName(name: string) {
		this.m_name = name;
	}
	getName(): string {
		return this.m_name
	};

	setReaction(reaction: ReactionBase) {
		this.m_reaction = reaction;
	}

	getReaction(): ReactionBase {
		return this.m_reaction;
	}

	getType(): ActionType {
		return this.m_type;
	}

	public destroy(cb: { (msg: any): void }, publish: boolean) {

		if (!publish) {
			cb({ uid: this.getUID() });
			return;
		}

		// this.m_publisher.deleteRoomNode(
		//     {
		//         uid:this.getUID(),
		//         name:RoomNodeTypeName[this.m_roomNodeType]
		//     },
		//     cb)
	}

}
