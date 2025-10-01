
<!--
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright (c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright (c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2025

	contributors:
	Fabian Töpfer - baniaf@uber.space
-->

<template>
    <div id="interactionpanel">
        <DynamicInteractionsActionPanel :actions="actions" class="panel" @setAction="setAction"></DynamicInteractionsActionPanel>
        
        <h6><i class="pi pi-arrow-right" style="font-size: 4rem; margin-top:20px;"></i></h6>

        <DynamicInteractionsReactionPanel :reactions="reactions" class="panel" @setReaction="setReaction"></DynamicInteractionsReactionPanel>
    </div>
</template>
<script setup lang="ts">
import type ActionSpaceRoomNode from '~/app/RoomNodes/ActionSpace/ActionSpaceRoomNode';
import * as THREE from "three"
import { ActionRegistry, ActionType, ActionTypeName } from '~/app/Interactions/ActionRegistry';
import { ReactionRegistry, ReactionType, ReactionTypeName } from '~/app/Interactions/ReactionRegistry';
import type InteractionManager from '~/app/InteractionManager';
import type { IInteraction } from '~/app/InteractionManager';

const props = defineProps(["actionspace","camera","interactionManager"])

const actions = reactive([] as {name:string,type:ActionType}[]);
const reactions = reactive([] as {name:string,type:ReactionType}[]);

const currentActionType = ref(ActionType.AT_UNKNOWN);
const currentReactionType = ref(ReactionType.RT_UNKNOWN);


const currentInteraction = ref<IInteraction|undefined>(undefined)

 
onBeforeMount(()=>{
    ActionRegistry.forEach((value: any, key: any) => {    
       actions.push({name: ActionTypeName[key],type:key});
    });
     ReactionRegistry.forEach((value: any, key: any) => {    
       reactions.push({name: ReactionTypeName[key],type:key});
    });
})

onMounted(()=>{
    const label = document.getElementById("interactionpanel");
    let unwatchPos = undefined as any;

    if(label && props.actionspace){
        updateLabelPosition( props.actionspace,label);

        unwatchPos = watch(props.actionspace.getObject3D().position,()=>{
                updateLabelPosition( props.actionspace,label);
        });

        watch(()=>(props.actionspace as ActionSpaceRoomNode).getUID(),()=>{
            setCurrentInteraction();
            updateLabelPosition( props.actionspace,label);
            if(unwatchPos)
                unwatchPos();

            unwatchPos = watch(props.actionspace.getObject3D().position,()=>{
                updateLabelPosition( props.actionspace,label);
            });
        })
    }else{
        updateToPosition(label!, window.innerWidth/2 - 100, window.innerHeight/2 - 150);
    }
    setCurrentInteraction();

})

function setCurrentInteraction(){
    currentInteraction.value = (props.interactionManager as InteractionManager).createInteraction((props.actionspace as ActionSpaceRoomNode));
    if(currentInteraction.value.action){
        currentActionType.value = currentInteraction.value.action.getType();
    }else{
        currentActionType.value = ActionType.AT_UNKNOWN;
    }

    if(currentInteraction.value.reaction){
        currentReactionType.value = currentInteraction.value.reaction.getType();
    }else{
        currentReactionType.value = ReactionType.RT_UNKNOWN;
    }
}

function updateLabelPosition(actionspace:ActionSpaceRoomNode, labelElement:HTMLElement) {
    const vector = new THREE.Vector3();
    actionspace.getObject3D().getWorldPosition(vector);
    
    vector.project(props.camera.value);

    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;

    labelElement.style.left = (vector.x * widthHalf + widthHalf) - 100 + 'px';
    labelElement.style.top = -(vector.y * heightHalf - heightHalf) - 150 + 'px';
}

function updateToPosition(labelElement:HTMLElement, left:number, top:number){
     
    labelElement.style.left = left + 'px';
    labelElement.style.top = top + 'px';
}
 

function setAction(action:{type:ActionType,name:string}){
    currentActionType.value = action.type;
    (props.interactionManager as InteractionManager).createActionByType(action.type,(props.actionspace as ActionSpaceRoomNode))
}

function setReaction(reaction:{type:ReactionType,name:string}){
    currentReactionType.value = reaction.type;
    (props.interactionManager as InteractionManager).createReactionByType(reaction.type,(props.actionspace as ActionSpaceRoomNode))
}

</script>
<style scoped lang="scss">
@use "@/assets/style/vars.scss";
#interactionpanel{
    position:absolute;
    z-index: 10;
    transition:none;
    display: flex;
    flex-direction: row ;
    justify-content: center;
    align-items: flex-start;
    width:400px;

    .panel{
        margin:20px;
    }
    
    .title_wrapper{
        display:flex;
        width: 100%;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .title{
            width:100%;
            text-align: left;
            padding-bottom:10px;
        }

        .row{
            h6{
                padding:5px;
            }
        }
    }
}

.row{
    display:flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items:center;
}
 
.interactionpanel_content{
    width:100%;
    display:flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items:center;     
    
    .row{
        width: 100%;
        justify-content: space-between;
    
    }

        h6{
            padding: vars.$padding;
        }
    }


</style>
