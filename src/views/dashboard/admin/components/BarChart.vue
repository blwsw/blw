<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    chartData: {
      type: Array,
      required: true
    },
    weeks:{
      type:Array,
      defaults:["星期一","星期二"]
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    setOptions(chartData) {
      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.weeks,//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle:{
              color:'#5154de',
              width: 1,
              type: 'dotted'
            }
          },
          splitArea : {show : false}//保留网格区域
        }],
        series: [{
          name: '正常',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: chartData[0],//[79, 52, 200, 334, 390, 330, 220],
          animationDuration,
          itemStyle: {
            //通常情况下：
            normal: {
              //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: "#65d186",
            },
          }
        },{
          name: '故障',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: chartData[3],//[79, 52, 200, 334, 390, 330, 220],
          animationDuration,
          itemStyle: {
            //通常情况下：
            normal: {
              //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: "#e0d405",
            },
          }
        }, {
          name: '预警',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data:chartData[1],//[80, 52, 200, 334, 390, 330, 220],
          animationDuration,
          itemStyle: {
            //通常情况下：
            normal: {
              //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color:"#F19433",
            },
          }
        }, {
          name: '报警',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: chartData[2],//[30, 52, 200, 334, 390, 330, 220],
          animationDuration,
          itemStyle: {
            //通常情况下：
            normal: {
              //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: "#E93F33",
            },
          }
        }]
      })
    }
  }
}
</script>
