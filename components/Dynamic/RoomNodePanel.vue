
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
            <h6>ROOM NODES</h6>
        </template>
        <template v-slot:content>
            <CommonPanelRow v-for="c in roomNodes" :key="c.name" @click="addRoomNode(c.type,new THREE.Vector3())" :id="c.name">
                <h6>{{ c.name }}</h6>
            </CommonPanelRow>
        </template>
    </DynamicPanelBase>
</template>
<script setup lang="ts">
import * as THREE from "three"
import RoomManager from "~/app/RoomManager";
import RoomNodeRegistry, { RoomNodeType, fromRoomNodeType } from "~/app/RoomNodes/RoomNodeRegistry";
import UI3D from "~/app/View3D/UI3D";
import { GUIState } from "~/composables/useGUIState";
 

let { guiState } = useGUIState();
let { setDraggable } = useDragAndDrop();

let expand = ref<boolean>(false);

let roomNodes = reactive([] as {name:string,type:RoomNodeType}[]);

const props = defineProps({
    roomManager:{
        type:RoomManager,
        required:true
    },
    ui3d:{
        type:UI3D,
        required:true
    },
});
onBeforeMount(()=>{
    RoomNodeRegistry.forEach((value: any, key: any) => {    
       roomNodes.push({name: fromRoomNodeType(key),type:key});
   });
})
onMounted(() => {
 
    roomNodes.forEach((r)=>{
        let element = document.getElementById(r.name);
        if(element)
        setDraggable(
            element,
            r.name,
            (event:any)=>{
                let roomMgrType = RoomNodeRegistry.get(r.type);
                if(roomMgrType){
                    let roomManager = props.roomManager.getRoomNodeMgrByRoomNodeType(r.type);
                    if(roomManager)
                    {
                        roomManager.getTemplate3DObject().then((obj:THREE.Object3D)=>{
                            obj.scale.set(0.4,0.4,0.4);
                            props.ui3d.addDragTemplateObject(obj)
                        })
                    }
                }
            },
            (event:any)=>{
                let pos = props.ui3d.removeDragTemplateObject();
                addRoomNode(r.type,pos);
            }
        )
    })
})

function addRoomNode(roomNodeType:RoomNodeType, position:THREE.Vector3){
    let roomNode = props.roomManager.createRoomNodeByType(roomNodeType,undefined,position);
    }

watch(guiState, () => {
    if (guiState.value == GUIState.GS_SETUP) {
        expand.value = true;
    }
    else expand.value = false;
})

</script>
<style scoped lang="scss">
@import "@/assets/style/vars.scss";
</style>
