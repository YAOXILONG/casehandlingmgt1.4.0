<template>
  <div id="AlarmConfigPage" class="AlarmConfigPage">
    <Layout>
      <Header :height="48">
        <div class="path-desc-box">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              v-for="(item, index) in $breadcrumb"
              :key="index"
              >{{ item }}</el-breadcrumb-item
            >
          </el-breadcrumb>
        </div>
      </Header>
      <Main style="position: relative">
        <div class="left-content" style="padding: 8px">
          <!-- <div class="left-title">
                办案区
          </div>
          <ul class="alarm-type-list">-->
          <el-scrollbar>
            <div
              class="authUserPlaceItem"
              :class="{ active: areaIndexCode == item.areaIndexCode }"
              v-for="item in authUserPlaceList"
              @click="switchAuthUserPlace(item)"
              :key="item.areaIndexCode"
            >
              {{ item.areaName }}
            </div>
          </el-scrollbar>
          <!-- </ul> -->
        </div>
        <div class="right-content">
          <Main style="position: relative">
            <div class="left-content">
              <div class="left-title">报警配置</div>
              <ul class="alarm-type-list">
                <el-scrollbar>
                  <li
                    class="alarm-type-wrapper"
                    v-for="(item, index) in alarmTypeList"
                    :class="{ active: index === activeIndex }"
                    :key="item.alarmType"
                    @click="
                      handleTypeClick(
                        index,
                        item.alarmType,
                        item.useFlag,
                        item.alarmTypeName,
                        item.alarmConfigId,
                        item.alarmGroup
                      )
                    "
                  >
                    <span class="alarm-type-name">{{
                      item.alarmTypeName
                    }}</span>
                    <span
                      class="alarm-type-status"
                      :class="{ active: item.useFlag }"
                      >{{ item.useFlag ? '启用' : '禁用' }}</span
                    >
                  </li>
                </el-scrollbar>
              </ul>
            </div>
            <div class="right-content">
              <component
                :is="currentComponent"
                :current-enable="activeAlarmEnable"
                :areaIndexCode="areaIndexCode"
                :alarmTypeName="alarmTypeName"
                :alarmType="activeAlarmtype"
                :alarmConfigId="alarmConfigId"
                :locationAbility="locationAbility"
                @save="handleSave"
              ></component>
            </div>
          </Main>
        </div>
      </Main>
    </Layout>
  </div>
</template>

<script>
import Layout, { Main, Footer, Header, Sider } from '../../components/Layout'
import server from '../../server/alarmconfig'

