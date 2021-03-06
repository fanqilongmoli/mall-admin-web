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
        <el-table-column label="原价" width="120" align="center">
          <template slot-scope="scope">
            <p>￥{{scope.row.price}}</p>
          </template>
        </el-table-column>
        <el-table-column label="SKU库存" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="handleShowSkuEditDialog(scope.$index, scope.row)"
                       circle></el-button>
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
    <el-dialog
      title="编辑货品信息"
      :visible.sync="editSkuInfo.dialogVisible"
      width="40%">
      <el-table style="width: 100%;margin-top: 20px"
                :data="editSkuInfo.stockList"
                border>
        <el-table-column
          label="规格名称"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.specsName"></el-input>
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
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>


</template>
<script>
    import {getProductList, deleteProduct, listSpecs, saveSpecsList} from '../../../api/product'
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
                },
                editSkuInfo: {
                    dialogVisible: false,
                    productId: null,
                    productSn: '',
                    productAttributeCategoryId: null,
                    stockList: [],
                    productAttr: [],
                    keyword: null
                },
            }
        },
        created() {
            const search = JSON.parse(localStorage.getItem("search_query_p"));
            if (search) {
                this.listQuery = search;
            }
            this.getList();
            this.getProductCateLists();
        },
        watch: {},
        filters: {
            verifyStatusFilter(value) {
                return value === 1 ? "下架" : value === 2 ? "在售" : value === 3 ? "新品" : "爆款";
            }
        },
        methods: {
            getList() {
                this.listLoading = true;
                const data = this.listQuery;
                getProductList(data).then(response => {
                    // 保存查询参数
                    localStorage.setItem("search_query_p", JSON.stringify(this.listQuery));
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
                localStorage.removeItem("search_query_p");
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
                localStorage.removeItem("search_query_p");
                this.listQuery = Object.assign({}, defaultListQuery);
                this.getList();
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
            handleShowSkuEditDialog(index, row) {

                // 获取对应商品的规格列表
                listSpecs(row.id).then(response => {
                    this.editSkuInfo.dialogVisible = true;
                    this.editSkuInfo.stockList = response.data;
                })
            },
            handleEditSkuConfirm() {
                if (this.editSkuInfo.stockList == null || this.editSkuInfo.stockList.length <= 0) {
                    this.$message({
                        message: '暂无sku信息',
                        type: 'warning',
                        duration: 1000
                    });
                    return
                }
                this.$confirm('是否要进行修改', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    saveSpecsList(this.editSkuInfo.stockList).then(response => {
                        this.$message({
                            message: '修改成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.editSkuInfo.dialogVisible = false;
                    });
                });
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


