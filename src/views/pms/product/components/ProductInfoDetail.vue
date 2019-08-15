<template>
  <div style="margin-top: 50px">
    <el-form :model="value" :rules="rules" ref="productInfoForm" label-width="120px" style="width: 720px" size="small">
      <el-form-item label="商品分类：" prop="categoryId">
        <el-cascader
          v-model="value.categoryId"
          :options="productCateOptions"
          :props="defaultParams">
        </el-cascader>
      </el-form-item>
      <el-form-item label="商品名称：" prop="name">
        <el-input v-model="value.name"></el-input>
      </el-form-item>
      <el-form-item label="商品子标题：" prop="subtitle">
        <el-input v-model="value.subtitle"></el-input>
      </el-form-item>
      <el-form-item label="商品主图：" prop="mainImage">
        <single-upload v-model="value.mainImage"/>
      </el-form-item>
      <el-form-item label="商品正方形图：" prop="squareImage">
        <single-upload v-model="value.squareImage"/>
      </el-form-item>
      <el-form-item label="商品原价：">
        <el-input v-model="value.originalPrice" type="number"></el-input>
      </el-form-item>
      <el-form-item label="商品单价：" prop="price">
        <el-input v-model="value.price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="销量：" prop="price">
        <el-input v-model="value.salesVolume" type="number"></el-input>
      </el-form-item>
      <el-form-item label="标签：">
        <el-input v-model="value.label" maxlength="4" prop="label"></el-input>
      </el-form-item>
      <el-form-item label="校验库存">
        <el-switch
          v-model="value.checkStock"
          active-value="1"
          inactive-value="0"/>
      </el-form-item>
      <el-form-item label="是否可以退/补差价">
        <el-switch
          v-model="value.canRefund"
          active-value="1"
          inactive-value="0"/>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="value.sort"></el-input-number>
      </el-form-item>
      <el-form-item label="爆款排序">
        <el-input-number v-model="value.hotSort"></el-input-number>
      </el-form-item>
      <el-form-item prop="status" label="商品状态">
        <el-select v-model="value.status" placeholder="请选择商品状态" clearable>
          <el-option
            v-for="item in operates"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="medium" @click="handleNext('productInfoForm')">下一步，填写商品促销</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {fetchListWithChildren} from '@/api/productCate'
  import {fetchList as fetchBrandList} from '@/api/brand'
  import {getProductCateList} from '../../../../api/productCate';
  import SingleUpload from '../../../../components/Upload/singleUpload'
  import MultiUpload from '../../../../components/Upload/multiUpload'
  import Tinymce from '../../../../components/Tinymce'

  export default {
    name: "ProductInfoDetail",
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        hasEditCreated: false,
        //选中商品分类的值
        selectProductCateValue: [],
        productCateOptions: [],
        operates: [
          {
            label: "下架",
            value: 1
          },
          {
            label: "在售",
            value: 2
          },
          {
            label: "新品",
            value: 3
          },
          {
            label: "爆款",
            value: 4
          }
        ],
        defaultParams: {
          label: 'name',
          value: 'id',
          children: 'children'
        },
        rules: {
          name: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          subtitle: [{required: true, message: '请输入商品副标题', trigger: 'blur'}],
          categoryId: [{required: true, message: '请选择商品分类', trigger: 'blur'}],
          specs: [{required: true, message: '请选择商品规格', trigger: 'blur'}],
          description: [{required: true, message: '请输入商品介绍', trigger: 'blur'}],
          costPrice: [{required: true, message: '该项为必填项', trigger: 'blur'}],
          price: [{required: true, message: '该项为必填项', trigger: 'blur'}],
          stock: [{required: true, message: '该项为必填项', trigger: 'blur'}],
          status: [{required: true, message: '该项为必填项', trigger: 'blur'}],
          salesVolume: [{required: true, message: '该项为必填项', trigger: 'blur'}]
        }
      };
    },
    created() {
      this.getProductCateLists();
    },
    computed: {
      //商品的编号
      productId() {
        return this.value.id;
      }
    },
    components: {
      SingleUpload, MultiUpload, Tinymce
    },
    watch: {
      productId: function (newValue) {
        if (!this.isEdit) return;
        if (this.hasEditCreated) return;
        if (newValue === undefined || newValue == null || newValue === 0) return;
        this.handleEditCreated();
      },
      selectProductCateValue: function (newValue) {
        if (newValue != null && newValue.length === 2) {
          this.value.productCategoryId = newValue[1];
          this.value.productCategoryName = this.getCateNameById(this.value.productCategoryId);
        } else {
          this.value.productCategoryId = null;
          this.value.productCategoryName = null;
        }
      }
    },
    methods: {
      //处理编辑逻辑
      handleEditCreated() {
        if (this.value.productCategoryId != null) {
          this.selectProductCateValue.push(this.value.cateParentId);
          this.selectProductCateValue.push(this.value.productCategoryId);
        }
        this.hasEditCreated = true;
      },
      getProductCateLists() {
        getProductCateList().then(response => {
          this.productCateOptions = response.data
        })
      },
      getCateNameById(id) {
        let name = null;
        for (let i = 0; i < this.productCateOptions.length; i++) {
          for (let j = 0; i < this.productCateOptions[i].children.length; j++) {
            if (this.productCateOptions[i].children[j].value === id) {
              name = this.productCateOptions[i].children[j].label;
              return name;
            }
          }
        }
        return name;
      },
      handleNext(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('nextStep');
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      handleBrandChange(val) {
        let brandName = '';
        for (let i = 0; i < this.brandOptions.length; i++) {
          if (this.brandOptions[i].value === val) {
            brandName = this.brandOptions[i].label;
            break;
          }
        }
        this.value.brandName = brandName;
      }
    }
  }
</script>

<style scoped>
</style>
