
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
    <div class="spatial_navigation_widget" >
    </div>
    <div class="row">
        <h6 @click="switchProjection()">{{getProjectionName()}}</h6>
    </div>
</template>
    <script setup lang="ts">
    import { ProjectionPos } from "~/app/View3D/ProjectionManager";
    import { Circle, Svg, SVG } from '@svgdotjs/svg.js'
    import App from "~/app/App";
 
    const props = defineProps({
        app:{
            type:App,
            required:true
        }
    });

    let projPos = ref<ProjectionPos>(ProjectionPos.NONE);
    let widget = {} as Svg;
    let pos = [] as any[];
    let posNames = ["front","right","isoRight","top","isoLeft","left"];
    let center = 50;
    let r = 25;
    let size = 9;
    let highlightSize = 14

    onMounted(()=>{
        draw();
        props.app.UI3D.orbitControls.addEventListener("change",()=>{
            if(projPos.value != ProjectionPos.NONE){
                projPos.value = ProjectionPos.NONE;
                for(let i = 0; i < 6; i++){
                    if(!isSelected(posNames[i]))
                        pos[i].size(size,size)
                }
            }
        });

        props.app.roomManager.stage.projectionManager.addListener("projectionPosChanged",(pp:ProjectionPos)=>{
            projPos.value = pp;
            for(let i = 0; i < 6; i++){
                if(!isSelected(posNames[i]))
                    pos[i].size(size,size)
            }
        
        })
    })

    function draw(){
        widget = SVG().addTo(".spatial_navigation_widget").size("100%","100%");

        for(let i = 0; i < 6; i++){
            let wrapper = widget.circle("30");
            let indicator = widget.circle(3)
            wrapper.opacity(0.0)
            pos[i]= widget.circle(size);
            pos[i].fill("#1a1a1a")
            pos[i].cx(Math.sin(i * 0.33 * Math.PI) * r + center);
            pos[i].cy(Math.cos(i * 0.33 *Math.PI) * r + center);

            
            indicator.fill("#1a1a1a");
            indicator.cx(Math.sin(i * 0.33 * Math.PI) * (r - 5) + center);
            indicator.cy(Math.cos(i * 0.33 * Math.PI) * (r - 5)  + center);

            wrapper.cx(Math.sin(i * 0.33 * Math.PI) * r + center);
            wrapper.cy(Math.cos(i * 0.33 *Math.PI) * r + center);

            wrapper.click(()=>{
                clicked(posNames[i])
                for(let n = 0; n < 6; n++){
                    pos[n].size(size,size);
                }
                pos[i].size(highlightSize,highlightSize);
            })

            pos[i].click(()=>{
                clicked(posNames[i])
                for(let n = 0; n < 6; n++){
                    pos[n].size(size,size);
                }
                pos[i].size(highlightSize,highlightSize);
            })

            pos[i].on("mouseover",()=>{
                pos[i].size(highlightSize,highlightSize)
            })

            pos[i].on("mouseout",()=>{
                if(!isSelected(posNames[i]))
                    pos[i].size(size,size)
            })   
        }
    }

   
    function isSelected(name:string):boolean{
       
        switch(name){
        case "top":
            return projPos.value == ProjectionPos.TOP;
        case "left":
            return projPos.value == ProjectionPos.LEFT;            
        case "right":
            return projPos.value == ProjectionPos.RIGHT;            
        case "front":
            return projPos.value == ProjectionPos.FRONT;            
        case "isoLeft":
            return projPos.value == ProjectionPos.ISO_LEFT;            
        case "isoRight":
            return projPos.value == ProjectionPos.ISO_RIGHT;            
        }
 
        return false; 
    }

    function clicked(name:string){
        
        if(!props.app.roomManager.stage.projectionManager.getIsOrthographicProjection()){
            props.app.setOrthoProjection(true);
        };

        switch(name){
            case "top":
                projPos.value = ProjectionPos.TOP;
                break;
            case "left":
                projPos.value = ProjectionPos.LEFT;
                break;
            case "right":
                projPos.value = ProjectionPos.RIGHT;
                break;
            case "front":
                projPos.value = ProjectionPos.FRONT;
                break;
            case "isoLeft":
                projPos.value = ProjectionPos.ISO_LEFT;
                break;
            case "isoRight":
                projPos.value = ProjectionPos.ISO_RIGHT;
                break;
            }

        if(projPos.value)
            props.app.roomManager.stage.projectionManager.setProjectionPos(projPos.value);
        //cameraManager.setCameraToProjectionPos(projPos.value!,cameraManager.getCurrentCam());
    }

    function switchProjection(){
        props.app.switchProjection();
    }

    function getProjectionName(){
        if(props.app.roomManager.stage.projectionManager.getIsOrthographicProjection())
            return "orthographic"
        
        return "perspective"
    }



    // watch(cameraManager.isFlying,()=>{
    //     if(cameraManager.isFlying.value){
    //         pos.forEach(p=>{
    //             p.size(size,size);
    //         })
    //     } 
    // })
 
</script>
<style lang="scss" scoped>
.spatial_navigation_widget{
    
    z-index:5;
    height:100px;
    width:100px;
    display:flex;
    align-items:flex-end;
    justify-content: flex-end;
  
}
.tile{
    transition:all 0.2s ease-out;
    &:hover{
        fill: #0f0f0f !important; 
    }
}

.row{
    width:100px;
    display:flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;


}
 
</style>
