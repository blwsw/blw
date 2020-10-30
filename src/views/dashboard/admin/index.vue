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
          <bar-chart :chart-data="barChart222" :weeks="weeks" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper" style="width: 100%;">
          <div style="margin: 0px 0px 5px 20px;color: #279cd5;"> 设备巡检状态 </div>
          <el-table id="tableList" height="278px" :data="reals" border fit highlight-current-row style="width: 100%;" ref="tablelist">
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
import {fetchEvent} from "@/api/article";


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
        // { value: 0, name: '故障',itemStyle:{color:"#f29e3c"} },
        // { value: 0, name: '报警' ,itemStyle:{color:"#f67287"}},
       // { value: 0, name: '正常' ,itemStyle:{color:"#3567EF"}},
        { value: 0, name: '故障',itemStyle:{color:"#e0d405"} },
        { value: 0, name: '预警' ,itemStyle:{color:"#F19433"}},
        { value: 0, name: '报警' ,itemStyle:{color:"#E93F33"}},
      ],
      barChart:[
        [0, 0, 0,0, 0, 0, 0],//正常
        [0, 0, 0,0, 0, 0, 0],//故障
        [0, 0, 0,0, 0, 0, 0],//预警
        [0, 0, 0,0, 0, 0, 0]//报警
      ],
      barChart222:[],
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
      ],
      historyData:[],
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
         console.log('new',newValue)
        // console.log('old',oldValue)
        this.reals = newValue;
        this.appendData(newValue);
      },
      deep: true
    }
  },
  mounted() {

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
    dataInit(){
      this.pieChartData=[
        { value: 0, name: '正常' ,itemStyle:{color:"#65d186"}},
        { value: 0, name: '故障',itemStyle:{color:"#e0d405"} },
        { value: 0, name: '预警' ,itemStyle:{color:"#F19433"}},
        { value: 0, name: '报警' ,itemStyle:{color:"#E93F33"}},
      ];
      this.lineChartData.expectedData =this.expectedData;
      this.barChart222 = this.barChart;

      this.lineChartData ={
        expectedData:[0, 0, 0, 0, 0, 0, 0],
          actualData:[0, 0, 0, 0, 0, 0, 0]
      },
        this.expectedData=[0, 0, 0, 0, 0, 0, 0],
        this.actualData=[0, 0, 0, 0, 0, 0, 0],

        this.barChart = [
        [0, 0, 0,0, 0, 0, 0],
        [0, 0, 0,0, 0, 0, 0],
        [0, 0, 0,0, 0, 0, 0],
         [0, 0, 0,0, 0, 0, 0]
      ], this.barChart222=[];
    },
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
      //var fdate = this.getDayByTime(item.In_Time);
      var i=6;
      // for(var i=0;i<this.dataweek.length;i++){
      //   var days = this.dataweek[i];
      //   if(days== fdate){
          this.actualData[i]+=item.TTime;
          //故障标志位，T有警报，F无故障，D离线故障
          if(item.ErrFlag == 'F'){
            this.barChart[0][i]++;
          }
          if(item.ErrFlag == 'D'){

            this.barChart[3][i]++;
          }else if(item.ErrFlag == 'T'){
            //01预警
            if(item.ErrThunder=='01' ||item.ErrLeihua=='01' ||item.ErrLC1=='01' ||item.ErrLC2=='01' ||
              item.ErrTemp=='01' || item.ErrLC3=='01'
            ){
              this.barChart[1][i]++;
              this.expectedData[i] ++;
            }

            //10报警
            if(item.ErrThunder=='10' ||item.ErrLeihua=='10' ||item.ErrLC1=='10' ||item.ErrLC2=='10' ||
              item.ErrTemp=='10' || item.ErrLC3=='10' || item.Switch1 =='1' || item.Switch2 =='1' || item.Switch3 =='1' || item.Switch4 =='1'
            ){
              this.barChart[2][i]++;
              this.expectedData[i] ++;
            }
          }
      //   }
      // }
      this.lineChartData.actualData =this.actualData;
      this.lineChartData.expectedData =this.expectedData;
      this.barChart222 = this.barChart;
    },
    getStateColor(code,yj){
      //{code:"00",value:"正常"},
      //{code:"01",value:"预警"},
      //{code:"10",value:"报警"},
      if(code == "F"){
        return "#65d186";
      }
      if(code == "D"){
        return "#e0d405";
      }
      if(code == "T"){
        if(yj =="01"){
          return "#F19433";
        }
        if(yj =="10"){
          return "#E93F33";
        }
      }
    },
    appendData(data){//近一周状况
      this.dataInit();
      var context = this;
      context.azcount= this.reals.length;
      this.reals = this.reals.map((item)=>{

        context.getTTimeCount(item);

        //totalList计算total
        //故障标志位，T有警报，F无故障，D离线=故障
        if(item.ErrFlag == 'F'){
          context.pieChartData[0].value ++;
        }
        if(item.ErrFlag == 'T'){
            //01预警
            if(item.ErrThunder=='01' ||item.ErrLeihua=='01' ||item.ErrLC1=='01' ||item.ErrLC2=='01' ||
              item.ErrTemp=='01' || item.ErrLC3=='01'
            ){
              context.pieChartData[2].value ++;
              item.YJ="01";
            }

            //10报警
            if(item.ErrThunder=='10' ||item.ErrLeihua=='10' ||item.ErrLC1=='10' ||item.ErrLC2=='10' ||
              item.ErrTemp=='10' || item.ErrLC3=='10' || item.Switch1 =='1' || item.Switch2 =='1' || item.Switch3 =='1' || item.Switch4 =='1'
            ){
              context.pieChartData[3].value ++;
              item.YJ="10";
            }
        }
        if(item.ErrFlag == 'D'){
          context.pieChartData[1].value ++;
        }else{
          // context.zxcount++;
        }
        // context.azcount++;
        item.colorss = this.getStateColor(item.ErrFlag,item.YJ);
        item.ErrLeihuaStatusName = this.getStatusName(item.ErrFlag,item.YJ);
        return item;
      });
      this.getHistory();
    },
    getStatusName(code,yj){
      if(!code){
        return "未知";
      }
      let statusName = code;
      if(code == "F"){
        return "正常";
      }
      if(code == "D"){
        return "故障";
      }
      if(code == "T"){
        if(yj =="01"){
          return "预警";
        }
        if(yj =="10"){
          return "报警";
        }
      }
      return statusName;
    },
    getHistory(){
      if(this.historyData.length >0){
        this.hisData(this.historyData);
      }else{
        this.loading = true
        var obj = {
          url: 'get/history/tj/count',
          data: {
            currentPage:1,
            pageSize:10000
          }
        }
        var context = this;
        fetchEvent(obj).then(response => {
          context.historyData = response.responseBody;
          context.hisData(response.responseBody);
        })
      }
    },
    hisData(hisData){
      console.log(hisData);
     var barChart=
       [
        [0, 0, 0,0, 0, 0, this.barChart[0][6]],//正常
        [0, 0, 0,0, 0, 0, this.barChart[1][6]],//故障
        [0, 0, 0,0, 0, 0, this.barChart[2][6]],//预警
        [0, 0, 0,0, 0, 0, this.barChart[3][6]]//报警
      ];
      hisData.map((e)=>{
        for(var i=0;i<this.dataweek.length;i++) {
          var days = this.dataweek[i];
          if (days == e.In_Time) {
            this.actualData[i]=e.TTime;
            barChart[0][i]=e.zccount;
            barChart[3][i]=e.gzcount;
            barChart[1][i]=e.yjcount;
            barChart[2][i]=e.bjcount;
            this.expectedData[i] +=e.yjcount;
            this.expectedData[i] +=e.bjcount;
          }
        }
      });
      var a = {
        actualData:this.actualData,
        expectedData:this.expectedData
      };
      this.lineChartData =a;
      this.barChart222 = barChart;
    }
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
