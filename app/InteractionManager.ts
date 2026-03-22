
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
	uid:string,
	actions: ActionBase[],
	reactions: ReactionBase[],
}

export default class InteractionManager {


	private m_roomManager = {} as RoomManager;

	private m_actions: ActionBase[] = reactive([]);
	private m_reactions: ReactionBase[] = reactive([]);
	private m_interactions = reactive(new Map<string, IInteraction[]>()); // maps actionspace uid to interaction interface 

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

	getInteractionsByActionSpace(uid: string): IInteraction[] | undefined {
		return this.m_interactions.get(uid);
	}

	getInteractionByUID(uid: string): IInteraction | undefined {
		let interaction = undefined as IInteraction | undefined;
		this.m_interactions.forEach((interactions: IInteraction[]) => {
			interactions.forEach((i: IInteraction) => {
				if (i.uid == uid) {
					interaction = i;
				}
			});
		});
		return interaction;
	}

	createActionByType(type: ActionType, actionSpace: ActionSpaceRoomNode): ActionBase | undefined {
		let Action = ActionRegistry.get(type);
		let action = undefined;
		if (Action) {
			action = new Action(this.m_publisher);
			action.setUID(this.m_publisher.createUID());
			this.m_actions.push(action);
			this.getOrCreateInteractionByActionSpace(actionSpace).actions.push(action);
		}
		return action;
	}

	createReactionByType(type: ReactionType, actionSpace: ActionSpaceRoomNode): ReactionBase | undefined {
		let reaction = undefined;
		let Reaction = ReactionRegistry.get(type);
		if (Reaction) {
			reaction = new Reaction(this.m_publisher);
			reaction.setUID(this.m_publisher.createUID());
			this.m_reactions.push(reaction);
			this.getOrCreateInteractionByActionSpace(actionSpace).reactions.push(reaction);
			console.log("[InteractionManger] created reaction", reaction);
 
		}

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

	createInteraction(actionSpace: ActionSpaceRoomNode, action?: ActionBase, reaction?: ReactionBase): IInteraction {
		if (!this.m_interactions.has(actionSpace.getUID()))
			this.m_interactions.set(actionSpace.getUID(), [] as IInteraction[]);


		let interactions =  this.m_interactions.get(actionSpace.getUID())!;
		let interaction: IInteraction = { uid:this.m_publisher.createUID(), actions: [], reactions: [] };
		
		if(action)
			interaction.actions.push(action);
		if(reaction)
			interaction.reactions.push(reaction);

		interactions.push(interaction);
		
		this.m_interactions.set(actionSpace.getUID(), interactions);

		return interaction;
	}

	private getOrCreateInteractionByActionSpace(actionSpace: ActionSpaceRoomNode): IInteraction {
		let interactions = this.m_interactions.get(actionSpace.getUID());

		if (!interactions) {
			interactions = [] as IInteraction[];
			this.m_interactions.set(actionSpace.getUID(), interactions);
		}

		let interaction = interactions[0];
		if (!interaction) {
			interaction = this.createInteraction(actionSpace);
		}

		return interaction;
	}

	deleteInteractionByUID(uid: string) {
		this.m_interactions.delete(uid);
	}

	fromJson(json: any) {
		this.m_actions.splice(0, this.m_actions.length);
		this.m_reactions.splice(0, this.m_reactions.length);
		this.m_interactions.clear();

		if (!json?.interactions) {
			return;
		}

		Object.entries(json.interactions).forEach(([actionSpaceUID, interactionEntries]) => {
			if (!Array.isArray(interactionEntries)) {
				return;
			}

			const interactions = [] as IInteraction[];

			interactionEntries.forEach((interactionJson: any) => {
				const interaction: IInteraction = {
					uid: interactionJson.uid ?? this.m_publisher.createUID(),
					actions: [],
					reactions: [],
				};

				if (Array.isArray(interactionJson.actions)) {
					interactionJson.actions.forEach((actionJson: any) => {
						const Action = ActionRegistry.get(actionJson.type as ActionType);
						if (!Action) {
							return;
						}

						const action = new Action(this.m_publisher);
						if (actionJson.uid) {
							action.setUID(actionJson.uid);
						}
						action.fromJson(actionJson, false);
						this.m_actions.push(action);
						interaction.actions.push(action);
					});
				}

				if (Array.isArray(interactionJson.reactions)) {
					interactionJson.reactions.forEach((reactionJson: any) => {
						const Reaction = ReactionRegistry.get(reactionJson.type as ReactionType);
						if (!Reaction) {
							return;
						}

						const reaction = new Reaction(this.m_publisher);
						if (reactionJson.uid) {
							reaction.setUID(reactionJson.uid);
						}
						reaction.fromJson(reactionJson, false);
						this.m_reactions.push(reaction);
						interaction.reactions.push(reaction);
					});
				}

				interactions.push(interaction);
			});

			this.m_interactions.set(actionSpaceUID, interactions);
		});
	}

	toJson(): any {
		const interactions: Record<string, any[]> = {};

		 
		this.m_interactions.forEach((interactionEntries: IInteraction[], actionSpaceUID: string) => {
			interactions[actionSpaceUID] = interactionEntries.map((interaction: IInteraction) => ({
				uid: interaction.uid,
				actions: interaction.actions.map((action: ActionBase) => ({
					uid: action.getUID(),
					type: action.getType(),
					...action.toJson(),
				})),
				reactions: interaction.reactions.map((reaction: ReactionBase) => ({
					uid: reaction.getUID(),
					type: reaction.getType(),
					...reaction.toJson(),
				})),
			}));
		});

		return { interactions };
	}

}
