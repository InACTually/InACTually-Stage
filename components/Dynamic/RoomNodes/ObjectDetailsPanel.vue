
<!--
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright (c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright (c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2026

	contributors:
	Fabian Töpfer - baniaf@uber.space
    Lars Engeln - mail@lars-engeln.de
-->

<template>
    <CommonPanelRow class="color_row"> 
        <h6>PATH</h6>
        <CommonInput
            class="input"
            v-model="modelPath"
            type="text"
            @onUserChange="updateModelPath()">
        </CommonInput>
        <h6 class="action" @click="openFilePicker()">BROWSE</h6>
        <input
            ref="fileInput"
            class="hidden_input"
            type="file"
            accept=".glb,.gltf,.obj,.dae, .fbx, .ply, .spz, .sog"
            @change="onFileSelected">
     </CommonPanelRow>
     
</template>
<script lang="ts" setup>
import ObjectRoomNode from "~/app/RoomNodes/Object/ObjectRoomNode";
 

const props = defineProps({
    selectedRoomNode:{
        required:true,
        type:ObjectRoomNode
    },
});

let modelPath = ref<string>("");
let fileInput = ref<HTMLInputElement | null>(null);

onMounted(()=>{
    watch(
        () => props.selectedRoomNode.getModelPath(),
        () => {
            modelPath.value = props.selectedRoomNode.getModelPath();
        },
        { immediate: true }
    );
})

function updateModelPath(){
    props.selectedRoomNode.setModelPath(modelPath.value);
    modelPath.value = props.selectedRoomNode.getModelPath();
}

function openFilePicker() {
    fileInput.value?.click();
}

function onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] as (File & { path?: string }) | undefined;

    if (!file) {
        return;
    }

    modelPath.value = file.path ?? file.name;
    props.selectedRoomNode.setModelFile(file, modelPath.value);
}


 

</script>
<style lang="scss" scoped>
@use "@/assets/style/vars.scss";
.color_row{
    width: 100%;
    display:flex;
    flex-direction: row;
    justify-content:space-between;
    align-items:space-between;

    .input{
        margin:3px;
    }

    .action{
        cursor:pointer;
        margin-left:6px;
    }
   
}
.hidden_input{
    display:none;
}
.loot_at_row{
    width: 100%;
    display:flex;
    flex-direction: row;
    justify-content:space-between;
    align-items:space-between;

    .input{
        margin:3px;
    }
}
.dmx_row{
    width: 100%;
    display:flex;
    flex-direction: row;
    justify-content:space-between;
    align-items:space-between;

    .input{
        margin:3px;
        width:85%;
    }
}
</style>
