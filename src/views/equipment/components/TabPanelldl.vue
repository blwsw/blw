<template>
  <div class="app-container" style="padding: 0;margin: 0">
    <div>
      <div style="float: right;">
  <el-button :loading="downloadLoading" style="margin:5px;" type="primary" icon="el-icon-document" @click="handleDownload1" >
    导出
  </el-button>
  <el-button :loading="downloadLoading" style="margin:5px;" type="primary" icon="el-icon-document" @click="handlePrint" >
    打印
  </el-button></div>
  <el-table id="tableList" :data="list" border fit highlight-current-row style="width: 100%;height:600px;overflow-y: auto;" ref="tablelist">
    <el-table-column
      v-loading="loading"
      align="center"
      label="序号"
      min-width="100px"
      element-loading-text="请给我点时间！"
    >
      <template slot-scope="scope">
        <span>{{ scope.row.seqNo }}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="50px" label="节点编号">
      <template slot-scope="{row}">
        <span>{{ row.addr }}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="50px" label="配电箱号">
      <template slot-scope="{row}">
        <span>{{ row.pdcNo }}</span>
      </template>
    </el-table-column>
    <el-table-column width="90px" align="center" label="泄露电流1">
      <template slot-scope="scope">
        <span>{{ scope.row.LCurrent1 }}</span>
      </template>
    </el-table-column>

    <el-table-column min-width="90px" label="泄露电流2" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.LCurrent2 }}</span>
      </template>
    </el-table-column>
    <el-table-column min-width="90px" label="泄露电流3" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.LCurrent3 }}</span>
      </template>
    </el-table-column>
    <el-table-column width="110px" align="center" label="安装位置">
      <template slot-scope="scope">
        <span>{{ scope.row.InstallPos }}</span>
      </template>
    </el-table-column>


  </el-table>
    </div>
  </div>
</template>

<script>
import { fetchEvent } from '@/api/article'
import {formatTime, parseTime} from "@/utils";
import store from "@/store";

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
    },
    dataList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      list: [],
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx',
      listQuery: {
        currentPage: 1,
        pageSize: 5,
        eventType: 'IN',
        sort: '-in_Time'
      },
      loading: false
    }
  },
  created() {

  },
  mounted() {
    this.list = this.$store.state.app.reals;
    if(!this.list || this.list.length ==0){
      this.list =  store.dispatch('app/getReals',{reload:true} )
      this.list=[];
    }
  },
  computed: { //          监听词条
    getReals(){
      return this.$store.state.app.reals
    }
  },
  watch: {
    getReals: {
      handler(newValue,oldValue){ //当词条改变时执行事件
        this.list = newValue;
      }
    }
  },
  methods: {
    getList() {
      this.loading = true
      this.$emit('create') // for test
      var obj = {
        url: 'get/reals',
        data: this.listQuery
      }
      fetchEvent(obj).then(response => {
        this.list = response.responseBody
        this.loading = false
      })
    },
    handleDownload1() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['序号', '节点编号', '配电箱号', '时间', '泄露电流1', '泄露电流2', '泄露电流3', '安装位置']
        const filterVal = ['seqNo', 'addr', 'pdcNo', 'In_Time','LCurrent1','LCurrent2','LCurrent3','InstallPos']
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
    },

    parseTime1(dateobj){
      var datestr = dateobj.year + '-' + dateobj.monthValue + '-' + dateobj.dayOfMonth +' '+ dateobj.hour+':'+dateobj.minute+':'+dateobj.second
      return datestr;
    },

  }

}
</script>

