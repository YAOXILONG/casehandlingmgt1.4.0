<template>
  <div id="lockersPage"
       v-loading="loadingInstances">
    <Layout>
      <Header :height="32">
        <template v-for="(item, index) in LegendList">
          <span class="colorItem"
                :style="item['backgroundColor']"
                :key="index"></span>
          <span class="colorMeanItem"
                :key="item.mean">{{ item['mean'] }}</span>
        </template>
      </Header>
      <Main>
        <div ref="lockersPage"
             class="lockersPage"
             :style="{height:totalHeight+'px'}">
          <ul v-for="(item, index) in doorsList.doors"
              :key="index"
              class="lockersPageItemBox"
              :style="computedItemStyle(item)">
            <li @contextmenu.prevent.stop="cancellationOfDistribution(item,index)"
                @dblclick.prevent.stop="handleDbclick(item,index)"
                class="lockersPageItem"
                :style="computedStyleLockersPageItem(item)"
                :title="item.registerName || ''">
              <div class="boxRegisterName overflow"
                   v-if="item.registerId ==currentRegisterInfo.currentRegisterId">
                {{ item.code }}{{ item.registerName ? '（' + item.registerName +'）' : '' }}
              </div>
              <div class="boxRegisterName overflow"
                   v-else>
                {{ item.code }}
              </div>
              <el-button class="popoverBtn"
                         ref="popoverBtn"
                         v-show="item.visible"
                         @click.prevent.stop="handleCancel(item,index)">
                <span class="arrow">
                </span>
                取消分配
              </el-button>
            </li>
          </ul>
        </div>
      </Main>
    </Layout>
  </div>
</template>

