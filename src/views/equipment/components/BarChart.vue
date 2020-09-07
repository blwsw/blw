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
      default: '200px'
    }
  },
  data() {
    return {
      chart: null
    }
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
      /**
       * title : 标题

       tooltip : 提示框组件

       legend : 图例组件

       xAxis : 直角坐标轴中的 x 轴

       yAxis : 直角坐标轴中的 y 轴

       series : 系列列表。每个系列通过 type 决定自己的图表类型
       */
      this.chart.setOption({
        title:{
          text: '2.14',
          subtext: '',
          left: 'left',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data:['正常','故障','报警','预警']
        },
        grid: {
          top: 28,
          left: '0',
          right: '5px',
          bottom: '5px',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data:['正常','故障','报警','预警'],
          axisTick: {
            alignWithLabel: false
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: true
          }
        }],
        series: [{
          name: '数量',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          //data: [79, 0, 0, 0],
          data: [
            { value: 320, name: '正常' },
            { value: 240, name: '故障' },
            { value: 149, name: '报警' },
            { value: 100, name: '预警' },
          ],
          animationDuration,
          itemStyle: {
            //通常情况下：
            normal: {
              //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
              color: function(params) {
                var colorList = [
                  "#65d186",
                  "#f29e3c",
                  "#f67287",
                  "#f29e3c",
                  "#f67287"
                ]; //每根柱子的颜色
                return colorList[params.dataIndex];
              }
            },
          }
        }
        // , {
        //   name: '故障',
        //   type: 'bar',
        //   stack: 'vistors',
        //   barWidth: '60%',
        //   data: [0, 52,0, 0],
        //   animationDuration
        // }, {
        //   name: '报警',
        //   type: 'bar',
        //   stack: 'vistors',
        //   barWidth: '60%',
        //   data: [0, 0, 20,0],
        //   animationDuration
        // }, {
        //     name: '预警',
        //     type: 'bar',
        //     stack: 'vistors',
        //     barWidth: '60%',
        //     data: [0, 0, 0,100],
        //     animationDuration
        //   }
        ]
      })
    }
  }
}
</script>
