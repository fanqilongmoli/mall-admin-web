<template> 
  <div class="detail-container">
    <div>
      <el-steps :active="formatStepStatus(order.status)" finish-status="success" align-center>
        <el-step title="提交订单" :description="formatTime(order.createTime)"></el-step>
        <el-step title="支付订单" :description="formatTime(order.paymentTime)"></el-step>
        <el-step title="平台发货" :description="formatTime(order.sendTime)"></el-step>
        <el-step title="完成时间" :description="formatTime(order.endTime)"></el-step>
        <el-step title="完成评价" :description="formatTime(order.closeTime)"></el-step>
      </el-steps>
    </div>
    <el-card shadow="never" style="margin-top: 15px">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">当前订单状态：{{order.status | formatStatus}}</span>
        <!--        订单状态：0->待付款；1->待发货；2->已发货；3->待补差价 4->待退差价 5->已完成；6->已关闭；7->无效订单-->
        <div class="operate-button-container" v-show="order.status===0">
          <el-button size="mini" @click="showUpdateReceiverDialog">修改收货人信息</el-button>
          <el-button size="mini">修改商品信息</el-button>
          <el-button size="mini" @click="handleCloseOrder">关闭订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <!--代发货-->
        <div class="operate-button-container" v-show="order.status===1">
          <el-button size="mini" @click="handleDeliveryOrder">订单发货</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status===3">
          <el-button size="mini" @click="payOffsetMoneyOffLineDialogVisible = true">线下补差价</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status===2">
          <el-button size="mini" @click="showLogisticsDialog">确认收货</el-button>
          <el-button size="mini" @click="showMessageDialog">发送站内信</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container" v-show="order.status===6">
          <el-button size="mini" @click="handleDeleteOrder">删除订单</el-button>
          <el-button size="mini" @click="showMarkOrderDialog">备注订单</el-button>
        </div>
        <div class="operate-button-container">
          <el-button size="mini" @click="handleCloseOrder">取消订单</el-button>
        </div>

      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="8" class="table-cell-title">订单编号</el-col>
          <el-col :span="4" class="table-cell-title">用户账号</el-col>
          <el-col :span="4" class="table-cell-title">支付方式</el-col>
          <el-col :span="4" class="table-cell-title">订单来源</el-col>
          <el-col :span="4" class="table-cell-title">订单类型</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">{{order.orderNo}}</el-col>
          <el-col :span="4" class="table-cell">{{order.commonUser.nickName}}</el-col>
          <el-col :span="4" class="table-cell">微信</el-col>
          <el-col :span="4" class="table-cell">{{order.sourceType | formatSourceType}}</el-col>
          <el-col :span="4" class="table-cell">{{order.orderType | formatOrderType}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell-title">配送方式</el-col>
          <el-col :span="8" class="table-cell-title">物流单号</el-col>
          <el-col :span="8" class="table-cell-title">自动确认收货时间</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">{{order.deliveryCompany | formatNull}}</el-col>
          <el-col :span="8" class="table-cell">{{order.deliverySn | formatNull}}</el-col>
          <el-col :span="8" class="table-cell">{{order.autoConfirmDay}}天</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">收货人信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="8" class="table-cell-title">收货人</el-col>
          <el-col :span="8" class="table-cell-title">手机号码</el-col>
          <el-col :span="8" class="table-cell-title">收货地址</el-col>
        </el-row>
        <el-row>
          <el-col :span="8" class="table-cell">{{order.receiverName}}</el-col>
          <el-col :span="8" class="table-cell">{{order.receiverPhone}}</el-col>
          <el-col :span="8" class="table-cell">{{order | formatAddress}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">商品信息</span>
      </div>
      <el-table
        ref="orderItemTable"
        :data="order.userOrderItems"
        style="width: 100%;margin-top: 20px" border>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.productMainImage" style="height: 80px">
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.productName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="商品规格名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.specsName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="120" align="center">
          <template slot-scope="scope">
            <p>￥{{scope.row.specsPrice}}</p>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.quantity}}
          </template>
        </el-table-column>
        <el-table-column label="实际称重" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.actualWeighing}}斤
          </template>
        </el-table-column>
        <el-table-column label="小计" width="120" align="center">
          <template slot-scope="scope">
            ￥{{scope.row.totalPayment}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" align="center">
          <template slot-scope="scope">
            <p>
              <el-button v-show="order.status === 1" @click="showUpdateMoneyDialog(scope.row)">修改差价</el-button>
            </p>
            <p>
              <el-button v-show="order.status === 1" @click="showUpdateWeighingDialog(scope.row)">修改称重</el-button>
            </p>
            <p>
              <el-button v-show="order.status === 1" @click="showShortage(scope.row)">缺货通知</el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;margin: 20px">
        合计：<span class="color-danger">￥{{order.payment}}</span>
      </div>
      <div style="margin-top: 60px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">费用信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="5" class="table-cell-title">订单支付总金额</el-col>
          <el-col :span="5" class="table-cell-title">订单实际支付金额</el-col>
          <el-col :span="5" class="table-cell-title">运费</el-col>
          <el-col :span="5" class="table-cell-title">优惠券抵扣金额</el-col>
          <el-col :span="4" class="table-cell-title">退差价方式</el-col>
        </el-row>
        <el-row>
          <el-col :span="5" class="table-cell">￥{{order.payment}}</el-col>
          <el-col :span="5" class="table-cell">￥{{order.actualPayment}}</el-col>
          <el-col :span="5" class="table-cell">￥0</el-col>
          <el-col :span="5" class="table-cell">￥{{order.couponAmount}}</el-col>
          <el-col :span="4" class="table-cell">{{order.refundType|formatRefundType}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 60px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">订单备注</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="24" class="table-cell">{{order.orderNote}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">操作信息</span>
      </div>
      <el-table style="margin-top: 20px;width: 100%"
                ref="orderHistoryTable"
                :data="order.historyList" border>
        <el-table-column label="操作者" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.operateMan}}
          </template>
        </el-table-column>
        <el-table-column label="操作时间" width="160" align="center">
          <template slot-scope="scope">
            {{formatTime(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.orderStatus | formatStatus}}
          </template>
        </el-table-column>
        <el-table-column label="付款状态" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.orderStatus | formatPayStatus}}
          </template>
        </el-table-column>
        <el-table-column label="发货状态" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.orderStatus | formatDeliverStatus}}
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">
            {{scope.row.note}}
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="修改收货人信息"
               :visible.sync="receiverDialogVisible"
               width="40%">
      <el-form :model="receiverInfo"
               ref="receiverInfoForm"
               label-width="150px">
        <el-form-item label="收货人姓名：">
          <el-input v-model="receiverInfo.receiverName" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="receiverInfo.receiverPhone" style="width: 200px">
          </el-input>
        </el-form-item>
        <el-form-item label="邮政编码：">
          <el-input v-model="receiverInfo.receiverPostCode" style="width: 200px">
          </el-input>
        </el-form-item>
        <el-form-item label="所在区域：">
          <v-distpicker :province="receiverInfo.receiverProvince"
                        :city="receiverInfo.receiverCity"
                        :area="receiverInfo.receiverRegion"
                        @selected="onSelectRegion"></v-distpicker>
        </el-form-item>
        <el-form-item label="详细地址：">
          <el-input v-model="receiverInfo.receiverDetailAddress" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="receiverDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleUpdateReceiverInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改订单重量-->
    <el-dialog title="修改商品重量(单位:斤)"
               :visible.sync="weighingDialogVisible"
               width="40%">
      <div class="table-layout">
        <el-row>
          <el-col :span="24" class="table-cell">
            <el-input-number v-model="moneyInfo.actualWeighing" size="mini"
                             controls-position="right" :precision="2" :step="0.01">
            </el-input-number>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="weighingDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleUpdateWeighingInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改订单差价-->
    <el-dialog title="修改订单差价"
               :visible.sync="moneyDialogVisible"
               width="40%">
      <div class="table-layout">
        <el-row>
          <el-col :span="24" class="table-cell">
            <el-input-number v-model="moneyInfo.totalActualPayment" size="mini"
                             controls-position="right" :precision="2" :step="0.01">
              <template slot="prepend">￥</template>
            </el-input-number>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="moneyDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleUpdateMoneyInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="发送站内信"
               :visible.sync="messageDialogVisible"
               width="40%">
      <el-form :model="message"
               ref="receiverInfoForm"
               label-width="150px">
        <el-form-item label="标题：">
          <el-input v-model="message.title" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <el-input v-model="message.content" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="messageDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSendMessage">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="关闭订单"
               :visible.sync="closeDialogVisible"
               width="40%">
      <el-form :model="closeInfo"
               label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="closeInfo.note" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCloseOrder">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="线下补差价信息"
               :visible.sync="payOffsetMoneyOffLineDialogVisible"
               width="40%">
     <span>需补差价金额：{{order.payment - order.actualPayment}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="payOffsetMoneyOffLineDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlePayOffLineMoney">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="备注订单"
               :visible.sync="markOrderDialogVisible"
               width="40%">
      <el-form :model="markInfo"
               label-width="150px">
        <el-form-item label="操作备注：">
          <el-input v-model="markInfo.note" type="textarea" rows="3">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="markOrderDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleMarkOrder">确 定</el-button>
      </span>
    </el-dialog>
    <logistics-dialog v-model="logisticsDialogVisible"></logistics-dialog>
  </div>
</template>
<script>
    import {
        orderDetail,
        updateReceiverInfo,
        updateMoneyInfo,
        closeOrder,
        updateOrderNote,
        deleteOrder,
        orderUpdateReceiverInfo,
        confirmReceiveGood,
        delivery,
        shortage,
      payOffsetMoneyOffLine
    } from '../../../api/order';
    import LogisticsDialog from '@/views/oms/order/components/logisticsDialog';
    import {formatDate} from '@/utils/date';
    import VDistpicker from 'v-distpicker';

    const defaultReceiverInfo = {
        orderId: null,
        orderItemId: null,
        totalActualPayment: null
    };
    export default {
        name: 'orderDetail',
        components: {VDistpicker, LogisticsDialog},
        data() {
            return {
                id: null,
                order: {},
                receiverDialogVisible: false,
                receiverInfo: Object.assign({}, defaultReceiverInfo),
                moneyDialogVisible: false,
                weighingDialogVisible: false,
                moneyInfo: {orderId: null, orderItemId: null, totalActualPayment: 0, actualWeighing: 0},
                messageDialogVisible: false,
                message: {title: null, content: null},
                closeDialogVisible: false,
                closeInfo: {note: null, id: null},
                markOrderDialogVisible: false,
                markInfo: {note: null},
                logisticsDialogVisible: false,
                payOffsetMoneyOffLineDialogVisible: false
            }
        },
        created() {
            this.id = this.list = this.$route.query.id;
            orderDetail(this.id).then(response => {
                console.log('orderDetail', response)
                this.order = response.data;
            });
        },
        filters: {
            formatNull(value) {
                if (value === undefined || value === null || value === '') {
                    return '暂无';
                } else {
                    return value;
                }
            },
            formatLongText(value) {
                if (value === undefined || value === null || value === '') {
                    return '暂无';
                } else if (value.length > 8) {
                    return value.substr(0, 8) + '...';
                } else {
                    return value;
                }
            },
            formatRefundType(value) {
                if (value === 0) {
                    return '退差价'
                } else {
                    return '补差价'
                }
            },
            formatPayType(value) {
                if (value === 1) {
                    return '在线支付';
                }
            },
            formatSourceType(value) {
                return '小程序';
                if (value === 1) {
                    return 'APP订单';
                } else {
                    return 'PC订单';
                }
            },
            formatOrderType(value) {
                if (value === 1) {
                    return '秒杀订单';
                } else {
                    return '正常订单';
                }
            },
            formatAddress(order) {
                let str = order.receiverProvince;
                if (order.receiverCity != null) {
                    str += "  " + order.receiverCity;
                }
                str += "  " + order.receiverDistrict;
                str += "  " + order.receiverAddress;
                return str;
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
            formatPayStatus(value) {
                if (value === 0) {
                    return '未支付';
                } else if (value === 4) {
                    return '已退款';
                } else {
                    return '已支付';
                }
            },
            formatDeliverStatus(value) {
                if (value === 0 || value === 1) {
                    return '未发货';
                } else {
                    return '已发货';
                }
            },
            formatProductAttr(value) {
                if (value == null) {
                    return '';
                } else {
                    let attr = JSON.parse(value);
                    let result = '';
                    for (let i = 0; i < attr.length; i++) {
                        result += attr[i].key;
                        result += ":";
                        result += attr[i].value;
                        result += ";";
                    }
                    return result;
                }
            }
        },
        methods: {
          handlePayOffLineMoney(){
            payOffsetMoneyOffLine(this.order.id).then(()=>{
              orderDetail(this.id).then(response => {
                this.order = response.data;
              });
              this.payOffsetMoneyOffLineDialogVisible = false;
            })
          },
            onSelectRegion(data) {
                this.receiverInfo.receiverProvince = data.province.value;
                this.receiverInfo.receiverCity = data.city.value;
                this.receiverInfo.receiverRegion = data.area.value;
            },
            formatTime(time) {
                if (time == null || time === '') {
                    return '';
                }
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
            },
            formatStepStatus(value) {
                if (value === 1) {
                    //待发货
                    return 2;
                } else if (value === 2) {
                    //已发货
                    return 3;
                } else if (value === 5) {
                    //已完成
                    return 4;
                } else {
                    //待付款、已关闭、无限订单
                    return 1;
                }
            },
            showUpdateReceiverDialog() {
                this.receiverDialogVisible = true;
                this.receiverInfo = {
                    orderId: this.order.id,
                    receiverName: this.order.receiverName,
                    receiverPhone: this.order.receiverPhone,
                    receiverPostCode: this.order.receiverPostCode,
                    receiverDetailAddress: this.order.receiverDetailAddress,
                    receiverProvince: this.order.receiverProvince,
                    receiverCity: this.order.receiverCity,
                    receiverRegion: this.order.receiverRegion,
                    status: this.order.status
                }
            },
            handleUpdateReceiverInfo() {
                this.$confirm('是否要修改收货信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    orderUpdateReceiverInfo(this.receiverInfo).then(response => {
                        this.receiverDialogVisible = false;
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        orderDetail(this.id).then(response => {
                            this.order = response.data;
                        });
                    });
                });
            },
            showUpdateWeighingDialog(data) {
                this.weighingDialogVisible = true;
                this.moneyInfo.orderId = this.order.id;
                this.moneyInfo.orderItemId = data.id;
            },
            handleUpdateWeighingInfo() {
                this.$confirm('是否要修改商品重量?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    orderUpdateReceiverInfo({
                        orderId: this.moneyInfo.orderId,
                        orderItemId: this.moneyInfo.orderItemId,
                        actualWeighing: this.moneyInfo.actualWeighing
                    },).then(response => {
                        this.weighingDialogVisible = false;
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        orderDetail(this.id).then(response => {
                            this.order = response.data;
                        });
                    });
                });
            },
            // 订单缺货通知
            showShortage(data) {
                this.$confirm('是否发送缺货通知?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = {
                        orderId: this.id,
                        orderItemId: data.id,
                        totalActualPayment: data.totalActualPayment,
                        actualWeighing: data.actualWeighing
                    };
                    shortage(param).then(response => {
                        this.$message({
                            type: 'success',
                            message: '修缺货通知发送成功!'
                        });
                    })
                });
            },

            showUpdateMoneyDialog(data) {
                this.moneyDialogVisible = true;
                this.moneyInfo.orderId = this.order.id;
                this.moneyInfo.orderItemId = data.id;
            },

            handleUpdateMoneyInfo() {
                this.$confirm('是否要修改费用信息?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    orderUpdateReceiverInfo({
                        orderId: this.moneyInfo.orderId,
                        orderItemId: this.moneyInfo.orderItemId,
                        totalActualPayment: this.moneyInfo.totalActualPayment
                    }).then(response => {
                        this.moneyDialogVisible = false;
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        orderDetail(this.id).then(response => {
                            this.order = response.data;
                        });
                    });
                });
            },
            showMessageDialog() {
                this.messageDialogVisible = true;
                this.message.title = null;
                this.message.content = null;
            },
            handleSendMessage() {
                this.$confirm('是否要发送站内信?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.messageDialogVisible = false;
                    this.$message({
                        type: 'success',
                        message: '发送成功!'
                    });
                });
            },
            showCloseOrderDialog() {
                this.closeDialogVisible = true;
                this.closeInfo.note = null;
                this.closeInfo.id = this.id;
            },
            handleCloseOrder() {
                this.$confirm('是否要关闭?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    closeOrder(this.order.id).then(response => {
                        this.closeDialogVisible = false;
                        this.$message({
                            type: 'success',
                            message: '订单关闭成功!'
                        });
                        orderDetail(this.id).then(response => {
                            this.order = response.data;
                        });
                    });
                });
            },
            handleDeliveryOrder() {
                delivery([this.order.id]).then(response => {
                    this.$message({
                        message: '发货成功',
                        type: 'success',
                        duration: 1000
                    });
                    orderDetail(this.id).then(response => {
                        this.order = response.data;
                    });
                })
            },

            showMarkOrderDialog() {
                this.markOrderDialogVisible = true;
                this.markInfo.id = this.id;
                this.closeOrder.note = null;
            },
            handleMarkOrder() {
                this.$confirm('是否要备注订单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = new URLSearchParams();
                    params.append("id", this.markInfo.id);
                    params.append("note", this.markInfo.note);
                    params.append("status", this.order.status);
                    updateOrderNote(params).then(response => {
                        this.markOrderDialogVisible = false;
                        this.$message({
                            type: 'success',
                            message: '订单备注成功!'
                        });
                        orderDetail(this.id).then(response => {
                            this.order = response.data;
                        });
                    });
                });
            },
            handleDeleteOrder() {
                this.$confirm('是否要进行该删除操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = new URLSearchParams();
                    params.append("ids", [this.id]);
                    deleteOrder(params).then(response => {
                        this.$message({
                            message: '删除成功！',
                            type: 'success',
                            duration: 1000
                        });
                        this.$router.back();
                    });
                })
            },
            showLogisticsDialog() {
                // 确认收货
                confirmReceiveGood(this.order.id).then(
                    response => {
                        this.$message({
                            message: '确认收货成功',
                            type: 'success',
                            duration: 1000
                        });
                    }
                )
            }
        }
    }
</script>
<style scoped>
  .detail-container {
    width: 80%;
    padding: 20px 20px 20px 20px;
    margin: 20px auto;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px 0;
    line-height: 80px;
  }

  .operate-button-container {
    float: right;
    margin-right: 20px
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>


