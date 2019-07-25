<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productSaleForm" label-width="120px" style="width: 720px" size="small">
      <el-form-item label="商品规格：">
        <el-card>
          <el-input v-model="addProductAttrValue" style="width: 160px;margin-left: 10px" clearable></el-input>
          <el-button class="littleMarginLeft" @click="handleAddProductAttrValue">增加规格</el-button>

          <el-table style="width: 100%;margin-top: 20px"
                    :data="value.productSpecsList"
                    border>
            <el-table-column
              label="规格名称"
              width="80"
              align="center">
              <template slot-scope="scope">
                {{scope.row.specsName}}
              </template>
            </el-table-column>
            <el-table-column
              label="SKU编码"
              width="80"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.skuNo"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="库存"
              width="80"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.stock"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="商品成本"
              width="80"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.costPrice"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="商品现单价"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.price"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="售卖方式"
              align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.saleStyle"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="80"
              align="center">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleRemoveProductSku(scope.$index, scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-form-item>
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

  import {deleteSpecs} from '../../../../api/product'

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
      return {
        // 手动添加规格的值
        addProductAttrValue: '',
      }
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
      },
      // 添加新的规格名称
      handleAddProductAttrValue() {
        console.log("asdasdasdasd", this.value);
        if (this.addProductAttrValue == null || this.addProductAttrValue == '') {
          this.$message({
            message: '属性值不能为空',
            type: 'warning',
            duration: 1000
          });
          return
        }

        if (this.value.productSpecsList.length > 0 && this.value.productSpecsList.filter(item => item.specsName === this.addProductAttrValue).length > 0) {
          this.$message({
            message: '属性值不能重复',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        this.value.productSpecsList.push({
          specsName: this.addProductAttrValue,
          skuNo: '',
          stock: '',
          costPrice: '',
          price: '',
          saleStyle: '',
        })
      },
      // 删除规格
      handleRemoveProductSku(index, row) {
        if (this.isEdit) {
          // 编辑状态 调用接口删除
          const list = this.value.productSpecsList;
          deleteSpecs(row.id).then(response => {
            if (list.length === 1) {
              list.pop();
            } else {
              list.splice(index, 1);
            }
          })
        } else {
          // 添加状态 本地删除
          const list = this.value.productSpecsList;
          if (list.length === 1) {
            list.pop();
          } else {
            list.splice(index, 1);
          }

        }
      }
    }
  }
</script>

<style scoped>
  .littleMargin {
    margin-top: 10px;
  }
</style>