export default {
  name: 'AlarmConfigPage',
  data() {
    return {
      alarmTypeListMap: {},
      alarmTypeList1: [],
      alarmTypeList: [],
      activeIndex: 0,
      activeAlarmtype: '',
      alarmConfigId: '',
      alarmTypeName: '',
      activeAlarmEnable: false,
      authUserPlaceList: [],
      currentAuthUserPlace: null,
      areaIndexCode: '',
      componentsMap: {
        1: 'overtime',
        2: 'entryExit',
        3: 'currency',
        4: 'inspection',
        5: 'monitorPoint',
      },
      currentComponent: '',
      locationAbility: false,
    }
  },
  methods: {
    async getAlarmTypeList1() {
      const result = await server.getAlarmTypeList()
      const { data } = result
      if (data.code == '0') {
        let alarmTypeList = []
        let alarmTypeMap = {}
        let list = data.data
        list.forEach((v, i) => {
          let res = {
            useFlag: false,
            voiceFlag: false,
            ...v,
          }
          alarmTypeList.push(res)
          alarmTypeMap[v.alarmType] = i
        })
        this.alarmTypeList1 = alarmTypeList
        this.alarmTypeListMap = alarmTypeMap
      }
    },
    async findAuthUserPlaceList() {
      const res = await server.findAuthUserPlaceList()
      const { data } = res
      if (data.code == '0') {
        if (data.data && data.data.list.length) {
          this.authUserPlaceList = data.data.list
          this.currentAuthUserPlace = data.data.list[0]
          this.areaIndexCode = data.data.list[0].areaIndexCode
          this.getLocationAbility()
          this.firstRender()
        } else {
          this.authUserPlaceList = []
          this.currentAuthUserPlace = null
          this.areaIndexCode = ''
        }
      } else {
        this.$messagebox(res)
      }
    },
    switchAuthUserPlace(item) {
      this.currentAuthUserPlace = item
      this.areaIndexCode = item.areaIndexCode
      this.getLocationAbility()
      this.firstRender()
    },
    async getAlarmTypeList() {
      const res = await server.queryAll({ areaIndexCode: this.areaIndexCode })
      if (res.data.code === '0') {
        let alarmTypeList = JSON.parse(JSON.stringify(this.alarmTypeList1))
        res.data.data.forEach((item) => {
          let index = this.alarmTypeListMap[item.alarmType]
          console.log(index, '===')
          alarmTypeList[index] = {
            ...alarmTypeList[index],
            ...item,
          }
          if (item.alarmType === this.activeAlarmtype) {
            this.activeIndex = index
            let key = alarmTypeList[index].alarmGroup
            this.currentComponent = this.componentsMap[key]
            this.activeAlarmtype = item.alarmType
            this.alarmTypeName = alarmTypeList[index].alarmTypeName
            this.activeAlarmEnable = item.useFlag
            this.alarmConfigId = item.alarmConfigId
          }
        })
        this.alarmTypeList = alarmTypeList
      } else {
        // this.$message.error(res.data.msg)
        this.$messagebox(res)
      }
    },
    handleTypeClick(index, type, enable, name, alarmConfigId, alarmGroup) {
      this.activeIndex = index
      this.activeAlarmtype = type
      this.currentComponent = this.componentsMap[alarmGroup]
      this.alarmTypeName = name
      this.activeAlarmEnable = enable
      this.alarmConfigId = alarmConfigId
    },
    handleSave(val) {
      this.getAlarmTypeList()
    },
    async firstRender() {
      this.activeIndex = 0
      this.activeAlarmEnable = false
      this.activeAlarmtype = ''
      this.currentComponent = ''
      let activeAlarmtype = this.alarmTypeList1[0].alarmType
      console.log(activeAlarmtype)
      let alarmData = {}
      const res = await server.queryAll({ areaIndexCode: this.areaIndexCode })
      if (res.data.code === '0') {
        let alarmTypeList = JSON.parse(JSON.stringify(this.alarmTypeList1))
        res.data.data.forEach((item) => {
          let index = this.alarmTypeListMap[item.alarmType]
          alarmTypeList[index] = {
            ...alarmTypeList[index],
            ...item,
          }
          if (item.alarmType === activeAlarmtype) {
            alarmData.activeIndex = index
            let key = alarmTypeList[index].alarmGroup
            alarmData.currentComponent = this.componentsMap[key]
            alarmData.activeAlarmtype = item.alarmType
            alarmData.alarmTypeName = alarmTypeList[index].alarmTypeName
            alarmData.activeAlarmEnable = item.useFlag
            alarmData.alarmConfigId = item.alarmConfigId
          }
        })
        console.log(alarmTypeList)
        if (!alarmData.activeAlarmtype) {
          this.activeIndex = 0
          this.activeAlarmtype = activeAlarmtype
          let key = this.alarmTypeList1[0].alarmGroup
          this.currentComponent = this.componentsMap[key]
          this.alarmTypeName = this.alarmTypeList1[0].alarmTypeName
          this.activeAlarmEnable = this.alarmTypeList1[0].useFlag
          this.alarmConfigId = ''
        } else {
          this.activeIndex = alarmData.activeIndex
          this.alarmTypeName = alarmData.alarmTypeName
          this.activeAlarmEnable = alarmData.useFlag
          this.alarmConfigId = alarmData.alarmConfigId
          this.activeAlarmtype = alarmData.activeAlarmtype
          this.currentComponent = alarmData.currentComponent
        }
        this.alarmTypeList = alarmTypeList
      } else {
        // this.$message.error(res.data.msg)
        this.$messagebox(res)
      }
    },
    async getLocationAbility() {
      const res = await server.getLocationAbility({
        areaCode: this.areaIndexCode,
      })
      if (res.data.code === '0') {
        if (res.data.data && res.data.data.length) {
          this.locationAbility = true
        } else {
          this.locationAbility = false
        }
      }
    },
  },
  async mounted() {
    await this.getAlarmTypeList1()
    this.findAuthUserPlaceList()
  },
  components: {
    currency: () => import('./currency'),
    entryExit: () => import('./entryExit'),
    inspection: () => import('./Inspection'),
    overtime: () => import('./overtime'),
    monitorPoint: () => import('./monitorPoint'),
    Layout,
    Main,
    Footer,
    Header,
    Sider,
  },
}
</script>

<style lang="less" rel="stylesheet/less">
@leftContentWidth: 280px;
#app {
  width: 100%;
  height: 100%;
}

.AlarmConfigPage {
  position: relative;
  height: 100%;
  background: #f2f2f2;
  .path-desc-box {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    height: 48px;
    padding: 12px 16px;
    border-bottom: solid 1px #e5e5e5;
    background: #fff;
  }
  .left-content {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: @leftContentWidth;
    background: #fff;
    border-right: 1px solid #e5e5e5;
    box-sizing: border-box;
    .left-title {
      height: 64px;
      line-height: 64px;
      padding-left: 16px;
      font-size: 16px;
      font-weight: bold;
      box-sizing: border-box;
      border-bottom: 1px solid #e5e5e5;
    }
    .alarm-type-list {
      height: calc(~'100% - 64px');

      .alarm-type-wrapper {
        height: 40px;
        line-height: 40px;
        padding-left: 16px;
        padding-right: 20px;
        cursor: pointer;
        font-size: 14px;
        &.active {
          background: #d4dff2;
        }
        .alarm-type-name {
          font-weight: bold;
        }
        .alarm-type-status {
          float: right;
          text-align: right;
          color: #666;
          &.active {
            color: #1dca82;
          }
        }
      }
    }
  }
  .right-content {
    height: 100%;
    padding-left: @leftContentWidth;
  }
  .authUserPlaceItem {
    height: 40px;
    line-height: 40px;
    padding: 0 8px;
    cursor: pointer;
    position: relative;
    &:hover {
      background-color: rgba(32, 128, 247, 0.08);
    }
    &.active {
      background-color: rgba(32, 128, 247, 0.12);
      &:before {
        content: '';
        position: absolute;
        width: 3px;
        height: 24px;
        background: #2080f7;
        top: 8px;
        left: 0px;
      }
    }
  }
  .el-scrollbar__wrap {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
}
</style>
