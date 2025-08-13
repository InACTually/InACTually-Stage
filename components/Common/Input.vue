
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
    <div>
        <label>{{ props.labelText }}</label>
        <input :type="props.type"  v-model="model" :onchange="onChange" :oninput="onInput">
    </div>
</template>
<script lang="ts" setup>
let props = defineProps(["labelText","type"])
let model = defineModel();
let emits = defineEmits(["onUserInput", "onUserChange"])

function onChange(){
    emits("onUserChange");
}

function onInput(){
    emits("onUserInput");
}
 
</script>
<style lang="scss" scoped>
@use "@/assets/style/vars.scss";



input{
 
    border:none;
    border-bottom:solid vars.$borderWidth vars.$borderColor;
    transition:all 0.3s ease-out;
    width:100%;
    font-size:8pt;
    font-weight:700;
    color:vars.$primaryColor;
    text-transform: uppercase;
    text-align:center;  
    cursor: pointer;
 
    &:focus{
        border-bottom:solid vars.$borderWidth vars.$borderColorHighlight;
    }
}
</style>
