<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          保存
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">
          Draft
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="addr">
              <MDinput v-model="postForm.addr" :maxlength="100" name="addr" required>
                节点编号
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="6">
                  <el-form-item label="名称" label-width="60px"  prop="name" class="postInfo-container-item">
                    <el-input v-model="postForm.name" />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                <el-form-item label="状态" label-width="60px" class="postInfo-container-item">
                  <el-select v-model="postForm.delete" class="filter-item" placeholder="Please select">
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.lable" :value="item.value" />
                  </el-select>
                </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label-width="120px" label="串口服务器IP:"  prop="serialserver_ip" class="postInfo-container-item">
                    <el-input v-model="postForm.serialserver_ip" />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label-width="120px" label="串口服务器端口:" prop="serialserver_port" class="postInfo-container-item">
                    <el-input v-model="postForm.serialserver_port"  placeholder="port 88 or 80" />
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label="说明" label-width="60px" prop="descript"  class="postInfo-container-item">
                    <el-input v-model="postForm.descript" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label-width="100px" label="安装位置" prop="InstallPos" class="postInfo-container-item">
                    <el-input v-model="postForm.InstallPos" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <div class="paramscontainer">
          <div style="margin: 10px;color: darkgrey;">设备参数</div>
          <el-row>
            <el-col :span="6">
              <el-form-item label="雷击电流报警设定值(单位：A):" label-width="220px"  prop="TCurrentAlarm" class="postInfo-container-item">
                <el-input v-model="postForm.TCurrentAlarm" placeholder="雷击电流报警设定值，单位：A"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="温度报警设定值，单位：摄氏度:" label-width="220px"  prop="TAlarm" class="postInfo-container-item">
                <el-input v-model="postForm.TAlarm" placeholder="温度报警设定值，单位：摄氏度"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="温升限值设定值，单位：摄氏度:" label-width="220px"  prop="TRiseMax" class="postInfo-container-item">
                <el-input v-model="postForm.TRiseMax" placeholder="温升限值设定值，单位：摄氏度"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="漏电流限值，单位：A:" label-width="220px"  prop="LCurrentMax" class="postInfo-container-item">
                <el-input v-model="postForm.LCurrentMax" placeholder="漏电流限值，单位：A"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="脱扣:" label-width="60px"  prop="BOut" class="postInfo-container-item">
                <el-select v-model="postForm.BOut" class="filter-item" placeholder="脱扣，E:开启 D:关闭">
                  <el-option v-for="item in kgSelect" :key="item.value" :label="item.lable" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开关量1:" label-width="120px"  prop="Switch1" class="postInfo-container-item">
                <el-select v-model="postForm.Switch1" class="filter-item" placeholder="开关量1，E:开启 D:关闭">
                  <el-option v-for="item in kgSelect" :key="item.value" :label="item.lable" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开关量2:" label-width="120px"  prop="Switch2" class="postInfo-container-item">
                <el-select v-model="postForm.Switch2" class="filter-item" placeholder="开关量2，E:开启 D:关闭">
                  <el-option v-for="item in kgSelect" :key="item.value" :label="item.lable" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开关量3:" label-width="120px"  prop="Switch3" class="postInfo-container-item">
                <el-select v-model="postForm.Switch3" class="filter-item" placeholder="开关量3，E:开启 D:关闭">
                  <el-option v-for="item in kgSelect" :key="item.value" :label="item.lable" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开关量4:" label-width="120px"  prop="Switch4" class="postInfo-container-item">
                <el-select v-model="postForm.Switch4" class="filter-item" placeholder="开关量4，E:开启 D:关闭">
                  <el-option v-for="item in kgSelect" :key="item.value" :label="item.lable" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="漏电流1:" label-width="120px"  prop="TCurrent1" class="postInfo-container-item">
                <el-select v-model="postForm.TCurrent1" class="filter-item" placeholder="漏电流1，E:开启 D:关闭">
                  <el-option v-for="item in kgSelect" :key="item.value" :label="item.lable" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="漏电流2:" label-width="120px"  prop="TCurrent2" class="postInfo-container-item">
                <el-select v-model="postForm.TCurrent2" class="filter-item" placeholder="漏电流2，E:开启 D:关闭">
                  <el-option v-for="item in kgSelect" :key="item.value" :label="item.lable" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="漏电流3:" label-width="120px"  prop="TCurrent3" class="postInfo-container-item">
                <el-select v-model="postForm.TCurrent3" class="filter-item" placeholder="漏电流3，E:开启 D:关闭">
                  <el-option v-for="item in kgSelect" :key="item.value" :label="item.lable" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-form-item style="margin-bottom: 40px;" label-width="70px" label="Summary:">
          <el-input v-model="postForm.content_short" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>
        </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import { fetchArticle } from '@/api/article'
import { searchUser } from '@/api/remote-search'



const defaultForm = {
  status: 'draft',
  // title: '', // 文章题目
  // content: '', // 文章内容
  // content_short: '', // 文章摘要
  // source_uri: '', // 文章外链
  // image_uri: '', // 文章图片
  // display_time: undefined, // 前台展示时间
  // id: undefined,
  // platforms: ['a-platform'],
  // comment_disabled: false,
  // importance: 0
  addr:'',
  delete:'',
  name:'',
  descript:'',
  InstallPos:'',
  serialserver_ip:'',
  serialserver_port:'',
  TCurrentAlarm:'',
  TAlarm:'',
  TRiseMax:'',
  LCurrentMax:'',
  BOut:'',
  Switch1:'',
  Switch2:'',
  Switch3:'',
  Switch4:'',
  TCurrent1:'',
  TCurrent2:'',
  TCurrent3:''
}

export default {
  name: 'DeviceDetail',
  components: { Tinymce, MDinput, Upload, Sticky },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {},
      statusOptions: [{
        value:"1",lable:"禁用"
      },{
        value:"0",lable:"启用"
      }],
      kgSelect:[{
        value:"E",lable:"开启"
      },{
        value:"D",lable:"关闭"
      }]
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.addr.length;
    },
    lang() {
      return this.$store.getters.language
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.display_time))
      },
      set(val) {
        this.postForm.display_time = new Date(val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data

        // just for test
        this.postForm.title += `   Article Id:${this.postForm.id}`
        this.postForm.content_short += `   Article Id:${this.postForm.id}`

        // set tagsview title
        this.setTagsViewTitle()

        // set page title
        this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '发布文章成功',
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";

.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
        width: 100%;
      }
    }
    .paramscontainer{
      border-top: 1px solid #8c94a5;
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
