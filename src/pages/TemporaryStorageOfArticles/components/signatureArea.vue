<template>
  <div class="signatureAreaPage">
    <div class="mainContent">
      <Layout>
        <Header :height="42">
          <div class="signatureAreaPageTitle">
            <span>
              电子签名
            </span>
          </div>
        </Header>
        <Main>
          <div class="signatureAreaBox"
               ref="signatureAreaBox">
            <div class="signatureAreaItem"
                 :style="{width : itemWidth + 'px'}">
              <signItem :item-width="itemWidth"
                        :sign-item-top-label="'办案民警'"
                        :sign-text="signItemObject.policeSign"
                        @handleCollection="handleCollection">
              </signItem>
            </div>
            <div class="signatureAreaItem"
                 :style="{width : itemWidth + 'px'}">
              <signItem :item-width="itemWidth"
                        :sign-item-top-label="'管理员'"
                        :sign-text="signItemObject.managerSign"
                        @handleCollection="handleCollection">
              </signItem>
            </div>
            <div class="signatureAreaItem"
                 :style="{width : itemWidth + 'px'}">
              <signItem :item-width="itemWidth"
                        :sign-item-top-label="'涉案人'"
                        :sign-text="signItemObject.personSign"
                        @handleCollection="handleCollection">
              </signItem>
            </div>
          </div>
        </Main>
      </Layout>
    </div>
  </div>
</template>

