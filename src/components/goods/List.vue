<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :names="breadcrumbData"></breadcrumb>
    <el-card>
      <!-- 搜索&添加商品 -->
      <div>
        <!-- 搜索区域 -->
        <el-input
          placeholder="请输入内容"
          v-model="queryInfo.query"
          :clearable="true"
          style="width: 30%"
          @clear="getGoodsList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getGoodsList"
          ></el-button>
        </el-input>
        <!-- 添加商品按钮 -->
        <el-button type="primary" class="btn" @click="goAddPage"
          >添加商品</el-button
        >
      </div>
      <!-- 表格区域 -->
      <el-table :data="goodsList" stripe border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          width="400px"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格（元）">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量">
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.add_time }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteGoods(scope.row)"
              circle
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationStyle">
        <!-- 系统给的事件size-change... 触发函数不要写参数 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[10, 20, 40, 80]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="theNumOfGoods"
          background
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
import Breadcrumb from '../Breadcrumb/Breadcrumb.vue'
import { getGoodsListRequest, deleteGoodsRequest } from '@/api/goods.js'
export default {
  components: { Breadcrumb },
  created() {
    this.getGoodsList()
  },
  data() {
    return {
      // 面包屑数据
      breadcrumbData: ['商品管理', '商品列表'],
      //   查询商品列表所需参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      theNumOfGoods: 0,
      //   商品表格数据
      goodsList: [],
      //   搜索的内容
      searchContent: ''
    }
  },
  methods: {
    //   获取商品列表
    async getGoodsList() {
      const { data: res } = await getGoodsListRequest(this.queryInfo)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      } else {
        res.data.goods.forEach(item => {
          item.add_time = new Date(item.add_time).toLocaleString()
        })
        this.theNumOfGoods = res.data.total
        this.goodsList = res.data.goods
        //   console.log(res.data)
        this.$message.success('获取商品列表成功')
      }
      //   var date = new Date(1492665265000).toLocaleString()
    },
    // 删除商品
    deleteGoods(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await deleteGoodsRequest(row.goods_id)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败')
          } else {
            //   删除成功 刷新列表
            this.getGoodsList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      //   console.log(row)
    },
    // 分页 当前页码改变
    handleCurrentChange(newPageNum) {
      //   console.log(typeof this.queryInfo.pagenum)
      //   console.log(newPageNum)
      this.queryInfo.pagenum = newPageNum
      //   console.log(this.queryInfo)
      this.getGoodsList()
    },
    // 分页 当前页面大小改变
    handleSizeChange(newPageSize) {
      //   console.log(newPageSize)
      this.queryInfo.pagesize = newPageSize
      this.getGoodsList()
    },
    // 跳转到添加商品页面
    goAddPage() {
      this.$router.push('/goods/add')
    }
  },
  filters: {}
}
</script>

<style lang="less" scoped>
.btn {
  margin-left: 1.2rem;
}
.paginationStyle {
  display: flex;
  justify-content: center;
}
</style>