<script>
import Layout, { Main, Header } from '../../../components/Layout'
import server from '../../../server/temporaryStorageOfArticles'
import bus from '../../../views/temporaryStorageOfArticles/index'
export default {
  name: 'LockersPage',
  props: {
    'currentLocker': {
      type: Object,
      default: () => {
        return {
        }
      }
    },
    currentRegisterInfo: {
      type: Object,
      default: () => {
        return {
        }
      }
    },
    currentDoorOpened: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    currentLocker: {
      handler: function (newV, oldV) {
        if (this.currentLocker.deviceIndexCode) {
          this.currentLocker.cabinetIndexCode = this.currentLocker.deviceIndexCode
          this.getList()
        }
      },
      immediate: true,
      deep: true
    },
    doorsList: {
      handler: function (newV, oldV) {

      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      visible: false,
      doorsList: {},
      totalHeight: 0,
      itemRow: 0,
      itemCol: 50,
      eachItem: 0,
      LegendList: [
        {
          backgroundColor: 'background-color: rgba(59,205,141,0.50);',
          borderColor: 'border: 1px solid #3BCD8D;',
          mean: '可储存'
        }, {
          backgroundColor: 'background-color: rgba(254,83,50,0.50);',
          borderColor: 'border: 1px solid #FE5332;',
          mean: '已储存'
        }, {
          backgroundColor: 'background-color: rgba(204,204,204,0.60);',
          borderColor: 'border: 1px solid #CCCCCC;',
          mean: '不可用'
        }
      ],
      currentCancel: null,
      loadingInstances: false
    }
  },
  methods: {
    async handleDbclick (item, index) {
      if (item.type === 0) {
        if (item.registerId && item.registerId !== this.currentRegisterInfo.currentRegisterId) {
          return false
        }
        let firstOpen = true
        if (item.registerName && item.registerName === this.currentRegisterInfo.registerName) {
          firstOpen = false
        }

        if (this.currentDoorOpened.length >= 2 && firstOpen) {
          this.$message.warning('最多打开2个保管柜')
          return false
        }
        let loadingInstance = this.$loading({ fullscreen: true, text: '开柜中，请稍后' })
        try {
          let params = {
            cabinetIndexCode: this.currentLocker.deviceIndexCode,
            boxIndexCode: item.code,
            // doorIndexCode
            doorOpenType: this.currentLocker.doorOpenType
          }
          const data = await server.goodsStoreOpenDoor(params)
          if (data.data.code === '0') {
            loadingInstance.close()
            if (firstOpen) {
              this.doorsList.doors[index]['registerName'] = this.currentRegisterInfo.registerName
              this.doorsList.doors[index]['registerId'] = this.currentRegisterInfo.currentRegisterId
              if (!item.cabinetIndexCode) {
                item.cabinetIndexCode = this.currentLocker.deviceIndexCode
              }
              if (!item.doorOpenType) {
                item.doorOpenType = this.currentLocker.doorOpenType || 0
              }
              console.log(this.currentLocker)
              this.handlePush({                ...item,
                cabinetName: this.currentLocker.name,
                cabinetIndexCode: this.currentLocker.cabinetIndexCode,
                boxIndexCode: item.doorIndexCode
              })
            }
          } else {
            loadingInstance.close()
            setTimeout(() => {
              this.$messagebox(data)
            }, 800)
          }
        } catch {
          setTimeout(() => {
            loadingInstance.close()
          }, 800)
        }
      }
    },
    handlePush (item) {
      let params = JSON.parse(JSON.stringify(item))
      bus.$emit('handlePush', params)
    },
    handlePop (item) {
      let params = JSON.parse(JSON.stringify(item))
      bus.$emit('handlePop', params)
    },
    // 取消分配
    cancellationOfDistribution (item, index) {
      if (item.registerId === this.currentRegisterInfo.currentRegisterId) {
        let data = document.getElementsByClassName('popoverBtn')
        if (data && data.length) {
          if (data[this.currentCancel]) {
            data[this.currentCancel].style.display = 'none'
            this.currentCancel = null
          }
          if (item.registerName) {
            this.currentCancel = index
            data[this.currentCancel].style.display = 'block'
            document.addEventListener('click', () => {
              if (this.currentCancel >= 0) {
                let data = document.getElementsByClassName('popoverBtn')
                if (data && data[this.currentCancel]) {
                  data[this.currentCancel].style.display = 'none'
                  this.currentCancel = null
                }
              }
            })
          }
        }
      } else {
        // this.$message.warning('无权限操作')
      }
    },
    async handleCancel (item, index) {
      let loadingInstance = this.$loading({ fullscreen: true, text: '开柜中，请稍后' })
      try {
        let params = {
          cabinetIndexCode: this.currentLocker.deviceIndexCode,
          boxIndexCode: item.code,
          // doorIndexCode
          doorOpenType: this.currentLocker.doorOpenType
        }
        const data = await server.goodsStoreOpenDoor(params)
        if (data.data.code === '0') {
          loadingInstance.close()
          let data = document.getElementsByClassName('popoverBtn')
          data[this.currentCancel].style.display = 'none'
          this.currentCancel = null
          this.doorsList.doors[index]['registerName'] = ''
          this.doorsList.doors[index]['registerId'] = null
          this.handlePop({            ...item,
            boxIndexCode: item.doorIndexCode
          })
        } else {
          loadingInstance.close()
          setTimeout(() => {
            this.$messagebox(data)
          }, 500)
        }
      } catch {
        setTimeout(() => {
          loadingInstance.close()
        }, 500)
      }
    },
    async getList (type) {
      let params = {
        doorOpenType: this.currentLocker.doorOpenType,
        domainId: this.currentLocker.netZoneId,
        cabinetIndexCode: this.currentLocker.deviceIndexCode
      }
      this.loadingInstances = true
      const data = await server.findCabinetStructurebyIndexCode(params)
      if (data.data.code === '0') {
        let list = JSON.parse(JSON.stringify(data.data.data))
        this.doorsList = list
        if (this.doorsList && this.doorsList.doors && this.doorsList.doors.length) {
          let data = JSON.parse(JSON.stringify(this.doorsList.doors))
          let _data = JSON.parse(JSON.stringify(this.currentDoorOpened))
          for (let i = 0; i < _data.length; i++) {
            for (let j = 0; j < data.length; j++) {
              if (_data[i].doorIndexCode === data[j].doorIndexCode) {
                data[j].registerName = this.currentRegisterInfo.registerName
                break
              }
            }
          }
          this.doorsList.doors = JSON.parse(JSON.stringify(data))
          this.computedStyle(this.doorsList)
        } else {
          this.doorsList = {
            width: 0,
            height: 0,
            doors: []
          }
          this.computedStyle(this.doorsList)
          this.loadingInstances = false
        }
      } else {
        this.loadingInstances = false
        this.$messagebox(data)
      }
    },
    computedItemStyle (item) {
      return 'top:' + item['top_left_y'] * this.eachItem + 'px;left:' + item['top_left_x'] * this.eachItem + 'px;width:' + item['width'] * this.eachItem + 'px;height:' + item['height'] * this.eachItem + 'px;line-height:' + item['height'] * this.eachItem + 'px;' //  + this.colorList[item.goodsStatus]
    },
    computedStyleLockersPageItem (item) {
      let index = 0
      if (item.type === 0) { // 0:储物箱 1:操作区
        if (item.registerId) {
          index = 1
        } else {
          index = 0
        }
      } else {
        index = 2
      }
      return this.LegendList[index]['backgroundColor'] + this.LegendList[index]['borderColor']
    },
    computedStyle (list) {
      this.loadingInstances = false
      let offsetW = 0
      let Proportion = list.height / list.width
      if (this.$refs.lockersPage && this.$refs.lockersPage.offsetWidth) {
        offsetW = this.$refs.lockersPage.offsetWidth
        this.totalHeight = this.$refs.lockersPage.offsetWidth * Proportion
      }
      this.eachItem = offsetW / list.width
    }
  },
  created () {
    if (this.currentLocker.deviceIndexCode) {
      this.currentLocker.cabinetIndexCode = this.currentLocker.deviceIndexCode
      this.getList('first')
    }
  },
  components: {
    Layout,
    Main,
    Header
  }
}
</script>

<style lang="less">
#lockersPage {
  .ea-header {
    text-align: right;
    line-height: 32px;
    .colorItem {
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-left: 14px;
      margin-right: 6px;
      position: relative;
      top: 2px;
    }
    .colorMeanItem {
      display: inline-block;
    }
  }
  .lockersPage {
    width: 100%;
    background: #fff;
    height: 100%;
    position: relative;
    .lockersPageItemBox {
      width: 272px;
      height: 191px;
      padding: 2px;
      box-sizing: border-box;
      color: #fff;
      text-align: center;
      cursor: pointer;
      box-sizing: border-box;
      background: #fbfbfb;
      position: absolute;
      .lockersPageItem {
        width: 100%;
        height: 100%;
        border-radius: 2px;
        box-sizing: border-box;
        position: relative;
        > .boxRegisterName {
          width: 100%;
          height: 100%;
          padding: 0 8px;
          position: absolute;
          top: 0;
          left: 0;
          box-sizing: border-box;
          z-index: 1;
        }
        > .popoverBtn {
          position: absolute;
          bottom: -36px;
          right: -32px;
          z-index: 2;
          box-shadow: 4px 2px 16px #ccc;
          overflow: unset;
          .arrow {
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
            border-width: 6px;
            left: 24px;
            margin-bottom: 0px;
            border-top-color: #e5e5e5;
            border-top-width: 0;
          }
          .arrow::after {
            position: absolute;
            display: block;
            width: 0;
            height: 0;
            border-color: transparent;
            border-style: solid;
            content: " ";
            border-width: 6px;
            bottom: 8px;
            left: 0px;
            border-bottom-color: #fff;
            border-top-width: 0;
          }
          &.el-button:active {
            background: #f2f2f2;
          }
        }
      }
    }
  }
  .el-dialog.alertMsgDialog {
    .el-dialog__header {
      border-bottom: none;
    }
    .el-dialog__body {
      .alertMsg {
        color: #2080f7;
        font-size: 36px;
        position: relative;
        top: 8px;
        margin-right: 16px;
      }
    }
    .el-dialog__footer {
      background-color: transparent;
    }
  }
}
</style>
