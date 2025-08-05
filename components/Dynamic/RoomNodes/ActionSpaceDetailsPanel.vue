
<!--
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright (c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright (c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2024

	contributors:
	Fabian Töpfer - baniaf@uber.space
-->

<template>
    <CommonPanelRow class="color_row" @click="toggleShape"> 
        <h6 >Shape</h6>
        <h6>{{ shape }}</h6>
     </CommonPanelRow>
     
</template>
<script lang="ts" setup>
import * as THREE from "three"
import ActionSpaceRoomNode, { AS_Shape } from "~/app/RoomNodes/ActionSpace/ActionSpaceRoomNode";
 

const props = defineProps({
    selectedRoomNode:{
        required:true,
        type:ActionSpaceRoomNode
    },
});

let shape = ref<string>("");

onMounted(()=>{
    shape.value = getShapeName(props.selectedRoomNode.getShape());
})


function toggleShape(){

    const enumValues = Object.keys(AS_Shape).filter(key=>isNaN(Number(key)));
    const currentShape = props.selectedRoomNode.getShape();
    const nextShape = (currentShape + 1) % enumValues.length
    props.selectedRoomNode.setShape(nextShape)

    shape.value = getShapeName(nextShape)
}

function getShapeName(shape:AS_Shape){
    const enumValues = Object.keys(AS_Shape).filter(key=>isNaN(Number(key)));
    return enumValues[shape];
}


 

</script>
<style lang="scss" scoped>
@import "@/assets/style/vars.scss";
.color_row{
    width: 100%;
    display:flex;
    flex-direction: row;
    justify-content:space-between;
    align-items:space-between;

    .input{
        margin:3px;
    }
   
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
