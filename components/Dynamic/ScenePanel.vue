
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
            <h6>SCENE</h6>
        </template>
        <template v-slot:content>
            <div v-for="roomNodeArray in allRoomNodes" >
                <CommonPanelRow v-for="obj in roomNodeArray"  @click="toRaw(props.ui3d).setSelectedRoomNode(obj as RoomNodeBase)" :key="obj.getUID()">
                    <h6 class="catgeory">{{ toRaw(obj).getName() }}</h6> 
                    <h6 class="type">{{fromRoomNodeType(obj.getRoomNodeType())  }} </h6>
                </CommonPanelRow>
            </div>
        </template>
    </DynamicPanelBase>   
</template>
<script setup lang="ts">
import RoomManager from "~/app/RoomManager";
import type RoomNodeBase from "~/app/RoomNodes/RoomNodeBase";
import { fromRoomNodeType, type RoomNodeType } from "~/app/RoomNodes/RoomNodeRegistry";
import UI3D from "~/app/View3D/UI3D";
import { GUIState } from "~/composables/useGUIState";
 
 

let expand = ref<boolean>(false);
let {guiState} = useGUIState();


let allRoomNodes = ref<RoomNodeBase[][]>([])

const props = defineProps({
    ui3d:{
        type:UI3D,
        required:true
    },

    roomManager:{
        type:RoomManager,
        required:true
    }
});

onMounted(()=>{

    allRoomNodes.value =  props.roomManager.getAllRoomNodes();
    expand.value = true;
})

  
</script>
<style scoped lang="scss">
@use "@/assets/style/vars.scss";
.catgeory{
    font-size:8pt;
}
.type{
    font-size:6pt;
}

.row{
    display:flex;
    flex-direction: row;

    h6{
        padding:vars.$padding;
        color:grey;

        &.selected{
            color:vars.$primaryColor;
        }
    }
}
</style>
