
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
    <DynamicPanelBase v-model="expand">
        <template v-slot:title>
            BODY
        </template>
        <template v-slot:content>
            <div class="body_model_wrapper">
                <div class="body_model_content">

                </div>
            </div>
        </template>
    </DynamicPanelBase>   
</template>
<script setup lang="ts">

import { GUIState } from "~/composables/useGUIState";
import { Circle, SVG } from '@svgdotjs/svg.js'

interface JointInfo{
    name:string,
    x:number,
    y:number,
    element:Circle|undefined
}


let bodyManager = useBodyManager();

let {guiState} = useGUIState();
let expand = ref<boolean>(false);

let joints =[
    {name:"foot",  x:149, y:400, element:undefined},
    {name:"handL", x:283, y:180, element:undefined},
    {name:"handR", x:16,  y:180, element:undefined},
    {name:"spine", x:149, y:180, element:undefined},

] as JointInfo[]


onMounted(()=>{
    let draw = SVG().addTo(".body_model_content").size(300,500);
    importBG(draw);

    let size = 30;

    joints.forEach((j:JointInfo)=>{
        let circle = draw.circle(size).center(j.x,j.y)
        .attr({
            fill:"#ffffff",
            "fill-opacity":1.0,
            stroke:"#2a2a2a",
            "stroke-width":2
        });

        circle.css("cursor","pointer");
 
        circle.click(()=>{
            joints.forEach((j:JointInfo)=>{
                j.element!.attr({
                    fill:"#ffffff",
                    "fill-opacity":1.0,
                });
                circle.attr({
                    fill:"#2a2a2a",
                    "fill-opacity":1,
                });
            })

            bodyManager.setBodyFilter(j.name);
        })


        j.element = circle;
    })
})


function importBG(draw:any){
    draw.svg('<g transform="matrix(1,0,0,1,-0.789574,-61.7422)"><g transform="matrix(1.09271,0,0,1.09271,-9.64459,-19.095)"><path d="M145.873,294.193C145.873,294.193 139.58,306.145 138.795,308.187C138.009,310.228 136.381,338.583 137.265,341.431C138.148,344.278 140.25,365.264 140.672,369.057C141.094,372.85 138.49,380.638 137,386.013C135.511,391.387 133.366,430.666 136.047,433.197C138.727,435.728 138.72,440.295 138.739,447.416C138.759,454.536 133.51,454.423 133.51,454.423C133.51,454.423 129.239,454.455 122.824,454.546C116.409,454.637 114.042,451.62 111.537,449.609C109.031,447.599 120.886,431.379 120.886,431.379C120.886,431.379 111.604,385.316 112.181,376.901C112.758,368.487 112.75,337.932 114.354,332.309C115.958,326.686 108.095,296.498 108.095,296.498L106.393,259.374L109.492,243.51C109.492,243.51 111.916,228.936 111.487,215.146C111.059,201.356 110.647,181.673 110.647,181.673L70.236,212.268L33.472,238.619C33.472,238.619 19.023,253.978 11.814,245.879C5.841,239.166 15.932,230.884 23.745,228.947C33.554,226.514 93.429,158.835 93.429,158.835L128.827,139.979C128.827,139.979 133.711,138.35 132.94,135.629C132.169,132.909 122.794,122.521 122.981,114.65C123.169,106.779 122.981,92.65 122.981,92.65C122.981,92.65 129.582,74.436 135.745,74.436L149.846,74.436L141.979,74.436L156.079,74.436C162.243,74.436 168.843,92.65 168.843,92.65C168.843,92.65 168.656,106.779 168.843,114.65C169.031,122.521 159.656,132.909 158.885,135.629C158.114,138.35 166.121,141.225 166.121,141.225L198.768,159.475C198.768,159.475 258.643,227.154 268.451,229.587C276.264,231.524 286.356,239.806 280.382,246.519C273.174,254.618 258.725,239.259 258.725,239.259L221.96,212.908L181.55,182.313C181.55,182.313 181.138,201.996 180.709,215.786C180.281,229.576 182.704,244.15 182.704,244.15L185.803,260.014L184.101,297.138C184.101,297.138 176.239,327.326 177.843,332.949C179.447,338.572 179.439,369.127 180.016,377.541C180.593,385.956 171.311,432.019 171.311,432.019C171.311,432.019 183.165,448.239 180.66,450.249C178.154,452.26 175.788,455.277 169.373,455.186C162.958,455.095 158.687,455.063 158.687,455.063C158.687,455.063 153.438,455.176 153.458,448.055C153.477,440.935 153.469,436.368 156.15,433.837C158.831,431.306 156.686,392.027 155.196,386.652C153.707,381.278 151.102,373.49 151.525,369.697C151.947,365.903 154.048,344.918 154.932,342.071C155.815,339.223 154.187,310.868 153.402,308.826C152.617,306.785 146.324,294.833 146.324,294.833" style="fill:none;stroke:black;stroke-width:0.92px;"/></g></g>')

}

watch(guiState,()=>{
    if(guiState.value == GUIState.GS_CONFIG){
        expand.value = true;
    }
    else expand.value = false;
})

</script>
<style  lang="scss">
@use "@/assets/style/vars.scss";
.body_model_wrapper{
    width:100%;
    height:600px;
    display:flex;
    justify-content: center;
    align-items: center;

    .body_model_content{
        width:100%;
        display:flex;
        justify-content: center;
        align-items: center;
        
    }
}
</style>
