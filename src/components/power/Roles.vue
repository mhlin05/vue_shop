<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :names="nameList"></breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色区域 -->
      <div class="btnStyle">
        <el-button type="primary">添加角色</el-button>
      </div>
      <!-- 角色列表区域 -->
      <div>
        <el-table :data="rolesData" stripe style="width: 100%" border>
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row
                v-for="(item, index) in scope.row.children"
                :key="item.id"
                :class="['line_bottom', index === 0 ? 'line_top' : '']"
              >
                <!-- 一级权限 -->
                <el-col :span="5">
                  <el-tag>{{ item.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二级权限 -->
                <el-col :span="19">
                  <el-row
                    v-for="(item2, index2) in item.children"
                    :key="item2.id"
                  >
                    <el-col
                      ><el-tag type="success">
                        {{ item2.authName }}
                        <i class="el-icon-caret-right"></i> </el-tag
                    ></el-col>
                    <el-col></el-col>
                  </el-row>

                  <!-- <el-tag
                    type="warning"
                    v-for="(item3, index3) in item.children"
                    :key="item3.id"
                  >
                    {{ item3.authName }}
                  </el-tag> -->
                </el-col>
              </el-row>
              <pre>
                      {{ scope.row }}
                  </pre
              >
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column label="#" type="index"> </el-table-column>
          <el-table-column prop="roleName" label="角色名称"> </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
          <el-table-column label="操作" width="400px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete">删除</el-button>
              <el-button type="warning" icon="el-icon-setting"
                >分配权限</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.vue'
export default {
  created() {
    this.getRolesData()
  },
  components: {
    Breadcrumb
  },
  data() {
    return {
      nameList: ['权限管理', '角色列表'],
      rolesData: []
    }
  },
  methods: {
    async getRolesData() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesData = res.data
      //   console.log(res.data)
    }
  }
}
</script>

<style lang="less" scoped>
.btnStyle {
  display: flex;
  align-items: flex-start;
}
.el-tag {
  margin: 7px;
}

.line_top {
  border-top: 1px solid #eee;
}
.line_bottom {
  border-bottom: 1px solid #eee;
}
</style>
