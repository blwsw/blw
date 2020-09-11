<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.querySring" placeholder="输入节点查询条件" style="width: 50%;" class="filter-item" @keyup.enter.native="handleFilter" />

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-upload" @click="handleDoSend">
        下发
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-upload" @click="handleUpload">
        导入
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" @click="handleDeviceInit">
        服务初始化
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" @click="handleClearFault">
        清除故障
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" @click="handleGetNewData">
        获取实时参数
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      ref="multipleTable"
      @sort-change="sortChange"
      @selection-change="checkSelection"
    >
      <el-table-column type="selection" label="选择" width="65" ></el-table-column>
      <el-table-column label="节点编号" prop="addr" sortable="custom" align="center" width="80" :class-name="getSortClass('addr')">
        <template slot-scope="{row}">
          <span>{{ row.addr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="150px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="说明备注" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.descript }}</span>
        </template>
      </el-table-column>
      <el-table-column label="串口服务器IP" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.serialserver_ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="安装位置" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.InstallPos }}</span>
        </template>
      </el-table-column>

      <el-table-column label="串口服务器端口" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.serialserver_port }}</span>
        </template>
      </el-table-column>

      <el-table-column label="雷击电流报警设定值" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.TCurrentAlarm }}</span>
        </template>
      </el-table-column>
      <el-table-column label="温度报警设定值" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.TAlarm }}</span>
        </template>
      </el-table-column>
      <el-table-column label="温升限值设定值" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.TRiseMax }}</span>
        </template>
      </el-table-column>
      <el-table-column label="漏电流限值" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.LCurrentMax }}</span>
        </template>
      </el-table-column>
      <el-table-column label="脱扣" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.BOut }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开关量1" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Switch1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开关量2" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Switch2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开关量3" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Switch3 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开关量4" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.Switch4 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="漏电流1" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.TCurrent1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="漏电流2" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.TCurrent2 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="漏电流3" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.TCurrent3 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.delete | statusFilter">
            {{ row.delete }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button v-if="row.status!='1'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            启用
          </el-button>
          <el-button v-if="row.status!='0'" size="mini" @click="handleModifyStatus(row,'draft')">
            禁用
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="节点编号" prop="addr">
          <el-input v-model="temp.addr"  />
        </el-form-item>

        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="temp.descript" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="temp.delete" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="安装位置">
          <el-input v-model="temp.InstallPos" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchEvent, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination/index' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'deviceManager',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {//0禁用 1启用
      const statusMap = {
        1: 'success',
        //draft: 'info',
        0: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        querySring: undefined,
        sort: '+addr'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      var query={
        url:"nodes",
        data:this.listQuery
      };
      fetchEvent(query).then(response => {
        this.list = response.responseBody
        this.total = response.page.page_total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleUpload(){
      this.$router.push({ name: 'upload-device', params: { id:"" }}) //
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
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
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    checkSelection(){
      //this.multipleSelection = val;
    },
    handleDoSend(){
      //console.info(this.multipleSelection);
      //console.info(this.$refs.multipleTable.tableData);
      let selectionNodes = this.$refs.multipleTable.selection;
      if(selectionNodes != null){
        this.listLoading = true
         for(var i=0;i<selectionNodes.length;i++){
           var query={
             url:"send/nodes/33",
             data:selectionNodes[i],
             methods:"put",
             params:{
               seqNo:22
             }
           };
           fetchEvent(query).then(response => {
             this.$notify({
               title: '成功',
               message: '下发成功',
               type: 'success',
               duration: 2000
             })
             this.listLoading = false
           })
         }
        this.listLoading = false
      }
    },
    handleDeviceInit(){
      var query={
        url:"nodes/initHint",
        data: {},
        methods:"put",
        params:{
        }
      };
      fetchEvent(query).then(response => {
        this.$notify({
          title: '成功',
          message: '初始化下发成功',
          type: 'success',
          duration: 2000
        })
        this.listLoading = false
      })
    },
    handleClearFault(){
      let selectionNodes = this.$refs.multipleTable.selection;
      if(selectionNodes == null || selectionNodes.length ==0){
        this.$notify({
          title: '提示',
          message: '请选择需要清除的设备',
          type: 'warning',
          duration: 2000
        })
        return false;
      }
      let addrs = "";
      for(var i=0;i<selectionNodes.length;i++){
        if(!addrs){
          addrs = selectionNodes[i].addr;
        }else{
          addrs +=","+selectionNodes[i].addr;
        }
      }

      var query={
        url:"nodes/clearFault",
        data: {},
        methods:"put",
        params:{addrs
        }
      };
      fetchEvent(query).then(response => {
        this.$notify({
          title: '成功',
          message: '初始化下发成功',
          type: 'success',
          duration: 2000
        })
        this.listLoading = false
      })
    },
    handleGetNewData(){
      let selectionNodes = this.$refs.multipleTable.selection;
      if(selectionNodes == null || selectionNodes.length ==0){
        this.$notify({
          title: '提示',
          message: '请选择需要获取参数的设备',
          type: 'warning',
          duration: 2000
        })
        return false;
      }

      let addrs = "";
      for(var i=0;i<selectionNodes.length;i++){
         if(!addrs){
           addrs = selectionNodes[i].addr;
         }else{
           addrs +=","+selectionNodes[i].addr;
         }
      }

    }
  }
}
</script>
