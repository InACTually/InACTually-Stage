
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
    <div class="dynamic_panel_content" v-if="expand">
      <div
        class="action row"
        v-for="action in actions"
        :key="action.name"
        @click="setAction(action)"
      >
        <h6>
          {{ action.name }}
        </h6>
        
        <i :class="actionTypeIcons[action.type]" style="margin-right: 6px; font-size: 1rem"></i>

      </div>
    </div>

    <!-- panel title / toggle -->
    <div class="dynamic_panel_content">
      <div class="action" @click="expand = !expand">
         <i :class="actionTypeIcons[currentActionType]" style="margin-right: 6px; font-size: 2rem"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ActionType } from "~/app/Interactions/ActionRegistry";

let expand = defineModel<boolean>();

const props = defineProps<{
  actions: { name: string; type: ActionType }[];
}>();

const emits = defineEmits(["setAction"]);
const currentActionType = ref(ActionType.AT_UNKNOWN);

const actionTypeIcons: Record<ActionType, string> = {
  [ActionType.AT_UNKNOWN]: "pi pi-question",
  [ActionType.AT_MOVEMENT]: "pi pi-forward",
};

function setAction(action: { type: ActionType; name: string }) {
  currentActionType.value = action.type;
  expand.value = false;
  emits("setAction", action);
}
</script>

<style scoped lang="scss">
@use "@/assets/style/vars.scss" as vars;

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


    .action {
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
