<template>
  <div class="tab-container">
    <!--<el-tag>mounted times ：{{ createdTimes }}</el-tag>
    <el-alert :closable="false" style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;" title="Tab with keep-alive" type="success" />-->
    <el-tabs v-model="activeName" style="" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <TabPane v-if="'L1'==item.key" :type="item.key" @getDataList="getList" @create="showCreatedTimes" :dataList="dataList" />
          <TabPaneL2 v-if="'L2'==item.key" :type="item.key" @getDataList="getList" @create="showCreatedTimes" :dataList="dataList" />
          <TabPaneL3 v-if="'L3'==item.key" :type="item.key" @getDataList="getList" @create="showCreatedTimes" :dataList="dataList" />
          <TabPanelldl v-if="'L4'==item.key" :type="item.key" @getDataList="getList" @create="showCreatedTimes" :dataList="dataList" />
          <TabPane v-if="'L5'==item.key" :type="item.key" @getDataList="getList" @create="showCreatedTimes" :dataList="dataList" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabPane from './components/TabPane'
import TabPaneL3 from './components/TabPaneL3'
import TabPaneL2 from './components/TabPaneL2'
import TabPanelldl from './components/TabPanelldl'
import {fetchEvent} from "@/api/article";

export default {
  name: 'Tab',
  components: { TabPane, TabPaneL2, TabPaneL3, TabPanelldl },
  data() {
    return {
      tabMapOptions: [
        { label: '雷击次数', key: 'L1' },
        { label: '雷击电流', key: 'L2' },
        { label: '实时温度', key: 'L3' },
        { label: '泄露电流', key: 'L4' },
        { label: '劣化状态', key: 'L5' }
      ],
      activeName: 'L1',
      createdTimes: 0,
      dataList: [],
      listQuery: {
        currentPage: 1,
        pageSize: 5,
        sort: '-in_Time'
      },
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
   // this.getList()
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    },
    getList() {
      this.loading = true
      // this.$emit('create') // for test
      var obj = {
        url: 'get/reals',
        data: this.listQuery
      }
      fetchEvent(obj).then(response => {
        this.dataList = response.responseBody
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 5px;
  }
</style>
