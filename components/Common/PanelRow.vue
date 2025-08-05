
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
    <div class="panel_row_wrapper">
        <slot></slot>
    </div>
</template>
<script setup lang="ts">

</script>
<style lang="scss" scoped>
@import "@/assets/style/vars.scss";

.panel_row_wrapper{
    width:100%;
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    align-items:center;
    padding:$padding;
    border-bottom:solid $borderWidth rgba(0,0,0,0);
    background-color: none;
    &:hover{
        //border-bottom:solid $borderWidth $borderColorHighlight;

    }   

    :slotted(p,h6){
        width:80%;
    }
}
</style>
