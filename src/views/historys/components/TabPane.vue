<template>
  <div class="app-container" style="padding-bottom: 0px;padding-top: 0px;">
  <div class="filter-container" style="padding-bottom: 0px;padding-top: 0px;">
    <el-form
      inline
      :model="listQuery"
    >
      <el-button style="float: right;" v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-search" @click="handlePrint">
        打印
      </el-button>
      <el-button style="float: right;margin-right:10px;" v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-upload" @click="handleUpload" v-permission="['admin1','blw']">
        导入
      </el-button>
      <el-button style="float: right;" v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" v-permission="['admin1','admin2','blw']" @click="handleDownload">
        导出
      </el-button>

    </el-form>
  </div>


  <el-table id="tableList" :data="list" header-cell-style="background-color: #f5f7fa;color: #909399;font-weight: bold;border-bottom: 1px solid #EBEEF5;" border fit highlight-current-row >
    <el-table-column
      v-loading="loading"
      align="center"
      label="序号"
      width="65"
      element-loading-text="请给我点时间！"
    >
      <template slot-scope="scope">
        <span >{{ scope.$index+1 }}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="60px" label="节点编号">
      <template slot-scope="{row}">
        <span class="link-type" @click="handleUpdate(row)">{{ row.addr }}</span>
      </template>
    </el-table-column>
    <el-table-column width="140px" align="center" label="发生日期">
      <template slot-scope="scope">
        <span>{{ scope.row.In_Time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>
    <el-table-column width="100px" align="center" label="配电箱号">
      <template slot-scope="scope">
        <span>{{ scope.row.pdcNo}}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="40px" label="故障标志" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.ErrFlag |statusFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="40px" label="雷击故障" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.ErrThunder |GZFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="40px" label="温度故障" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.ErrTemp |GZFilter }}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="40px" label="温度劣化" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.ErrLeihua |GZFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="40px" label="漏电劣化1" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.ErrLC1 |GZFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="40px" label="漏电劣化2" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.ErrLC2 |GZFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="40px" label="漏电劣化3" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.ErrLC3 |GZFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="50px" label="脱离器1" show-overflow-tooltip >
      <template slot-scope="{row}">
        <span>{{ row.Switch1 |switchFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="50px" label="脱离器2" show-overflow-tooltip >
      <template slot-scope="{row}">
        <span>{{ row.Switch2 |switchFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="50px" label="脱离器3" show-overflow-tooltip >
      <template slot-scope="{row}">
        <span>{{ row.Switch3 |switchFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="50px" label="脱离器4" show-overflow-tooltip >
      <template slot-scope="{row}">
        <span>{{ row.Switch4 |switchFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="200px" align="center" label="安装位置">
      <template slot-scope="scope">
        <span>{{ scope.row.InstallPos }}</span>
      </template>
    </el-table-column>


  </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>

</template>

<script>
  import {fetchEvent, fetchHistory} from '@/api/article'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
  import {parseTime} from "@/utils";
  import permission from "@/directive/permission";
export default {
  components: { Pagination },
  directives: { waves ,permission},
  filters: {
    statusFilter(status) {
      const statusMap = {//故障标志位，T有故障，F无故障，D离线
        'T': '有故障',
        'F': '无故障',
        'D': '离线'
      }
      return statusMap[status]
    },
    GZFilter(status) {
      const statusMap = {//00正常01预警10报警
        '00': '正常',
        '01': '预警',
        '10': '报警'
      }
      return statusMap[status]
    },
    switchFilter(status) {//开关量1，0关，1开  = 开关量（1：故障 0：正常） 脱离器
      const statusMap = {
        '1': '故障',
        '0': '正常'
      }
      return statusMap[status]
    }
  },
  props: {
    type: {
      type: String,
      default: 'L1'
    }
  },
  data() {
    return {
      list: null,
      total:0,
      listQuery: {
        currentPage: 1,
        pageSize: 10  ,
        eventType:'',
        sort: '-addr'
      },
      loading: false,
      downloadLoading:false,
      eventTypes: [{
        code:'65',value:"服务反馈/推送采集数据"
      }, {
        code:'66',value:"服务召唤设备参数反馈"
      }, {
        code:'67',value:"服务下发设备参数反馈"
      }, {
        code:'68',value:"服务初始化反馈"
      }, {
        code:'69',value:"服务清除设备故障反馈"
      }, {
        code:'50',value:"前端召唤设备参数"
      }, {
        code:'51',value:"前端下发设备参数"
      }, {
        code:'49',value:"前端召唤采集数据"
      }, {
        code:'52',value:"前端通知服务初始化"
      }, {
        code:'53',value:"前端通知服务清除设备故障"
      }, {
        code:'',value:"其他日志"
      }],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      this.$emit('create') // for test
      fetchHistory(this.listQuery).then(response => {
        this.list = response.responseBody.map((e)=>{
          this.eventTypes.map((t)=>{
            if(t.code == e.eventType){
              e.eventTypeName = t.value;
              return false;
            }
          });
          return e;
        });
        this.total = response.page.page_total
        this.loading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row){
      this.$router.push({ name: 'logsDetail', params: { seqNo: row.seqNo,requestBody:row.requestBody,responseBody:row.responseBody }}) //
    },
    handleUpload(){
      this.$router.push({ name: 'upload-history', params: {  }}) //
    },
    handleDownload() {
      const statusMap = {//故障标志位，T有故障，F无故障，D离线
        'T': '有故障',
        'F': '无故障',
        'D': '离线'
      }
      const yjstatusMap = {//00正常01预警10报警
        '00': '正常',
        '01': '预警',
        '10': '报警'
      }
      const gzstatusMap = {
        '1': '故障',
        '0': '正常'
      }
      this.downloadLoading = true
      var query={
        url:"get/history",
        data: {
          pageSize:10000,
          currentPage:1,
          querySring:this.listQuery.querySring
        }
      };
      fetchEvent(query).then(response => {
        this.downloadList = response.responseBody.map((e)=>{

          e.ErrFlagName = statusMap[e.ErrFlag];
          e.ErrThunderName = yjstatusMap[e.ErrThunder];
          e.ErrTempName =yjstatusMap[e.ErrTemp];
          e.ErrLeihuaName =yjstatusMap[e.ErrLeihua];
          e.ErrLC1Name =yjstatusMap[e.ErrLC1];
          e.ErrLC2Name =yjstatusMap[e.ErrLC2];
          e.ErrLC3Name =yjstatusMap[e.ErrLC3];
          e.Switch1Name = gzstatusMap[e.Switch1];
          e.Switch2Name = gzstatusMap[e.Switch2];
          e.Switch3Name = gzstatusMap[e.Switch3];
          e.Switch4Name = gzstatusMap[e.Switch4];
          return e;
        });



        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ["节点编号","发生日期","配电箱号","故障标志位","雷击故障","温度故障","温度劣化","漏电劣化1","漏电劣化2","漏电劣化3","脱离器1","脱离器2","脱离器3","脱离器4","安装位置"]
          const filterVal = ["addr","In_time","pdcNo","ErrFlagName","ErrThunderName","ErrTempName","ErrLeihuaName","ErrLC1Name","ErrLC2Name","ErrLC3Name","Switch1Name","Switch2Name","Switch3Name","Switch4Name","InstallPos"]

          const data = this.formatJson(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '历史记录'
          })
          this.downloadLoading = false
        })
      })

    },
    formatJson(filterVal) {
      return this.downloadList.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))

    },
    handlePrint(){
      var newWindow = window.open('打印窗口','_blank');
      var docStr = document.getElementById('tableList').innerHTML
     // console.log(docStr)
      newWindow.document.write(docStr);
      //newWindow.document.body.innerHTML = docStr
      newWindow.document.close();
      newWindow.print();
      newWindow.close();
    }
  }
}
</script>

