<template>
  <div class="app-container">
    <div>
      <div style="float: right;">
  <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="handleDownload1" >
    导出
  </el-button>
  <el-button :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="handlePrint" >
    打印
  </el-button></div>
  <el-table id="tableList" :data="list" border fit highlight-current-row style="width: 100%" ref="tablelist">
    <el-table-column
      v-loading="loading"
      align="center"
      label="序号"
      width="65"
      element-loading-text="请给我点时间！"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="100px" label="节点编号">
      <template slot-scope="{row}">
        <span>{{ row.seqNo }}</span>
      </template>
    </el-table-column>
    <el-table-column width="180px" align="center" label="时间">
      <template slot-scope="scope">
        <span>{{ scope.row.requestTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="200px" label="雷击次数" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.requestBody }}</span>
      </template>
    </el-table-column>

    <el-table-column width="110px" align="center" label="安装位置">
      <template slot-scope="scope">
        <span>{{ scope.row.eventType }}</span>
      </template>
    </el-table-column>

    <el-table-column width="120px" label="其他" show-overflow-tooltip>
      <template slot-scope="scope">
        <span>{{ scope.row.requestBody }}</span>
      </template>
    </el-table-column>
  </el-table>
    </div>
  </div>
</template>

<script>
import { fetchEventLog } from '@/api/article'
import {parseTime} from "@/utils";

export default {
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
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx',
      listQuery: {
        currentPage: 1,
        pageSize: 5,
        eventType: 'IN',
        sort: '-id'
      },
      loading: false
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
        this.loading = false
      })
    },
    handleDownload1() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Id', '编号', '时间', 'eventType', 'Date']
        const filterVal = ['id', 'seqNo', 'requestTime', 'eventType', 'display_time']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    handlePrint(){
      var newWindow = window.open('打印窗口','_blank');
      var docStr = document.getElementById('tableList').innerHTML
      console.log(docStr)
      newWindow.document.write(docStr);
      //newWindow.document.body.innerHTML = docStr
      newWindow.document.close();
      newWindow.print();
      newWindow.close();
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }

}
</script>

