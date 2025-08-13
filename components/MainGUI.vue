
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
    <article class="gui_wrapper">
        <section class="gui_content">
            <StaticHeader :app="app" class="gui_top_panel"></StaticHeader>
            <LayoutLeftPanel :app="app" class="gui_left_panel"></LayoutLeftPanel>
            <LayoutRightPanel :app="app" class="gui_right_panel"></LayoutRightPanel>
            <StaticActionBar></StaticActionBar>  

            <DynamicInteractionsInteractionPanel 
                v-if="showInteractionPanel()" 
                :interactionManager="app.interactionManager"
                :actionspace="props.app.UI3D.selectedRoomNode" 
                :camera=" props.app.roomManager.stage.getCamera()">
            </DynamicInteractionsInteractionPanel>
        </section>
    </article>
</template>
<script lang="ts" setup>
import App from '~/app/App';
import { RoomNodeType } from '~/app/RoomNodes/RoomNodeRegistry';

const props = defineProps({
    app:{
        type:App,
        required:true
    }
});

let {guiState} = useGUIState();


function showInteractionPanel():boolean{
   
    if(props.app.UI3D.selectedRoomNode && guiState.value == GUIState.GS_CONFIG){
        if(props.app.UI3D.selectedRoomNode!.getRoomNodeType() == RoomNodeType.RNT_ACTIONSPACE)
            return true;
    } 
    return false;
}


</script>
<style lang="scss" scoped>
@use "@/assets/style/vars.scss";

    .gui_wrapper{
        width:100%;
        height:100%;
        display:flex;
        justify-content: center;
        align-items:center;
        background-color: vars.$backgroundColor;
        .gui_content{
            height: 100%;
            max-width:3000px;
            width:100%;
            background-color:vars.$backgroundColor;
            display: grid;  
            overflow: hidden;
            grid-template-columns: 20% 60% 20%;
            grid-template-rows:50px 90% 10%;
            .gui_top_panel{
                grid-column: 1/4;
                grid-row:1/2;
                z-index:2;
            }
        
            .gui_central_panel{
                grid-column: 1/4;
                grid-row:1/3;
                z-index:1;
            }
            .gui_left_panel{
                grid-column:1/2;
                grid-row:2/4;
                z-index:2;
            }
            .gui_right_panel{
                grid-column:3/4;
                grid-row:2/4;
                z-index:2;
             
            }
            
        }
    }
</style>
