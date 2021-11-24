<template>
  <el-select :class="{'multiple': multiple}"
             :value="selectValue"
             placeholder="请选择"
             ref="treeSelect"
             filterable
             tag-title
             :filter-method="filterMethod"
             :multiple="multiple"
             @input="updateVal"
             @change="change"
             :clear="clear"
             :disabled="disabled">
    <template v-if="valueList.length">
      <el-option v-for="item in valueList"
                 :key="item[defaultProps.id]"
                 :label="item[defaultProps.label]"
                 :value="item[defaultProps.id]"
                 :disabled="true"
                 v-show="false">
      </el-option>
    </template>
    <el-option label="请选择"
               value="请选择"
               :disabled="true"
               v-show="false">
    </el-option>
    <el-tree class="SelectWithTree"
             :data="treeData"
             :props="defaultProps"
             @node-click="handleNodeClick"
             :render-content="renderContent"
             :filter-node-method="filterNode"
             ref="tree2"
             @check-change="checkChange"
             :show-checkbox="multiple"
             :check-strictly="true"
             :simple-data="simpleData"
             :default-expanded-keys="treeExpandData"
             :node-key="nodeKey"
             :parent-key="parentKey"></el-tree>
  </el-select>
</template>
<script>
import renderContentTree from '../mixin/renderContentTree'

export default {
  name: 'SelectWithTree',
  props: {
    disabled: Boolean,
    clear: Boolean,
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: null,
      default: () => {
        return {}
      }
    },
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'label',
          icon: 'icon'
        }
      }
    },
    simpleData: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    nodeKey: {
      type: String,
      default: () => {
        return 'id'
      }
    },
    parentKey: {
      type: String,
      default: () => {
        return 'Pid'
      }
    },
    targetType: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data () {
    return {
      filterText: '',
      valueList: [],
      selectValue: '',
      treeExpandData: []
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val)
    },
    value (val) {
      //console.log(this.value)
      if (this.multiple) {
        this.valueList = val
        this.selectValue = this.valueList.map(v => v[this.defaultProps.id])
        this.$nextTick(() => {
          this.$refs.tree2&&this.$refs.tree2.setCheckedKeys(this.valueList.map(v => v[this.defaultProps.id]))
        })
      } else {
        if (!val[this.defaultProps.label] && val[this.defaultProps.id]) {
          val = (this.$refs.tree2.getNode(val[this.defaultProps.id]) || {}).data
        }
        if (val && val[this.defaultProps.id]) {
          this.valueList = [val]
          this.selectValue = val[this.defaultProps.id]
          this.$nextTick(() => {
            this.$refs.tree2.setCurrentKey(val[this.defaultProps.id])
            // this.treeExpandData.push(val[this.defaultProps.id])
          })
        } else {
          this.valueList = []
          this.selectValue = ''
        }
      }
    }
  },
  mixins: [renderContentTree],
  mounted () {
    //console.log(this.value)
    const val = this.value
    if (this.multiple) {
      this.valueList = val || []
      this.valueList.length > 0 && (this.selectValue = this.valueList.map(v => v[this.defaultProps.id]))
      this.$nextTick(() => {
        this.$refs.tree2&&this.$refs.tree2.setCheckedKeys(this.valueList.map(v => v[this.defaultProps.id]))
        this.$emit('input', this.value)
      })
    } else {
      if (val && val[this.defaultProps.id]) {
        this.valueList = [val]
        this.selectValue = val[this.defaultProps.id]
        this.$nextTick(() => {
          val && this.$refs.tree2.setCurrentKey(val[this.defaultProps.id])
          // this.treeExpandData.push(val[this.defaultProps.id])
        })
      } else {
        this.valueList = []
        this.selectValue = ''
      }

    }
  },
  methods: {
    getRoleTreeRootNode () {
      // this.treeExpandData.push(this.treeData[0].code)
    },
    // select change事件
    change () {
      this.$emit('change', this.value)
    },
    // 触发v-model绑定
    updateVal (val) {
      if (this.multiple) {
        this.$nextTick(() => {
          this.$refs.tree2&&this.$refs.tree2.setCheckedKeys(val)
          let valArr = this.$refs.tree2&&this.$refs.tree2.getCheckedNodes() || null
          this.$emit('input', valArr)
        })
      } else {
        this.$emit('input', val)
      }
    },
    // 多选项改变
    checkChange () {
      if (this.multiple) {
        let valArr = this.$refs.tree2.getCheckedNodes()
        this.$emit('input', valArr)
        this.$children[0].query = ''
      }
    },
    // 树查询过滤
    // filterNode (value, data) {
    //   if (!value) return true
    //   return data[this.defaultProps.label].indexOf(value) !== -1
    // },
    filterNode () {
      return true
    },
    // selectNode节点点击
    handleNodeClick (data, node) {
      if (node.childNodes.length > 0) {
        return
      } else {
      }
      if (this.targetType && data.type !== this.targetType) {
        return
      }
      if (!this.multiple) {
        this.$emit('input', data)
        this.$refs['treeSelect'].hiddenMenu()
      }
    },
    filterMethod (val) {
      this.filterText = val
    }
  },
  components: {}
}
</script>
<style lang="less" rel="stylesheet/less">
.SelectWithTree {
  .el-scrollbar__wrap {
    position: relative !important;
    height: auto;
  }
}
</style>
