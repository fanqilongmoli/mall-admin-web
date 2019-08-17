<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.orderNo" class="input-width" placeholder="订单编号"></el-input>
          </el-form-item>
          <el-form-item label="收货人：">
            <el-input v-model="listQuery.receiverName" class="input-width" placeholder="收货人姓名"></el-input>
          </el-form-item>
          <el-form-item label="收货人号码：">
            <el-input v-model="listQuery.receiverPhone" class="input-width" placeholder="手机号码"></el-input>
          </el-form-item>
          <el-form-item label="提交时间：">
            <el-date-picker
              v-model="listQuery.createTime"
              type="datetimerange"
              range-separator="至"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="订单状态：">
            <el-select v-model="listQuery.status" class="input-width" placeholder="全部" clearable>
              <el-option v-for="item in statusOptions"
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
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="订单编号" width="180" align="center">
          <template slot-scope="scope">{{scope.row.orderNo}}</template>
        </el-table-column>
        <el-table-column label="提交时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="订单总支付金额" width="120" align="center">
          <template slot-scope="scope">￥{{scope.row.payment}}</template>
        </el-table-column>
        <el-table-column label="订单实际支付金额" width="120" align="center">
          <template slot-scope="scope">{{scope.row.actualPayment}}</template>
        </el-table-column>
        <el-table-column label="退差价方式" width="120" align="center">
          <template slot-scope="scope">{{scope.row.refundType | formatRefundType}}</template>
        </el-table-column>
        <el-table-column label="支付类型" width="120" align="center">
          <template slot-scope="scope">{{scope.row.paymentType | formatPaymentType}}</template>
        </el-table-column>
        <el-table-column label="订单状态" width="120" align="center">
          <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
        </el-table-column>
        <el-table-column label="发货时间" align="center">
          <template slot-scope="scope">{{scope.row.sendTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleViewOrder(scope.$index, scope.row)"
            >查看订单
            </el-button>
            <el-button
              size="mini"
              @click="handleCloseOrder(scope.$index, scope.row)"
              v-show="scope.row.status===0">关闭订单
            </el-button>
            <el-button
              size="mini"
              @click="handleCloseOrder(scope.$index, scope.row)"
              v-show="scope.row.status===1">取消订单
            </el-button>
            <el-button
              size="mini"
              @click="handleDeliveryOrder(scope.$index, scope.row)"
              v-show="scope.row.status===1">订单发货
            </el-button>
            <el-button
              size="mini"
              @click="handleViewLogistics(scope.$index, scope.row)"
              v-show="scope.row.status===2||scope.row.status===5">确认收货
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteOrder(scope.$index, scope.row)"
              v-show="scope.row.status===6">删除订单
            </el-button>
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
        :current-page.sync="listQuery.pageNo"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="关闭订单"
      :visible.sync="closeOrder.dialogVisible" width="30%">
      <span style="vertical-align: top">操作备注：</span>
      <el-input
        style="width: 80%"
        type="textarea"
        :rows="5"
        placeholder="请输入内容"
        v-model="closeOrder.content">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOrder.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOrderConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>
<script>
  import {delivery, confirmReceiveGood} from '../../../api/order'
  import {formatDate} from '@/utils/date';
  import LogisticsDialog from '@/views/oms/order/components/logisticsDialog';
  import {orderList, orderDelete, orderClose, closeOrder} from '../../../api/order'

  const defaultListQuery = {
    pageNo: 1,
    pageSize: 10,
    orderNo: null,
    receiverName: null,
    receiverPhone: null,
    status: null,
    createTime: null,
  };
  export default {
    name: "orderList",
    components: {LogisticsDialog},
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: true,
        list: null,
        total: null,
        operateType: null,
        multipleSelection: [],
        closeOrder: {
          dialogVisible: false,
          content: null,
          orderIds: []
        },
        statusOptions: [
          {
            label: '待付款',
            value: 0
          },
          {
            label: '待发货',
            value: 1
          },
          {
            label: '已发货',
            value: 2
          },
          {
            label: '待补差价',
            value: 3
          },
          {
            label: '待退差价',
            value: 4
          },
          {
            label: '已完成',
            value: 5
          },
          {
            label: '已关闭',
            value: 6
          },
          {
            label: '无效订单',
            value: 7
          }
        ],
        logisticsDialogVisible: false
      }
    },
    created() {
      this.getOrderList();
    },
    filters: {
      formatCreateTime(time) {
        if (time) {
          let date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        } else {
          return '';
        }

      },
      formatPayType(value) {
        if (value === 1) {
          return '支付宝';
        } else if (value === 2) {
          return '微信';
        } else {
          return '未支付';
        }
      },
      formatSourceType(value) {
        if (value === 1) {
          return 'APP订单';
        } else {
          return 'PC订单';
        }
      },
      formatRefundType(value) {
        if (value === 1) {
          return '补差价';
        } else {
          return '退差价';
        }
      },
      formatPaymentType(value) {
        if (value === 1) {
          return '在线支付';
        }
      },
      formatStatus(value) {
        // 订单状态：0->待付款；1->待发货；2->已发货；3->待补差价 4->待退差价 5->已完成；6->已关闭；7->无效订单
        if (value === 1) {
          return '待发货';
        } else if (value === 2) {
          return '已发货';
        } else if (value === 3) {
          return '待补差价';
        } else if (value === 4) {
          return '待退差价';
        } else if (value === 5) {
          return '已完成';
        } else if (value === 5) {
          return '已关闭'
        } else if (value === 6) {
          return '已关闭'
        } else if (value === 7) {
          return '无效订单'
        } else {
          return '待付款';
        }
      },
    },
    methods: {
      getOrderList() {
        this.listLoading = true;
        orderList(this.listQuery).then(response => {
          console.log('orderList', response.data)
          this.listLoading = false;
          this.list = response.data.content;
          this.total = response.data.totalElements
        })
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getOrderList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleViewOrder(index, row) {
        this.$router.push({path: '/oms/orderDetail', query: {id: row.id}})
      },
      handleCloseOrder(index, row) {
        //this.closeOrder.dialogVisible = true;
        //this.closeOrder.orderIds = [row.id];
        this.closeOrders(row.id)
      },
      handleDeliveryOrder(index, row) {
        delivery([row.id]).then(response => {
          this.$message({
            message: '发货成功',
            type: 'success',
            duration: 1000
          });
          this.getOrderList();
        })
      },
      handleViewLogistics(index, row) {
        // 确认收货
        confirmReceiveGood(row.id).then(
          response => {
            this.$message({
              message: '确认收货成功',
              type: 'success',
              duration: 1000
            });
            this.getOrderList();
          }
        )
      },
      handleDeleteOrder(index, row) {
        let ids = [];
        ids.push(row.id);
        this.deleteOrder(ids);
      },
      handleBatchOperate() {
        if (this.multipleSelection == null || this.multipleSelection.length < 1) {
          this.$message({
            message: '请选择要操作的订单',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if (this.operateType === 1) {
          //批量发货
          let list = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            if (this.multipleSelection[i].status === 1) {
              list.push(this.covertOrder(this.multipleSelection[i]));
            }
          }
          if (list.length === 0) {
            this.$message({
              message: '选中订单中没有可以发货的订单',
              type: 'warning',
              duration: 1000
            });
            return;
          }
          this.$router.push({path: '/oms/deliverOrderList', query: {list: list}})
        } else if (this.operateType === 2) {
          //关闭订单
          this.closeOrder.orderIds = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            this.closeOrder.orderIds.push(this.multipleSelection[i].id);
          }
          this.closeOrder.dialogVisible = true;
        } else if (this.operateType === 3) {
          //删除订单
          let ids = [];
          for (let i = 0; i < this.multipleSelection.length; i++) {
            ids.push(this.multipleSelection[i].id);
          }
          this.deleteOrder(ids);
        }
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getOrderList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getOrderList();
      },
      handleCloseOrderConfirm() {
        if (this.closeOrder.content == null || this.closeOrder.content === '') {
          this.$message({
            message: '操作备注不能为空',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let params = new URLSearchParams();
        params.append('ids', this.closeOrder.orderIds);
        params.append('note', this.closeOrder.content);
        closeOrder(params).then(response => {
          this.closeOrder.orderIds = [];
          this.closeOrder.dialogVisible = false;
          this.getOrderList();
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
      closeOrders(ids) {
        this.$confirm('是否要进行该关闭操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          closeOrder(ids).then(response => {
            this.$message({
              message: '关闭成功！',
              type: 'success',
              duration: 1000
            });
            this.getOrderList();
          });
        })
      },
      deleteOrder(ids) {
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          orderDelete(ids).then(response => {
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration: 1000
            });
            this.getOrderList();
          });
        })
      },
      covertOrder(order) {
        let address = order.receiverProvince + order.receiverCity + order.receiverRegion + order.receiverDetailAddress;
        let listItem = {
          orderId: order.id,
          orderSn: order.orderSn,
          receiverName: order.receiverName,
          receiverPhone: order.receiverPhone,
          receiverPostCode: order.receiverPostCode,
          address: address,
          deliveryCompany: null,
          deliverySn: null
        };
        return listItem;
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>


