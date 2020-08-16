<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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

      this.chart.setOption({
        title: {
          text: '系统状态图',
          subtext: '',
          left: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['正常', '故障', '报警', '预警']
        },
        series: [
          {
            name: 'WEEKLY WRITE ARTICLES',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: 320, name: '正常' ,itemStyle:{color:"#65d186"}},
              { value: 240, name: '故障',itemStyle:{color:"#f29e3c"} },
              { value: 149, name: '报警' ,itemStyle:{color:"#f67287"}},
              { value: 100, name: '预警' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ],
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
      })
    }
  }
}
</script>
