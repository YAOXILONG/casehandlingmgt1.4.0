<template>
  <div class="step-statue-box">
    <div class="stepsBox">
      <slot />
    </div>
  </div>
</template>
<script>
// import { setTimeout } from 'timers';
export default {
  name: 'StepStatueBox',
  props: {
    currentKey: {
      type: Number,
      default: 0
    }
  },
  watch: {
    currentKey (newV, oldV) {
      this.currentValue = newV
      this.renderStepStatueItem()
    }
  },
  data () {
    return {
      isFilterBox: false,
      stepStatueItemLength: 0,
      currentValue: this.currentKey
    }
  },
  mounted () {
    if (this.$slots.default && this.$slots.default) {
      this.stepStatueItemLength = this.$slots.default.length
    }
    this.renderStepStatueItem()
  },
  methods: {
    renderStepStatueItem () {
      // console.log(1)
      let eles = document.getElementsByClassName('stepBox')
      let slots = this.$slots.default
      if (eles && eles.length && slots && slots.length) {
        let length = eles.length
        let _width = ((0.61 / 7) * 100) + '%'
        for (let i = 0; i < length; i++) {
          let el = eles[i]
          let _slot = slots[i].componentOptions.propsData
          if (i === length - 1) {
            el.style.width = '48px'
          } else {
            el.style.width = _width
          }
          if (_slot.value === this.currentValue) {
            el.getElementsByClassName('stepTitle')[0].style.borderColor = '#2080f7'
            el.getElementsByClassName('stepTitle')[0].style.backgroundColor = '#2080f7'
            el.getElementsByClassName('stepTitle')[0].style.color = '#fff'
          } else if (_slot.statue !== 0) {
            el.getElementsByClassName('stepTitle')[0].style.borderColor = '#2080f7'
            el.getElementsByClassName('stepTitle')[0].style.backgroundColor = '#fff'
            el.getElementsByClassName('stepTitle')[0].style.color = '#2080f7'
          } else {
            el.getElementsByClassName('stepTitle')[0].style.borderColor = '#ddd'
            el.getElementsByClassName('stepTitle')[0].style.backgroundColor = '#fff'
            el.getElementsByClassName('stepTitle')[0].style.color = '#ccc'
          }
        }
      }
    }
  },
  components: {}
}
</script>
<style lang="less" rel="stylesheet/less">
.step-statue-box {
  position: relative;
  height: 100%;
  padding-bottom: 8px;
  background: #f2f2f2;
  box-sizing: border-box;
  .stepsBox {
    position: relative;
    text-align: center;
    background-color: #fff;
    height: 100%;
    .stepBox {
      height: 100%;
      display: inline-block;
      position: relative;
      .stepTitle {
        width: 24px;
        height: 24px;
        line-height: 24px;
        border: 1px solid #ddd;
        box-sizing: border-box;
        border-radius: 50%;
        text-align: center;
        font-size: 22px;
        color: #ccc;

        &.active {
          border: 1px solid #2080f7;
          color: #2080f7;
        }
        &#active {
          border: 1px solid #2080f7;
          background-color: #2080f7;
          color: #fff;
        }
        .stepLabel {
          position: absolute;
          font-size: 14px;
          color: #4d4d4d;
          left: -17px;
        }
      }
      .stepLine {
        position: absolute;
        background: #ccc;
        height: 1px;
        width: ~"calc(100% - 56px)";
        top: 14px;
        right: 14px;
      }
      .h-icon-done {
        font-size: 22px;
      }
    }
  }
}
</style>
