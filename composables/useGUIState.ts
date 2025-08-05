
/*
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright (c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright (c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2023

	contributors:
	Fabian Töpfer - baniaf@uber.space
*/

export enum GUIState {
	GS_SETUP,
	GS_CONFIG,
}

export const GUIStateName = [
	"SETUP",
	"CONFIG"
]

let guiState = ref<GUIState>(GUIState.GS_SETUP);

export default function () {
	return {
		guiState
	};
}
