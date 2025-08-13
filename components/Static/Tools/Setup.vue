
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
    <section class="tools_setup_wrapper">
        <div class="tools_setup_content">
            <h6 @click="setTransformControlsMode()">{{ mode }}</h6>
        </div>
    </section>
</template>
<script lang="ts" setup>
 

//let { interactionManager,reactiveKey } = useApp();
 
let mode = ref<string>("translate")
  
function getNextTransformControlsMode(){
    if(mode.value == "translate")
        return "rotate";
    else if(mode.value == "rotate")
        return "scale";
    
    return "translate";
}
function setTransformControlsMode(){ 
   // interactionManager.setTransformControlsMode(getNextTransformControlsMode())
}

//watch(reactiveKey,()=>{
   // mode.value = interactionManager.getTransformControlsMode()
//})
 


</script>
<style lang="scss" scoped>
@use "@/assets/style/vars.scss";

.tools_setup_wrapper{
    .tools_setup_content{

    }
}
</style>