<script>
import SignItem from '../../../components/SignItem/SignItem'
import Layout, { Main, Header } from '../../../components/Layout'
// import server from '../../../server/temporaryStorageOfArticles'
export default {
  name: 'SignatureArea',
  props: {
    signObj: {
      type: Object,
      default: () => {
        return {
          goodsManagerId: 0,
          policeSign: '',
          managerSign: '',
          personSign: '',
          registerId: 0,
          managerType: 2,
          roomCode: '',
          outType: 0
        }
      }
    },
    webSocketData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    signObj: {
      immediate: true,
      deep: true,
      handler: function (newVal, oldVal) {
        this.signItemObject = {
          managerSign: {
            type: 'managerSign',
            data: newVal.managerSign || '',
            fileUrl: newVal.managerSign || '',
            fileName: newVal.managerSignName || ''
          },
          policeSign: {
            type: 'policeSign',
            data: newVal.policeSign || '',
            fileUrl: newVal.policeSign || '',
            fileName: newVal.policeSignName || ''
          },
          personSign: {
            type: 'personSign',
            data: newVal.personSign || '',
            fileUrl: newVal.personSign || '',
            fileName: newVal.personSignName || ''
          },
          registerId: newVal.registerId,
          managerType: newVal.managerType,
          roomCode: newVal.roomCode,
          outType: newVal.outType,
          goodsManagerId: newVal.goodsManagerId
        }
      }
    },
    webSocketData: {
      handler: function (newVal, oldVal) {
        let data = JSON.parse(JSON.stringify(newVal))
        if (data.type) {
          if (newVal.type === 'managerSign') {
            this.signItemObject.managerSign.data = data.fileUrl
            this.signItemObject.managerSign.fileUrl = data.fileUrl
            this.signItemObject.managerSign.fileName = data.fileName
          } else if (newVal.type === 'policeSign') {
            this.signItemObject.policeSign.data = data.fileUrl
            this.signItemObject.policeSign.fileUrl = data.fileUrl
            this.signItemObject.policeSign.fileName = data.fileName
          } else if (newVal.type === 'personSign') {
            this.signItemObject.personSign.data = data.fileUrl
            this.signItemObject.personSign.fileUrl = data.fileUrl
            this.signItemObject.personSign.fileName = data.fileName
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      itemWidth: 388,
      signItemObject: {
        managerSign: {
          type: 'managerSign',
          data: '',
          fileUrl: '',
          fileName: ''
        },
        policeSign: {
          type: 'policeSign',
          data: '',
          fileUrl: '',
          fileName: ''
        },
        personSign: {
          type: 'personSign',
          data: '',
          fileUrl: '',
          fileName: ''
        },
        registerId: null,
        managerType: null,
        roomCode: null,
        outType: null,
        goodsManagerId: null
      },
      currentwebSocketData: {},
      currentType: ''
    }
  },
  methods: {
    // 采集
    // async handleCollection (type) {
    // handleCollection (type) {
    //   let hikUrl = `btoolsprotocol://CenterUrl:${this.$centerUrl};Toollist:PROT_BToolCardReaderProtocol;CmdLine:BToolCardReaderProtocol://MethodType:1`
    //   if (type === 'managerSign') {
    //    this.signItemObject.managerSign.data = ''
    //    this.signItemObject.managerSign.fileUrl = ''
    //    this.signItemObject.managerSign.fileName = ''
    //  } else if (type === 'policeSign') {
    //   this.signItemObject.policeSign.data = ''
    //    this.signItemObject.policeSign.fileUrl = ''
    //   this.signItemObject.policeSign.fileName = ''
    //  } else if (type === 'personSign') {
    //   this.signItemObject.personSign.data = ''
    //    this.signItemObject.personSign.fileUrl = ''
    //  this.signItemObject.personSign.fileName = ''
    //  }
    //  this.$emit('initWebSocket', hikUrl, type, 'BToolCardReaderProtocol')
    //  },

    handleCollection (type) {
      let hikUrl = ''
      if (type === 'managerSign') {
        this.signItemObject.managerSign.data = ''
        this.signItemObject.managerSign.fileUrl = ''
        this.signItemObject.managerSign.fileName = ''
        hikUrl = `btoolsprotocol://CenterUrl:${this.$centerUrl};Toollist:PROT_BToolCardReaderProtocol;CmdLine:BToolCardReaderProtocol://MethodType:1;SignType:0;`
      } else if (type === 'policeSign') {
        this.signItemObject.policeSign.data = ''
        this.signItemObject.policeSign.fileUrl = ''
        this.signItemObject.policeSign.fileName = ''
        hikUrl = `btoolsprotocol://CenterUrl:${this.$centerUrl};Toollist:PROT_BToolCardReaderProtocol;CmdLine:BToolCardReaderProtocol://MethodType:1;SignType:0;`
      } else if (type === 'personSign') {
        this.signItemObject.personSign.data = ''
        this.signItemObject.personSign.fileUrl = ''
        this.signItemObject.personSign.fileName = ''
        hikUrl = `btoolsprotocol://CenterUrl:${this.$centerUrl};Toollist:PROT_BToolCardReaderProtocol;CmdLine:BToolCardReaderProtocol://MethodType:1;SignType:1;`
      }
      this.$emit('initWebSocket', hikUrl, type, 'BToolCardReaderProtocol')
    },

    computedStyle () {
      if (this.$refs.signatureAreaBox && this.$refs.signatureAreaBox.offsetWidth) {
        let _width = this.$refs.signatureAreaBox.offsetWidth
        if (_width < 389 * 3) {
          this.itemWidth = 389
        } else {
          this.itemWidth = Math.floor(_width / 3)
        }
      }
    }
  },
  created () {
    this.signItemObject = {
      managerSign: {
        type: 'managerSign',
        data: this.signObj.managerSign || '',
        fileUrl: this.signObj.managerSign || '',
        fileName: this.signObj.managerSignName || ''
      },
      policeSign: {
        type: 'policeSign',
        data: this.signObj.policeSign || '',
        fileUrl: this.signObj.policeSign || '',
        fileName: this.signObj.policeSignName || ''
      },
      personSign: {
        type: 'personSign',
        data: this.signObj.personSign || '',
        fileUrl: this.signObj.personSign || '',
        fileName: this.signObj.personSignName || ''
      },
      registerId: this.signObj.registerId,
      managerType: this.signObj.managerType,
      roomCode: this.signObj.roomCode,
      outType: this.signObj.outType,
      goodsManagerId: this.signObj.goodsManagerId
    }
  },
  mounted () {
    this.computedStyle()
    window.addEventListener('resize', () => {
      this.computedStyle()
    })
  },
  components: {
    Layout,
    Main,
    Header,
    SignItem
  }
}
</script>

<style lang="less">
.signatureAreaPage {
  height: auto;
  .mainContent {
    height: auto;
    background: #ffffff;
    .signatureAreaPageTitle {
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
    .signatureAreaBox {
      width: 100%;
      height: auto;
      .signatureAreaItem {
        width: 33%;
        float: left;
      }
    }
  }
}
</style>
