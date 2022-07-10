<template>
  <div class="loading-modal" v-if="show">
    <div class="loading-modal__content">
      <div class="sk-folding-cube">
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
});

</script>

<style lang="scss" scoped>
.loading-modal__content{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -80%);
  width: 540px;
  height: 350px;
  background: url('@/assets/progress.jpg') center center no-repeat
}


</style>