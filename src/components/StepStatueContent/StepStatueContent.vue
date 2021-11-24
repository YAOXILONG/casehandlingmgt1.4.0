<template>
  <div class="step-statue-content">
    <div class="step-statue-item"
         v-for="(item,index) in stepStatue"
         :key="index"
         :class="{'dis-none':stepStatue[index]==-1}">
      <div class="step-icon-desc">
        <div class="step-icon">
          <i class="h-icon-done"
             :class="{'default':item!=1 && item!=2}"></i>
          <i class="h-icon-done"
             :class="{'pass':item==1}"></i>
          <i class="h-icon-done"
             :class="{'current':item==2}"></i>
        </div>
        <div class="step-desc">
          {{ stepList[index] }}
        </div>
      </div>
      <div class="step-line"
           v-if="(index+1) != stepStatue.length">
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'StepStatueContent',
  props: {
    // 0：默认样式，1：已通过样式，2、当前正在执行的样式，-1：不展示
    stepStatue: {
      type: Array,
      default: () => {
        return [1, 2, 0, 0, 1, 1, 0]
      }
    }
  },
  data () {
    return {
      stepList: ['入区登记', '人身检查', '物品登记 ', '信息采集', '吸毒检测', '物品归还', '出区登记']
    }
  },
  mounted () { },
  methods: {},
  mixins: []
}
</script>
<style lang="less" rel="stylesheet/less" scoped>
.step-statue-content {
  position: relative;
  height: 100px;
  width: 100%;
  padding-top: 24px;
  box-sizing: border-box;
  text-align: center;
  border-bottom: 8px solid #f2f2f2;
  background: #ffffff;
  .step-statue-item {
    width: 130px;
    display: inline-block;
    position: relative;
    text-align: left;
    &.dis-none {
      display: none;
    }
    .step-icon-desc {
      display: inline-block;
      text-align: center;
      .step-icon {
        .h-icon-done {
          font-size: 22px;
          color: #cccccc;
          border: 1px solid #ccc;
          border-radius: 100%;
          display: none;
          &.default {
            display: inline;
          }
          &.pass {
            display: inline;
            color: #2080f7;
            border: 1px solid #2080f7;
            border-radius: 100%;
          }
        }
        .h-icon-done {
          font-size: 22px;
          display: none;
          border: 1px solid #ccc;
          border-radius: 100%;
          &.current {
            display: inline;
            color: #fff;
            background-color: #2080f7;
            border: 1px solid #2080f7;
            border-radius: 100%;
          }
        }
      }
      .step-desc {
        font-size: 14px;
      }
    }
    .step-line {
      width: ~"calc(100% - 56px)";
      display: inline-block;
      height: 1px;
      background: #cccccc;
      border: none;
      position: absolute;
      right: 0;
      top: 10px;
    }
  }
}
</style>
