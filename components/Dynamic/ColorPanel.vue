
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
            COLOR
        </template>
        <template v-slot:content>
            <div class="color_picker_wrapper">
                <ColorPicker v-model="color" format="rgb" inline />
            </div>
        </template>
    </DynamicPanelBase>   
</template>
<script setup lang="ts">
import { GUIState } from "~/composables/useGUIState";


let color = ref();

let {guiState} = useGUIState();
let expand = ref<boolean>(false);

watch(guiState,()=>{
    if(guiState.value === GUIState.GS_CONFIG){
        expand.value = true;
    }
    else expand.value = false;
})



    
</script>
<style scoped lang="scss">
@use "@/assets/style/vars.scss";
.color_picker_wrapper{
    width:100%;
    display:flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 20px;
}
</style>
