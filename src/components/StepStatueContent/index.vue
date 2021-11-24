<template>
  <div class="step-statue-content">
    <StepStatueBox :current-key="currentVal">
      <StepStatueItem
        v-for="(item, index) in stepList"
        :key="index"
        :name="item.name"
        :statue="item.statue"
        :value="item.value"
      ></StepStatueItem>
    </StepStatueBox>
  </div>
</template>
<script>
import StepStatueBox from '../StepStatueBox/StepStatueBox'
import StepStatueItem from '../StepStatueBox/StepStatueItem'

export default {
  name: 'AppointManage',
  props: {
    stepStatue: {
      type: Array,
      default: () => {
        return [0, 0, 0, 0, 0]
      }
    },
    currentKey: {
      type: Number,
      default: 0
    }
  },
  watch: {
    stepStatue: {
      handler: function (newV, oldV) {
        this.initList(newV)
      },
      immediate: true,
      deep: true
    },
    currentKey (newV, oldV) {
      this.currentVal = newV
    }
  },
  data () {
    return {
      stepList: [
        {
          name: '入区登记',
          statue: 1,
          value: 0
        }, {
          name: '人身检查',
          statue: 0,
          value: 1
        }, {
          name: '物品登记 ',
          statue: 0,
          value: 2
        }, {
          name: '信息采集',
          statue: 0,
          value: 3
        }, {
          name: '吸毒检测',
          statue: 0,
          value: 4
        }, {
          name: '物品归还',
          statue: 0,
          value: 5
        }, {
          name: '出区登记',
          statue: 0,
          value: 6
        }
      ],
      currentVal: this.currentKey,
      stepStatueItems: JSON.parse(JSON.stringify(this.stepStatue))
    }
  },
  mounted () {
  },
  methods: {
    initList (array) {
      let list = JSON.parse(JSON.stringify(this.stepList))
      let _array = JSON.parse(JSON.stringify(array))
      for (let i = 1; i < list.length - 1; i++) {
        list[i].statue = _array[i - 1]
      }
      this.stepList = JSON.parse(JSON.stringify(list))
    }

  },
  mixins: [],
  components: {StepStatueBox, StepStatueItem}
}
</script>
<style lang="less" rel="stylesheet/less">
.step-statue-content {
  position: relative;
  height: 100%;
  width: 100%;
  padding-top: 24px;
  box-sizing: border-box;
}
</style>
