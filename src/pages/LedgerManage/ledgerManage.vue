<template>
  <watermarkContent>
    <div id="ledgerManage"
         class="ledgerManage">
      <div class="listPage">
        <Layout>
          <Header :height="80">
            <PathDesc :path-desc-arr="pathDescArr"
                      :is-back="true"></PathDesc>
            <!-- <el-breadcrumb separator="/">
            <el-button type="iconButton"
                       icon="h-icon-arrow_left back"
                       @click="onBack"></el-button>
            <el-breadcrumb-item> 办案区台账</el-breadcrumb-item>
            <el-breadcrumb-item>涉案人员台账</el-breadcrumb-item>
          </el-breadcrumb> -->
            <div class="personInfo">
              <span>
                姓名：{{ currentRegisterInfo.registerName }}
              </span>
              <span>
                人员类型：{{ personTypeMap[currentRegisterInfo.personType] }}
              </span>
              <!-- <span>
              手环编号：{{ currentRegisterInfo.bandsNo }}
            </span> -->
              <span v-if="sexMap[currentRegisterInfo.registerSex]">
                性别：{{ sexMap[currentRegisterInfo.registerSex] }}
              </span>
              <span v-else>
                性别：
              </span>
              <span v-if="currentRegisterInfo.registerAge">
                年龄：{{ currentRegisterInfo.registerAge }}岁
              </span>
              <span v-else>
                年龄：未知
              </span>
            </div>
          </Header>

          <Main>
            <div class="ledgerManageMain">
              <Layout>
                <Header :height="68">
                  <ul class="ledgerMenuBox">
                    <li @click="changeMenu(item,index)"
                        :class="item.key ===currentLedgerMenu ? 'ledgerMenuItem active':'ledgerMenuItem'"
                        v-for="(item,index) in ledgerMenuList"
                        :key="index">
                      {{ item.name }}
                      <div class="topRight"></div>
                      <i v-show="item.already"
                         class="h-icon-right"></i>
                      <!-- <i :class="item.already ? 'h-icon-right active' : 'h-icon-right'"></i> -->
                    </li>
                  </ul>
                </Header>
                <Main>
                  <div class="ledgerManageInfo">
                    <div class="ledgerManageInfoBox">
                      <component :is="activeAlarmtype"
                                 :current-register-id="currentRegisterId"
                                 :inq-dict-list="inqDictList">
                      </component>
                    </div>
                  </div>
                </Main>
              </Layout>
            </div>
          </Main>
        </Layout>
      </div>
    </div>
  </watermarkContent>
