<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :names="nameList"></breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <template>
        <el-table
          :data="rightsData"
          stripe
          style="width: 100%"
          border
          class="rightsTable"
          :cell-style="rowStyle"
          :header-cell-style="headStyle"
        >
          <el-table-column label="#" type="index"> </el-table-column>
          <el-table-column prop="authName" label="权限名称"> </el-table-column>
          <el-table-column prop="path" label="路径"> </el-table-column>
          <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
              <!-- 权限tag组件 -->
              <rights-tag :level="scope.row.level"></rights-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
import RightsTag from './RightsTag.vue'
import { getRightsRequest } from '@/api/power.js'
export default {
  components: { RightsTag, Breadcrumb },
  data() {
    return {
      rightsData: [],
      nameList: ['权限管理', '权限列表']
    }
  },
  created() {
    // console.log('this is rights')
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      const { data: res } = await getRightsRequest()
      // console.log(res)
      this.rightsData = res.data
    },
    // 表格样式
    rowStyle() {
      return 'text-align:center'
    },
    headStyle() {
      return 'text-align:center'
    }
  }
}
</script>

<style lang="less" scoped></style>
