<template>
  <div class="mixin-components-container">

    <el-row :gutter="15" class="panel-group">
      <el-col :xs="8" :sm="8" :md="4" :lg="3" class="card-panel-col" v-for="node in dataList">
        <el-card class="box-card" body-style="padding:5px;" v-bind:class="{ 'bicon-people': node.ErrFlag=='F','bicon-message': node.ErrFlag=='T','bicon-outling': node.ErrFlag=='D' }">
          <div slot="header" class="clearfix spanaa">
            <i class="el-icon-warning-outline" />
            <span>{{node.addr}}</span>
            <span>{{node.pdcNo}}</span>
          </div>
          <div class="component-item">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper icon-people" v-if="node.ErrFlag =='F'">
                <i class="el-icon-video-play card-panel-icon" />
              </div>
              <div class="card-panel-icon-wrapper icon-message" v-if="node.ErrFlag =='T'">
                <i class="el-icon-warning card-panel-icon" />
              </div>
              <div class="card-panel-icon-wrapper icon-outling" v-if="node.ErrFlag =='D'">
                <i class="el-icon-circle-close card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  温度:{{node.OTemp}}℃
                </div>
                <div class="card-panel-text">
                  雷击数:{{node.TTime}}
                </div>
                <div class="card-panel-text">
                  劣化状态:{{node.ErrLeihuaStatusName}}
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>


    <el-row :gutter="1" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <el-row :gutter="1" >
          <el-col :xs="12" :sm="12" :lg="12">
            <el-card class="box-card btmtj btmtjbgcolor" >
              在线台数
            </el-card>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12">
            <el-card class="box-card btmtj"  >
              {{zxcount}}台
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="0" >
          <el-col :xs="12" :sm="12" :lg="12">
            <el-card class="box-card btmtj btmtjbgcolor" >
              安装台数
            </el-card>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="12" >
            <el-card class="box-card btmtj">
              {{azcount}}台
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="6" :sm="6" :lg="3" class="card-panel-col" v-for="t in totalList">
        <el-card class="box-card" body-style="padding:5px;" >
          <div class="component-item">
            <div class="card-panel">
              <div class="card-panel-icon-wrapper card-panel-icon-wrapper1 bicon-people" v-if="t.icon =='el-icon-video-play'">
                <i class="el-icon-video-play card-panel-icon" />
              </div>
              <div class="card-panel-icon-wrapper card-panel-icon-wrapper1 bicon-message" v-if="t.icon =='el-icon-warning'">
                <i class="el-icon-warning card-panel-icon" />
              </div>
              <div class="card-panel-icon-wrapper card-panel-icon-wrapper1 bicon-money" v-if="t.icon =='el-icon-message-solid'">
                <i class="el-icon-message-solid card-panel-icon" />
              </div>
              <div class="card-panel-icon-wrapper card-panel-icon-wrapper1 bicon-shopping" v-if="t.icon =='el-icon-sunrise-1'">
                <i class="el-icon-sunrise-1 card-panel-icon" />
              </div>
              <div class="card-panel-icon-wrapper card-panel-icon-wrapper1 bicon-outling" v-if="t.icon =='el-icon-circle-close'">
              <i class="el-icon-circle-close card-panel-icon" />
            </div>

              <div class="card-panel-description card-panel-description1" style="vertical-align: center;">
                <div class="card-panel-text">
                  {{t.count}}台&nbsp;
                </div>
                <div class="card-panel-text">
                  {{t.lable}}
                </div>

              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import PanThumb from '@/components/PanThumb'
import MdInput from '@/components/MDinput'
import Mallki from '@/components/TextHoverEffect/Mallki'
import DropdownMenu from '@/components/Share/DropdownMenu'
import waves from '@/directive/waves/index.js' // 水波纹指令
import {fetchEvent} from "@/api/article";
export default {
  name: 'DistributionList',
  components: {
    PanThumb,
    MdInput,
    Mallki,
    DropdownMenu
  },
  directives: {
    waves
  },
  data() {
    const validate = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('请输入六个字符'))
      } else {
        callback()
      }
    }
    return {
      loading:false,
      dataList: [],
      zxcount:0,
      azcount:0,
      totalList: [
        {count:0,lable:"正常台数",icon:"el-icon-video-play"},
        {count:0,lable:"故障台数",icon:"el-icon-warning"},
        {count:0,lable:"预警台数",icon:"el-icon-message-solid"},
        {count:0,lable:"报警台数",icon:"el-icon-sunrise-1"},
        {count:0,lable:"离线台数",icon:"el-icon-circle-close"},
      ],
      //00正常01预警10报警
      status: [
        {code:"",value:"未知"},
        {code:"00",value:"正常"},
        {code:"01",value:"预警"},
        {code:"10",value:"报警"},
      ]
    }
  },
  created() {
    this.getList()

  },
  methods:{
    getList() {
      this.loading = true
      // this.$emit('create') // for test
      var obj = {
        url: 'get/reals',
        data: {
          currentPage:1,
          pageSize:10000
        }
      }
      fetchEvent(obj).then(response => {
        this.dataList = response.responseBody.map((e)=>{
          e.ErrLeihuaStatusName = this.getStatusName(e.ErrLeihua);
          //totalList计算total
          //故障标志位，T有故障，F无故障，D离线
          if(e.ErrFlag == 'F'){
            this.totalList[0].count ++;
          }
          if(e.ErrFlag == 'T'){
            this.totalList[1].count ++;
          }
          if(e.ErrFlag == 'D'){
            this.totalList[4].count ++;
          }else{
            this.zxcount++;
          }
          this.azcount++;
          return e;
        });
        this.loading = false
      })
    },
    getStatusName(incode){
      if(!incode){
        return "未知";
      }
      let statusName = incode;
      this.status.map((s)=>{
        if(s.code == incode){
          statusName = s.value;
          return statusName;
        }
      });
      return statusName;
    }
  }
}
</script>

<style lang="scss" scoped>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 20px;
  min-height: calc(100vh - 84px);
}
.component-item{
  min-height: 80px;
  padding: 0;
}
.panel-group {
  margin-top: 15px;

  .btmtjbgcolor{
    background: #3671ca;
    color: azure;
  }
  .btmtj{
    text-align: center;
  }
  .card-panel-col {
    margin-bottom: 15px;
  }

  .bicon-people {
    background: #40c9c6;
  }

  .bicon-message {
    background: #eabb10;
  }

  .bicon-money {
    background: #f4516c;
  }

  .bicon-shopping {
    background: #ee0d0d
  }
  .bicon-outling {
    background: #aaa4a4
  }
  .card-panel {
    height: auto;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #eabb10;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #ee0d0d
      }
      .icon-outling {
        background: #aaa4a4
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #f7d736;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #f10606
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 0;
      padding: 12px 2px 12px 0px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon-wrapper1 {
      margin: 17px 0 15px 0;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 5px 5px 5px 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 10px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
    .card-panel-description1 {
      margin: 15px 0 15px 0;
      padding: 11px 0 11px 0;
    }

  }
}

.spanaa{
  width: 100%;
  display: inline-block;
  overflow:hidden;
  white-space:nowrap;
  text-overflow:ellipsis;
}
@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .card-panel-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
