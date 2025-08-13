
<!--
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright (c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright (c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2024-2025

	contributors:
	Fabian Töpfer - baniaf@uber.space
-->

<template>
    <DynamicPanelBase v-model="expand">
        <template v-slot:title>
            ACTIONS
        </template>
        <template v-slot:content>
            <CommonPanelRow v-for="c in actions" :key="c.name" :id="c.name + '_action_button'">
                <h6>{{ c.name }}</h6>
            </CommonPanelRow>
        </template>
    </DynamicPanelBase>
</template>
<script setup lang="ts">
import InteractionManager from "~/app/InteractionManager";
import type { ActionType, IActionBaseConstructor } from "~/app/Interactions/ActionRegistry";
import {ActionRegistry, ActionTypeName } from "~/app/Interactions/ActionRegistry";
import type ActionSpaceRoomNode from "~/app/RoomNodes/ActionSpace/ActionSpaceRoomNode";
import UI3D from "~/app/View3D/UI3D";
import { GUIState } from "~/composables/useGUIState";
 

let { guiState } = useGUIState();
let { setDraggable } = useDragAndDrop();

let expand = ref<boolean>(false);

let actions = reactive([] as {name:string,type:ActionType}[]);

const props = defineProps({
    interactionManager:{
        type:InteractionManager,
        required:true
    },
    ui3d:{
        type:UI3D,
        required:true
    },

});
onBeforeMount(()=>{
    ActionRegistry.forEach((value: any, key: any) => {    
       actions.push({name: ActionTypeName[key],type:key});
   });
})
onMounted(() => {
    actions.forEach((a:{name:string,type:ActionType})=>{
        
        let element = document.getElementById(a.name + "_action_button");

        if(element)
            setDraggable(
                element,
                a.name,
                (event:any)=>{
                },
                (event:any)=>{
                    let actionSpace = props.ui3d.hitsRoomNodeFrom2DEvent(event);
                    if(actionSpace)
                        addAction(a.type,actionSpace as ActionSpaceRoomNode)
                }
            )
    })
})

function addAction(type:ActionType, actionSpace:ActionSpaceRoomNode){
    props.interactionManager.createActionByType(type,actionSpace);
}

watch(guiState, () => {
    if (guiState.value == GUIState.GS_CONFIG) {
        expand.value = true;
    }
    else expand.value = false;
})

</script>
<style scoped lang="scss">
@use "@/assets/style/vars.scss";
</style>
