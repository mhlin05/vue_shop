<template>
  <div id="main" class="maindd"></div>
</template>

<script>
import * as echarts from 'echarts'
import { getDataRequest } from '@/api/report.js'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  // 这里发现 如果created里面有请求数据函数
  // mounted会比created先执行
  async mounted() {
    // 获取数据
    const { data: res } = await getDataRequest()
    // 准备配置项
    this.options = Object.assign(this.options, res.data)
    console.log(this.options)
    // console.log(this.options)
    // 初始化echart实例
    const myChart = echarts.init(document.getElementById('main'))
    myChart.setOption(this.options)
  }
}
</script>

<style lang="less" scoped>
.maindd {
  width: 100%;
  height: 100%;
}
</style>
