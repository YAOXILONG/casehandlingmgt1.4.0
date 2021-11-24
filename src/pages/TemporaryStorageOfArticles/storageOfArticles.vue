/* eslint-disable no-undef */
<template>
  <watermarkContent>
    <div id="storageOfArticles" class="storageOfArticles">
      <div class="listPage">
        <Layout>
          <Header :height="82">
            <PathDesc
              :path-desc-arr="[
                '物品登记',
                `${currentType == 2 ? '编辑' : '录入'}物品信息`,
              ]"
              :is-back="true"
            ></PathDesc>
            <div class="personInfo">
              <span>姓名：{{ currentRegisterInfo.registerName }}</span>
              <span
                >人员类型：{{
                  personTypeMap[currentRegisterInfo.personType]
                }}</span
              >
              <span v-if="sexMap[currentRegisterInfo.registerSex]"
                >性别：{{ sexMap[currentRegisterInfo.registerSex] }}</span
              >
              <span v-else>性别：</span>
              <span v-if="currentRegisterInfo.registerAge"
                >年龄：{{ currentRegisterInfo.registerAge }}岁</span
              >
              <span v-else>年龄：未知</span>
              <span v-show="$checkPlace"
                >手环编号：{{ currentRegisterInfo.bandsNo }}</span
              >
            </div>
          </Header>
          <Main>
            <div class="storageOfArticlesMain">
              <Layout>
                <Header :height="96">
                  <StepStatueContent
                    :current-key="2"
                    :step-statue="stepStatue"
                  ></StepStatueContent>
                </Header>
                <Main>
                  <div
                    class="storageOfArticlesInfo"
                    ref="storageOfArticlesInfo"
                  >
                    <el-scrollbar
                      wrap-class="scrollbarWrap"
                      view-class="scrollbarView"
                      ref="scrollbar"
                      @on-scrolling-y="onScrollingY"
                      tag="ul"
                    >
                      <ul
                        id="listOfArticles"
                        style="height: auto"
                        ref="listOfArticles"
                      >
                        <listOfArticles
                          ref="listOfArticlesObj"
                          :web-socket-data="webSocketData"
                          @initWebSocket="initWebSocket"
                          :goods-info-list="goodsInfoList"
                          :current-register-info="currentRegisterInfo"
                          :currentDisDoorOpened="currentDisDoorOpened"
                          :current-door-opened="currentDoorOpened"
                          @findGoods="findGoods"
                        ></listOfArticles>
                      </ul>
                      <ul
                        id="openStorage"
                        style="height: auto"
                        ref="openStorage"
                      >
                        <openStorage
                          ref="openStorageObj"
                          :current-register-info="currentRegisterInfo"
                          :current-register-name="
                            currentRegisterInfo.registerName
                          "
                          :current-door-opened="currentDoorOpened"
                        ></openStorage>
                      </ul>
                      <ul
                        id="signatureArea"
                        style="height: auto"
                        ref="signatureArea"
                      >
                        <signatureArea
                          ref="signatureAreaObj"
                          :web-socket-data="webSocketData"
                          @initWebSocket="initWebSocket"
                          :sign-obj="signObj"
                        ></signatureArea>
                      </ul>
                    </el-scrollbar>
                  </div>
                </Main>
                <Footer :height="49" class="storageOfArticlesFooter">
                  <el-button type="primary" @click="handleSubmite">
                    保存
                  </el-button>
                  <el-button @click="onBack"> 取消 </el-button>
                </Footer>
              </Layout>
              <div class="sidenav">
                <template v-for="(item, index) in navList">
                  <li
                    :targetid="'#' + item.id"
                    :class="['targetitem', { active: item.id === targetid }]"
                    @click="scrollToThere(index)"
                    :key="index"
                  >
                    <div class="targetflag"></div>
                    <div class="targetname">
                      {{ item.name }}
                    </div>
                    <div
                      class="targetline"
                      v-if="index != navList.length - 1"
                    ></div>
                  </li>
                </template>
              </div>
            </div>
          </Main>
        </Layout>
      </div>
    </div>
  </watermarkContent>
