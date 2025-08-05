
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
    <DynamicPanelBase class="networksim_panel" v-model="expand">
        <template v-slot:title>
                <h6>Network Sim</h6>
            </template>
            <template v-slot:content>
                <div class="networksim_content">
                    <div @click="createRoomNode()"><h6>CREATE ROOMNODE</h6></div>
                    <div @click="updateRoomNode()"><h6>UPDATE ROOMNODE</h6></div>
                    <div @click="deleteRoomNode()"><h6>DELETE ROOMNODE</h6></div>

                </div>
            </template>
    </DynamicPanelBase>
    
    
    </template>
    <script setup lang="ts">
    import Middleware from '~/app/Network/Middleware';
    let expand = ref<boolean>(true);
    
     
    const props = defineProps({
        middleware:{
            type:Middleware,
            required:true
        }
    });
     
    function createRoomNode(){
        let msg = {
            type:"roomNode",
            method:"create",
            uid:"123abc-test",
            timestamp:123213213,
            data:{
                name:"movingHead",
                uid:"123abc-myMovingHead",
                position:{x:2,y:2,z:2},
                params:{
                    name:"test",
                    fixtureIndex:1,
                    startAddress:123
                },
                orientation:{w:1,x:0.6,y:0,z:0}
            }
        }
        
        props.middleware.onMsg(
            {data:JSON.stringify(msg)}
        );
    }

    function updateRoomNode(){
        let msg = {
            type:"roomNode",
            method:"update",
            uid:"123abc-test",
            timestamp:123213213,
            data:{
                name:"movingHead",
                uid:"123abc-myMovingHead",
                position:{x:4,y:0,z:0},
                params:{
                    name:"test2",
                    fixtureIndex:2,
                    startAddress:1
                },
                orientation:{w:0,x:0,y:0,z:0}
            }
        }
        
        props.middleware.onMsg(
            {data:JSON.stringify(msg)}
        );
    }

    function deleteRoomNode(){
        let msg = {
            type:"roomNode",
            method:"delete",
            uid:"123abc-test",
            timestamp:123213213,
            data:{
                name:"movingHead",
                uid:"123abc-myMovingHead",
            }
        }
        
        props.middleware.onMsg(
            {data:JSON.stringify(msg)}
        );
    }
      
  
    
     
    </script>
    <style scoped lang="scss">
    @import "@/assets/style/vars.scss";
    .networksim_panel{
     
        width:350px;
        
     
    }
    </style>
