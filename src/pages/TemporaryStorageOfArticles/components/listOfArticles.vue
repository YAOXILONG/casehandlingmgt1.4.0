<template>
  <!-- 物品清单 -->
  <div class="listOfArticlesPage">
    <div class="mainContent">
      <Layout>
        <Header :height="42">
          <div class="listOfArticlesPageTitle">
            <span> 物品清单 </span>
          </div>
        </Header>
        <Main>
          <div class="effectsWrap">
            <div class="right-toolbar">
              <el-button
                type="iconButton"
                icon="h-icon-add"
                @click="onAddLine"
                :disabled="noBelongings"
              >
                添加
              </el-button>
              <el-button
                type="iconButton"
                icon="h-icon-delete"
                @click="onDelete()"
                :disabled="noBelongings"
              >
                删除
              </el-button>
              <el-checkbox v-model="noBelongings" :disabled="returnStatuKey" @change="changeBelongings"
                >无随身物品</el-checkbox
              >
            </div>
            <div class="listHeader">
              <el-row style="border-bottom: 1px solid #ccc">
                <div
                  class="el-col"
                  style="width: 40px; padding: 10px 0 10px 16px"
                >
                  <div style="padding-left: 0">
                    <el-checkbox
                      :indeterminate="isIndeterminate"
                      v-model="checkAll"
                      @change="handleCheckAllChange"
                    >
                    </el-checkbox>
                  </div>
                </div>
                <div class="el-col" style="width: 50px">
                  <div class="cell" title="序号">序号</div>
                </div>
                <div class="el-col" style="width: calc(50% - 455px)">
                  <div class="cell" title="物品名称">
                    <span style="color: #f00; padding-right: 4px"> * </span>
                    物品名称
                  </div>
                </div>
                <div class="el-col" style="width: 125px">
                  <div class="cell" title="数量">
                    <span style="color: #f00; padding-right: 4px"> * </span>
                    数量
                  </div>
                </div>
                <div class="el-col" style="width: 120px">
                  <div class="cell" title="单位">单位</div>
                </div>
                <div class="el-col" style="width: 120px">
                  <div class="cell" title="保管措施">保管措施</div>
                </div>
                <div class="el-col" style="width: 80px">
                  <div class="cell" title="涉案物品">涉案物品</div>
                </div>
                <div class="el-col" style="width: calc(50% - 455px)">
                  <div class="cell" title="物品描述">物品描述</div>
                </div>
                <div class="el-col" style="width: 150px">
                  <div class="cell" title="保管柜号">保管柜号</div>
                </div>
                <div class="el-col" style="width: 100px">
                  <div class="cell" title="存入照片">存入照片</div>
                </div>
                <div class="el-col" style="width: 125px">
                  <div class="cell" style="border: 0">操作</div>
                </div>
              </el-row>
            </div>
            <div class="listWrap">
              <el-form
                :model="ruleForm"
                ref="ruleForm"
                label-width="0px"
                class="demo-ruleForm"
                :gutter="20"
              >
                <!-- message-position="right" -->
                <el-checkbox-group
                  v-model="checkedId"
                  @change="handleCheckedCitiesChange"
                >
                  <div
                    class="listLine"
                    v-for="(item, index) in ruleForm.goodsList"
                    :key="index"
                  >
                    <el-row>
                      <div
                        class="el-col"
                        style="width: 40px; padding: 10px 0 0 16px"
                      >
                        <div class="cell" style="line-height: 24px">
                          <el-checkbox
                            :label="index"
                            :disabled="item.returnStatus != 0"
                            :show-label="false"
                          >
                          </el-checkbox>
                        </div>
                      </div>
                      <div class="el-col" style="width: 50px">
                        <div
                          class="cell"
                          style="
                            line-height: 32px;
                            font-size: 14px;
                            text-align: center;
                          "
                        >
                          <!--序号-->
                          {{ index + 1 }}
                        </div>
                      </div>
                      <div class="el-col" style="width: calc(50% - 455px)">
                        <div class="cell">
                          <!-- 物品名称 -->
                          <el-form-item
                            label=""
                            :key="item.key"
                            :prop="'goodsList.' + index + '.goodsName'"
                            content-width="calc(100% - 16px)"
                            :rules="rules.name"
                          >
                            <!-- <el-input
                              v-model="item.goodsName"
                              :title="item.goodsName"
                            >
                            </el-input>-->
                            <el-select
                              :filterable="true"
                              :allow-create="true"
                              :disabled="item.returnStatus != 0"
                              v-model="item.goodsName"
                              :title="item.goodsName"
                              @change="changeGoods(item.goodsName, index)"
                            >
                              <el-option
                                v-for="item in Object.keys(
                                  goodsNameList[index]
                                )"
                                :key="item"
                                :label="item"
                                :value="item"
                              >
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </div>
                      </div>
                      <div class="el-col" style="width: 125px">
                        <div class="cell">
                          <!--数量-->
                          <el-form-item
                            label=""
                            :key="item.key"
                            :prop="'goodsList.' + index + '.stockNum'"
                            content-width="calc(100% - 8px)"
                            :rules="rules.number"
                          >
                            <el-input
                              v-model="item.stockNum"
                              :disabled="item.returnStatus != 0"
                              :title="item.stockNum"
                            >
                            </el-input>
                          </el-form-item>
                        </div>
                      </div>
                      <div class="el-col" style="width: 110px">
                        <div class="cell">
                          <!--单位-->
                          <el-form-item
                            label=""
                            :key="item.key"
                            :prop="'goodsList.' + index + '.goodsUnit'"
                            content-width="calc(100% - 8px)"
                            :rules="rules.goodsUnit"
                          >
                            <el-input
                              v-model="item.goodsUnit"
                              :disabled="item.returnStatus != 0"
                              :title="item.goodsUnit"
                            >
                            </el-input>
                          </el-form-item>
                        </div>
                      </div>
                      <div class="el-col" style="width: 130px">
                        <div class="cell">
                          <!--保管措施-->
                          <el-form-item
                            label=""
                            :key="item.key"
                            :prop="'goodsList.' + index + '.keepType'"
                            content-width="calc(100% - 8px)"
                          >
                            <el-select
                              v-model="item.keepType"
                              :disabled="item.returnStatus != 0"
                            >
                              <el-option label="扣押" :value="1"> </el-option>
                              <el-option label="暂存" :value="2"> </el-option>
                              <el-option label="代保管" :value="3"> </el-option>
                            </el-select>
                          </el-form-item>
                        </div>
                      </div>
                      <div class="el-col" style="width: 80px">
                        <div class="cell">
                          <!--涉案物品-->
                          <el-form-item
                            label=""
                            :key="item.key"
                            :prop="'goodsList.' + index + '.goodsType'"
                            content-width="calc(100% - 8px)"
                          >
                            <el-select
                              v-model="item.goodsType"
                              :disabled="item.returnStatus != 0"
                            >
                              <el-option label="是" :value="0"> </el-option>
                              <el-option label="否" :value="1"> </el-option>
                            </el-select>
                          </el-form-item>
                        </div>
                      </div>
                      <div class="el-col" style="width: calc(50% - 455px)">
                        <div class="cell">
                          <!--物品描述-->
                          <el-form-item
                            label=""
                            :key="item.key"
                            :prop="'goodsList.' + index + '.goodsDesc'"
                            content-width="calc(100% - 16px)"
                            :rules="rules.goodsDesc"
                          >
                            <el-input
                              v-model="item.goodsDesc"
                              :disabled="item.returnStatus != 0"
                              :title="item.goodsDesc"
                            >
                            </el-input>
                          </el-form-item>
                        </div>
                      </div>
                      <div class="el-col" style="width: 150px">
                        <div class="cell">
                          <!--保管柜号-->
                          <!-- <div class="cell-item"
                               :title="item.boxName">
                            {{ item.boxName }}
                          </div> -->
                          <el-form-item
                            label=""
                            :key="item.key"
                            :prop="'goodsList.' + index + '.goodsName'"
                            content-width="calc(100% - 16px)"
                            :rules="rules.boxIndexCode"
                          >
                            <!-- <el-input
                              v-model="item.goodsName"
                              :title="item.goodsName"
                            >
                            </el-input>-->
                            <el-select
                              :filterable="true"
                              v-show="item.returnStatus == 0"
                              :allow-create="true"
                              v-model="item.boxIndexCode"
                              :title="item.boxName"
                              @change="changeDoors(item, index, $event)"
                            >
                              <el-option
                                v-for="itemd in currentDoorOpened"
                                :key="itemd.boxIndexCode"
                                :disabled="itemd.used == 1 ? true : false"
                                :label="itemd.boxName"
                                :value="itemd.boxIndexCode"
                              >
                              </el-option>
                            </el-select>
                            <el-select
                              :filterable="true"
                              v-show="item.returnStatus != 0"
                              :disabled="true"
                              :allow-create="true"
                              v-model="item.boxIndexCode"
                              :title="item.boxName"
                              @change="changeDoors(item, index, $event)"
                            >
                              <el-option
                                v-for="itemd in currentDisDoorOpened"
                                :key="itemd.boxIndexCode"
                                :disabled="itemd.used == 1 ? true : false"
                                :label="itemd.boxName"
                                :value="itemd.boxIndexCode"
                              >
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </div>
                      </div>
                      <div class="el-col" style="width: 100px">
                        <div class="cell">
                          <!--存入照片-->
                          <div class="cell-item">
                            <span
                              class="operationBtn goodsPhoto"
                              :title="item.goodsPhoto"
                              v-show="item.goodsPhoto"
                              @click="
                                handleShowPhoto('存入照片', item.goodsPhoto)
                              "
                              >{{ item.goodsPhoto }}
                              <i
                                class="canDelete h-icon-close"
                                title="删除"
                                v-show="item.returnStatus == 0"
                                @click.stop.prevent="
                                  handleDeleteShowPhoto(item, index)
                                "
                              ></i>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="el-col" style="width: 125px">
                        <div class="cell" style="border: 0">
                          <!--操作-->
                          <span
                            title="抓拍"
                            v-show="!item.goodsPhoto && item.returnStatus == 0"
                            class="operationBtn"
                            @click="onSnap(item, index)"
                            >抓拍</span
                          >
                          <span
                            title="重新抓拍"
                            v-show="item.goodsPhoto && item.returnStatus == 0"
                            class="operationBtn"
                            @click="onSnap(item, index)"
                            >重新抓拍</span
                          >
                          <span
                            class="dividingLine"
                            v-show="item.returnStatus == 0"
                            >|</span
                          >
                          <span
                            title="删除"
                            class="operationBtn"
                            v-show="item.returnStatus == 0"
                            @click="onDelete(item, index)"
                            >删除</span
                          >
                        </div>
                      </div>
                    </el-row>
                  </div>
                </el-checkbox-group>
              </el-form>
            </div>
          </div>
        </Main>
      </Layout>
    </div>
    <ShowPhoto
      :dialog-visible="dialogVisible"
      :img-url="imgUrl"
      @closeShowPhoto="handleCloseShowPhoto"
      :dialog-visible-title="dialogVisibleTitle"
    ></ShowPhoto>
  </div>
