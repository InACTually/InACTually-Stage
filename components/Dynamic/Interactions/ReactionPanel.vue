
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
            REACTIONS
        </template>
        <template v-slot:content>
            <CommonPanelRow v-for="c in reactions" :key="c.name" :id="c.name + '_reaction_button'">
                <h6>{{ c.name }}</h6>
            </CommonPanelRow>
        </template>
    </DynamicPanelBase>
</template>
<script setup lang="ts">
import InteractionManager from "~/app/InteractionManager";
import { ReactionRegistry, ReactionType, ReactionTypeName, type IReactionBaseConstructor } from "~/app/Interactions/ReactionRegistry";
import type RoomNodeBase from "~/app/RoomNodes/RoomNodeBase";
import UI3D from "~/app/View3D/UI3D";
import { GUIState } from "~/composables/useGUIState";
 

let { guiState } = useGUIState();
let { setDraggable } = useDragAndDrop();

let expand = ref<boolean>(false);

let reactions = reactive([] as {name:string,type:ReactionType}[]);

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
    ReactionRegistry.forEach((value: any, key: any) => {    
       reactions.push({name: ReactionTypeName[key],type:key});
   });
})
onMounted(() => {
    reactions.forEach((r:{name:string,type:ReactionType})=>{
        
        let element = document.getElementById(r.name + "_reaction_button");

        if(element)
            setDraggable(
                element,
                r.name,
                (event:any)=>{
                },
                (event:any)=>{
                    let roomNode = props.ui3d.hitsRoomNodeFrom2DEvent(event);
                    
                    if(roomNode)
                        addReaction(r.type,roomNode)
                }
            )
    })
})

function addReaction(type:ReactionType, roomNode:RoomNodeBase){
  //  props.interactionManager.createReactionByType(type,roomNode);
}

watch(guiState, () => {
    if (guiState.value == GUIState.GS_CONFIG) {
        expand.value = true;
    }
    else expand.value = false;
})

</script>
<style scoped lang="scss">
@import "@/assets/style/vars.scss";
</style>
