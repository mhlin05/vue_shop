<template>
  <div>
    <el-table :data="tableData" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column
        v-for="(item, index) in tableInfo.label_prop"
        :key="index"
        :label="item.label"
        :prop="item.prop"
      >
      </el-table-column>
      <!-- 状态栏 -->
      <el-table-column v-if="tableInfo.state === true" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="changeSwitchState(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <!-- 操作栏 -->
      <el-table-column v-if="tableInfo.operate === true" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showModifyDialog(scope.row)"
          ></el-button>
          <!-- 删除用户按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteUser(scope.row.id)"
          ></el-button>
          <!-- 分配角色按钮 -->
          <el-tooltip
            effect="dark"
            content="分配角色"
            placement="top-start"
            :enterable="false"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRoleDialogVisible(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    //   表单表头等信息
    tableInfo: {
      type: Object,
      default: () => {}
    },
    // 表格的数据
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {
    async changeSwitchState(row) {
      //   console.log(row)
      this.$emit('switchStateChanged', row)
    }
  }
}
</script>

<style lang="less" scoped></style>
