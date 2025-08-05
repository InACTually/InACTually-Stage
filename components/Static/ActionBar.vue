
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
    <section class="action_bar_wrapper">
        <div class="action_bar_content">
            <div class="interaction_modes">
                <h6 @click="guiStateClicked('setup')"  :class="{selected:isSelected('setup')}">SETUP</h6>
            </div>

            <!-- <NavigationWidget></NavigationWidget> -->
            <div class="interaction_modes">
                <h6 @click="guiStateClicked('configure')" :class="{selected:isSelected('configure')}">CONFIGURE</h6>
           </div>

        </div>
 
    </section>
</template>
<script lang="ts" setup>
import { GUIState } from "~/composables/useGUIState";

let {guiState} = useGUIState();
let mode = ref<string>("translate")

function guiStateClicked(state:string){
    switch(state){
        case "setup":
            guiState.value = GUIState.GS_SETUP;
            break;
        case "configure":
            guiState.value = GUIState.GS_CONFIG;
            break;
    }
}

function isSelected(state:string){
    switch(state){
        case "setup":
            return guiState.value == GUIState.GS_SETUP
        case "configure":
            return guiState.value == GUIState.GS_CONFIG
    }
    return false;
}


</script>
<style lang="scss" scoped>
@import "@/assets/style/vars.scss";
.action_bar_wrapper{
      
    background-color:$semiTransparentColor; 
    border:solid $borderWidth $borderColor;
    border-radius: 10px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    min-height:30px;
    max-width:600px;
    position:absolute;
    bottom:10px;
    left:50%;
    transform:translateX(-50%);
    z-index:2;
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items:center;
 
      .action_bar_content{
                padding:$padding;
                margin-left:$margin;
                margin-right:$margin;
                display:flex;
                flex-direction: row;
                justify-content:center;
                align-items:center;
                height:100%;

            .interaction_modes{
                margin-right:$margin;
                display:flex;
                flex-direction:row;
                

                h6{
                    padding:$padding;      
                    border-bottom:solid $borderWidth $semiTransparentColor;

                    &.selected{
                        border-bottom:solid $borderWidth $borderColor;
                    }

                    &:hover{
                        border-bottom:solid $borderWidth $borderColorHighlight;

                    }


                }
             }

        }
}
</style>
