<template>
  <div>
    <breadcrumb :names="breadCrumbData"></breadcrumb>
    <el-card>
      <!-- 查询订单区域 -->
      <el-input
        placeholder="请输入查询内容"
        v-model="queryInfo.query"
        class="input-with-select"
        style="width: 400px"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <!-- 表格区域 -->
      <el-table :data="orderTableData" stripe border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="180">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="180">
        </el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <span v-if="scope.order_pay === 1">
              <el-tag type="info">已付款</el-tag>
            </span>
            <span v-else>
              <el-tag type="danger">未付款</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="是否发货">
          <template slot-scope="scope"
            ><span v-if="scope.is_send === 1">是</span>
            <span v-else>否</span></template
          >
        </el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | datefilter }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改地址 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="addressDialogVisible = true"
            ></el-button>
            <!-- 展示物流按钮 -->
            <el-button
              type="success"
              icon="el-icon-location-outline"
              circle
              @click="showLogistics()"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressDialogVisible"
      width="50%"
    >
      <el-form
        :model="addressFormData"
        :rules="addressRules"
        ref="addressRuleForm"
        class="demo-ruleForm"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressFormData.address1"
          ></el-cascader>
          <!-- <el-input v-model="addressFormData.address1"></el-input> -->
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressFormData.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 展示物流对话框 -->
    <el-dialog
      title="物流信息"
      :visible.sync="logisticsDialogVisible"
      wiDth="50%"
    >
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(item, index) in logisticsData"
          :key="index"
          :timestamp="item.timestamp"
        >
          {{ item.content }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata'
import Breadcrumb from '../Breadcrumb/Breadcrumb.vue'
export default {
  components: { Breadcrumb },
  created() {
    this.getOrderList()
  },
  methods: {
    //   处理分页 页面大小改变
    handleSizeChange(size) {
      this.queryInfo.pagesize = size
      this.getOrderList()
    },
    // 处理分页 当前页改变
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum
      this.getOrderList()
    },
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      console.log(res)
      this.orderTableData = res.data.goods
      this.total = res.data.total
    },
    async showLogistics() {
      // 显示对话框
      this.logisticsDialogVisible = true
      // 获取物流数据
    }
  },
  data() {
    return {
      // 面包屑
      breadCrumbData: ['订单管理', '订单列表'],
      // 查询数据
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      //   订单数据
      orderTableData: [],
      // 修改地址 对话框
      addressDialogVisible: false,
      addressFormData: {
        address1: [],
        address2: ''
      },
      // 获取省市区/县数据
      cityData,
      addressRules: {
        address1: [
          { required: true, message: '请输入省市区/县', trigger: 'change' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      // 显示 展示物流对话框
      logisticsDialogVisible: false,
      // 物流数据
      logisticsData: [
        {
          content: '揽收',
          timestamp: '2018-04-15'
        },
        {
          content: '运输中',
          timestamp: '2018-04-13'
        },
        {
          content: '签收',
          timestamp: '2018-04-11'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.el-pagination {
  display: flex;
  justify-content: center;
}
.el-cascader {
  width: 100%;
}
</style>
