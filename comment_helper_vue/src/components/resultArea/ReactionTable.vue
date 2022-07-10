<template>
  <table class="table table-auto whitespace-normal table-zebra w-full">
    <!-- head -->
    <thead>
      <tr>
        <th></th>
        <th>名稱</th>
        <th>心情</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(tr, index) in dataStore.filteredData" :key="tr.id">
        <th>{{ index + 1 }}</th>
        <td>{{ tr.name || tr.id }}</td>
        <td>
          <ReactionIcon :reaction="tr.type" />
          <!-- {{ tr.type }}
          <span class="react" :class="tr.type"></span> -->
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script lang="ts" setup>
import ReactionIcon from './ReactionIcon.vue';
import { useDataStore } from '@/store/modules/data';
const dataStore = useDataStore();
</script>

<style lang="scss" scoped>
span.react{
  display: inline-block;
  vertical-align: middle;
  transform: scale(0.5);
  width: 48px;
  height: 48px;
  background-image: url('@/assets/reaction.png');
  &.LIKE{
    background-position: 0 -147px;
    background-repeat: no-repeat;
    background-size: auto;
  }
  &.LOVE{
    background-position: 0 -196px;
    background-repeat: no-repeat;
    background-size: auto;
  }
  &.HAHA{
    background-position: 0 -98px;
    background-repeat: no-repeat;
    background-size: auto;
  }
  &.WOW{
    background-position: 0 -294px;
    background-repeat: no-repeat;
    background-size: auto;
  }
  &.SAD{
    background-position: 0 -245px;
    background-repeat: no-repeat;
    background-size: auto;
  }
  &.ANGRY{
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: auto;
  }
  &.THANKFUL{
    background-position: 0 -49px;
    background-repeat: no-repeat;
    background-size: auto;
  }
}
</style>