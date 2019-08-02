<template>
  <div class="upload-container">
    <el-button icon='el-icon-upload' size="mini" :style="{background:color,borderColor:color}"
               @click=" dialogVisible=true" type="primary">上传图片
    </el-button>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <el-upload class="editor-slide-upload"
                 action="http://upload-z0.qiniu.com"
                 :data="uptoken"
                 :multiple="true"
                 :file-list="fileList"
                 :show-file-list="true"
                 list-type="picture-card"
                 :on-remove="handleRemove"
                 :on-success="handleSuccess"
                 :before-upload="beforeUpload">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import {uploadToken} from '../../../api/public'

  export default {
    name: 'editorSlideUpload',
    props: {
      color: {
        type: String,
        default: '#1890ff'
      }
    },
    data() {
      return {
        dialogVisible: false,
        listObj: [],
        fileList: [],
        uptoken: {
          token: '',
          key: ''
        },
      }
    },
    created() {
      uploadToken().then(response => {
        this.uptoken.token = response.data
      })
    },
    methods: {
      checkAllSuccess() {
        return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
      },
      handleSubmit() {
        console.log(this.listObj);
        this.$emit('successCBK', this.listObj);
        this.listObj = {};
        this.fileList = [];
        this.dialogVisible = false;
      },
      handleSuccess(response, file) {
        this.listObj.push({uid: file.uid, name: file.name, url: `http://img.cdn.freshth.top/${file.name}`});
        console.log("this.listObj", this.listObj)
      },
      handleRemove(file) {
        this.listObj = this.listObj.filter(item => item.uid !== file.uid)
        console.log("this.listObjfilter", this.listObj)
      },
      beforeUpload(file) {
        this.uptoken.key = file.name;
        return true;
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .upload-container .editor-slide-upload {
    margin-bottom: 20px;
  }
</style>
