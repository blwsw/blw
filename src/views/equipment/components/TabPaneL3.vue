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
    <el-table-column min-width="50px" label="实时温度" show-overflow-tooltip>
      <template slot-scope="{row}">
        <span>{{ row.OTemp }}</span>
      </template>
    </el-table-column>

    <el-table-column width="110px" align="center" label="安装位置">
      <template slot-scope="scope">
        <span>{{ scope.row.address }}</span>
      </template>
    </el-table-column>


  </el-table>
    </div>
  </div>
</template>

<script>
import { fetchEvent } from '@/api/article'
import {formatTime, parseTime} from "@/utils";

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
      list: null,
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
    if(!this.dataList || this.dataList.length == 0){
      //this.$emit('getDataList')
      this.getList();
    }
    this.list = this.dataList
  },
  mounted() {
    // WebSocket
    if ('WebSocket' in window) {
      this.websocket = new WebSocket(process.env.VUE_APP_WS_URS+this.$store.state.user.userId) //+ this.userName
      this.initWebSocket()
    } else {
      alert('当前浏览器 Not support websocket')
    }
  },
  beforeDestroy() {
    this.onbeforeunload()
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
        const tHeader = ['序号', '节点编号', '配电箱号', '时间', '雷击次数', '安装位置']
        const filterVal = ['seqNo', 'addr', 'pdcNo', 'In_Time', 'TTime','address']
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
    initWebSocket() {
      // 连接错误
      this.websocket.onerror = this.setErrorMessage

      // 连接成功
      this.websocket.onopen = this.setOnopenMessage

      // 收到消息的回调
      this.websocket.onmessage = this.setOnmessageMessage

      // 连接关闭的回调
      this.websocket.onclose = this.setOncloseMessage

      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload
    },
    setErrorMessage () {
      console.log('WebSocket连接发生错误   状态码：' + this.websocket.readyState)
    },
    setOnopenMessage () {
      console.log('WebSocket连接成功    状态码：' + this.websocket.readyState)
    },
    setOnmessageMessage (event) {
      // 根据服务器推送的消息做自己的业务处理
      console.log('服务端返回：' + event.data)
      if (event.data){
        var newData = JSON.parse(event.data)
        newData.In_Time = this.parseTime1(newData.In_Time)
        this.list.some((item, i) => {
          if (item.addr == newData.addr){
            this.list.splice(i,1)
            // 在数组的some方法中，如果return true，就会立即终止这个数组的后续循环,所以相比较foreach，如果想要终止循环，那么建议使用some
            return true
          }
        })


        this.list.unshift(newData)
      }

    },
    parseTime1(dateobj){
      var datestr = dateobj.year + '-' + dateobj.monthValue + '-' + dateobj.dayOfMonth +' '+ dateobj.hour+':'+dateobj.minute+':'+dateobj.second
      return datestr;
    },
    setOncloseMessage () {
      console.log('WebSocket连接关闭    状态码：' + this.websocket.readyState)
    },
    onbeforeunload () {
      this.closeWebSocket()
    },
    closeWebSocket () {
      this.websocket.close()
    }
  }

}
</script>

