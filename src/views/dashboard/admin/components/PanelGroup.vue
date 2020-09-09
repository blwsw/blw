<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
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
      <div class="card-panel" @click="handleSetLineChartData('messages')">
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
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
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
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
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
    }

  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    async getReals(){
      this.relas = store.getters.reals
      if(!this.relas || this.relas.length ==0){
        this.relas = await store.dispatch('app/getReals',{reload:true} )
      }
      console.log(this.relas);
    },
    appendData(){
      var context = this;
      this.relas.map((item)=>{
          //故障标志位，T有故障，F无故障，D离线
          if(item.ErrFlag == 'F'){
            context.zccount ++;
          }
          if(item.ErrFlag == 'T'){
            context.gzcount ++;
          }
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
        background: #eabb10;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #ee0d0d
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
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
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
