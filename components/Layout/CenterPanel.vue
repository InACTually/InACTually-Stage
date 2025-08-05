
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
</template>
<script lang="ts" setup>
import App from '~/app/App';
import { RoomNodeType } from '~/app/RoomNodes/RoomNodeRegistry';

//let {lightTheme} = useTheme();
///let {roomManager,renderer} = useApp();
   
onMounted(()=>{
 

   // renderer.start(document.getElementById("scene"));
})


/*watch(lightTheme,()=>{
    if(lightTheme.value){
        roomManager.setLightTheme();
    }
    else{
        roomManager.setDarkTheme();
    }
})*/

</script>
<style lang="scss" scoped>
@import "@/assets/style/vars.scss";

</style>
