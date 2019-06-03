<template> 
  <div>
    <el-upload
      action="http://upload-z0.qiniu.com"
      :data="uptoken"
      list-type="picture"
      :multiple="false"
      :file-list="fileList"
      :show-file-list="showFileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10MB</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import {uploadToken} from '../../api/public'

  export default {
    name: 'singleUpload',
    props: {
      value: String
    },
    computed: {
      showFileList: {
        get: function () {
          console.log('this.value', this.value !== null && this.value !== '' && this.value !== undefined)
          return this.value !== null && this.value !== '' && this.value !== undefined;
        },
        set: function (newValue) {
        }
      }
    },
    watch: {
      value(val) {
        console.log("------------",val)
        this.fileList.pop();
        this.fileList.push({
          url: val
        })
      }
    },
    data() {
      return {
        uptoken: {
          token: '',
          key: ''
        },
        dialogVisible: false,
        fileList: []
      };
    },
    created() {
      uploadToken().then(response => {
        this.uptoken.token = response.data
      })
      this.fileList.push({
        url: this.value
      })
    },
    methods: {
      emitInput(val) {
        this.$emit('input', val)
      },
      handleRemove(file, fileList) {
        this.emitInput('');
      },
      handlePreview(file) {
        this.dialogVisible = true;
      },
      beforeUpload(file) {
        this.uptoken.key = new Date().getTime() + file.name;
        return true;
      },
      handleUploadSuccess(res, file) {
        this.showFileList = true;
        this.fileList.pop();
        this.fileList.push({name: file.name, url: `http://prqmm1g1p.bkt.clouddn.com/${this.uptoken.key}`});
        this.emitInput(this.fileList[0].url);
        console.log("this.fileList", this.fileList)
      }
    }
  }
</script>
<style>

</style>


