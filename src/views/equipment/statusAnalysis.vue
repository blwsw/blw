<template>
  <div class="dashboard-editor-container">
    <div style="margin: 0px 0px 5px 20px;"> 设备状态分析 </div>

    <el-row :gutter="32">

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

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart :chart-data="pieChartData" :azcount="azcount"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">

          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>
<!--

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">

      <raddar-chart />
    </el-row>


    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row>
    -->
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

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

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
      lineChartData: lineChartData.newVisitis,
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
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
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
        this.dataList = response.responseBody.map((e)=>{
          // e.ErrLeihuaStatusName = this.getStatusName(e.ErrLeihua);
          //totalList计算total
          //故障标志位，T有故障，F无故障，D离线
          if(e.ErrFlag == 'F'){
            this.pieChartData[0].value ++;
          }
          if(e.ErrFlag == 'T'){
            this.pieChartData[1].value ++;
          }
          if(e.ErrFlag == 'D'){
            this.totalList[4].count ++;
          }else{
            this.zxcount++;
          }
          this.azcount++;

          //01预警
          if(e.ErrThunder=='01' ||e.ErrLeihua=='01' ||e.ErrLC1=='01' ||e.ErrLC2=='01' ||
            e.ErrTemp=='01' || e.ErrLC3=='01'
          ){
            this.pieChartData[3].value ++;
          }

          //10预警
          if(e.ErrThunder=='10' ||e.ErrLeihua=='10' ||e.ErrLC1=='10' ||e.ErrLC2=='10' ||
            e.ErrTemp=='10' || e.ErrLC3=='10'
          ){
            this.pieChartData[2].value ++;
          }
          return e;
        });
        this.loading = false
      })
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
