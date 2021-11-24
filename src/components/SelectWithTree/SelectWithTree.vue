<template>
  <div class="select-with-tree">
    <el-select
      :value="value"
      placeholder="请选择"
      ref="treeSelect"
      filterable
      :filter-method="filterMethod"
      :multiple="multiple"
      multiple-nowrap
      @input="updateVal"
      @change="change"
      :disabled="disabled"
      clear
    >
      <el-option
        label="部门选择"
        value="部门选择"
        :disabled="true"
        v-show="false"
      >
      </el-option>
      <el-option
        v-for="(item,index) in treeData"
        :key="index"
        :label="item.name"
        :value="item[nodeKey]"
        v-show="false"
      >
      </el-option>
      <el-tree
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
        :node-key="nodeKey"
        :parent-key="parentKey"
        class="select-tree"
      ></el-tree>
    </el-select>
  </div>
</template>
<script>
import renderContentTree from '../../mixin/renderContentTree'

export default {
  name: 'SelectWithTree',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: null,
      default: () => {
        return null
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
          label: 'label'
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
    disabled: {
      type: Boolean,
      default: () => {
        return false
      }
    }

  },
  data () {
    return {
      filterText: ''
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree2.filter(val)
    },
    value (val) {
      if (this.multiple) {
        let valArr = this.$refs.tree2.getCheckedNodes()
        let newValArr = valArr.filter((item) => {
          return val.indexOf(item[this.nodeKey]) > -1
        })
        this.$refs.tree2.setCheckedNodes(newValArr)
      } else {

      }
    }
  },
  mixins: [renderContentTree],
  mounted () {
  },
  methods: {
    // select change事件
    change (val) {
      let data = {}
      this.treeData.forEach((item) => {
        if (item[this.nodeKey] === val) {
          data = item
        }
      })
      this.$emit('change', data)
    },
    // 触发v-model绑定
    updateVal (val) {
      this.$emit('input', val)
    },
    // 多选项改变
    checkChange (val) {
      if (this.multiple) {
        let valArr = this.$refs.tree2.getCheckedNodes()
        let data = valArr.map((item) => {
          return item
        })
        this.$emit('input', data[this.nodeKey])
        this.$emit('change', valArr)
      }
    },
    // 树查询过滤
    filterNode (value, data) {
      if (!value) return true
      return data[this.defaultProps.label].indexOf(value) !== -1
    },
    // selectNode节点点击
    handleNodeClick (data, nodeData) {
      if (!this.multiple) {
        let value = data[this.nodeKey]
        this.$emit('input', value)
        this.$emit('change', data)
        this.$refs['treeSelect'].hiddenMenu()
      }
    },
    filterMethod (val) {
      this.filterText = val
    }
  },
  components: {
  }
}
</script>
<style lang="less" rel="stylesheet/less">

.select-tree {
  width: 100%;
  font-size: 12px;
  .el-tree-scrollbar__wrap {
    max-height: 200px;
  }
}

</style>
