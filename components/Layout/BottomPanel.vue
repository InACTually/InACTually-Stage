
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
    <section class="bottom_panel_wrapper">
        <div class="bottom_panel_content">
            <h6>Bottom</h6>
        </div>
    </section>
</template>
<script lang="ts" setup>

</script>
<style lang="scss" scoped>
@use "@/assets/style/vars.scss";
.bottom_panel_wrapper{
      
      background-color:vars.$semiTransparentColor;//rgba(255,255,255,1.0  );
      backdrop-filter: blur(10px);
      .bottom_panel_content{
                border-top:vars.$borderWidth solid vars.$borderColor;
                margin-left:vars.$margin;
                margin-right:vars.$margin;
                display:flex;
                flex-direction: row;
                justify-content:left;
                align-items:center;
                height:100%;
           
        }
}
</style>
