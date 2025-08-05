
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

let draggedElement = ref<string>()

export default function () {
	let setDraggable = (element: HTMLElement, name: string, onDragStartCallback: any, onDragEndCallback: any) => {
		draggedElement.value = name;
		element.setAttribute("draggable", "true");
		element.addEventListener("dragstart", (event) => { dragStart(event, onDragStartCallback) });
		element.addEventListener("dragend", (event) => { dragEnd(event, onDragEndCallback); });
	}

	let dragStart = (event: any, callback: any) => { callback(event) }
	let dragEnd = (event: any, callback: any) => { callback(event); }

	return { setDraggable, draggedElement }
}
