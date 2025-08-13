
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
    <section class="left_panel_wrapper">
        <div class="left_panel_content" v-if="props.app.roomManager">
             <!--<DynamicScenePanel class="dynamic_panel"></DynamicScenePanel>
            <DynamicDetailsPanel v-if="getGuiStateName(guiState) == 'setup'" class="dynamic_panel"></DynamicDetailsPanel>
            <DynamicDetailsPanelPath v-if="inPathMode" :expand="true" class="dynamic_panel"></DynamicDetailsPanelPath>
            <DynamicRoomNodePanel v-if="getGuiStateName(guiState) == 'setup'" class="dynamic_panel"></DynamicRoomNodePanel>
            <DynamicRoomRegistrationPanel v-if="getGuiStateName(guiState) == 'room_registration'"  :expand="true" class="dynamic_panel"></DynamicRoomRegistrationPanel>

            <DynamicBodyPanel v-if="getGuiStateName(guiState) == 'configure'" class="dynamic_panel"></DynamicBodyPanel>-->
            
            <DynamicScenePanel      :roomManager="props.app.roomManager" :ui3d="props.app.UI3D" class="dynamic_panel"></DynamicScenePanel>
            <DynamicDetailsPanel    v-if="props.app.UI3D.selectedRoomNode" :roomManager="props.app.roomManager" :selectedRoomNode="props.app.UI3D.selectedRoomNode" class="dynamic_panel"></DynamicDetailsPanel>
            <DynamicRoomNodePanel   v-if="getGuiStateName(guiState) == 'SETUP'" :ui3d="props.app.UI3D" :roomManager="props.app.roomManager" class="dynamic_panel"></DynamicRoomNodePanel>

            <DynamicInteractionsActionPanel  v-if="getGuiStateName(guiState) == 'CONFIG'" :ui3d="props.app.UI3D" :interactionManager="props.app.interactionManager" class="dynamic_panel"></DynamicInteractionsActionPanel>
            <DynamicInteractionsReactionPanel  v-if="getGuiStateName(guiState) == 'CONFIG'" :ui3d="props.app.UI3D" :interactionManager="props.app.interactionManager" class="dynamic_panel"></DynamicInteractionsReactionPanel>

        </div>
    </section>
</template>
<script lang="ts" setup>
import { GUIState } from '#imports';
import App from '~/app/App';

let {guiState} = useGUIState();

const props = defineProps({
    app:{
        type:App,
        required:true
    }
});

function getGuiStateName(guiState:GUIState):string{
    return    GUIStateName[guiState];
}


// watch(app.isInitialized,()=>{

//     if(app.isInitialized.value == true){
//         watch(interactionManager.getSetupMode(),()=>{
//             if(interactionManager.getSetupMode().value == SetupMode.SM_PATH){
//                 inPathMode.value = true;
//             }
//             else
//                 inPathMode.value = false;
//         });
//     }
// })



</script>
<style lang="scss" scoped>
@use "@/assets/style/vars.scss";
.left_panel_wrapper{
    width:100%;
    
    .left_panel_content{
        display:flex;
        flex-direction: column;
        justify-content:center;
        align-items:flex-start;
       
        width:100%;
        padding-bottom:50px;

        .dynamic_panel{
            margin:vars.$margin;
        }
    }
}
</style>
