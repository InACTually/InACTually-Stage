
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
<section class="menu_wrapper" >
    <div class="menu_content" id="menu">
        <h4>MENU</h4>

        <div class="buttons">
            <h6 @click="setRoomRegistrationMode()">ROOM REGISTRATION</h6>
        </div>
        <h6 @click="$emit('close')">CLOSE</h6>
    </div>
</section>
</template>
<script setup lang="ts">

let {guiState} = useGUIState();
let emit = defineEmits(["close"]);


function setRoomRegistrationMode(){
    //guiState.value = GUIState.ROOM_REGISTRATION;
    emit("close");
}
 
</script>
<style lang="scss" scoped>
@use "@/assets/style/vars.scss";
  
.menu_wrapper{
    position:absolute;
    width:30%;
    top:20%;
    left:50%;
    transform: translateX(-50%);
    min-height:300px;
    background-color:vars.$semiTransparentColor; 
    backdrop-filter: blur(10px);
    z-index:9;
    border:solid vars.$borderWidth vars.$borderColor;
    border-radius:5px;

    .menu_content{
        width:100%;
        height:100%;
        margin:vars.$padding;
        display:flex;
        flex-direction: column;
        justify-content:space-between;

        .buttons{
            padding:20px;

            h6{
                margin-top:10px;
                border-bottom:solid vars.$borderWidth vars.$borderColor;
            }
        }
    }
}
</style>
