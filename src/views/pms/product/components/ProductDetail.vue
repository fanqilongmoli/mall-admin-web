<template> 
  <el-card class="form-container" shadow="never">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="填写商品基本信息"></el-step>
      <el-step title="填写商品详情"></el-step>
      <el-step title="填写商品属性"></el-step>
      <el-step title="选择商品关联"></el-step>
    </el-steps>
    <product-info-detail
      v-show="showStatus[0]"
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep">
    </product-info-detail>
    <product-sale-detail
      v-show="showStatus[1]"
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </product-sale-detail>
    <product-attr-detail
      v-show="showStatus[2]"
      v-model="productParam"
      :is-edit="isEdit"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </product-attr-detail>
    <product-relation-detail
      v-show="showStatus[3]"
      v-model="productParam"
      :is-edit="isEdit"
      @prevStep="prevStep"
      @finishCommit="finishCommit">
    </product-relation-detail>
  </el-card>
</template>
<script>
  import ProductInfoDetail from './ProductInfoDetail';
  import ProductSaleDetail from './ProductSaleDetail';
  import ProductAttrDetail from './ProductAttrDetail';
  import ProductRelationDetail from './ProductRelationDetail';
  import {createProduct, getProduct, updateProduct} from '@/api/product';

  const defaultProductParam = {
    categoryId: null, //商品分类
    name: '', //商品名称
    subtitle: '', //商品子标题
    mainImage: '', //商品主图
    squareImage: '', // 商品正方形图片
    specs: '', // 商品规格
    costPrice: null, //商品成本价
    originalPrice: null, //商品原价
    price: null, // 商品现单价
    stock: 0, // 库存
    label: '', // 标签
    checkStock: '1', //校验库存
    sort: 0, //排序
    status: null, //商品状态 1下架 2在售 3新品 4爆款
    subImages: [], //商品相册
    detail: '', // 商品详情
  };
  export default {
    name: 'ProductDetail',
    components: {ProductInfoDetail, ProductSaleDetail, ProductAttrDetail, ProductRelationDetail},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        active: 0,
        productParam: Object.assign({}, defaultProductParam),
        showStatus: [true, false, false, false]
      }
    },
    created() {
      if (this.isEdit) {
        getProduct(this.$route.query.id).then(response => {
          this.productParam = response.data;
        });
      }
    },
    methods: {
      hideAll() {
        for (let i = 0; i < this.showStatus.length; i++) {
          this.showStatus[i] = false;
        }
      },
      prevStep() {
        if (this.active > 0 && this.active < this.showStatus.length) {
          this.active--;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      nextStep() {
        if (this.active < this.showStatus.length - 1) {
          this.active++;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      finishCommit(isEdit) {
        this.$confirm('是否要提交该产品', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (isEdit) {
            updateProduct(this.$route.query.id, this.productParam).then(response => {
              this.$message({
                type: 'success',
                message: '提交成功',
                duration: 1000
              });
              this.$router.back();
            });
          } else {
            createProduct(this.productParam).then(response => {
              this.$message({
                type: 'success',
                message: '提交成功',
                duration: 1000
              });
              location.reload();
            });
          }
        })
      }
    }
  }
</script>
<style>
  .form-container {
    width: 800px;
  }
</style>


