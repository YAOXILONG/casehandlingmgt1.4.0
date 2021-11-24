<template>
  <div class="AlarmEnable">
    <div class="item-block">
      <label class="tag">
        {{ labelName }}
      </label>
      <div class="btnContent">
        <el-radio-group v-model="alarmEnable" @change="handleChange">
          <el-radio :label="true"> 启用 </el-radio>
          <el-radio :label="false"> 禁用 </el-radio>
        </el-radio-group>
      </div>
      <div class="slotContent">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlarmEnable',
  props: {
    labelName: {
      type: String,
      default: () => {
        return ''
      },
    },
    enable: {
      type: Boolean,
      default: () => {
        return false
      },
    },
  },
  data() {
    return {
      alarmEnable: false,
    }
  },
  methods: {
    handleChange(val) {
      console.log('==', typeof val)
      this.$emit('enableChange', val)
    },
  },
  mounted() {
    this.alarmEnable = this.enable
  },
  watch: {
    enable() {
      this.alarmEnable = this.enable
    },
  },
}
</script>

<style lang="less" scoped>
@labelWidth: 120px;
.AlarmEnable {
  margin-bottom: 16px;
  .item-block {
    label.tag {
      position: relative;
      width: @labelWidth;
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #484c6a;
      line-height: 1;
      padding: 10px 12px 10px 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
  .btnContent {
    width: 192px;
    height: 32px;
    font-size: 0;
    padding: 8px 0 7px;
    box-sizing: border-box;
    margin-left: @labelWidth;
    .btn {
      display: inline-block;
      height: 32px;
      width: 96px;
      color: #666;
      background: #ffffff;
      font-size: 14px;
      text-decoration: none;
      text-align: center;
      &.active {
        color: #ffffff;
        background: #2c65d6;
      }
    }
  }
  .slotContent {
    font-size: 14px;
    color: #8d8dab;
    margin-top: 8px;
    margin-left: @labelWidth;
  }
}
</style>