</template>

<script>
import Layout, { Main, Header } from '../../../components/Layout'
import server from '../../../server/temporaryStorageOfArticles'
import ShowPhoto from '../../../components/ShowPhoto/index'
export default {
  name: 'ListOfArticles',
  props: {
    goodsInfoList: {
      type: Array,
      default: () => {
        return []
      },
    },
    currentDoorOpened: {
      type: Array,
      default: () => {
        return []
      },
    },
    currentDisDoorOpened: {
      type: Array,
      default: () => {
        return []
      },
    },
    currentRegisterInfo: {
      type: Object,
      default: () => {
        return {}
      },
    },
    webSocketData: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  computed: {
    doorsListMap() {
      let _map = {}
      this.currentDoorOpened.forEach((v) => {
        _map[v.boxIndexCode] = v.boxName
      })
      return _map
    },
  },
  watch: {
    goodsInfoList: {
      immediate: true,
      deep: true,
      handler: function (newVal, oldVal) {
        if (newVal && newVal.length) {
          this.noBelongings = false
          let _data = JSON.parse(JSON.stringify(newVal))
          this.ruleForm.goodsList = JSON.parse(JSON.stringify(_data))
          for(let i=0;i <_data.length;i++){
           let v = _data[i]
           if(v.returnStatus){
             this.returnStatuKey = true
             break
           }
          }
          const goodsInfoListMap = {}
          const suspectPersonalBelongings = {}
          const goodsNameList = []
          _data &&
            _data.forEach((_v) => {
              goodsInfoListMap[_v.goodsName] = true
              let _map = {}
              _map[_v.goodsName] = _v.goodsUnit
              goodsNameList.push(_map)
            })
          Object.keys(this.suspectPersonalBelongingsMap).forEach((v) => {
            let _data = this.suspectPersonalBelongingsMap[v]
            if (_data.used == 0) {
              suspectPersonalBelongings[_data.key] = _data.value
            } else if (goodsInfoListMap[v]) {
              suspectPersonalBelongings[_data.key] = _data.value
            }
          })
          this.dictData = {
            certificateType: suspectPersonalBelongings,
          }
          let _goodsNameList = []
          goodsNameList.forEach((v) => {
            _goodsNameList.push({
              ...this.dictData.certificateType,
              ...v,
            })
          })
          this.goodsNameList = _goodsNameList
        } else {
          if (this.currentRegisterInfo.doGoodsStorage == 1) {
            this.noBelongings = true
          } else {
            this.noBelongings = false
          }
        }
      },
    },
    webSocketData: {
      handler: function (newVal, oldVal) {
        if (newVal.type === 'photo') {
          if (this.ruleForm.goodsList[this.currentPhoto]) {
            this.ruleForm.goodsList[this.currentPhoto]['goodsPhoto'] =
              newVal.fileName
          }
        }
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    let validateCommon = (rule, value, callback) => {
      if (value && value.length) {
        if (/['/\\:*?""<>|]/g.test(value)) {
          callback(new Error('不能包含 \' / \\ : * ? " < > | 这些特殊字符'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    let validateNumber = (rule, val, callback) => {
      let value = val === null ? '' : val + ''
      if (value && value.length) {
        if (!/^[1-9]\d{0,5}$/g.test(val)) {
          callback(new Error('请输入1~999999的正整数！'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入'))
      }
    }
    return {
      ruleForm: {
        goodsList: JSON.parse(JSON.stringify(this.goodsInfoList)),
        LocalList: [],
      },
      rules: {
        name: [
          { required: true, message: '请输入' },
          { min: 1, max: 50, message: '请输入1~50个字符' },
          { validator: validateCommon },
        ],
        number: [{ validator: validateNumber }],
        goodsUnit: [
          { min: 0, max: 20, message: '请输入0~20个字符' },
          { validator: validateCommon },
        ],
        goodsDesc: [
          { min: 0, max: 100, message: '请输入0~100个字符' },
          { validator: validateCommon },
        ],
      },
      checkedId: [],
      checkAll: false,
      isIndeterminate: false,
      dialogVisibleTitle: '',
      imgUrl: '',
      dialogVisible: false,
      currentwebSocketData: {},
      currentPhoto: null,
      dictData: {
        certificateType: [], // 暂时代替物品名称数据字典
      },
      goodsNameList: [],
      suspectPersonalBelongingsMap: {},
      noBelongings: false,
      returnStatuKey:false
    }
  },
  methods: {
    changeDoors(val, index, e) {
      const _item = this.ruleForm.goodsList[index]
      this.ruleForm.goodsList.splice(index, 1, {
        ..._item,
        boxName: this.doorsListMap[_item.boxIndexCode],
      })
    },
    changeGoods(val, index) {
      this.ruleForm.goodsList[index].goodsUnit =
        this.dictData.certificateType[val]
      const _item = this.ruleForm.goodsList[index]
      this.ruleForm.goodsList.splice(index, 1, { ..._item })
    },
    handleCheckAllChange(value, event) {
      if (value) {
        let ids = []
        this.ruleForm.goodsList.forEach((v, i) => {
          v.returnStatus == 0 && ids.push(i)
        })
        this.checkedId = ids
      } else {
        this.checkedId = []
      }
      // this.checkedId = value ? this.ruleForm.goodsList.map((v, i) => i) : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.ruleForm.goodsList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.ruleForm.goodsList.length
    },
    onDelete(item, index) {
      if (item) {
        // 单个操作
        this.handleDelete([index])
      } else {
        // 批量操作
        this.handleDelete(this.checkedId)
      }
    },
    // 删除
    handleDelete(array) {
      if (array && array.length) {
        let _goodsList = JSON.parse(JSON.stringify(this.ruleForm.goodsList))
        let _array = JSON.parse(JSON.stringify(array))
        let _newArray = []
        _goodsList.forEach((item, i) => {
          let flag = false
          _array.forEach((_item, j) => {
            if (i === _array[j]) {
              flag = true
            }
          })
          if (!flag) {
            _newArray.push(_goodsList[i])
          }
        })
        _goodsList = JSON.parse(JSON.stringify(_newArray))
        this.ruleForm.goodsList = JSON.parse(JSON.stringify(_goodsList))
        this.checkedId = []
        this.checkAll = false
        this.isIndeterminate = false
      } else {
        this.$message({
          message: '请选择删除内容',
          type: 'warning',
        })
      }
    },
    // 添加
    onAddLine() {
      if (this.ruleForm.goodsList && this.ruleForm.goodsList.length === 20) {
        this.$message({
          message: '最多20条',
          type: 'warning',
        })
        return false
      }
      // 储物柜设备编号
      //   v.cabinetIndexCode = this.currentDoorOpened[0].cabinetIndexCode
      // 储物柜设备名称
      //   v.cabinetName = this.currentDoorOpened[0].cabinetName
      // 柜门编号  boxIndexCode===doorIndexCode
      //   v.boxIndexCode = this.currentDoorOpened[0].boxIndexCode
      // 柜号
      //   v.boxName = this.currentDoorOpened[0].boxName
      // 柜门编号   boxIndexCode===doorIndexCode
      //   v.doorIndexCode = this.currentDoorOpened[0].doorIndexCode
      this.ruleForm.goodsList.push({
        registerId: this.currentRegisterInfo.currentRegisterId,
        goodsName: '',
        stockNum: null,
        goodsType: 1,
        returnStatus: 0,
        goodsUnit: '',
        keepType: 2,
        goodsDesc: '',
        goodsPhoto: '',
        goodsPhoto2: '',
        $index: this.ruleForm.goodsList.length + 1,
        cabinetIndexCode: this.currentDoorOpened.length
          ? this.currentDoorOpened[0].cabinetIndexCode
          : '',
        cabinetName: this.currentDoorOpened.length
          ? this.currentDoorOpened[0].cabinetName
          : '',
        doorIndexCode: this.currentDoorOpened.length
          ? this.currentDoorOpened[0].doorIndexCode
          : '',
        boxName: this.currentDoorOpened.length
          ? this.currentDoorOpened[0].boxName
          : '',
        boxIndexCode: this.currentDoorOpened.length
          ? this.currentDoorOpened[0].doorIndexCode
          : '',
      })
      this.goodsNameList.push({
        ...this.dictData.certificateType,
      })
    },
    handleDeleteShowPhoto(item, index) {
      item.goodsPhoto = ''
      this.goodsInfoList[index] = JSON.parse(JSON.stringify(item))
    },
    handleShowPhoto(title, url) {
      this.imgUrl = url
      this.dialogVisibleTitle = title
      this.dialogVisible = true
    },
    handleCloseShowPhoto(res) {
      let bloon = !!res
      this.imgUrl = ''
      this.dialogVisible = bloon
    },
    // 抓拍
    async onSnap(item, index) {
      let _self = this
      let params = {
        roomType:'roomType.3008',
        cameraMarks: 'roomType.3008',
        areaCode: this.currentRegisterInfo.areaIndexCode,
      }
      const ress = await server.findCameraCaptureInfo(params)

      let res = ress.data
      if (res.code === '0') {
        let data = res.data
        let language = data.language ? data.language : 'zh_CN'
        let cameraType = data.cameraType // USB相机usbCamera;网络摄像机ipCamera;高拍仪highMeter
        let protocolType = data.protocolType // http https
        let indexCode = data.indexCode
        let NginxIp = data.nginxIp
        let NginxPort = data.nginxPort
        let sg = data.sg
        let context = data.context
        let hikUrl = null
        switch (cameraType) {
          case 'usbCamera': // ①USB相机模式
            hikUrl =
              'btoolsprotocol://CenterUrl:' +
              this.$centerUrl +
              ';toollist:PROT_imagecaptureprotocol;CmdLine:imagecaptureprotocol://language:' +
              language +
              ';cameraType:' +
              cameraType +
              ';NginxIp:' +
              NginxIp +
              ';NginxPort:' +
              NginxPort +
              ';sg:' +
              sg +
              ';protocolType:' +
              protocolType +
              ';context:' +
              context +
              ';faceMode:0;'
            break
          case 'ipCamera': // ②网络摄像机模式
            hikUrl =
              'btoolsprotocol://CenterUrl:' +
              this.$centerUrl +
              ';toollist:PROT_imagecaptureprotocol;CmdLine:imagecaptureprotocol://language:' +
              language +
              ';cameraType:' +
              cameraType +
              ';indexCode:' +
              indexCode +
              ';NginxIp:' +
              NginxIp +
              ';NginxPort:' +
              NginxPort +
              ';sg:' +
              sg +
              ';protocolType:' +
              protocolType +
              ';context:' +
              context
            break
          case 'highMeter': // ③高拍仪模式
            hikUrl =
              'btoolsprotocol://CenterUrl:' +
              this.$centerUrl +
              ';toollist:PROT_imagecaptureprotocol;CmdLine:imagecaptureprotocol://language:' +
              language +
              ';cameraType:' +
              cameraType +
              ';NginxIp:' +
              NginxIp +
              ';NginxPort:' +
              NginxPort +
              ';sg:' +
              sg +
              ';protocolType:' +
              protocolType +
              ';context:' +
              context
            break
        }
        _self.currentPhoto = index
        _self.$emit('initWebSocket', hikUrl, 'photo', 'imagecaptureprotocol')
      } else {
        this.$messagebox(ress)
      }
    },
    computedLocalListList() {
      let data = JSON.parse(JSON.stringify(this.ruleForm.goodsList))
      let array = []
      for (let i = 0; i < data.length; i++) {
        if (!data[i].goodsId) {
          data[i].cabinetCode = this.goodsBox.cabinetCode
          data[i].boxCode = this.goodsBox.boxCode
          data[i].boxName = this.goodsBox.boxName
          array.push(data[i])
        }
      }
      this.ruleForm.LocalList = JSON.parse(JSON.stringify(array))
    },
    // 获取字典
    async inqDict() {
      const result = await server.inqDict()
      const { data } = result
      if (data.code === '0') {
        const suspectPersonalBelongings = {}
        const suspectPersonalBelongingsMap = {}
        const goodsInfoListMap = {}
        const goodsNameList = []
        this.goodsInfoList &&
          this.goodsInfoList.forEach((_v) => {
            goodsInfoListMap[_v.goodsName] = true
            let _map = {}
            _map[_v.goodsName] = _v.goodsUnit
            goodsNameList.push(_map)
          })
        data.data.suspectPersonalBelongings &&
          data.data.suspectPersonalBelongings.forEach((v) => {
            const name = v.name
            const key = name.split('(')[0]
            const value = name.split('(')[1].replace(')', '')
            if (v.used == '0') {
              suspectPersonalBelongings[key] = value
            } else {
              if (goodsInfoListMap[key]) {
                suspectPersonalBelongings[key] = value
              }
            }
            suspectPersonalBelongingsMap[key] = {
              key: key,
              value: value,
              used: v.used,
            }
          })
        this.suspectPersonalBelongingsMap = suspectPersonalBelongingsMap
        this.dictData = {
          certificateType: suspectPersonalBelongings,
        }
        let _goodsNameList = []
        goodsNameList.forEach((v) => {
          _goodsNameList.push({
            ...this.dictData.certificateType,
            ...v,
          })
        })
        this.goodsNameList = _goodsNameList
      } else {
        this.$messagebox(result)
      }
    },
    changeBelongings(val) {
      console.log('changeBelongings', val)
      if (val && this.ruleForm.goodsList.length) {
        this.$confirm('此操作将删除物品信息, 是否继续?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'question',
          onConfirm: () => {
            this.ruleForm.goodsList = []
          },
          onCancel :()=>{
            this.noBelongings = !val
          }
        })
      }
    },
  },
  components: {
    Layout,
    Main,
    Header,
    ShowPhoto,
  },
  created() {
    this.inqDict() // 获取字典列表
  },
}
</script>

<style lang="less">
.listOfArticlesPage {
  height: auto;
  padding-bottom: 10px;
  box-sizing: border-box;
  background: #f2f2f2;
  .mainContent {
    height: auto;
    background: #ffffff;
    .listOfArticlesPageTitle {
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
    }
    .effectsWrap {
      min-height: 240px;
      padding: 0 16px;
      box-sizing: border-box;
      overflow: hidden;
      .right-toolbar {
        height: 48px;
        padding: 8px 0px;
        box-sizing: border-box;
        border-bottom: 1px solid #ccc;
        > .el-checkbox {
          top: 4px;
        }
      }
      .el-row {
        border-bottom: 1px solid #ccc;
      }
      .listHeader {
        .el-col {
          float: left;
          padding: 14px 0;
          background: #fafafa;
          box-sizing: border-box;
          .cell {
            font-size: 14px;
            padding-left: 8px;
            box-sizing: border-box;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 16px;
            line-height: 16px;
          }
        }
      }
      .listWrap {
        position: relative;
        min-height: 40px;
        .cell-item {
          height: 32px;
          line-height: 32px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          position: relative;
        }
        .el-checkbox-group {
          width: 100%;
        }
        .listLine {
          .el-col {
            float: left;
            padding: 4px 0px;
            box-sizing: border-box;
            // height: 40px;
          }
          .operationBtn {
            display: inline-block;
            padding: 0 8px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #2080f7;
            letter-spacing: 0;
            line-height: 32px;
            height: 100%;
            cursor: pointer;
            &.goodsPhoto {
              width: 100%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              padding-right: 16px;
              box-sizing: border-box;
              .canDelete {
                display: none;
              }
            }
          }
          .operationBtn:hover {
            display: inline-block;
            padding: 0 8px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #2080f7;
            letter-spacing: 0;
            line-height: 32px;
            height: 100%;
            cursor: pointer;
            &.goodsPhoto {
              width: 100%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              padding-right: 16px;
              box-sizing: border-box;
              background: rgba(61, 61, 61, 0.2);
              .canDelete {
                display: inline;
                position: absolute;
                color: #fff;
                font-weight: bold;
                right: 2px;
                top: 10px;
                z-index: 2;
              }
            }
          }
          .dividingLine {
            color: #e6e6e6;
            font-size: 14px;
          }
          .picName {
            max-width: 130px;
            display: inline-block;
            vertical-align: top;
            color: #2080f7;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
            margin-left: 6px;
            &:hover {
              text-decoration: underline;
            }
          }
          .el-form-item {
            height: 40px;
            margin-bottom: 0 !important;
            &.is-error {
              height: auto;
            }
          }
        }
      }
    }
  }
}
</style>
