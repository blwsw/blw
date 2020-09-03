<template>
  <div class="app-container">
    <upload-excel-component :on-handle-save="handleSave" :on-success="handleSuccess" :before-upload="beforeUpload" />
    <div style="float: right;">
h
    </div>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
    },
    handleSave({ results, header }){//保存数据库
       if(!results){
         this.$message({
           message: '没有要保存的内容.',
           type: 'warning'
         })
         return false
       }
    }
  }
}
</script>
