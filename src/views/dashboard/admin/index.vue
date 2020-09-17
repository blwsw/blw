<template>
  <div class="dashboard-editor-container">
    <!--<github-corner class="github-corner" />-->

    <panel-group @handleSetLineChartData="handleSetLineChartData"  :chart-data="pieChartData" />

    <el-row style="padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" :weeks="weeks" />
    </el-row>

    <el-row :gutter="32">
      <!--<el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>-->
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart :chart-data="pieChartData" :azcount="azcount"  />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper" style="width: 100%;">
          <div style="margin: 0px 0px 5px 20px;color: #279cd5;"> 设备巡检状态 </div>
          <el-table id="tableList" :data="reals" border fit highlight-current-row style="width: 100%;height: 326px;overflow-y: auto;" ref="tablelist">
            <el-table-column
              v-loading="loading"
              align="center"
              label="序号"
              min-width="40px"
              element-loading-text="请给我点时间！"


            >
              <template slot-scope="srow">
                <span  v-bind:style="{color:srow.row.colorss}" > {{srow.$index+1}} </span>
              </template>
            </el-table-column>
            <el-table-column  min-width="50px" label="节点编号" show-overflow-tooltip >
              <template slot-scope="{row}">
                <span v-bind:style="{color:row.colorss}" >{{ row.addr }}</span>
              </template>
            </el-table-column>
            <el-table-column  min-width="50px" label="设备状态" show-overflow-tooltip >
              <template slot-scope="{row}">
                <span v-bind:style="{color:row.colorss}"  >{{ row.ErrLeihuaStatusName }}</span>
              </template>
            </el-table-column>
          </el-table>

        </div>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import {parseTime} from "@/utils";
import store from "@/store";


export default {
  name: 'DashboardAdmin',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard
  },
  data() {
    return {
      lineChartData : {
        expectedData:[0, 0, 0, 0, 0, 0, 0],
        actualData:[0, 0, 0, 0, 0, 0, 0]
      },
      expectedData:[0, 0, 0, 0, 0, 0, 0],
      actualData:[0, 0, 0, 0, 0, 0, 0],
      pieChartData:[
        { value: 0, name: '正常' ,itemStyle:{color:"#65d186"}},
        { value: 0, name: '故障',itemStyle:{color:"#f29e3c"} },
        { value: 0, name: '报警' ,itemStyle:{color:"#f67287"}},
        { value: 0, name: '预警' }
      ],
      azcount:0,
      reals:[],
      dataweek:[],
      weeks:[],
      loading:false,
      //00正常01预警10报警
      status: [
        {code:"",value:"未知"},
        {code:"00",value:"正常"},
        {code:"01",value:"预警"},
        {code:"10",value:"报警"},
      ]
    }
  },
  computed: { //          监听词条
    getRealData(){
      return this.$store.state.app.reals
    }
  },
  watch: {
    getRealData: {
      handler(newValue,oldValue){ //当词条改变时执行事件
        // console.log('new',newValue)
        // console.log('old',oldValue)
        this.reals = newValue;
        this.appendData(newValue);
      }
    }
  },
  mounted() {
    //this.appendData(this.reals);
  },
  created() {
    var day = null;
    for(let i=6;i>=0;i--){
      day = this.getWeek(-i);
      this.dataweek.push(day);
      this.weeks.push("星期"+parseTime(day, '{a}'));
      //this.statusChart[i].date=day;
    }
    this.reals = this.$store.state.app.reals;
    if(!this.relas || this.relas.length ==0){
      this.getReals();
    }

  },
  methods: {
    async getReals(){
      this.relas = await store.dispatch('app/getReals',{reload:true} );
      await store.dispatch('app/setReals', this.relas);
      this.appendData(this.relas);
    },
    getWeek (day) {
      var today = new Date();
      var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
      today.setTime(targetday_milliseconds);
      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();
      tMonth = this.doHandleMonth(tMonth + 1);
      tDate =  this.doHandleMonth(tDate);
      return tYear+"-"+tMonth+"-"+tDate;
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
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    getTTimeCount(item){ //获取雷击数
      //本年月份的雷击次数
      var fdate = this.getDayByTime(item.In_Time);
      for(var i=0;i<this.dataweek.length;i++){
        var days = this.dataweek[i];
        if(days== fdate){
          this.actualData[i]+=item.TTime;
          //故障标志位，T有故障，F无故障，D离线
          if(item.ErrFlag == 'T'){
            this.expectedData[i] ++;
          }

          //01预警
          if(item.ErrThunder=='01' ||item.ErrLeihua=='01' ||item.ErrLC1=='01' ||item.ErrLC2=='01' ||
            item.ErrTemp=='01' || item.ErrLC3=='01'
          ){
            this.expectedData[i] ++;
          }

          //10预警
          if(item.ErrThunder=='10' ||item.ErrLeihua=='10' ||item.ErrLC1=='10' ||item.ErrLC2=='10' ||
            item.ErrTemp=='10' || item.ErrLC3=='10'
          ){
            this.expectedData[i] ++;
          }

        }
      }
      this.lineChartData.actualData =this.actualData;
      this.lineChartData.expectedData =this.expectedData;
    },
    appendData(data){//近一周状况
      var context = this;
      context.azcount= this.reals.length;
      this.reals = this.reals.map((item)=>{
        item.ErrLeihuaStatusName = this.getStatusName(item.ErrLeihua);
        let daye = context.getDayByTime(item.In_Time);
        context.getTTimeCount(item);
        item.colorss = '#65d186';
        //totalList计算total
        //故障标志位，T有故障，F无故障，D离线
        if(item.ErrFlag == 'F'){
          context.pieChartData[0].value ++;
          item.colorss = '#65d186';
        }
        if(item.ErrFlag == 'T'){
          context.pieChartData[1].value ++;
          item.colorss = '#f29e3c';
        }
        if(item.ErrFlag == 'D'){
          // context.totalList[4].count ++;
          item.colorss = '#f67287';
        }else{
          // context.zxcount++;
        }
        // context.azcount++;

        //01预警
        if(item.ErrThunder=='01' ||item.ErrLeihua=='01' ||item.ErrLC1=='01' ||item.ErrLC2=='01' ||
          item.ErrTemp=='01' || item.ErrLC3=='01'
        ){
          context.pieChartData[3].value ++;
        }

        //10预警
        if(item.ErrThunder=='10' ||item.ErrLeihua=='10' ||item.ErrLC1=='10' ||item.ErrLC2=='10' ||
          item.ErrTemp=='10' || item.ErrLC3=='10'
        ){
          context.pieChartData[2].value ++;
        }
        return item;
      });
    },
    getStatusName(incode){
      if(!incode){
        return "未知";
      }
      let statusName = incode;
      this.status.map((s)=>{
        if(s.code == incode){
          statusName = s.value;
          return statusName;
        }
      });
      return statusName;
    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
