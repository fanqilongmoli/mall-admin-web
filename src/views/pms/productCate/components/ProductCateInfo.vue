<template>
  <div class="app-container">
    <el-form label-position="left" ref="cateForm" :rules="rules" style="width: 500px" label-width="80px"
             :model="formLabelAlign">
      <el-form-item label="名称" prop="name">
        <el-input v-model="formLabelAlign.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sortOrder">
        <el-input-number v-model="formLabelAlign.sortOrder"></el-input-number>
      </el-form-item>
      <el-form-item label="父级分类" prop="parentId">
        <el-select v-model="formLabelAlign.parentId" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('cateForm')">{{isEdit?"更新":"保存"}}</el-button>
        <el-button @click="onBack">返回</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import {getCateDetail, getProductCateRootList, saveCate} from '../../../../api/productCate'

  export default {
    name: "ProductCateInfo",
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        formLabelAlign: {},
        options: null,
        rules: {
          name: [
            {required: true, message: '请输入分类名称', trigger: 'blur'},
          ],
          sortOrder: [
            {required: true, message: '请输入排序', trigger: 'change'}
          ],
          parentId: [
            {required: true, message: '请选择父级分类', trigger: 'change'}
          ]
        }
      }
    },
    created() {
      if (this.isEdit) {
        getCateDetail(this.$route.query.id).then(response => {
          this.formLabelAlign = response.data
        })
      }

      getProductCateRootList().then(response => {
        this.options = response.data
        this.options.unshift({
          id: 0,
          name: "默认"
        })
      })
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            saveCate(this.formLabelAlign).then(response => {
              this.$message.success(this.isEdit ? "更新成功" : "保存成功")
              if (!this.isEdit) {
                this.resetForm(formName)
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      onBack() {
        this.$router.back()
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>

</style>
