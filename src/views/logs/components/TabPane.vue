<template>
  <div class="app-container">
  <div class="filter-container">
    <el-form
      inline
      :model="listQuery"
    >
      <el-form-item label="seqNo">
        <el-input v-model="listQuery.seqNo" placeholder="日志号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      </el-form-item>
      <el-form-item label="日志类型">
        <el-select v-model="listQuery.eventType" placeholder="请选择日志类型!" clearable style="width:200px" class="filter-item">
          <el-option v-for="item in eventTypes" :key="item.code" :label="item.value" :value="item.code" />
        </el-select>
      </el-form-item>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <!--
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
     -->
    </el-form>
  </div>


  <el-table :data="list" border fit highlight-current-row style="width: 100%;">
    <el-table-column
      v-loading="loading"
      align="center"
      label="ID"
      width="65"
      element-loading-text="请给我点时间！"
    >
      <template slot-scope="scope">
        <span >{{ scope.row.id }}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="100px" label="seqNo">
      <template slot-scope="{row}">
        <span class="link-type" @click="handleUpdate(row)">{{ row.seqNo }}</span>
      </template>
    </el-table-column>
    <el-table-column width="180px" align="center" label="Date">
      <template slot-scope="scope">
        <span>{{ scope.row.requestTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="200px" label="requestBody" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.requestBody }}</span>
      </template>
    </el-table-column>

    <el-table-column width="110px" align="center" label="eventType">
      <template slot-scope="scope">
        <span>{{ scope.row.eventType }}</span>
      </template>
    </el-table-column>

    <el-table-column width="120px" label="requestBody" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{ scope.row.requestBody }}</span>
      </template>
    </el-table-column>


  </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="getList" />
  </div>

</template>

<script>
import { fetchEventLog } from '@/api/article'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
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
        pageSize: 5,
        eventType:'',
        sort: '-id'
      },
      loading: false,
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
      fetchEventLog(this.listQuery).then(response => {
        this.list = response.responseBody
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
  }
}
</script>

