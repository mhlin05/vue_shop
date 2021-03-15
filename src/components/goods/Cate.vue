<template>
  <div>
    <breadcrumb :names="cateBreadCrumbData"> </breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col class="add_btn">
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodCategoriesData" stripe border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="cat_name" label="分类名称" width="180">
        </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效" width="180">
          <template slot-scope="scope">
            <i
              class="el-icon-circle-check"
              v-if="scope.cat_deleted !== false"
            ></i>
            <i class="el-icon-circle-close" v-else></i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序"> </el-table-column>
        <el-table-column label="操作"> </el-table-column>
      </el-table>
      <!-- 分页区域 -->
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '../Breadcrumb/Breadcrumb.vue'

export default {
  components: { Breadcrumb },
  data() {
    return {
      // 面包屑数据
      cateBreadCrumbData: ['商品管理', '商品分类'],
      //   分类数据
      goodCategoriesData: [],
      queryInfo: {
        type: 3,
        //   当前页码
        pagenum: 1,
        //   页面大小
        pagesize: 5
      },
      total: 0
    }
  },
  created() {
    this.getCategoriesData()
  },
  methods: {
    async getCategoriesData() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.goodCategoriesData = res.data.result
      //   总数据条数赋值
      this.total = res.data.total
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
.add_btn {
  display: flex;
  align-items: flex-start;
}
</style>
