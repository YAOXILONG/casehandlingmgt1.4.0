<template>
  <div class="openStoragePage">
    <Layout>
      <Header :height="42">
        <div class="openStoragePageTitle">
          <span>
            开柜存放
          </span>
          <span>
            <i class="h-icon-circle_info"></i>
            双击可存储的柜子即可开柜
          </span>
        </div>
      </Header>
      <Main>
        <div class="mainContent">
          <Layout>
            <Header :height="64"
                    class="tabContent">
              <el-radio-group v-model="currentLockerIndex"
                              type="simple"
                              size="small">
                <el-radio-button v-for="(item, index) in cabinetList"
                                 :key="index"
                                 :label="index">
                  {{ item.name }}
                </el-radio-button>
              </el-radio-group>
            </Header>
            <Main v-loading="loadingInstance">
              <LockersPage :current-locker="currentLocker"
                           :current-register-info="currentRegisterInfo"
                           :current-door-opened="currentDoorOpened">
                <!-- @openLoading="openLoadingInstance"
                @closeLoading="closeLoadingInstance" -->
              </LockersPage>
            </Main>
          </Layout>
        </div>
      </Main>
      <Footer :height="32"></Footer>
    </Layout>
  </div>
</template>

<script>
import Layout, { Main, Footer, Header } from '../../../components/Layout'
import server from '../../../server/temporaryStorageOfArticles'
import LockersPage from './LockersPage'
export default {
  name: 'OpenStorage',
  props: {
    currentRegisterInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    currentDoorOpened: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      cabinetList: [],
      currentLocker: {}, // 当前储物柜
      currentLockerIndex: 0, // 当前储物柜
      loadingInstance: false
    }
  },
  methods: {
    async findCabinetListByRegisterId () {
      let params = {
        registerId: this.currentRegisterInfo.currentRegisterId
      }
      this.openLoadingInstance()
      try {
        const data = await server.findCabinetListByRegisterId(params)
        if (data.data.code === '0') {
          if (data.data.data && data.data.data.length) {
            this.cabinetList = JSON.parse(JSON.stringify(data.data.data))
            this.currentLocker = this.cabinetList[0]
            this.currentLockerIndex = 0
          } else {
            this.cabinetList = []
            this.currentLocker = {}
            this.currentLockerIndex = 0
          }
          this.closeLoadingInstance()
        } else {
          this.closeLoadingInstance()
          this.$messagebox(data)
        }
      } catch {
        this.closeLoadingInstance()
      }
    },
    openLoadingInstance () {
      this.loadingInstance = true
    },
    closeLoadingInstance () {
      this.loadingInstance = false
    }
  },
  watch: {
    currentLockerIndex (newV, oldV) {
      this.currentLocker = this.cabinetList[newV]
    },
    'currentRegisterInfo.currentRegisterId' (newV, oldV) {
      if (newV) {
        this.findCabinetListByRegisterId()
      }
    }
  },
  mounted () {
    if (this.currentRegisterInfo.currentRegisterId) {
      this.findCabinetListByRegisterId()
    }
  },
  components: {
    LockersPage,
    Layout,
    Main,
    Footer,
    Header
  }
}
</script>

<style lang="less">
.openStoragePage {
  height: auto;
  padding-bottom: 10px;
  box-sizing: border-box;
  background: #f2f2f2;
  .ea-layout {
    background: #ffffff;
    .openStoragePageTitle {
      height: 42px;
      background: #ffffff;
      box-shadow: inset 0 -1px 0 0 #e6e6e6;
      > span {
        display: inline-block;
        line-height: 40px;
        font-family: PingFangSC-Semibold;
        font-size: 14px;
        color: #4c4c4c;
        letter-spacing: 0;
        padding-left: 16px;
      }
      > span + span {
        color: #999999;
        padding-left: 8px;
      }
    }
    .mainContent {
      height: auto;
      padding: 0 25%;
      box-sizing: border-box;
      .ea-header.tabContent {
        padding-top: 16px;
        box-sizing: border-box;
        .el-radio-group .el-radio-button:checked + .el-radio-button__inner,
        .el-radio-button.is-checked {
          background-color: #2080f7;
          color: #fff;
        }
        .el-radio-button--small .el-radio-button__inner {
          width: 80px;
          height: 32px;
          line-height: 30px;
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>
