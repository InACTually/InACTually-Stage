
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
<DynamicPanelBase class="networkLog_panel" v-model="expand">
    <template v-slot:title>
            <h6>Network Log</h6>
        </template>
        <template v-slot:content>
        <div class="log_content">
            <div class="log in">
                <h6>in</h6>
                <p v-for="(i,n) in middleware.log.in" :key="i.title + n" @click="selected = i">{{ i.title }}</p>
            </div>
            <div class="log out">
                <h6>out</h6>
                <p v-for="(o,n) in middleware.log.out" :key="o.title + n"  @click="selected = o">{{ o.title }}</p>
            </div>
            <div>
                <p>{{selected.payload }}</p>
            </div>



        </div>

        </template>
</DynamicPanelBase>


</template>
<script setup lang="ts">
import Middleware from '~/app/Network/Middleware';
let expand = ref<boolean>(false);

 
const props = defineProps({
    middleware:{
        type:Middleware,
        required:true
    }
});
 
let selected = ref<any>({})
 
onMounted(()=>{console.log("[NetworkLog] network log created")})

/*function saveBodyData(){
    const data = JSON.stringify(bodyManager.log)
    const blob = new Blob([data], {type: 'text/plain'})
    const e = document.createEvent('MouseEvents'),
    a = document.createElement('a');
    a.download = "test.json";
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
}*/


 
</script>
<style scoped lang="scss">
@use "@/assets/style/vars.scss";
.networkLog_panel{
 
    width:350px;
 
 
    .log_content{
        width:100%;
        display:flex;
        flex-direction:row;
        flex-wrap: wrap;
        height:100%;
        div{
            padding-top:10px;
            padding-bottom:10px;
        }

        .log{
            width:50%;
            height:200px;
            overflow-y: auto;
            h6{
                margin:vars.$margin;

            }
            p{
            padding-top:5px;
            border-bottom:1px solid $blackColor;
        }
        }
        p{
            font-size: 12px;
        }
    }
}
</style>
