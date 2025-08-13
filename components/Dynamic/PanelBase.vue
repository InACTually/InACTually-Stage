
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
<div class="dynamic_panel_wrapper" >
    <div class="dynamic_panel_title" @click="expand = !expand">
        <slot name="title"></slot> 
        <span class="indicator" :class="{filled:expand}"></span>
    </div>  
        <div class="dynamic_panel_content" :class="{expanded:expand}">
            <slot name="content">

            </slot>
        </div>
</div>    
</template>
<script setup lang="ts">

let expand = defineModel();


</script>
<style scoped lang="scss">
@use "@/assets/style/vars.scss";
.dynamic_panel_wrapper{
    width:100%;
    max-width: 350px;
    background-color:vars.$semiTransparentColor; 
    border:solid vars.$borderWidth vars.$borderColor;
    border-radius: 10px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
   
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;
    transition:all 0.3s ease-out;
    padding:vars.$padding;
 

    .dynamic_panel_title{
        display:flex;
        flex-direction:row;
        justify-content:space-between;
        width:100%;
        align-items:center;
        min-height:30px;
        padding:vars.$padding;
        .indicator{
            height:10px;
            width:10px;
            border:solid vars.$borderWidth vars.$borderColor;
            border-radius:50%;

            &.filled{
                background-color: vars.$borderColor;
            }
        }
    }

    .dynamic_panel_content{
        width:90%;
        max-height:0px;
        overflow:hidden;
        &.expanded{
            max-height:700px;
            overflow-y:scroll;

        }
    }
}

</style>
