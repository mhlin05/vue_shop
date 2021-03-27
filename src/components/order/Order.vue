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
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button
              type="success"
              icon="el-icon-location-outline"
              circle
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
  </div>
</template>

<script>
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
      orderTableData: []
    }
  }
}
</script>

<style lang="less" scoped>
.el-pagination {
  display: flex;
  justify-content: center;
}
</style>
