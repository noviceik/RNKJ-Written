<template>
  <div class="view">
    <div class="view-header">
      <div class="back" @click="goBack"> < 返回</div>
      <div class="title">{{ state.name }}</div>
    </div>
    <div class="pdf-view">
      <canvas class="pdf-page" v-for="page in state.pdfPages" :key="page"  :id="`page-${page}`" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router';
import * as PDF from 'pdfjs-dist';

const router = useRouter()
const query = router.currentRoute.value.query

const state = reactive({
  name: query.name,
  // 总页数
  pdfPages: 1,
  // 页面缩放
  pdfScale: 1, 
})
let pdfInfo = {}

function goBack() {
  router.push('/')
}

onMounted(() => {
  loadFile(query)
})

// 加载文件
function loadFile(file) {
  PDF.getDocument({
      url: file.url,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/cmaps/',
      cMapPacked: true,
      password: file.password,
  }).promise.then((pdf) => {
    console.log('pdf', pdf);
    pdfInfo = pdf
    state.pdfPages = pdf.numPages
    renderPage(1)
  })
}

// 渲染页面
function renderPage(num) {
  pdfInfo.getPage(num).then((page) => {
    const canvas = document.getElementById(`page-${num}`);
    const ctx = canvas.getContext('2d')
    const viewport = page.getViewport({ scale: state.pdfScale })
    canvas.width = viewport.width
    canvas.height = viewport.height
    const renderContext = {
      canvasContext: ctx,
      viewport
    }
    page.render(renderContext)
    if (num < state.pdfPages) {
      renderPage(num + 1);
    }
  })
}
</script>
<style scoped>
.view {
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 50px;
  box-sizing: border-box;
}
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px;
  font-size: 20px;
  color: #333;
  font-weight: bold;
}
.back {
  cursor: pointer;
}
.title {
  flex: 1;
  text-align: center;
}
.pdf-view {
  text-align: center;
  margin-top: 40px;
}
.pdf-page {
  margin: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
}
</style>