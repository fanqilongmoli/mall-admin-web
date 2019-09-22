<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>用户管理</span>

      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="搜索电话号码：">
            <el-input style="width: 203px" v-model="listQuery.phone" placeholder="电话号码"></el-input>
          </el-form-item>
          <el-form-item label="搜索昵称：">
            <el-input style="width: 203px" v-model="listQuery.nickName" placeholder="昵称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              style="float: right;margin-right: 15px"
              @click="handleResetSearch">
              重置
            </el-button>
          </el-form-item>
        </el-form>

      </div>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column label="昵称" align="center">
          <template slot-scope="scope">{{scope.row.nickName|formatNick}}</template>
        </el-table-column>
        <el-table-column label="头像" width="120" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.avatarUrl"></template>
        </el-table-column>
        <el-table-column label="注册时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime|formatNick}}</template>
        </el-table-column>
        <el-table-column label="手机号码" align="center">
          <template slot-scope="scope">{{scope.row.phone|formatNick}}</template>
        </el-table-column>
        <el-table-column label="地区" align="center">
          <template slot-scope="scope">{{scope.row.province|formatNick}}</template>
        </el-table-column>
        <el-table-column label="城市" align="center">
          <template slot-scope="scope">{{scope.row.city|formatNick}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                type="danger"
                @click="sendCoupon(scope.$index, scope.row)">发放微信代金券
              </el-button>
            </p>
            <p>
              <el-button
                size="mini"
                type="danger"
                @click="sendPlatformCoupon(scope.$index, scope.row)">发放平台优惠券
              </el-button>
            </p>
            <p>
              <el-button
                size="mini"
                @click="updatePhone(scope.$index, scope.row)">修改电话号码
              </el-button>
            </p>
            <p>
              <el-button
                size="mini"
                @click="deleteUser(scope.$index, scope.row)">删除
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
        :current-page.sync="listQuery.pageNo"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>

    <el-dialog
      title="发放代金券"
      :visible.sync="couponDialog"
      width="40%">
      <el-form :model="form" ref="couponForm" :rules="rules">
        <el-form-item label="代金券批次id	" prop="coupon_stock_id">
          <el-input v-model="form.coupon_stock_id" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditCancel">取 消</el-button>
        <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="发放平台优惠券"
      :visible.sync="platformCouponDialog"
      width="40%">
      <el-form :model="form" ref="platformCouponForm" :rules="rules">
        <el-form-item label="优惠券编号	" prop="platform_coupon_id">
          <el-input v-model="form.platform_coupon_id" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handlePlatformCouponCancel">取 消</el-button>
        <el-button type="primary" @click="handlePlatformCouponConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="修改电话号码"
      :visible.sync="phoneDialog"
      width="40%">
      <el-form :model="formPhone" ref="phoneForm" :rules="rulesPhone">
        <el-form-item label="电话号码	" prop="phone">
          <el-input v-model="formPhone.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditPhoneCancel">取 消</el-button>
        <el-button type="primary" @click="handleEditPhoneConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {list, sendCoupon, updatePhone, deleteUser,sendPlatformCoupon} from "../../api/user"
  import {random3} from "../../utils/math"

  const defaultListQuery = {
    pageNo: 1,
    pageSize: 10,
    phone: "",
    nickName: "",
  };

  export default {
    name: "user",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: true,
        list: null,
        total: 0,
        rules: {
          coupon_stock_id: [
            {required: true, message: '请输入代金券批次id', trigger: 'blur'},
          ]
        },
        rulesPhone: {
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
          ]
        },
        form: {
          coupon_stock_id: "",
          platform_coupon_id: "",
        },
        formPhone: {
          phone: ""
        },
        currentUser: null,
        couponDialog: false,
        platformCouponDialog: false,
        phoneDialog: false
      }
    },
    created() {
      this.getUserList();
    },
    filters: {
      formatNick(val) {
        return val ? val : "---";
      }
    },
    methods: {
      getUserList() {
        this.listLoading = true;
        list(this.listQuery).then(
          response => {
            this.listLoading = false;
            this.list = response.data.content;
            this.total = response.data.totalElements
          }
        )
      },
      handleSizeChange(val) {
        this.listQuery.pageNo = 1;
        this.listQuery.pageSize = val;
        this.getUserList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.getUserList();
      },
      handleSelectionChange(val) {

      },
      // 发放优惠券
      sendCoupon(index, val) {
        this.couponDialog = true;
        this.currentUser = val;
      },
      sendPlatformCoupon(index,val){
        this.platformCouponDialog = true;
        this.currentUser = val;
      },
      handlePlatformCouponCancel() {
        this.platformCouponDialog = false;
        this.$refs.platformCouponForm.resetFields();
      },
      handlePlatformCouponConfirm() {
        let param = {
          userId: this.currentUser.id,
          couponId: this.form.platform_coupon_id
        };
        sendPlatformCoupon(param).then(response => {
          this.platformCouponDialog = false;
          this.$refs.platformCouponForm.resetFields();
          this.$message.success("优惠券发送成功")
        })
      },
      handleEditCancel() {
        this.couponDialog = false;
        this.$refs.couponForm.resetFields();

      },
      handleEditSkuConfirm() {

        this.$refs.couponForm.validate((valid) => {

          if (valid) {
            const time = new Date().getTime()
            const partnerTradeNo = `1544021361${time}${random3(6)}`;
            // 发送代金券
            let params = {
              // 代金券批次id
              couponStockId: this.form.coupon_stock_id,
              // openid记录数
              openidCount: 1,
              // 商户此次发放凭据号（格式：商户id+日期+流水号），商户侧需保持唯一性
              partnerTradeNo: partnerTradeNo,
              // 用户openid
              openid: this.currentUser.openid
            };
            sendCoupon(params).then(response => {
              this.couponDialog = false;
              this.$refs.couponForm.resetFields();
              this.$message.success("代金券发成成功")
            })
          }
        });
      },
      updatePhone(index, val) {
        this.phoneDialog = true;
        this.formPhone.phone = val.phone;
        this.currentUser = val;
      },
      handleEditPhoneCancel() {
        this.phoneDialog = false;
        this.$refs.phoneForm.resetFields();
      },
      handleEditPhoneConfirm() {
        let param = {
          id: this.currentUser.id,
          phone: this.formPhone.phone
        }
        updatePhone(param).then(response => {
          this.phoneDialog = false;
          this.$refs.phoneForm.resetFields();
          this.$message.success("修改电话号码成功")
          this.getUserList();
        })
      },
      deleteUser(index, val) {
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(val.id).then(response => {
              this.$message.success("删除用户成功")
              this.getUserList();
            }
          )
        })

      },
      handleSearch() {
        this.listQuery.pageNo = 1;
        this.getUserList();
      },
      handleResetSearch() {
        this.listQuery.phone = "";
        this.listQuery.nickName = "";
        this.getUserList();
      }
    }
  }
</script>

<style scoped>

</style>
