<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="homeAdvertise"
             :rules="rules"
             ref="homeAdvertiseFrom"
             label-width="150px"
             size="small">
      <el-form-item label="广告名称：" prop="name">
        <el-input v-model="homeAdvertise.name" class="input-width"></el-input>
      </el-form-item>
      <!--<el-form-item label="广告位置：">-->
        <!--<el-select v-model="homeAdvertise.type">-->
          <!--<el-option-->
            <!--v-for="type in typeOptions"-->
            <!--:key="type.value"-->
            <!--:label="type.label"-->
            <!--:value="type.value">-->
          <!--</el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="开始时间：" prop="startTime">-->
        <!--<el-date-picker-->
          <!--type="datetime"-->
          <!--placeholder="选择日期"-->
          <!--v-model="homeAdvertise.startTime"></el-date-picker>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="到期时间：" prop="endTime">-->
        <!--<el-date-picker-->
          <!--type="datetime"-->
          <!--placeholder="选择日期"-->
          <!--v-model="homeAdvertise.endTime"></el-date-picker>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="上线/下线：">-->
        <!--<el-radio-group v-model="homeAdvertise.status">-->
          <!--<el-radio :label="0">下线</el-radio>-->
          <!--<el-radio :label="1">上线</el-radio>-->
        <!--</el-radio-group>-->
      <!--</el-form-item>-->
      <el-form-item label="广告图片：" prop="imageUrl">
        <single-upload v-model="homeAdvertise.imageUrl"></single-upload>
      </el-form-item>
      <el-form-item label="排序：" prop="positionSort">
        <el-input v-model="homeAdvertise.positionSort" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="广告链接：" prop="link">
        <el-input v-model="homeAdvertise.link" class="input-width"></el-input>
      </el-form-item>
      <!--<el-form-item label="广告备注：">-->
        <!--<el-input-->
          <!--class="input-width"-->
          <!--type="textarea"-->
          <!--:rows="5"-->
          <!--placeholder="请输入内容"-->
          <!--v-model="homeAdvertise.note">-->
        <!--</el-input>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="onSubmit('homeAdvertiseFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('homeAdvertiseFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import SingleUpload from '../../../../components/Upload/singleUpload'
  import {createHomeAdvertise, getHomeAdvertise, updateHomeAdvertise} from '../../../../api/homeAdvertise'

  const defaultHomeAdvertise = {
    name: null,
    link: null,
    imageUrl: null,
    positionSort: 0
  };
  export default {
    name: 'HomeAdvertiseDetail',
    components:{SingleUpload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        homeAdvertise: null,
        rules: {
          name: [
            {required: true, message: '请输入广告名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          link: [
            {required: true, message: '请输入广告链接', trigger: 'blur'}
          ],
          positionSort: [
            {required: true, message: '请输入排序', trigger: 'blur'}
          ],
          imageUrl: [
            {required: true, message: '请选择广告图片', trigger: 'blur'}
          ]
        }
      }
    },
    created(){
      if (this.isEdit) {
        getHomeAdvertise(this.$route.query.id).then(response => {
          this.homeAdvertise = response.data;
        });
      }else{
        this.homeAdvertise = Object.assign({},defaultHomeAdvertise);
      }
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updateHomeAdvertise(this.homeAdvertise).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
                updateHomeAdvertise(this.homeAdvertise).then(response => {
                  this.$refs[formName].resetFields();
                  this.homeAdvertise = Object.assign({},defaultHomeAdvertise);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              }
            });

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.homeAdvertise = Object.assign({},defaultHomeAdvertise);
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 70%;
  }
</style>


