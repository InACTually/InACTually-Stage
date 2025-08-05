<template>
  <div class="app_wrapper">
     <MainGUI v-if="app" :app="app"></MainGUI>
     <canvas id="scene"></canvas>   
     <div id="xrbuttoncontainer"></div>
  </div>
</template>
<script lang="ts" setup>
import App from './app/App';

let {setTheme} = useTheme();
let app = ref<App>();

onMounted(()=>{
  let canvas = document.getElementById("scene");  
  app.value = new App(canvas!);
  setTheme();
})
 
</script>
<style lang="scss" scoped>
#scene{
  position:absolute;
  top:0px;
  left:0px;
  width:100vw;
  height:100vh;
}

#xrbuttoncontainer{
  position:absolute;
  bottom:0px;
  left:85px;
}

</style>