<template>
  <div class="dashboard-editor-container">
    <div class="chart-wrapper">
    <div style="margin: 0px 0px 5px 20px;color: #279cd5;"> 设备状态分析 </div>
    <el-row :gutter="0">
      <el-col :xs="10" :sm="10" :md="4" :lg="3" v-for="bar in statusChart">
        <div class="chart-wrapper"  >
          <bar-chart :chart-data="bar.barChartData" :date="bar.date"  />
        </div>
      </el-col>

    </el-row>
    </div>
    <el-row :gutter="1">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart :chart-data="pieChartData" :azcount="azcount"/>
        </div>
      </el-col>
      <el-col :xs="32" :sm="32" :lg="10">
        <div class="chart-wrapper">

          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
      <el-col :xs="16" :sm="16" :lg="6">
        <div class="chart-wrapper" style="width: 100%;">
          <div style="margin: 0px 0px 5px 20px;color: #279cd5;"> 设备巡检状态 </div>
          <el-table id="tableList" height="327px" :data="dataList" border fit highlight-current-row style="width: 100%;" ref="tablelist">
            <el-table-column
              v-loading="loading"
              align="center"
              label="序号"
              min-width="40px"
              element-loading-text="请给我点时间！"

            >
              <template slot-scope="srow">
                <span v-bind:style="{color:srow.row.colorss}" > {{srow.$index+1}} </span>
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
import {fetchEvent} from "@/api/article";
import bgUrl from '@/assets/images/bg.jpg'
export default {
  name: 'StatusAnalysis',
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
      lineChartData: {
        expectedData:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        actualData:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      expectedData:[],
      actualData:[],
      pieChartData:[
        { value: 0, name: '正常' ,itemStyle:{color:"#65d186"}},
        // { value: 0, name: '故障',itemStyle:{color:"#f29e3c"} },
        // { value: 0, name: '报警' ,itemStyle:{color:"#f67287"}},
        // { value: 0, name: '预警' ,itemStyle:{color:"#F19433"}}
        { value: 0, name: '故障',itemStyle:{color:"#e0d405"} },
        { value: 0, name: '报警' ,itemStyle:{color:"#E93F33"}},
        { value: 0, name: '预警' ,itemStyle:{color:"#F19433"}}
        ],
      barChartData:[
        { value: 0, name: '正常'},
        { value: 0, name: '故障'},
        { value: 0, name: '报警'},
        { value: 0, name: '预警'}
      ],
      statusChart:[
        {date:'',barChartData:[
            { value: 0, name: '正常'},
            { value: 0, name: '故障'},
            { value: 0, name: '报警'},
            { value: 0, name: '预警'}
          ]},
        {date:'',barChartData:[
            { value: 0, name: '正常'},
            { value: 0, name: '故障'},
            { value: 0, name: '报警'},
            { value: 0, name: '预警'}
          ]},
        {date:'',barChartData:[
            { value: 0, name: '正常'},
            { value: 0, name: '故障'},
            { value: 0, name: '报警'},
            { value: 0, name: '预警'}
          ]},
        {date:'',barChartData:[
            { value: 0, name: '正常'},
            { value: 0, name: '故障'},
            { value: 0, name: '报警'},
            { value: 0, name: '预警'}
          ]},
        {date:'',barChartData:[
            { value: 0, name: '正常'},
            { value: 0, name: '故障'},
            { value: 0, name: '报警'},
            { value: 0, name: '预警'}
          ]},
        {date:'',barChartData:[
            { value: 0, name: '正常'},
            { value: 0, name: '故障'},
            { value: 0, name: '报警'},
            { value: 0, name: '预警'}
          ]},
        {date:'',barChartData:[
            { value: 0, name: '正常'},
            { value: 0, name: '故障'},
            { value: 0, name: '报警'},
            { value: 0, name: '预警'}
          ]},
      ],
      dataweek:[],
      loading:false,
      dataList: [],
      zxcount:0,
      azcount:0,
      historyData:[],
      totalList: [
        {count:0,lable:"正常台数",icon:"el-icon-video-play"},
        {count:0,lable:"故障台数",icon:"el-icon-warning"},
        {count:0,lable:"预警台数",icon:"el-icon-message-solid"},
        {count:0,lable:"报警台数",icon:"el-icon-sunrise-1"},
        {count:0,lable:"离线台数",icon:"el-icon-circle-close"},
      ],
      //00正常01预警10报警
      status: [
        {code:"",value:"未知"},
        {code:"00",value:"正常"},
        {code:"01",value:"预警"},
        {code:"10",value:"报警"},
      ]
    }
  },
  created() {
    this.expectedData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.actualData= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var day = null;
    for(let i=0;i<=6;i++){
      day = this.getWeek(-i);
      this.dataweek.push(day);
      this.statusChart[i].date=day;
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
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
    getList() {
      this.loading = true
      var obj = {
        url: 'get/reals',
        data: {
          currentPage:1,
          pageSize:10000
        }
      }
      fetchEvent(obj).then(response => {
        var context = this;
        this.dataList = response.responseBody.map((e)=>{
           //e.ErrLeihuaStatusName = this.getStatusName(e.ErrLeihua);

          // e.colorss = this.getStateColor(e.ErrLeihua);
          //totalList计算total
          //故障标志位，T有故障，F无故障，D离线
          if(e.ErrFlag == 'F'){
            context.pieChartData[0].value ++;
          }else
          if(e.ErrFlag == 'T'){
              //01预警
              if(e.ErrThunder=='01' ||e.ErrLeihua=='01' ||e.ErrLC1=='01' ||e.ErrLC2=='01' ||
                e.ErrTemp=='01' || e.ErrLC3=='01'
              ){
                context.pieChartData[3].value ++;
                e.YJ="01";
              }

              //10预警
              if(e.ErrThunder=='10' ||e.ErrLeihua=='10' ||e.ErrLC1=='10' ||e.ErrLC2=='10' ||
                e.ErrTemp=='10' || e.ErrLC3=='10'  || e.Switch1 =='1' || e.Switch2 =='1' || e.Switch3 =='1' || e.Switch4 =='1'
              ){
                context.pieChartData[2].value ++;
                e.YJ="10";
              }
          }else
          if(e.ErrFlag == 'D'){
            //context.totalList[4].count ++;
            context.pieChartData[1].value ++;
          }else{
            context.zxcount++;
          }
          context.azcount++;


          this.getTTimeCount(e);
          e.colorss = this.getStateColor(e.ErrFlag,e.YJ);
          e.ErrLeihuaStatusName = this.getStatusName(e.ErrFlag,e.YJ);
          return e;
        });
        this.loading = false
        this.getTimeStatusCounts();
        this.getHistory();
      })
    },
    getTTimeCount(item){ //获取雷击数
      //本年月份的雷击次数
      var fdate = new Date(item.In_Time);

      for(var i=0;i<12;i++){
         if(i== fdate.getMonth()){
           this.expectedData[i]+=item.TTime;
         }
         // if(i == ){
         //
         // }
      }
      this.lineChartData.expectedData =this.expectedData;
    },
    getTimeStatusCounts(){//近一周的状态数据
      // console.log(this.statusChart);
      var context = this;
      // for(var i=0;i<this.dataweek.length;i++){
        // var days = this.dataweek[i];
        var i=0;
        this.dataList.map((item)=>{
          let daye = context.getDayByTime(item.In_Time);
          // if( days == daye){
            //故障标志位，T有故障，F无故障，D离线
            if(item.ErrFlag == 'F'){
              context.statusChart[i].barChartData[0].value ++;
            }
            if(item.ErrFlag == 'D'){
              context.statusChart[i].barChartData[1].value ++;
            }
            if(item.ErrFlag == 'T'){
              //01预警
              if(item.ErrThunder=='01' ||item.ErrLeihua=='01' ||item.ErrLC1=='01' ||item.ErrLC2=='01' ||
                item.ErrTemp=='01' || item.ErrLC3=='01'
              ){
                context.statusChart[i].barChartData[3].value ++;
              }

              //10预警
              if(item.ErrThunder=='10' ||item.ErrLeihua=='10' ||item.ErrLC1=='10' ||item.ErrLC2=='10' ||
                item.ErrTemp=='10' || item.ErrLC3=='10'  || item.Switch1 =='1' || item.Switch2 =='1' || item.Switch3 =='1' || item.Switch4 =='1'
              ){
                context.statusChart[i].barChartData[2].value ++;
              }
            }

          // }
        });
      // }
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
      hisData.map((e)=>{
        for(var i=1;i<this.dataweek.length;i++) {
          var days = this.dataweek[i];
          var barChartData=[
            { value: 0, name: '正常'},
            { value: 0, name: '故障'},
            { value: 0, name: '报警'},
            { value: 0, name: '预警'}
          ];
          if (days == e.In_Time) {
            barChartData[0].value =e.zccount;
            barChartData[1].value =e.gzcount;
            barChartData[3].value =e.yjcount;
            barChartData[2].value =e.bjcount;
            this.statusChart[i].barChartData =barChartData;
          }
        }
      });

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
