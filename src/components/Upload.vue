<template>
  <div class="upload">
    <h1>PDF 文件上传</h1>
    <p class="upload-tips">upload a PDF file to parse the preview</p>
    <el-upload
      class="upload-demo"
      drag
      action=""
      :on-change="onChange"
      :auto-upload="false"
      :show-file-list="false"
      accept=".pdf"
      multiple
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
    </el-upload>

  </div>
</template>

<script setup>
import { reactive, defineProps } from 'vue';
import { UploadFilled } from '@element-plus/icons-vue'
const props = defineProps({
  fileList: {
    type: Array,
  }
})
const emits = defineEmits(['update:fileList'])

const onChange = (file) => {
  const reader = new FileReader()
  // 读取文件dataurl
  reader.readAsDataURL(file.raw)
  reader.onload = (e) => {
    const newFile = reactive({
      name: file.name,
      size: file.size,
      url: e.target.result
    })
    const newFileList = [
      ...props.fileList, 
      newFile
    ]
    emits('update:fileList', newFileList)
  }
}
</script>
<style scoped>
.upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.upload-tips {
  font-size: 16px;
  color: #555;
}

.upload-demo {
  margin: 20px 0;
}

::v-deep .upload-demo .el-upload .el-upload-dragger {
  padding: 100px 40px;
}
</style>