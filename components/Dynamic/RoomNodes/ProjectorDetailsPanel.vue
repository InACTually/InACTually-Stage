<template>
    <CommonPanelRow class="resolution_row">
        <h6>Resolution</h6>
        <CommonInput class="input" v-model="resolution.x" labelText="" type="number" @onUserChange="updateResolution()" />
        <CommonInput class="input" v-model="resolution.y" labelText="" type="number" @onUserChange="updateResolution()" />
    </CommonPanelRow>
</template>
<script lang="ts" setup>
import * as THREE from "three"
import ProjectorRoomNode from "~/app/RoomNodes/Projector/ProjectorRoomNode";

const props = defineProps({
    selectedRoomNode: {
        required: true,
        type: ProjectorRoomNode
    },
});

let resolution = ref<{ x: number, y: number }>({ x: 1920, y: 1080 });

const rawSelectedRoomNode = computed(() => {
    return toRaw(props.selectedRoomNode);
})

onMounted(() => {
    watch(rawSelectedRoomNode, () => {
        if (rawSelectedRoomNode.value) {
            watch(rawSelectedRoomNode.value.getResolution(), () => {
                setResolution();
            }, { immediate: true })

        }
    }, { immediate: true })
})

function setResolution() {
    const res = rawSelectedRoomNode.value.getResolution().value;
    resolution.value = { x: res.x, y: res.y };
}

watch(() => resolution.value.x, (newValue: any, oldValue: any) => {
    if (isNaN(Number(newValue))) {
        newValue = oldValue;
    }
    resolution.value.x = Number(newValue.toFixed(0));
})
watch(() => resolution.value.y, (newValue: any, oldValue: any) => {
    if (isNaN(Number(newValue))) {
        newValue = oldValue;
    }
    resolution.value.y = Number(newValue.toFixed(0));
})

function updateResolution() {
    rawSelectedRoomNode.value.setResolution({ x: resolution.value.x, y: resolution.value.y });
}

</script>
<style lang="scss" scoped>
@use "@/assets/style/vars.scss";
.resolution_row {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: space-between;
    
    .input {
        margin: 3px;
    }
}
</style>
