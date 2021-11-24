<template slot="stepsBox">
  <div class="stepBox"
       ref="stepBox">
    <div :class="computedClass(stepStatue)">
      <div class="stepIcon h-icon-done"></div>
      <div class="stepLabel"
           ref="stepLabel">
        {{ stepName }}
      </div>
    </div>
    <div class="stepLine">
    </div>
  </div>
</template>

<script>
export default {
  name: 'StepStatue',
  props: {
    name: {
      type: String,
      default: ''
    },
    statue: {
      type: Number,
      default: 0
    },
    value: {
      type: Number,
      default: 0
    }
  },
  watch: {
    name (newV, oldV) {
      this.stepName = newV
      let el = this.$parent
      el.renderStepStatueItem()
    },
    statue (newV, oldV) {
      this.stepStatue = newV
      let el = this.$parent
      el.renderStepStatueItem()
    }
  },
  data () {
    return {
      stepName: this.name,
      stepStatue: this.statue
    }
  },
  methods: {
    computedClass (item) {
      if (item === 1) {
        return 'active stepTitle'
      } else {
        return 'stepTitle'
      }
    }
  }
}
</script>

<style lang="less">
</style>
