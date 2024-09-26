<template>
  <div class="content">
    <Upload v-model:fileList="fileList" />
    <Preview :fileList="fileList" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import  Preview from '../components/Preview.vue'
import Upload from '../components/Upload.vue';
const fileList = ref([])

</script>
<style scoped>
.content {
  padding: 50px 0;
  box-sizing: border-box;
  background-color: rgb(247, 245, 238);
  min-height: calc(100vh - 80px);
}
</style>