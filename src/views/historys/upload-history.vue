<template>
  <div class="app-container">
    <upload-excel-component :on-handle-save="handleSave" :on-success="handleSuccess" :before-upload="beforeUpload" />
    <div style="float: right;">
    </div>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
  </div>
</template>

<script>

const calendarTypeOptions = [
  { key: '节点编号', display_name: 'addr' },
  { key: '节点地址', display_name: 'addr' },

  { key: '发生日期', display_name: 'In_Time' },
  { key: '设备状态', display_name: 'ErrFlag' },
  { key: '雷击状态', display_name: 'ErrThunder' },
  { key: '温度状态', display_name: 'ErrTemp' },
  { key: '温度劣化', display_name: 'ErrLeihua' },
  { key: '漏电劣化1', display_name: 'ErrLC1' },
  { key: '漏电劣化2', display_name: 'ErrLC2' },
  { key: '漏电劣化3', display_name: 'ErrLC3' },
  { key: '端口', display_name: 'serialserver_port' },
  { key: '雷击电流报警设定值', display_name: 'TCurrentAlarm' },
  { key: '温度报警设定值', display_name: 'TAlarm' },
  { key: '温升限值设定值', display_name: 'TRiseMax' },
  { key: '漏电流限值', display_name: 'LCurrentMax' },
  { key: '脱扣', display_name: 'BOut' },
  { key: '开关量1', display_name: 'Switch1' },
  { key: '开关量2', display_name: 'Switch2' },
  { key: '开关量3', display_name: 'Switch3' },
  { key: '开关量4', display_name: 'Switch4' },
  { key: '脱离器1', display_name: 'Switch1' },
  { key: '脱离器2', display_name: 'Switch2' },
  { key: '脱离器3', display_name: 'Switch3' },
  { key: '脱离器4', display_name: 'Switch4' },
  { key: '漏电流1', display_name: 'TCurrent1' },
  { key: '漏电流2', display_name: 'TCurrent2' },
  { key: '漏电流3', display_name: 'TCurrent3' },
  { key: '安装位置', display_name: 'InstallPos' },
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { fetchEvent} from '@/api/article'
export default {
  name: 'uploadHistory',
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
        message: '请上传小于1m的文件.',
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
      this.listLoading = true
      const statusMap = {//设备状态，T有故障，F无故障，D离线
        '有故障':'T',
        '无故障':'F',
        '离线':'D'
      }
      const yjstatusMap = {//00正常01预警10报警
        '正常':'00',
        '预警':'01' ,
        '报警':'10'
      }
      const gzstatusMap = {
        '报警':'1',
        '正常':'0'
    }
      //转换json数据
      var dataList = results.map((item)=>{
        let obj = {};
        header.map((key)=>{
          obj[calendarTypeKeyValue[key]] = item[key];
        })

        obj.ErrFlag = statusMap[obj.ErrFlag];
        obj.ErrThunder = yjstatusMap[obj.ErrThunder];
        obj.ErrTemp =yjstatusMap[obj.ErrTemp];
        obj.ErrLeihua =yjstatusMap[obj.ErrLeihua];
        obj.ErrLC1 =yjstatusMap[obj.ErrLC1];
        obj.ErrLC2 =yjstatusMap[obj.ErrLC2];
        obj.ErrLC3 =yjstatusMap[obj.ErrLC3];
        obj.Switch1 = gzstatusMap[obj.Switch1];
        obj.Switch2 = gzstatusMap[obj.Switch2];
        obj.Switch3 = gzstatusMap[obj.Switch3];
        obj.Switch4 = gzstatusMap[obj.Switch4];
        return obj;
      });
      console.log(dataList);



      // /batch/historys
      var query={
        url:"batch/historys",
        data:dataList,
        methods:"post"
      };
      fetchEvent(query).then(response => {
        this.$message({
          message: '保存成功.',
          type: 'success'
        })
          this.$router.push({ name: 'historys', params: { id:"" }}) //
      })

     //  var countIndex =0;
     // dataList.map((node)=>{
     //    //保存数据
     //    var query={
     //      url:"history",
     //      data:node,
     //      methods:"post"
     //    };
     //     fetchEvent(query).then(response => {
     //      countIndex++;
     //      if(countIndex == dataList.length){
     //        this.$router.push({ name: 'historys', params: { id:"" }}) //
     //      }
     //    })
     //  });


    }
  }
}
</script>
