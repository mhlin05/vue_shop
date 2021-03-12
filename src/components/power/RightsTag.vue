<template>
  <div>
    <el-tag v-if="level === '0'">一级</el-tag>
    <el-tag type="success" v-else-if="level === '1'">二级</el-tag>
    <el-tag type="warning" v-else>三级</el-tag>
  </div>
</template>

<script>
export default {
  props: ['level']
}
</script>

<style></style>
