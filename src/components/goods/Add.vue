<template>
  <div>
    <!-- 面包屑 -->
    <breadcrumb :names="breadcrumbData"></breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 警告 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :active="active"
        finish-status="success"
        class="steps_style"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签页 -->
      <el-tabs
        tab-position="left"
        class="tabs_style"
        :value="activePane"
        @tab-click="tabChanged"
      >
        <el-tab-pane label="基本信息" :name="'0'">用户管理</el-tab-pane>
        <el-tab-pane label="商品参数" :name="'1'">配置管理</el-tab-pane>
        <el-tab-pane label="商品属性" :name="'2'">角色管理</el-tab-pane>
        <el-tab-pane label="商品图片" :name="'3'">定时任务补偿</el-tab-pane>
        <el-tab-pane label="商品内容" :name="'4'">定时任务补偿</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from '../Breadcrumb/Breadcrumb.vue'
export default {
  components: {
    Breadcrumb
  },
  data() {
    return {
      breadcrumbData: ['商品列表', '添加商品'],
      // 当前激活的步骤
      active: 0,
      // 当前激活的面板
      activePane: '0'
    }
  },
  methods: {
    //
    tabChanged(tab) {
      console.log(tab)
      this.activePane = tab.index
      this.active = this.activePane - ''
    }
  }
}
</script>

<style lang="less" scoped>
.steps_style {
  margin-top: 30px;
}
.tabs_style {
  height: 200px;
  margin-top: 20px;
}
</style>
