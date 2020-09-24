<template>
  <div class="app-container" style="padding-bottom: 0px;padding-top: 0px;">
  <div class="filter-container" style="padding-bottom: 0px;padding-top: 0px;">
    <el-form
      inline
      :model="listQuery"
    >
      <el-button style="float: right;" v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
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


  <el-table :data="list" header-cell-style="background-color: #f5f7fa;color: #909399;font-weight: bold;border-bottom: 1px solid #EBEEF5;" border fit highlight-current-row style="width: 100%;">
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

    <el-table-column min-width="40px" label="故障标志位" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.ErrFlag |statusFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="40px" label="雷击故障代码" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.ErrThunder |GZFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="40px" label="温度故障代码" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.ErrTemp |GZFilter }}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="40px" label="温度劣化故障代码" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.ErrLeihua |GZFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="40px" label="漏电劣化1故障代码" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.ErrLC1 |GZFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="40px" label="漏电劣化2故障代码" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.ErrLC2 |GZFilter}}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="40px" label="漏电劣化3故障代码" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.ErrLC3 |GZFilter}}</span>
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
      this.downloadLoading = true
      var query={
        url:"nodes",
        data: {
          pageSize:10000,
          currentPage:1,
          querySring:this.listQuery.querySring
        }
      };
      fetchEvent(query).then(response => {
        this.downloadList = response.responseBody;
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ["节点地址","安装位置","名称","串口服务器IP","端口","故障标志位","雷击故障代码","温度故障代码","温度劣化故障代码","漏电劣化1故障代码","漏电劣化2故障代码","漏电劣化3故障代码","备注"]
          const filterVal = ["addr","InstallPos","name","serialserver_ip","serialserver_port","ErrFlag","ErrThunder","ErrTemp","ErrLeihua","ErrLC1","ErrLC2","ErrLC3","descript"]
          const data = this.formatJson(filterVal)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: '设备列表'
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
  }
}
</script>

