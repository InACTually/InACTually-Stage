
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
    <section class="right_panel_wrapper">
        <div class="right_panel_content">
            <NavigationWidget :app="app"></NavigationWidget>
            <!-- <DebugNetworkLog class="dynamic_panel" :middleware="props.app.middleware"></DebugNetworkLog>
            <DebugNetworkSim class="dynamic_panel" :middleware="props.app.middleware"></DebugNetworkSim> -->
        </div>
    </section>
</template>
<script lang="ts" setup>
import App from '~/app/App';


const props = defineProps({
    app:{
        type:App,
        required:true
    }
});
  
</script>
<style lang="scss" scoped>
@use "@/assets/style/vars.scss";
.right_panel_wrapper{
    width:100%;
    
    .right_panel_content{
        display:flex;
        flex-direction: column;
        justify-content:center;
        align-items:flex-end;
       
        width:100%;
        padding-bottom:50px;

        .dynamic_panel{
            margin:vars.$margin;
        }
    }
}
</style>
