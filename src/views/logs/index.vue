<template>
  <div class="tab-container">
    <keep-alive>
      <tab-pane  @create="showCreatedTimes" />
    </keep-alive>
  </div>
</template>

<script>
import TabPane from './components/TabPane'

export default {
  name: 'Tab',
  components: { TabPane },
  data() {
    return {
      tabMapOptions: [
        { label: '累计次数', key: 'L1' },
        { label: '雷击电流', key: 'L2' },
        { label: '实时温度', key: 'L3' },
        { label: '泄露电流', key: 'L4' },
        { label: '劣化状态', key: 'L5' },
      ],
      activeName: 'L1',
      createdTimes: 0
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    showCreatedTimes() {
      this.createdTimes = this.createdTimes + 1
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
