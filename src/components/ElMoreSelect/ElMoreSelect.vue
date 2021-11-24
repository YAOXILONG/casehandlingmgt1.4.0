<template>
  <el-select :value="value"
             filterable
             placeholder="请选择"
             @focus="caseCauseFocus"
             @change="caseCauseChange"
             :filter-method="caseCauseFilter"
             @on-scrolling-y="caseCauseScrolling"
             @input="updateVal"
             clear>
    <el-option v-for="item in accusationSlow"
               :key="item.key"
               :label="item.name"
               :value="item.key">
    </el-option>
  </el-select>
</template>
<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => {
        return []
      }
    },
    value: {
      type: null,
      default: () => {
        return null
      }
    }
  },
  data () {
    return {
      accusationSlow: [],
      filterAccusationSlow: []
    }
  },
  methods: {
    // 触发v-model绑定
    updateVal (val) {
      this.$emit('input', val)
    },
    caseCauseFocus () {
      this.accusationSlow = this.options.filter((item, index) => {
        return index < 10
      })
      this.filterAccusationSlow = []
    },
    caseCauseChange (val) {
      this.$nextTick(() => {
        this.accusationSlow = this.options.filter((item) => {
          return item.key === val
        })
      })
    },
    caseCauseFilter (val) {
      this.accusationSlow = this.options.filter((item) => {
        return item.name.indexOf(val) > -1
      })
      this.filterAccusationSlow = [...this.accusationSlow]
    },
    caseCauseScrolling ({ scrollTop, percentY }) {
      if (percentY >= 1) {
        let len = this.accusationSlow.length
        let filterData = (this.filterAccusationSlow && this.filterAccusationSlow.length) > 0 ? this.filterAccusationSlow : this.options
        this.accusationSlow = filterData.filter((item, index) => {
          return index < (len + 10)
        })
      }
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less">
</style>
