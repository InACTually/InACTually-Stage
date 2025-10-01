
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
-->


 

<template>
  <div class="dynamic_panel">
    <!-- collapsible content -->
    <div class="dynamic_panel_wrapper dynamic_panel_content" v-if="expand">
      <div
        class="reaction row"
        v-for="reaction in reactions"
        :key="reaction.name"
        @click="setReaction(reaction)"
      >
        <h6>
          {{ reaction.name }}
        </h6>
        <i :class="reactionTypeIcons[reaction.type]" style="margin-right: 6px; font-size: 1rem"></i>

      </div>
    </div>

    <!-- panel title / toggle -->
    <div class="dynamic_panel_wrapper dynamic_panel_content">
      <div class="reaction" @click="expand = !expand" id="selected_reaction">
        <span class="indicator" :class="{ filled: expand }"></span>
        <i :class="reactionTypeIcons[currentReactionType]" style="margin-right: 6px; font-size: 2rem"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ReactionType } from "~/app/Interactions/ReactionRegistry";

let expand = defineModel<boolean>();
let { setDraggable } = useDragAndDrop();


onMounted(()=>{
  
        let element = document.getElementById("selected_reaction");

        console.log(element)
        if(element)
        setDraggable(
            element,
            "selected_reaction",
            (event:any)=>{
                 console.log("drag reaction" + event);
            },
            (event:any)=>{
                 console.log("drop reaction" + event);
            }
        )
})


const props = defineProps<{
  reactions: { name: string; type: ReactionType }[];
}>();

const emits = defineEmits(["setReaction"]);
const currentReactionType = ref(ReactionType.RT_UNKNOWN);

const reactionTypeIcons: Record<ReactionType, string> = {
  [ReactionType.RT_UNKNOWN]: "pi pi-question",
  [ReactionType.RT_FOLLOWING_LIGHT]: "pi pi-sun",
};

function setReaction(reaction: { type: ReactionType; name: string }) {
  currentReactionType.value = reaction.type;
    expand.value = false;

  emits("setReaction", reaction);
}
</script>


<style scoped lang="scss">
@use "@/assets/style/vars.scss";

.dynamic_panel {
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column-reverse;
  justify-content: start;
  align-items: center;
  transition: all 0.3s ease-out;
  padding: vars.$padding;

  .dynamic_panel_content {
    width:100%;
    transition: max-height 0.3s ease-out;


    .reaction {
      background-color: vars.$semiTransparentColor;
      border: solid vars.$borderWidth vars.$borderColor;
      border-radius: 10px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      margin: vars.$padding;
      padding: vars.$padding;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      &.row {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content:space-between;
        align-items:center;
      }
      &:hover {
        background-color: vars.$backgroundColor;
      }
    }
  }

  .dynamic_panel_title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    min-height: 30px;
    padding: vars.$padding;
    cursor: pointer;
 
  }
}
</style>




 