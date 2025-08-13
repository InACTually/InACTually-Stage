
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
	Lars Engeln - mail@lars-engeln.de
-->

<template>
    <DynamicPanelBase v-model="expand">
        <template v-slot:title>
            ROOM REGISTRATION
        </template>
        <template v-slot:content>
            <div class="room_model_wrapper">
                <div class="room_model_content">
                    <CommonInput v-model="refLength"></CommonInput>
                 </div>
            </div>
        </template>
    </DynamicPanelBase>   
</template>
<script setup lang="ts">

import { GUIState } from "~/composables/useGUIState";
  
let {guiState} = useGUIState();
let expand = ref<boolean>(true);
 
let refLength = ref<number>(1);
//let interactionManager = useInteractionManager();


watch(guiState,()=>{
    if(guiState.value === GUIState.GS_SETUP){
        expand.value = true;
    }
    else expand.value = false;
})

watch(refLength,()=>{   
    //interactionManager.setRoomRegistrationRefLength(refLength.value);

})
 
</script>
<style  lang="scss">
@use "@/assets/style/vars.scss";
.room_model_wrapper{
    width:100%;
    display:flex;
    justify-content: center;
    align-items: center;

    .room_model_content{
        width:100%;
        display:flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        
    }
}
</style>
