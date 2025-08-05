
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

import type ActionBase from "./Interactions/ActionBase";
import { ActionRegistry, type ActionType } from "./Interactions/ActionRegistry";
import type ReactionBase from "./Interactions/ReactionBase";
import { ReactionRegistry, ReactionType } from "./Interactions/ReactionRegistry";
import type IInteractionPublisher from "./Network/IInteractionPublisher";
import type RoomManager from "./RoomManager";
import type ActionSpaceRoomNode from "./RoomNodes/ActionSpace/ActionSpaceRoomNode";

export interface IInteraction {
	action: ActionBase | undefined,
	reaction: ReactionBase | undefined
}

export default class InteractionManager {


	private m_roomManager = {} as RoomManager;

	private m_actions: ActionBase[] = reactive([]);
	private m_reactions: ReactionBase[] = reactive([]);
	private m_interactions: Map<string, IInteraction> = reactive(new Map<string, IInteraction>()); // maps actionspace uid to interaction interface 

	private m_publisher = {} as IInteractionPublisher;

	constructor(publisher: IInteractionPublisher, roomManager: RoomManager) {
		this.setup(publisher, roomManager);
	}

	setup(publisher: IInteractionPublisher, roomManager: RoomManager) {
		this.m_publisher = publisher;
		this.m_roomManager = roomManager;
	}

	update() {

	}

	getActionByUID(uid: string): ActionBase | undefined {
		return this.m_actions.find((a: ActionBase) => a.getUID() == uid);
	}
	getReactionByUID(uid: string): ReactionBase | undefined {
		return this.m_reactions.find((r: ReactionBase) => r.getUID() == uid);
	}

	getInteractionByUID(uid: string): IInteraction | undefined {
		return this.m_interactions.get(uid);
	}

	createActionByType(type: ActionType, actionSpace: ActionSpaceRoomNode): ActionBase | undefined {
		let Action = ActionRegistry.get(type);
		let action = undefined;
		if (Action) {
			action = new Action(this.m_publisher);
			this.m_actions.push(action);
			console.log("[InteractionManger] created action", action);

			let interaction = this.m_interactions.get(actionSpace.getUID());

			if (interaction) {
				interaction.action = action
			} else {
				interaction = this.createInteraction(actionSpace, action);
			}
		}
		return action;
	}

	createReactionByType(type: ReactionType, actionSpace: ActionSpaceRoomNode): ReactionBase | undefined {
		let reaction = undefined;
		let Reaction = ReactionRegistry.get(type);
		if (Reaction) {
			reaction = new Reaction(this.m_publisher);
			this.m_reactions.push(reaction);
			console.log("[InteractionManger] created reaction", reaction);

			let interaction = this.m_interactions.get(actionSpace.getUID());

			if (interaction) {
				interaction.reaction = reaction
			} else {
				this.createInteraction(actionSpace, undefined, reaction);
			}

		}
		// let reactionRoomNodeTypes = ReactionRoomNodeMap.get(type);

		// if (reactionRoomNodeTypes) {
		//     if (reactionRoomNodeTypes.includes(roomNode.getRoomNodeType())) {
		//         let Reaction = ReactionRegistry.get(type);
		//         if (Reaction) {
		//             reaction = new Reaction(this.m_publisher, roomNode);
		//             this.m_reactions.push(reaction);
		//             console.log("[InteractionManger] created reaction", reaction);
		//         }
		//     }
		// }


		return reaction;
	}

	updateActionByUID(uid: string, data: any, publish: boolean) {
		let action = this.getActionByUID(uid);
		if (action) {
			action.fromJson(data, publish);
		}
	}

	updateReactionByUID(uid: string, data: any, publish: boolean) {
		let reaction = this.getReactionByUID(uid);
		if (reaction) {
			reaction.fromJson(data, publish);
		}
	}

	deleteActionByUID(uid: string, publish: boolean) {
		let action = this.getActionByUID(uid);
		if (action) {
			action.destroy(() => {
				let i = this.m_actions.indexOf(action);
				if (i > -1) {
					this.m_actions.slice(i, 1);
				}
			}, publish);
		}
	}

	deleteReactionByUID(uid: string, publish: boolean) {
		let reaction = this.getReactionByUID(uid);
		if (reaction) {
			reaction.destroy(() => {
				let i = this.m_reactions.indexOf(reaction);

				if (i > -1) {
					this.m_reactions.slice(i, 1);
				}
			}, publish);
		}
	}

	createInteraction(actionSpace: ActionSpaceRoomNode, action?: ActionBase, reaction?: ReactionBase, condition?: any): IInteraction {
		if (!this.m_interactions.has(actionSpace.getUID()))
			this.m_interactions.set(actionSpace.getUID(), { action: action, reaction: reaction });

		return this.m_interactions.get(actionSpace.getUID())!;
	}

	deleteInteractionByUID(uid: string) {
		this.m_interactions.delete(uid);
	}

	fromJson(json: any) {

	}

	toJson(): any {

		return {};
	}

}
