<template>
  <transition name="msgbox-fade">
    <div
      v-show="visible"
      class="el-message-box__wrapper"
      tabindex="-1"
      @click.self="handleWrapperClick"
    >
      <div :class="[customClassName]" class="el-message-box" :style="customStyle">
        <div class="frame-box">
          <el-button class="closeButton" icon="h-icon-close" v-show="showClose" @click="doClose"/>
          <div class="dialog_title" v-if="title">
            <span :title="title">{{title}}</span>
          </div>
          <dynamicFrame :tab="data" class="frame-wrap"></dynamicFrame>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
import Main from '../mixin/main'
import dynamicFrame from './dynamicFrame'

export default {
  mixins: [Main],
  props: {
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default () {
        return {
          id: '',
          url: 'about:blank'
        }
      }
    },
    customStyle: {
      type: Object,
      default () {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  components: { dynamicFrame },
  data () {
    return {}
  },
  watch: {},
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {}
}
</script>
<style lang="less">
  .frame-box {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;

    .frame-wrap {
      flex: 1;
      overflow: hidden;
    }

    .closeButton {
      position: absolute;
      right: 2px;
      top: 2px;
      z-index: 9;
    }

    .dialog_title {
      overflow: hidden;
      width: 100%;
      box-sizing: border-box;
      padding-left: 12px;
      float: left;
      font-size: 14px;
      font-weight: 500;
      line-height: 36px;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-bottom: 1px solid #e5e5e5;
    }
  }
</style>
