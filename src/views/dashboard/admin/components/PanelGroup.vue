<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel card-panel1" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="example" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            正常
          </div>
          <count-to :start-val="0" :end-val="zccount" :duration="1" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel  card-panel2" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <i class="el-icon-s-tools card-panel-icon" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            故障
          </div>
          <count-to :start-val="0" :end-val="gzcount" :duration="1" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel  card-panel3" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="dashboard" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            预警
          </div>
          <count-to :start-val="0" :end-val="yjcount" :duration="1" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel  card-panel4" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="icon" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            报警
          </div>
          <count-to :start-val="0" :end-val="bjcount" :duration="1" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import store from "@/store";
import {mapState} from "vuex";

export default {
  components: {
    CountTo
  },
  props: {
    chartData: {
      type: Array,
      required: true
    }
  },
  mounted() {
    this.getReals();
  },
  data() {
    return {
      zccount:0,
      gzcount:0,
      yjcount:0,
      bjcount:0,
    }
  },
  computed: { //          监听词条
    getSearchKey(){
      return this.$store.state.app.reals
    }
  },
  watch: {
    getSearchKey: {
      handler(newValue,oldValue){ //当词条改变时执行事件
         // console.log('new',newValue)
         // console.log('old',oldValue)
        this.reals = newValue;
         this.appendData(newValue);
      }
    },
    chartData: {
      deep: true,
      handler(val) {
         this.zccount = val[0].value;
         this.gzcount= val[1].value;
         this.yjcount= val[2].value;
         this.bjcount= val[3].value;
      }
    },
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    async getReals(){
      this.relas = this.$store.state.app.reals
      if(!this.relas || this.relas.length ==0){
        // this.relas = await store.dispatch('app/getReals',{reload:true} )
      }
      this.appendData(this.relas);
    },
    appendData(){
      var context = this;
      this.zccount=0,
        this.gzcount=0,
        this.yjcount=0,
        this.bjcount=0,
      this.relas.map((item)=>{
          //故障标志位，T有故障，F无故障，D离线
          if(item.ErrFlag == 'F'){
            context.zccount ++;
          }else if(item.ErrFlag == 'T'){
              //01预警
              if(item.ErrThunder=='01' ||item.ErrLeihua=='01' ||item.ErrLC1=='01' ||item.ErrLC2=='01' ||
                item.ErrTemp=='01' || item.ErrLC3=='01'
              ){
                context.yjcount++;
              }
              //10预警
              if(item.ErrThunder=='10' ||item.ErrLeihua=='10' ||item.ErrLC1=='10' ||item.ErrLC2=='10' ||
                item.ErrTemp=='10' || item.ErrLC3=='10'
              ){
                context.bjcount ++;
              }
          }else if(item.ErrFlag == 'D'){
            context.gzcount ++;
          }
      });
    }

  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
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
        background: #a412cb;
      }

      .icon-money {
        background: #22c2b5;
      }

      .icon-shopping {
        background: #b60df3
      }
    }

    .icon-people {
      color: #f0f5f3;
    }

    .icon-message {
      color: #f0f5f3;
    }

    .icon-money {
      color: #f0f5f3;
    }

    .icon-shopping {
      color: #f0f5f3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: #ffffff;
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }

  .card-panel1{
    background: #65d186;
    color: #ffffff;
  }

  .card-panel2 {
    background: #e0d405;
    color: #ffffff;
  }

  .card-panel3 {
    background: #F19433;
    color: #ffffff;
  }

  .card-panel4 {
    background: #E93F33;
    color: #ffffff;
  }
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

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
