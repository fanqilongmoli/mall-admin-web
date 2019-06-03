<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productSaleForm" label-width="120px" style="width: 720px" size="small">
      <el-form-item label="商品相册：" prop="subImages">
        <multi-upload v-model="value.subImages"/>
      </el-form-item>
      <el-form-item label="商品详情：">
        <tinymce :width="595" :height="300" v-model="value.detail"></tinymce>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品促销</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交商品</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import MultiUpload from '../../../../components/Upload/multiUpload'
  import Tinymce from '../../../../components/Tinymce'

  export default {
    name: "ProductSaleDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {}
    },
    components: {
      MultiUpload, Tinymce
    },
    methods: {
      handlePrev() {
        this.$emit('prevStep')
      },
      handleNext() {
        this.$emit('nextStep')
      },
      handleFinishCommit() {
        this.$emit('finishCommit', this.isEdit);
      }
    }
  }
</script>

<style scoped>
  .littleMargin {
    margin-top: 10px;
  }
</style>