</template>
<script>
import Layout, { Main, Footer, Header } from '../../components/Layout'

import server from '../../server/temporaryStorageOfArticles'
import PathDesc from './components/PathDesc'
import StepStatueContent from '../../components/StepStatueContent/index'
import listOfArticles from './components/listOfArticles'
import openStorage from './components/openStorage'
import signatureArea from './components/signatureArea'
import bus from '../../views/temporaryStorageOfArticles/index'

export default {
  name: 'StorageOfArticles',
  data() {
    return {
      currentType: 1,
      huge: 40,
      targetid: 'listOfArticles',
      stepStatue: [0, 0, 0, 0, 0],
      navList: [
        {
          name: '物品清单',
          id: 'listOfArticles',
          height: '0',
        },
        {
          name: '开柜存放',
          id: 'openStorage',
          height: '0',
        },
        {
          name: '签字区域',
          id: 'signatureArea',
          height: '0',
        },
      ],
      currentHeight: 0,
      managerType: 1, // 管理类型（1：存放物品；2：归还物品；3：临时领取；4：临时领取物品归还）
      currentRegisterInfo: {
        currentRegisterId: null,
        registerName: '',
        bandsNo: '',
        registerSex: '',
        registerAge: '',
        personType: '',
        areaCode: '',
        doGoodsStorage: 0,
      },

      goodsInfoList: [],
      signObj: {
        policeSign: '',
        policeSignName: '',
        managerSign: '',
        managerSignName: '',
        personSign: '',
        personSignName: '',
        registerId: null,
        managerType: 2,
        roomCode: '',
        outType: 0,
      },
      currentDoorOpened: [],
      currentDisDoorOpened: [],
      personTypeMap: {},
      sexMap: {},
      //  webSocket
      websock: null,
      websocketTimer: null,
      tryTime: 0,
      timeout: 1 * 30 * 1000, // 30 seconds
      timeoutObj: null,
      webSocketData: {
        type: '',
        fileUrl: '',
        fileName: '',
      },
    }
  },
  created() {},
  mixins: [],
  methods: {
    // 获取物品清单
    async findGoods() {
      let params = {
        registerId: this.currentRegisterInfo.currentRegisterId,
      }
      let res = await server.findGoods(params)
      if (res.data.code === '0') {
        let data = res.data.data
        if (data && data.length) {
          this.goodsInfoList = JSON.parse(JSON.stringify(data))
          let doorsIndex = []
          let disDoorIndex = []
          let doors = []
          /**
           * @description: 增加判断哪些物品已全部归还
           * @author: jinxiaoxu
           * @Date: 2020-11-30 10:56:48
           */
          let currentDisDoorOpened = []
          this.goodsInfoList.forEach((v) => {
            let returnStatus = !!(v.returnStatus != 0)
            if (v.boxIndexCode) {
              if (v.returnStatus == 0) {
                if (doorsIndex.indexOf(v.boxIndexCode) == -1) {
                  let boxIndexCode = v.boxIndexCode || v.doorIndexCode
                  doorsIndex.push(boxIndexCode)
                  doors.push({
                    cabinetIndexCode: v.cabinetIndexCode,
                    cabinetName: v.cabinetName,
                    boxIndexCode: boxIndexCode,
                    doorIndexCode: boxIndexCode,
                    boxName: v.boxName,
                  })
                }
              } else {
                if (disDoorIndex.indexOf(v.boxIndexCode) == -1) {
                  let boxIndexCode = v.boxIndexCode || v.doorIndexCode
                  disDoorIndex.push(boxIndexCode)
                  currentDisDoorOpened.push({
                    cabinetIndexCode: v.cabinetIndexCode,
                    cabinetName: v.cabinetName,
                    boxIndexCode: boxIndexCode,
                    doorIndexCode: boxIndexCode,
                    boxName: v.boxName,
                  })
                }
              }
            } else {
              v.cabinetIndexCode = ''
              v.cabinetName = ''
              v.boxIndexCode = ''
              v.boxName = ''
              v.doorIndexCode = ''
            }
          })
          this.currentDoorOpened = doors
          this.currentDisDoorOpened = currentDisDoorOpened
        } else {
          this.goodsInfoList = []
          this.currentDoorOpened = []
          this.currentDisDoorOpened = []
        }
      } else {
        this.$messagebox(res)
      }
    },
    // 获取签名
    async findGoodsManagerInfo() {
      let params = {
        registerId: this.currentRegisterInfo.currentRegisterId,
        managerType: 1,
      }
      let res = await server.findGoodsManagerInfo(params)
      if (res.data.code === '0') {
        let data = res.data.data
        if (data) {
          this.signObj = {
            policeSign: data.policeSignPhotoUrl,
            policeSignName: data.policeSign,
            managerSign: data.managerSignPhotoUrl,
            managerSignName: data.managerSign,
            personSign: data.suspectSignPhotoUrl,
            personSignName: data.suspectSign,
            goodsManagerId: data.goodsManagerId,
            registerId: this.currentRegisterInfo.currentRegisterId,
            managerType: 2,
            roomCode: data.roomCode || '',
            outType: 0,
          }
        } else {
          this.signObj = {
            goodsManagerId: '',
            policeSign: '',
            policeSignName: '',
            managerSign: '',
            managerSignName: '',
            personSign: '',
            personSignName: '',
            registerId: this.currentRegisterInfo.currentRegisterId,
            managerType: 2,
            roomCode: '',
            outType: 0,
          }
        }
      } else {
        this.$messagebox(res)
      }
    },
    // 获取人员信息
    async findRegisterInfo() {
      let params = {
        registerId: this.currentRegisterInfo.currentRegisterId,
      }
      let res = await server.findRegisterInfo(params)
      if (res.data.code === '0') {
        let data = res.data.data
        if (data) {
          this.currentRegisterInfo = {
            registerName: data.registerName,
            bandsNo: data.bandsNo,
            registerSex: data.registerSex,
            registerAge: data.registerAge,
            currentRegisterId: data.registerId,
            personType: data.personType,
            areaIndexCode: data.areaCode,
            doGoodsStorage: data.doGoodsStorage,
          }
          this.stepStatue = [
            data.doBodyCheck,
            data.doGoodsStorage,
            data.doCollected,
            data.doDrugCheck,
            data.doGoodsReturn,
          ]
        }
      } else {
        this.$messagebox(res)
      }
    },
    handleSubmite() {
      // 物品清单
      let listOfArticlesObj = this.$refs.listOfArticlesObj
      listOfArticlesObj.$refs['ruleForm'].validate(async (valid) => {
        if (valid) {
          let goodsStockInfoList = listOfArticlesObj.ruleForm.goodsList // 物品清单
          let lengthKey = 0
          goodsStockInfoList.forEach((v) => {
            if (v.returnStatus == 0) {
              lengthKey++
            }
          })
          if (lengthKey === 0 && !listOfArticlesObj.noBelongings) {
            return this.$message('有效的物品清单不能为空！')
          }

          // // 开柜存放
          // let openStorageObj = this.$refs.openStorageObj
          let boxBelongList = JSON.parse(JSON.stringify(this.currentDoorOpened))
          // // 签字区域
          let signatureAreaObj = this.$refs.signatureAreaObj
          let goodsManagerInfo = {
            registerId: this.currentRegisterInfo.currentRegisterId,
            managerType: 1,
            policeSign: signatureAreaObj.signItemObject.policeSign.fileName,
            managerSign: signatureAreaObj.signItemObject.managerSign.fileName,
            suspectSign: signatureAreaObj.signItemObject.personSign.fileName,
            goodsManagerId: signatureAreaObj.signObj.goodsManagerId,
            roomCode: '',
            outType: 0,
          }
          let params = {
            goodsStockInfoList: goodsStockInfoList,
            boxBelongList: boxBelongList,
            goodsManagerInfo: goodsManagerInfo,
          }
          let loadingInstance = this.$loading({
            fullscreen: true,
            text: '保存中...',
          })
          try {
            let res = await server.saveStoreGoods(params)
            if (res.data.code === '0') {
              loadingInstance.close()
              this.$message.success('保存成功')
              this.onBack()
            } else {
              loadingInstance.close()
              setTimeout(() => {
                loadingInstance.close()
                this.$messagebox(res)
              }, 500)
            }
          } catch {
            setTimeout(() => {
              loadingInstance.close()
            }, 500)
          }
        }
      })
    },
    initWebSocket(webMsg, _type, content) {
      let _self = this
      // 参数
      // let sendMsg = webMsg //'{"comment":{"commenttype":"startapp", "context":"noteFormatClientprotocol", "commentcmd":"noteFormatClientprotocol://nginxIP:' + webMsg.nginxIp + ';nginxport:' + webMsg.nginxPort + ';sg:' + webMsg.sg + ';protocol:' + webMsg.protocol + ';componentID:' + webMsg.componentId + ';servicetype:' + webMsg.serviceType + ';noteTemplateId:' + webMsg.id + ';language:' + webMsg.language + ';"}}'
      let sendMsg =
        '{"comment":{"commenttype":"startapp", "context":"btoolsprotocol", "commentcmd":"' +
        webMsg +
        ';"}}'
      let socketHost =
        window.location.protocol.indexOf('https') > -1
          ? 'wss://127.0.0.1:18001/WebS_Js'
          : 'ws://127.0.0.1:18000/WebS_Js'
      try {
        if (!_self.websock) {
          _self.websock = new WebSocket(socketHost)
          _self.websock.onopen = function () {
            // 发送检测插件助手是否安装请求
            let jsonObj =
              '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol"}}'
            _self.websock.send(jsonObj)
          }
        } else {
          let jsonObj =
            '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol"}}'

          _self.websock.send(jsonObj)
        }
        _self.websock.onerror = function () {
          // 连接失败，通信中间件未安装
          _self.$message('检测到您未安装插件助手')
        }
        _self.websock.onmessage = async (data) => {
          let _data = JSON.parse(data.data)
          if (
            _data &&
            _data.comment &&
            _data.comment.commenttype === 'checkapp'
          ) {
            // 检测插件助手是否安装
            if (_data.comment.resultCode === '1') {
              // 模板笔录编辑
              let jsonObj = sendMsg
              _self.websock.send(jsonObj)
            } else {
              _self.$message('检测到您未安装插件助手')
            }
          } else if (_data && _data.Code === 0 && _data.Result) {
            if (_data.Result.Data && _data.Result.Data.ImgData) {
              let base64Str = _data.Result.Data.ImgData
              let res = await server.uploadbase64({ base64Str })
              if (res && res.data && res.data.code === '0') {
                _self.webSocketData = {
                  type: _type,
                  fileUrl: res.data.data.fileUrl,
                  fileName: res.data.data.fileName,
                }
              } else {
                _self.$messagebox(res)
                // _self.$message.error(_self.$t(res.data.code))
              }
            }
          } else {
            if (_data.fileUrl && _data.fileName) {
              _self.webSocketData = {
                type: _type,
                fileUrl: _data.fileUrl,
                fileName: _data.fileName,
              }
            }
          }
        }
        _self.websock.onclose = function () {
          _self.websock = null
        }
      } catch (err) {
        console.log(err)
      }
    },
    onScrollingY(item) {
      this.computedHeight()
      let $el = this.$refs.scrollbar
      let _scrollTop = item.scrollTop
      // $el.setScroll(_scrollTop)
      let list = this.navList
      let height = 0
      for (let i = 0; i < list.length; i++) {
        height += list[i].height
        let _height =
          _scrollTop === 0 ? _scrollTop : _scrollTop + this.currentHeight * 0.5
        if (height >= _height) {
          if (item.percentY > 0.99) {
            this.targetid = this.navList[list.length - 1].id
          } else {
            this.targetid = this.navList[i].id
          }
          break
        }
      }
    },
    computedHeight() {
      this.navList[0].height = this.$refs.listOfArticles
        ? this.$refs.listOfArticles.offsetHeight
        : 0
      this.navList[1].height = this.$refs.openStorage
        ? this.$refs.openStorage.offsetHeight
        : 0
      this.navList[2].height = this.$refs.signatureArea
        ? this.$refs.signatureArea.offsetHeight
        : 0
      this.currentHeight = this.$refs.storageOfArticlesInfo
        ? this.$refs.storageOfArticlesInfo.offsetHeight
        : 100
    },
    scrollToThere(index) {
      this.computedHeight()
      let $el = this.$refs.scrollbar
      let scrollTop = '0'
      for (let i = 0; i < index; i++) {
        scrollTop = scrollTop - 0 + this.navList[i].height + ''
      }
      $el.setScroll(scrollTop)
      this.targetid = this.navList[index].id
      setTimeout(() => {
        this.targetid = this.navList[index].id
      }, 10)
    },
    handlePush(item) {
      console.log('========', item)
      let openStorageObj = this.$refs.openStorageObj
      let currentLocker = JSON.parse(
        JSON.stringify(openStorageObj.currentLocker)
      )
      let currentLockerName = currentLocker.name
      let data = JSON.parse(JSON.stringify(item))
      if (!data.boxName) {
        data.boxName = currentLockerName + data.code
      }

      if (!data.areaIndexCode) {
        data.areaIndexCode = this.currentRegisterInfo.areaIndexCode
      }
      data.registerId = this.currentRegisterInfo.currentRegisterId
      if (!data.doorOpenType) {
        data.doorOpenType = 0
      }
      this.currentDoorOpened.push(data)
      let listOfArticlesObj = this.$refs.listOfArticlesObj
      listOfArticlesObj &&
        listOfArticlesObj.ruleForm &&
        listOfArticlesObj.ruleForm.goodsList.forEach((v) => {
          if (!v.boxIndexCode) {
            // 储物柜设备编号
            v.cabinetIndexCode = this.currentDoorOpened[0].cabinetIndexCode
            // 储物柜设备名称
            v.cabinetName = this.currentDoorOpened[0].cabinetName
            // 柜门编号  boxIndexCode===doorIndexCode
            v.boxIndexCode = this.currentDoorOpened[0].boxIndexCode
            // 柜号
            v.boxName = this.currentDoorOpened[0].boxName
            // 柜门编号   boxIndexCode===doorIndexCode
            v.doorIndexCode = this.currentDoorOpened[0].boxIndexCode
          }
          console.log(v)
        })
    },
    handlePop(item) {
      let list = JSON.parse(JSON.stringify(this.currentDoorOpened))
      let array = []
      for (let i = 0; i < list.length; i++) {
        if (list[i].boxIndexCode !== item.doorIndexCode) {
          array.push(JSON.parse(JSON.stringify(list[i])))
        }
      }
      this.currentDoorOpened = JSON.parse(JSON.stringify(array))
      let listOfArticlesObj = this.$refs.listOfArticlesObj
      listOfArticlesObj &&
        listOfArticlesObj.ruleForm &&
        listOfArticlesObj.ruleForm.goodsList.forEach((v) => {
          if (v.boxIndexCode === item.doorIndexCode) {
            if (this.currentDoorOpened.length == 0) {
              // 储物柜设备编号
              v.cabinetIndexCode = ''
              // 储物柜设备名称
              v.cabinetName = ''
              // 柜门编号  boxIndexCode===doorIndexCode
              v.boxIndexCode = ''
              // 柜号
              v.boxName = ''
              // 柜门编号   boxIndexCode===doorIndexCode
              v.doorIndexCode = ''
            } else {
              // 储物柜设备编号
              v.cabinetIndexCode = this.currentDoorOpened[0].cabinetIndexCode
              // 储物柜设备名称
              v.cabinetName = this.currentDoorOpened[0].cabinetName
              // 柜门编号  boxIndexCode===doorIndexCode
              v.boxIndexCode = this.currentDoorOpened[0].boxIndexCode
              // 柜号
              v.boxName = this.currentDoorOpened[0].boxName
              // 柜门编号   boxIndexCode===doorIndexCode
              v.doorIndexCode = this.currentDoorOpened[0].boxIndexCode
            }
          }
          console.log(v)
        })
    },
    onBack() {
      this.$router.push({ path: '/', query: {} })
    },
    // 数据字典
    async inqDict() {
      let res = await server.inqDict()
      if (res.data.code === '0') {
        let data = res.data.data
        let sexData = data.sex
        let personType = data.suspectType
        this.sexMap = this.computedDic(sexData)
        this.personTypeMap = this.computedDic(personType)
      } else {
        this.$messagebox(res)
      }
    },
    computedDic(list) {
      let dicMap = {}
      if (list && list.length) {
        for (let i = 0; i < list.length; i++) {
          dicMap[list[i].key] = list[i].name
        }
      }
      return dicMap
    },
  },
  async mounted() {
    bus.$off('handlePush')
    bus.$off('handlePop')
    bus.$on('handlePush', (res) => {
      this.handlePush(JSON.parse(JSON.stringify(res)))
    })
    bus.$on('handlePop', (res) => {
      this.handlePop(JSON.parse(JSON.stringify(res)))
    })
    this.inqDict()
    let data = this.$route.query
    this.currentType = data.type
    this.currentRegisterInfo.currentRegisterId = data.id
    this.signObj.registerId = data.id
    await this.findRegisterInfo()
    this.findGoods()
    this.findGoodsManagerInfo()
    
  },
  components: {
    Layout,
    Main,
    Footer,
    Header,
    StepStatueContent,
    listOfArticles,
    signatureArea,
    openStorage,
    PathDesc,
  },
  destroyed() {
    if (this.websock) {
      this.websock.onclose()
    }
  },
}
</script>
<style lang="less" rel="stylesheet/less">
.storageOfArticles {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .listPage {
    height: 100%;
    .back {
      cursor: pointer;
    }
    .personInfo {
      background: #ffffff;
      padding-left: 36px;
      font-size: 14px;
      color: #999999;
      padding-bottom: 14px;
      position: relative;
      top: -1px;
      border-bottom: solid 1px #e5e5e5;
      > span {
        margin-right: 32px;
      }
    }
    .storageOfArticlesMain {
      height: 100%;
      position: relative;
      padding: 8px 146px 8px 8px !important;
      box-sizing: border-box;
      background: #f2f2f2;
      .storageOfArticlesInfo {
        background: #fff;
        height: 100%;
        .scrollbarWrap {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }
      }
      .storageOfArticlesFooter {
        background: #ffffff;
        box-shadow: inset 0 1px 0 0 #e6e6e6;
        text-align: center;
        padding-top: 8px;
        box-sizing: border-box;
        > .el-button {
          min-width: 96px;
          > span {
            display: inline-block;
            width: 50%;
            text-align-last: justify;
            text-align: justify;
            text-justify: distribute-all-lines;
          }
        }
      }
    }
    .sidenav {
      width: 114px;
      height: 148px;
      position: absolute;
      top: 24px;
      right: 16px;
      .targetitem {
        list-style: none;
        box-sizing: border-box;
        width: 160px;
        height: 42px;
        padding-left: 4.5px;
        position: relative;
        background-repeat: repeat-y;
        background-position: 23px 0;
        cursor: pointer;
        .targetname {
          display: inline-block;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #4d4d4d;
          letter-spacing: 0;
          width: 88px;
          height: 20px;
          box-sizing: border-box;
          line-height: 20px;
          padding-left: 24px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .targetflag {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 100%;
          border: 3px solid #2080f7;
          background-color: #f2f2f2;
          box-sizing: border-box;
          top: 4px;
          position: absolute;
        }
        .targetline {
          height: 32px;
          width: 2px;
          background: #e6e6e6;
          position: absolute;
          top: 16px;
          left: 9.5px;
        }
        &.active {
          .targetname {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #2080f7;
            letter-spacing: 0;
            line-height: 20px;
          }
        }
      }
    }
  }
}
</style>
