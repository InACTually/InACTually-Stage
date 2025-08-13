
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
    <CommonPanelRow class="color_row">
        <h6>Color</h6>
        <ColorPicker class="color_picker" format="rgb" :baseZIndex="10" v-model="color" />
    </CommonPanelRow>
    <CommonPanelRow class="look_at_row">
        <h6>Look At</h6>
        <CommonInput class="input" v-model="lookAt.x" labelText="" type="number" @onUserChange="updateLookAt()">
        </CommonInput>
        <CommonInput class="input" v-model="lookAt.y" labelText="" type="number" @onUserChange="updateLookAt()">
        </CommonInput>
        <CommonInput class="input" v-model="lookAt.z" labelText="" type="number" @onUserChange="updateLookAt()">
        </CommonInput>
    </CommonPanelRow>
    <CommonPanelRow class="dmx_row">
        <h6>DMX</h6>
        <CommonInput class="input" v-model="startAddress" labelText="" type="number"
            @onUserChange="updateStartAddress()"></CommonInput>
    </CommonPanelRow>
</template>
<script lang="ts" setup>
import * as THREE from "three"
import MovingHeadRoomNode from "~/app/RoomNodes/DMX/MovingHeadRoomNode";

const props = defineProps({
    selectedRoomNode: {
        required: true,
        type: MovingHeadRoomNode
    },
});

let color = ref<{ r: number, g: number, b: number }>({ r: 1, g: 1, b: 1 });
let lookAt = ref<THREE.Vector3>(new THREE.Vector3());
let startAddress = ref<number>(0);

const rawSelectedRoomNode = computed(() => {
    return toRaw(props.selectedRoomNode);
})


onMounted(() => {
    watch(rawSelectedRoomNode, () => {
        if (rawSelectedRoomNode.value) {
            watch(rawSelectedRoomNode.value.getLookAt(), () => {
                setLookAt();
            }, { immediate: true })
            watch(rawSelectedRoomNode.value.getColor(), () => {
                setColor();
            }, { immediate: true })
            watch(rawSelectedRoomNode.value.getStartAddress(), () => {
                setStartAddress();
            }, { immediate: true })
        }
    }, { immediate: true })
})

/*************          DMX      Start Address    *********/

function setStartAddress() {
    startAddress.value = rawSelectedRoomNode.value.getStartAddress().value;
}

watch(startAddress, (newValue: number, oldValue: number) => {
    if (isNaN(Number(newValue))) {
        newValue = oldValue;
    }
    startAddress.value = Math.ceil(newValue);
})

function updateStartAddress() {
    rawSelectedRoomNode.value.setStartAddress(startAddress.value);
}

/*************          Color          *********/


function setColor() {

    // creates endless recursion
    //color.value = { r: rawSelectedRoomNode.value.getColor().value.r * 255, g: rawSelectedRoomNode.value.getColor().value.g * 255, b: rawSelectedRoomNode.value.getColor().value.b * 255 };
}

watch(color, () => {
    updateColor();
})

function updateColor() {
    rawSelectedRoomNode.value.setColor({ r: color.value.r / 255, g: color.value.g / 255, b: color.value.b / 255 });
}


/*************          LookAt          *********/

function setLookAt() {
    lookAt.value = rawSelectedRoomNode.value.getLookAt().clone();
}

watch(() => lookAt.value.x, (newValue: any, oldValue: any) => {
    if (isNaN(Number(newValue))) {
        newValue = oldValue;
    }
    lookAt.value.x = Number(newValue.toFixed(2));
})
watch(() => lookAt.value.y, (newValue: any, oldValue: any) => {
    if (isNaN(Number(newValue))) {
        newValue = oldValue;
    }
    lookAt.value.y = Number(newValue.toFixed(2));
})
watch(() => lookAt.value.z, (newValue: any, oldValue: any) => {
    if (isNaN(Number(newValue))) {
        newValue = oldValue;
    }
    lookAt.value.z = Number(newValue.toFixed(2));
})

function updateLookAt() {
    rawSelectedRoomNode.value.setLookAt(lookAt.value);
}

</script>
<style lang="scss" scoped>
@use "@/assets/style/vars.scss";

.color_row {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: space-between;

    .input {
        margin: 3px;
    }

}

.loot_at_row {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: space-between;

    .input {
        margin: 3px;
    }
}

.dmx_row {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: space-between;

    .input {
        margin: 3px;
        width: 85%;
    }
}
</style>