</template>
<script>
import Layout, { Main, Header } from '../../components/Layout/index'
import server from '../../server/ledgerManage'
import PathDesc from './components/PathDesc'
export default {
  name: 'LedgerManage',
  computed: {
    currentRegisterId () {
      if (this.$route.query && this.$route.query.id) {
        return Number(this.$route.query.id)
      } else {
        return null
      }
    }
  },
  data () {
    return {
      pathDescArr: ['办案区台账', '涉案人员台账'],
      activeAlarmtype: 'basicPersonnelSituation',
      currentLedgerMenu: 1,
      ledgerMenuList: [
        {
          key: 1,
          value: 'basicPersonnelSituation',
          name: '人员基本情况'
        }, {
          key: 2,
          value: 'personalExaminationRecord',
          name: '人身检查记录'
        }, {
          key: 3,
          value: 'inspectionRecordOfPersonalBelongings',
          name: '随身财物检查记录'
        }, {
          key: 4,
          value: 'informationAcquisitionRecord',
          name: '信息采集记录'
        }, {
          key: 5,
          value: 'drugAbuseTestingRecords',
          name: '吸毒检测记录'
        }, {
          key: 6,
          value: 'activityRecord',
          name: '活动记录'
        }, {
          key: 7,
          value: 'leaveTheCaseAreaRecords',
          name: '离开办案区记录'
        }],
      currentRegisterInfo: {
        registerName: '',
        bandsNo: '',
        registerSex: '',
        registerAge: '',
        personType: ''
      },
      inqDictList: {},
      personTypeMap: {},
      sexMap: {}
    }
  },
  mixins: [],
  methods: {
    async findRegisterInfo () {
      let params = {
        registerId: this.currentRegisterId
      }
      let res = await server.findRegisterInfos(params)
      if (res.data.code === '0') {
        let data = res.data.data
        this.currentRegisterInfo = {
          registerName: data.registerName,
          bandsNo: data.bandsNo,
          registerSex: data.registerSex,
          registerAge: data.registerAge,
          personType: data.personType
        }
      } else {
        this.$messagebox(res)
      }
    },
    async findRegisterFinishInfo () {
      let params = {
        registerId: this.currentRegisterId
      }
      let res = await server.findRegisterFinishInfo(params)
      if (res.data.code === '0') {
        let data = res.data.data
        this.ledgerMenuList = [
          {
            key: 1,
            already: data.doRegister,
            value: 'basicPersonnelSituation',
            name: '人员基本情况'
          }, {
            key: 2,
            already: data.doBodyCheck,
            value: 'personalExaminationRecord',
            name: '人身检查记录'
          }, {
            key: 3,
            already: data.doGoodsStorage,
            value: 'inspectionRecordOfPersonalBelongings',
            name: '随身财物检查记录'
          }, {
            key: 4,
            already: data.doCollected,
            value: 'informationAcquisitionRecord',
            name: '信息采集记录'
          }, {
            key: 5,
            already: data.doDrugCheck,
            value: 'drugAbuseTestingRecords',
            name: '吸毒检测记录'
          }, {
            key: 6,
            already: data.doActive,
            value: 'activityRecord',
            name: '活动记录'
          }, {
            key: 7,
            already: data.doLeave,
            value: 'leaveTheCaseAreaRecords',
            name: '离开办案区记录'
          }] // '入区登记','人身检查','物品登记  ','信息采集','吸毒检测','物品归还','出区登记'
      } else {
        this.$messagebox(res)
      }
    },
    changeMenu (item, index) {
      this.currentLedgerMenu = item.key
      this.activeAlarmtype = item.value
    },
    // 数据字典
    async inqDict () {
      let res = await server.inqDict()
      if (res.data.code === '0') {
        let data = res.data.data
        this.inqDictList = data
        let sexData = data.sex
        let personType = data.suspectType
        this.sexMap = this.computedDic(sexData)
        this.personTypeMap = this.computedDic(personType)
      } else {
        this.$messagebox(res)
      }
    },
    computedDic (list) {
      let dicMap = {}
      if (list && list.length) {
        for (let i = 0; i < list.length; i++) {
          dicMap[list[i].key] = list[i].name
        }
      }
      return dicMap
    },
    onBack () {
      this.$router.push({ path: '/', query: {} })
    }
  },
  mounted () {
    this.inqDict()
    if (this.$route.query && this.$route.query.id) {
      this.findRegisterInfo()
      this.findRegisterFinishInfo()
    } else {
      this.$router.push({ path: '/', query: {} })
    }
  },
  components: {
    activityRecord: () => import('./components/activityRecord'),
    drugAbuseTestingRecords: () => import('./components/drugAbuseTestingRecords.vue'),
    informationAcquisitionRecord: () => import('./components/informationAcquisitionRecord.vue'),
    basicPersonnelSituation: () => import('./components/basicPersonnelSituation.vue'),
    personalExaminationRecord: () => import('./components/personalExaminationRecord.vue'),
    inspectionRecordOfPersonalBelongings: () => import('./components/inspectionRecordOfPersonalBelongings.vue'),
    leaveTheCaseAreaRecords: () => import('./components/leaveTheCaseAreaRecords.vue'),
    Layout,
    Main,
    Header,
    PathDesc
  }
}
</script>
<style lang="less" rel="stylesheet/less">
.ledgerManage {
  height: 100%;
  width: 100%;
  .listPage {
    height: 100%;
    > .ea-layout {
      > .ea-header {
        box-shadow: inset 0 -1px 0 0 #e5e5e5;
      }
    }
    .personInfo {
      height: 24px;
      font-size: 14px;
      color: #999999;
      font-family: PingFangSC-Regular;
      padding-left: 20px;
      box-sizing: border-box;
      > span {
        padding: 0 16px;
      }
    }
    .ledgerManageMain {
      height: 100%;
      box-sizing: border-box;
      background: #f2f2f2;
      > .ea-layout {
        padding: 8px;
        box-sizing: border-box;
        background: #f2f2f2;
        > .ea-header {
          background: #f2f2f2;
          padding-bottom: 8px;
          // padding-top: 8px;
          box-sizing: border-box;
        }
      }
      .ledgerMenuBox {
        width: 100%;
        height: 100%;
        padding: 6px 0px;
        padding-left: 24px;
        box-sizing: border-box;
        background: #fff;
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
        .ledgerMenuItem {
          float: left;
          width: 160px;
          height: 40px;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #2185f8;
          letter-spacing: 0;
          text-align: center;
          line-height: 40px;
          margin-left: 24px;
          cursor: pointer;
          border-width: 1px;
          border-color: linear-gradient(90deg, #29a3fe 0%, #2080f7 100%);
          border-style: solid;
          border-radius: 20px;
          box-sizing: border-box;
          position: relative;
          > .topRight {
            display: none;
          }
          &.active {
            background: rgba(233, 243, 255, 0.8);
            font-size: 14px;
            color: #2185f8;
            > .topRight {
              display: block;
              position: absolute;
              z-index: 1;
              top: -4px;
              right: -10px;
              width: 0;
              height: 0;
              overflow: hidden;
              font-size: 0; /*是因为, 虽然宽高度为0, 但在IE6下会具有默认的 */
              line-height: 0; /* 字体大小和行高, 导致盒子呈现被撑开的长矩形 */
              border-width: 6px;
              border-style: solid dashed dashed dashed; /*IE6下, 设置余下三条边的border-style为dashed,即可达到透明的效果*/
              border-color: transparent #28a4fd transparent transparent;
              transform: rotate(140deg);
              -ms-transform: rotate(140deg); /* Internet Explorer */
              -moz-transform: rotate(140deg); /* Firefox */
              -webkit-transform: rotate(140deg); /* Safari 和 Chrome */
              -o-transform: rotate(140deg); /* Opera */
            }
          }
        }
        .h-icon-right {
          font-size: 16px;
          margin-left: 6px;
          color: #3bcd8d;
          font-weight: bold;
        }
        .ledgerMenuItem:nth-of-type(1) {
          margin-left: 0px;
        }
      }
      .ledgerManageInfo {
        background: #fff;
        height: 100%;
        background: #f2f2f2;
        padding: 8px !important;
        box-sizing: border-box;
        position: relative;
        .ledgerManageInfoBox {
          width: 100%;
          height: 100%;
        }
        .scrollbarWrap {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          .formContant {
            width: 100%;
            padding: 0;
            height: auto;
            box-sizing: border-box;
            text-align: center;
            .ledgerManageReason {
              height: auto;
              padding-bottom: 8px;
              box-sizing: border-box;
              background: #f2f2f2;
              .ledgerManageReasonBox {
                height: 100%;
                background: #fff;
              }
            }
          }
        }
      }
    }
  }
}
</style>
