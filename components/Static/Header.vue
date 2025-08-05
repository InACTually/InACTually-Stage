
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
    <header class="header_wrapper">
        <nav class="header_content">
            <div class="actions">
                <h6>INACTUALLY</h6>
                <h6 v-if="isConnected">CONNECTED</h6>
                <h6 v-else @click="connect()">DISCONNECTED</h6>
                <small>ask Fabian Töpfer & Lars Engeln</small>
            </div>
            <div class="actions">
                <div id="xrbuttoncontainer"> </div>
                <!-- <h6 @click="switchProjection()">PROJECTION</h6> -->
                <h6 @click="switchGrid()">GRID</h6>
                <h6 @click="switchModel()">MODEL</h6>
                <h6 @click="switchTheme()">THEME</h6>
                <!-- <h6 @click="showMenu = !showMenu"><i class="pi pi-bars"></i></h6> -->
            </div>
        </nav>
        
        <StaticMenu v-show="showMenu" @close="showMenu = false"></StaticMenu>
    </header>
</template>

<script setup lang="ts">
import App from '~/app/App';


let showMenu = ref<boolean>(false);
let {switchTheme,lightTheme} = useTheme();
const props = defineProps({
    app:{
        type:App,
        required:true
    }
});

const isConnected = computed(()=>{
    return !props.app.middleware.isOffline;
})

function connect(){
    props.app.connect();
}



function switchModel(){
   props.app.roomManager.stage.switchRoomModel();
}

function switchGrid(){
    props.app.roomManager.stage.switchGrid();
}


watch(lightTheme,()=>{
    if(lightTheme.value){
        props.app.roomManager.stage.setLightTheme();  
    }else{
        props.app.roomManager.stage.setDarkTheme();
    }
})

</script>

<style lang="scss" scoped>
@import "@/assets/style/vars.scss";
 
.header_wrapper {
 
     width:100%;
    
    .header_content{
       display:flex;
       padding:$padding;
       flex-direction: row;
       justify-content: space-between;
       align-items:center;
        h6{
            padding:$padding;
            margin-right: $padding;
        }

        .actions{
            display:flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
        }
         
    }   
}
</style>
