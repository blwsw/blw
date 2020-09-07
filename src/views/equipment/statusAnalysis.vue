<template>
  <div class="dashboard-editor-container">
    <div class="chart-wrapper">
    <div style="margin: 0px 0px 5px 20px;color: #279cd5;"> 设备状态分析 </div>
    <el-row :gutter="8">

      <el-col :xs="8" :sm="8" :lg="6">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="6">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="6">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
      <el-col :xs="8" :sm="8" :lg="6">
        <div class="chart-wrapper">
          <bar-chart />
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
          <el-table id="tableList" :data="dataList" border fit highlight-current-row style="width: 100%;height: 326px;overflow-y: auto;" ref="tablelist">
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
      pieChartData:[
        { value: 0, name: '正常' ,itemStyle:{color:"#65d186"}},
        { value: 0, name: '故障',itemStyle:{color:"#f29e3c"} },
        { value: 0, name: '报警' ,itemStyle:{color:"#f67287"}},
        { value: 0, name: '预警' }
        ],
      loading:false,
      dataList: [],
      zxcount:0,
      azcount:0,
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
  mounted() {
    this.getList();
  },
  methods: {
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
           e.ErrLeihuaStatusName = this.getStatusName(e.ErrLeihua);
           e.colorss = '#65d186';
          //totalList计算total
          //故障标志位，T有故障，F无故障，D离线
          if(e.ErrFlag == 'F'){
            context.pieChartData[0].value ++;
            e.colorss = '#65d186';
          }
          if(e.ErrFlag == 'T'){
            context.pieChartData[1].value ++;
            e.colorss = '#f29e3c';
          }
          if(e.ErrFlag == 'D'){
            context.totalList[4].count ++;
            e.colorss = '#f67287';
          }else{
            context.zxcount++;
          }
          context.azcount++;

          //01预警
          if(e.ErrThunder=='01' ||e.ErrLeihua=='01' ||e.ErrLC1=='01' ||e.ErrLC2=='01' ||
            e.ErrTemp=='01' || e.ErrLC3=='01'
          ){
            context.pieChartData[3].value ++;
          }

          //10预警
          if(e.ErrThunder=='10' ||e.ErrLeihua=='10' ||e.ErrLC1=='10' ||e.ErrLC2=='10' ||
            e.ErrTemp=='10' || e.ErrLC3=='10'
          ){
            context.pieChartData[2].value ++;
          }
          this.getTTimeCount(e);
          return e;
        });
        this.loading = false
      })
    },
    getTTimeCount(item){//获取雷击数
      //本年月份的雷击次数
      var fdate = new Date(item.In_Time);
      var expectedData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for(var i=0;i<12;i++){
         if(i== fdate.getMonth()){
           expectedData[i]+=item.TTime;
         }
      }
      this.lineChartData.expectedData =expectedData;
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
