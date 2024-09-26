<template>
  <div class="preview">
    <div class="preview-list">
      <div class="preview-item" v-for="(item, index) in fileList" :key="index">
        <img class="preview-img" :src="pdfImg" alt="">
        <div class="preview-content">
          <div class="preview-name">{{ item.name }}
            <span v-if="item.state === 'success'"> - 未加密文件</span>
            <span v-if="item.state === 'error'"> - 加密文件</span>
            <span v-if="item.state === 'decrypt'"> - 密钥：{{ item.password }}</span>
          </div>
          <div class="preview-size">{{ parseInt(item.size / 1024) }}KB<span v-if="item.state === 'success'"> / {{ item.pageCount }} 页</span></div>
        </div>
        <button class="preview-btn" @click="handlePreview(item)">
          查看
        </button>
      </div>
    </div>
    
    <el-dialog
      v-model="decryptVisible"
      title="输入密钥"
      width="400"
    >
      <el-input v-model="currentFile.password" style="width: 100%" placeholder="请输入密钥" @keyup.enter="decryptConfirm" />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="decryptVisible = false">取消</el-button>
          <el-button type="primary" @click="decryptConfirm">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, defineProps, toRefs, watch  } from 'vue';
import pdfImg from '@/assets/pdf.svg';
import { useRouter } from 'vue-router';
import 'pdfjs-dist/web/pdf_viewer.css';
import * as PDF from 'pdfjs-dist';
import { ElMessage } from 'element-plus'

PDF.GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.min.js';

const props = defineProps({
  fileList: {
    type: Array,
  }
})
const router = useRouter()

// 文件列表
const { fileList } = toRefs(props);
const decryptVisible = ref(false);
// 当前文件
const currentFile = ref(null);

// 监听文件上传变化
watch(fileList, (newVal) => {
  if (newVal.length) {
    loadFile(newVal[newVal.length - 1]);
  }
})

// 加载文件
function loadFile(file, isDecrypt) {
  PDF.getDocument({
      url: file.url,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/cmaps/',
      cMapPacked: true,
      password: file.password,
  }).promise.then((pdf) => {
      file.pageCount = pdf.numPages;
      file.info = pdf;
      console.log('pdf', pdf);
      if (isDecrypt) {
        decryptVisible.value = false;
        file.state = 'decrypt';
        router.push({
          path: '/view',
          query: {
            name: file.name,
            url: file.url,
            password: file.password
          }
        })
      } else {
        file.state = 'success';
      }
  }).catch((err) => {
      console.log('err', err);
      file.state = 'error';
      file.password = '';
      if (isDecrypt) {
        ElMessage({
          message: '密钥输入错误！',
          type: 'warning',
        })
      }
  })
}

// 查看文件
function handlePreview(file) {
  currentFile.value = file;
  if (file.state === 'error') {
    decryptVisible.value = true;
  } else {
    router.push({
      path: '/view',
      query: {
        name: file.name,
        url: file.url,
        password: file.password
      }
    })
  }
}

// 解密确认
function decryptConfirm() {
  loadFile(currentFile.value, true);
}
</script>

<style scoped>
.preview {
  max-width: 800px;
  margin: 20px auto;
}
.preview-list {
  display: flex;
  flex-wrap: wrap;
}
.preview-item {
  width: 100%;
  height: 80px;
  margin: 10px;
  padding: 10px 20px;
  border: 1px solid #ddd;
  background-color: #d1d8f720;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-sizing: border-box;
}
.preview-item:hover {
  background-color: #eff1f7;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.preview-img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.preview-content {
  flex: 1;
}
.preview-name {
  font-size: 16px;
  font-weight: bold;
}
.preview-size {
  font-size: 14px;
  color: #999;
}
.preview-btn {
  background-color: #409eff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.preview-btn:hover {
  background-color: #66b1ff;
}
</style>
