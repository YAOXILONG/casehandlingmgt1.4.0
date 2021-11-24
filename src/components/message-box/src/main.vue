<script src="../../../../../../../../../../2019/Q4/工作台/project/platform/src/server/axios/index.ts"></script>
<template>
  <transition name="msgbox-fade">
    <div v-show="visible"
         class="el-message-box__wrapper"
         style="z-index:99999;"
         tabindex="-1"
         @click.self="handleWrapperClick">
      <div :class="[customClassName]"
           class="el-message-box msgbox_box">
        <div class="el-message-box__content">
          <h-feedback-icon v-if="!data.showInfo"
                           icon-name="h-icon-feedback_error_lg"
                           class="x-error-dialog__icon" />
          <div class="x-error-dialog__msg">
            <p v-if="errorTitle"
               class="x-error-dialog__msg-title"
               :title="errorTitle"
               v-text="errorTitle" />
            <p :class="errorMsgClassName"
               :title="errorMsg"
               v-text="errorMsg" />
            <el-button v-if="!showDetail"
                       type="link"
                       class="x-error-dialog__detail-btn"
                       @click="handleDetail">
              详情
            </el-button>
            <div v-if="showDetail"
                 class="x-error-dialog__msg-detail">
              <div v-if="!data.showInfo"
                   class="x-error-dialog__item">
                <span :title="errorCode"
                      class="x-error-dialog__item-text">
                  错误码：{{ errorCode }}
                </span>
                <el-tooltip content="复制"
                            popper-class="messageBoxTooltip"
                            placement="top">
                  <el-button v-clipboard:copy="errorCode"
                             v-clipboard:success="onCopy"
                             v-clipboard:error="onError"
                             type="link"
                             class="x-error-dialog__btn-copy">复制
                  </el-button>
                </el-tooltip>
                <el-tooltip :content="i18n.t('errorDialog_errorCodeTip')"
                            popper-class="messageBoxTooltip"
                            placement="top">
                  <el-button icon="h-icon-info"
                             class="x-error-dialog__btn-info" />
                </el-tooltip>
              </div>
              <div class="x-error-dialog__item">
                <span :title="callChain"
                      class="x-error-dialog__item-text">
                  调用链：{{ callChain }}
                </span>
                <el-tooltip content="复制"
                            popper-class="messageBoxTooltip"
                            placement="top">
                  <el-button v-clipboard:copy="callChain"
                             v-clipboard:success="onCopy"
                             v-clipboard:error="onError"
                             type="link"
                             class="x-error-dialog__btn-copy"> 复制
                  </el-button>
                </el-tooltip>
                <el-tooltip :content="i18n.t('errorDialog_callChainTip')"
                            popper-class="messageBoxTooltip"
                            placement="top">
                  <el-button icon="h-icon-info"
                             class="x-error-dialog__btn-info" />
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
        <div class="el-message-box__btns">
          <!-- 传入按钮 -->
          <div>
            <el-button @click.native="handleAction()">
              确 认
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
import Main from '../mixin/main'

export default {
  mixins: [Main],

  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      showDetail: false
    }
  },

  computed: {
    customClass () {
      let className = 'x-error-dialog'
      if (this.showDetail) {
        className += ' x-error-dialog-detail'
      }
      if (this.data.showInfo) {
        className += ' x-show-info'
      }
      return className
    },
    errorCode () {
      const { data } = this
      return data.serviceErrorCode || data.code
    },
    callChain () {
      const { data } = this
      return data.callChain || 'null'
    },
    errorMsg () {
      const { data } = this
      return data.msg
    },
    errorTitle () {
      return this.data.title
    },
    errorMsgClassName () {
      return this.errorTitle
        ? 'x-error-dialog__msg-text'
        : 'x-error-dialog__msg-title'
    }
  },

  watch: {},

  mounted () {
  },

  beforeDestroy () {
  },

  methods: {
    onCopy: function () {
      this.$message.success(this.i18n.t('errorDialog_copySuccessed'))
    },
    onError: function () {
      this.$message.error(this.i18n.t('errorDialog_copyFailed'))
    },
    handleDetail () {
      this.showDetail = true
    }
  }
}
</script>
<style lang="less">
.el-message-box__wrapper {
  z-index: 99999 !important;
}
.messageBoxTooltip {
  z-index: 100000 !important;
}
.msgbox_box {
  width: 450px;
}

.x-error-dialog__icon {
  font-size: 40px;
  float: left;
}

.x-error-dialog__item-text {
  display: inline;
  line-height: 24px;
  word-break: break-all;
}

.x-error-dialog__cont {
  display: flex;
}

.x-error-dialog__msg {
  width: 100%;
  padding-left: 50px;
}

.x-error-dialog__msg-title {
  margin-bottom: 4px;
  color: #4d4d4d;
  font-size: 16px;
}

.x-error-dialog__msg-text {
  margin-top: 4px;
  color: #4d4d4d;
}

.x-error-dialog__btn-info,
.x-error-dialog__btn-copy {
  min-width: 24px !important;
  height: 24px !important;
  margin-left: 4px !important;

  &:hover {
    background: transparent !important;
  }
}

.msgbox_box .el-message-box__content {
  height: 140px;
}
</style>
