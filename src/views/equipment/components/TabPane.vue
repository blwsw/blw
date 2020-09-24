<template>
  <div class="app-container" style="padding: 0;margin: 0">
    <div>
      <div style="float: right;">
  <el-button :loading="downloadLoading" v-permission="['admin1','admin2','blw']" style="margin:5px;" type="primary" icon="el-icon-document" @click="handleDownload1" >
    导出
  </el-button>
  <el-button :loading="downloadLoading" style="margin:5px;" type="primary" icon="el-icon-document" @click="handlePrint" >
    打印
  </el-button></div>
  <el-table id="tableList" height="600px"  header-cell-style="background-color: #f5f7fa;color: #909399;font-weight: bold;border-bottom: 1px solid #EBEEF5;" :data="list" border fit highlight-current-row style="width: 100%;" ref="tablelist">
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

      <el-table-column v-if="'L1' == type" width="160px" align="center" label="时间" >
        <template slot-scope="scope">
          <span>{{ scope.row.In_Time }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="'L1' == type" min-width="50px" label="雷击次数" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.TTime }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="'L5' == type" width="160px" align="center" label="时间">
        <template slot-scope="scope">
          <span>{{ scope.row.In_Time }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="'L5' == type" min-width="50px" label="劣化状态" show-overflow-tooltip >
        <template slot-scope="{row}">
          <span>{{ row.ErrLeihua |statusFilter}}</span>
        </template>
      </el-table-column>
    <el-table-column v-if="'L5' == type" min-width="50px" label="劣化度" show-overflow-tooltip >
      <template slot-scope="{row}">
        <span>{{ row.Deterior}}</span>
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
import permission from '@/directive/permission/index.js' // 权限判断指令
import store from "@/store";

export default {
  directives: { permission},
  filters: {
    statusFilter(status) {//故障代码，00正常01预警10报警
      const statusMap = {
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
        let tHeader = ['序号', '节点编号', '配电箱号', '时间', '雷击次数', '安装位置']
        let filterVal = ['seqNo', 'addr', 'pdcNo', 'In_Time', 'TTime','InstallPos']
        if(this.type =='L5'){
          tHeader = ['序号', '节点编号', '配电箱号', '时间', '劣化状态', '劣化度', '安装位置']
          filterVal = ['seqNo', 'addr', 'pdcNo', 'In_Time', 'ErrLeihuaName', 'Deterior','InstallPos']
        }
        const statusMap = {
          '00': '正常',
          '01': '预警',
          '10': '报警'
        }
        const list = this.list.map((l)=>{
          l.ErrLeihuaName = statusMap[l.ErrLeihua];
          return l;
        })
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
<style lang="scss" scoped>
  .el-table th > .cell {
    position: relative;
    word-wrap: normal;
    text-overflow: ellipsis;
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .el-table th.is-leaf, .el-table td {
    border-bottom: 1px solid #EBEEF5;
  }
  .elhed {
    background-color: #f5f7fa;
  }
  </style>

