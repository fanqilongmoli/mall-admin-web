<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float: right"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.name" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader
              clearable
              expand-trigger="hover"
              :props="defaultParams"
              v-model="listQuery.categoryId"
              :options="productCateOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品状态：">
            <el-select v-model="listQuery.status" placeholder="请选择商品状态" clearable>
              <el-option
                v-for="item in operates"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProduct()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="id" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.mainImage"></template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
          </template>
        </el-table-column>

        <el-table-column label="成本价" width="120" align="center">
          <template slot-scope="scope">
            <p>￥{{scope.row.costPrice}}</p>
          </template>
        </el-table-column>
        <el-table-column label="原价" width="120" align="center">
          <template slot-scope="scope">
            <p>￥{{scope.row.originalPrice}}</p>
          </template>
        </el-table-column>
        <el-table-column label="现单价" width="120" align="center">
          <template slot-scope="scope">
            <p>￥{{scope.row.price}}</p>
          </template>
        </el-table-column>

        <el-table-column label="标签" width="140" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.label}}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="140" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.status | verifyStatusFilter}}</p>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.salesVolume}}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="100" align="center">
          <template slot-scope="scope">{{scope.row.updateTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="handleShowProduct(scope.$index, scope.row)">查看评论
              </el-button>
            </p>
            <p>
              <el-button
                size="mini"
                @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button>
            </p>
            <p>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNo"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {getProductList, deleteProduct} from '../../../api/product'
  import {getProductCateList} from '../../../api/productCate'

  const defaultListQuery = {
    name: null,
    pageNo: 1,
    pageSize: 5,
    status: null,
    categoryId: [],

  };
  export default {
    name: "productList",
    data() {
      return {
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
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        selectProductCateValue: null,
        multipleSelection: [],
        productCateOptions: [],
        brandOptions: [],
        defaultParams: {
          label: 'name',
          value: 'id',
          children: 'children'
        }

      }
    },
    created() {
      this.getList();
      this.getProductCateLists();
    },
    watch: {

    },
    filters: {
      verifyStatusFilter(value) {
        return value === 1 ? "下架" : value === 2 ? "2在售" : value === 3 ? "新品" : "爆款";
      }
    },
    methods: {
      getList() {
        this.listLoading = true;
        const data = this.listQuery;
        getProductList(data).then(response => {
          this.listLoading = false;
          this.list = response.data.content;
          this.total = response.data.totalElements;
        });
      },
      getProductCateLists() {
        getProductCateList().then(response => {
          this.productCateOptions = response.data
        })
      },
      handleSearchList() {
        this.listQuery.pageNo = 1;
        this.getList();
      },
      handleAddProduct() {
        this.$router.push({path: '/pms/addProduct'});
      },
      handleSizeChange(val) {
        this.listQuery.pageNo = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.getList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleDelete(index, row) {
        this.$confirm('是否要进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [];
          ids.push(row.id);
          this.updateDeleteStatus(ids);
        });
      },
      handleUpdateProduct(index, row) {
        this.$router.push({path: '/pms/updateProduct', query: {id: row.id}});
      },
      handleShowProduct(index, row) {
        console.log("handleShowProduct", row);
      },

      updateDeleteStatus(ids) {
        //let params = new URLSearchParams();
        //params.append('ids', ids);
        //params.append('deleteStatus', deleteStatus);
        deleteProduct(ids).then(response => {
          this.$message({
            message: '删除成功',
            type: 'success',
            duration: 1000
          });
          this.getList();
        });

      }
    }
  }
</script>
<style></style>


