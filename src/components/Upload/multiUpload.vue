3
<template> 
  <div>
    <el-upload
      action="http://upload-z0.qiniu.com"
      :data="uptoken"
      list-type="picture-card"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import {uploadToken} from '../../api/public'

  export default {
    name: 'multiUpload',
    props: {
      //图片属性数组
      value: Array,
      //最大上传图片数量
      maxCount: {
        type: Number,
        default: 5
      }
    },
    data() {
      return {
        uptoken: {
          token: '',
          key: ''
        },
        dialogVisible: false,
        dialogImageUrl: null,
        listObj: []
      };
    },
    computed: {
      fileList() {
        const temp = [];
        console.log('multiUpload', this.value);
        this.value.forEach(item => {
          temp.push({
            url: item
          })
        });
        return temp
      },

    },
    created() {
      uploadToken().then(response => {
        this.uptoken.token = response.data
      })
    },
    methods: {
      handleRemove(file, fileList) {
        this.value = fileList.map(item => item.url);
        this.$emit('input', this.value)
        // const anies = this.listObj.filter(item => item.name !== file.response.key).map(item => item.url);
      },
      handlePreview(file) {
        this.dialogVisible = true;
        this.dialogImageUrl = file.url;
      },
      beforeUpload(file) {
        this.uptoken.key = new Date().getTime() + file.name;
        return true;
      },
      handleUploadSuccess(res, file) {
        //this.fileList.push({name: file.name, url: `http://prqmm1g1p.bkt.clouddn.com/${file.response.key}`});
        this.value.push(`http://ptsoyxuli.bkt.clouddn.com/${file.response.key}`);
        // this.listObj.push({
        //   name: file.response.key,
        //   url: this.value
        // });
        this.$emit('input', this.value)
        console.log('handleUploadSuccess', this.value);
      },
      handleExceed(files, fileList) {
        this.$message({
          message: '最多只能上传' + this.maxCount + '张图片',
          type: 'warning',
          duration: 1000
        });
      },
    }
  }
</script>
<style>

</style>


