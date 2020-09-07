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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Array,
      required: true
    },
    azcount:{
      type:Number,
      default:0
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
      this.setOptions(this.chartData,null);
    },
    setOptions(picChartData,legendData){
      if(!legendData){
        legendData = ['正常', '故障', '报警', '预警'];
      }
      this.chart.setOption({
        title: {
          text: '系统状态图',
          subtext: '总台数'+this.azcount+"台",
          left: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: legendData
        },
        series: [
          {
            name: '系统状态',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 90],
            center: ['50%', '50%'],
            data: picChartData,
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
            label:{
              normal:{
                show: true,
                formatter: '{b} : {c} ({d}%)'
                //position: 'center',
                //color:'#4c4a4a',
              }
            }
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
