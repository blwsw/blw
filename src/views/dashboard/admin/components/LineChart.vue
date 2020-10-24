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
      type: Object,
      required: true
    },
    weeks:{
      type:Array,
      defaults:["星期一","星期二"]
    }
  },
  data() {
    return {
      chart: null,
      lineChartData: {
        expectedData:[0, 0, 0, 0, 0, 0, 0],
        actualData:[0, 0, 0, 0, 0, 0, 0]
      },
      azcount:0,
      reals:[],
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
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        title: {
          text: '近7天状态折线图',
          subtext: '',
          left: 'left',
          textStyle: {
            fontSize: 16,
          },
        },
        xAxis: {
          data: this.weeks,//['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['警报数', '雷击数']
        },
        series: [{
          name: '警报数', itemStyle: {
            normal: {
              color: '#FF005A',
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          smooth: true,
          type: 'line',
          data: expectedData,
          animationDuration: 2800,
          animationEasing: 'cubicInOut'
        },
        {
          name: '雷击数',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: actualData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    },
    appendData(data){//近一周状况
      var context = this;

      for(var i=0;i<this.dataweek.length;i++){
        var days = this.dataweek[i];
        this.reals = this.reals.map((item)=>{
          let daye = context.getDayByTime(item.In_Time);

          if( days == daye){
            //故障标志位，T有故障，F无故障，D离线
            if(item.ErrFlag == 'T'){
              context.lineChartData.expectedData[i] ++;
            }
            if(item.TTime){
              context.lineChartData.actualData[i] +=item.TTime;
            }
            //01预警
            if(item.ErrThunder=='01' ||item.ErrLeihua=='01' ||item.ErrLC1=='01' ||item.ErrLC2=='01' ||
              item.ErrTemp=='01' || item.ErrLC3=='01'
            ){
              context.lineChartData.expectedData[i] ++;
            }

            //10预警
            if(item.ErrThunder=='10' ||item.ErrLeihua=='10' ||item.ErrLC1=='10' ||item.ErrLC2=='10' ||
              item.ErrTemp=='10' || item.ErrLC3=='10'
            ){
              context.lineChartData.expectedData[i] ++;
            }
            console.log(context.lineChartData)
            this.setOptions(context.lineChartData)
          }
          return item;
        });
      }
      this.lineChartData = context.lineChartData;
      console.log(this.dataweek);
      console.log(this.reals);
      console.log(this.lineChartData);

    },
    doHandleMonth(month) {
      var m = month;
      if (month.toString().length == 1) {
        m = "0" + month;
      }
      return m;
    },
    getDayByTime(inTime){
      var today = new Date(inTime);
      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();
      tMonth = this.doHandleMonth(tMonth + 1);
      tDate =  this.doHandleMonth(tDate);
      return tYear+"-"+tMonth+"-"+tDate;
    },
  }
}
</script>
