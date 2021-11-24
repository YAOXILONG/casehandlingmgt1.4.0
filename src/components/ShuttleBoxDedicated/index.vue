<template>
  <div
    :class="['shuttlebox_dialogDedicated', { single: !multiple }]"
    no-scrollbar
    title=""
    :before-close="beforeCLose"
  >
    <div class="ShuttleBoxDedicated">
      <div class="sider">
        <div class="tree-title">人员所属组织</div>
        <el-input
          clearable
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          class="filter-tree-input"
          suffix-icon="h-icon-search"
          :on-icon-click="TreeHandleIconClick"
          :clear-icon-click="TreeClearIconClick"
        >
        </el-input>
        <div class="tree-wrap">
          <el-tree
            default-icon="h-icon-info_organization"
            :node-key="defaultProps.id"
            ref="tree"
            :data="treeData"
            :props="defaultProps"
            :default-expanded-keys="defaultExpandedKeys"
            :current-node-key="currentNodeKey"
            :filter-node-method="filterNode"
            :render-content="renderContent"
            @node-click="TreeHandleNodeClick"
          >
          </el-tree>
        </div>
      </div>
      <div class="left">
        <div class="left-title">
          待选择人员({{ leftTableDataFilterSelect.length }}人)
        </div>
        <div class="left-search">
          <el-input
            clearable
            placeholder="请输入"
            suffix-icon="h-icon-search"
            v-model="leftSearchInput"
            :on-icon-click="leftHandleIconClick"
            :clear-icon-click="leftClearIconClick"
          ></el-input>
        </div>
        <div class="left-table">
          <div class="left-table-cantainer">
            <el-table
              force-scroll
              style="width: 100%"
              ref="leftMultipleTable"
              :data="leftTableDataFilterSelect"
              @selection-change="leftHandleSelectionChange"
              :highlight-current-row="!multiple"
              current-row-key="personIndexCode"
              @current-change="handleCurrentChange"
            >
              <template v-if="multiple">
                <el-table-column type="selection"></el-table-column>
              </template>
              <template v-else>
                <el-table-column
                  type="radio"
                  :selectable="selectable"
                  label="选择"
                >
                  <template slot-scope="scope">
                    {{ scope.row === currentRow ? "√" : "" }}
                  </template>
                </el-table-column>
              </template>
              <el-table-column
                show-overflow-title
                :label="multiple ? '姓名' : '人员'"
              >
                <template slot-scope="scope">
                  {{ `${scope.row.personName}` }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <template v-if="multiple">
        <div class="middle">
          <el-button
            icon-border="h-icon-angle_right"
            :disabled="!leftMultipleSelection.length"
            @click="pushData"
          ></el-button>
          <el-button
            icon-border="h-icon-angle_left"
            :disabled="!rightMultipleSelection.length"
            @click="deleteData"
          ></el-button>
        </div>
        <div class="right">
          <div class="right-title">
            已选择人员({{ rightTableDataFilterSelect.length }}人)
          </div>
          <div class="right-search">
            <el-input
              clearable
              placeholder="请输入"
              suffix-icon="h-icon-search"
              v-model="rightSearchInput"
              :on-icon-click="rightHandleIconClick"
              :clear-icon-click="rightClearIconClick"
            ></el-input>
          </div>
          <div class="right-table">
            <div class="right-table-cantainer">
              <el-table
                force-scroll
                style="width: 100%"
                ref="rightMultipleTable"
                :data="rightTableDataFilterSelect"
                @selection-change="rightHandleSelectionChange"
              >
                <el-table-column type="selection"></el-table-column>
                <el-table-column show-overflow-title label="姓名">
                  <template slot-scope="scope">
                    {{ `${scope.row.personName}` }}
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-title
                  label="设为默认"
                  width="90"
                >
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.isDefaultApprovalUser"
                      size="small"
                      :before-change="handleBeforeChange"
                    ></el-switch>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import renderContentTree from "./renderContentTree";
import ShuttleBoxMixin from "./ShuttleBox";

// 获取第一个匹配节点
export const getFirstObjectInTree = (origin, target, prop) => {
  const result = { target: {} };
  const _getFirstObjectInTree = (_origin) => {
    return _origin.some((v) => {
      if (v[prop].indexOf(target) > -1) {
        result.target = v;
        return true;
      }
      if (v.children) return _getFirstObjectInTree(v.children);
    });
  };
  _getFirstObjectInTree(origin);
  return result.target;
};

const defaultProps = {
  children: "children",
  label: "label",
  id: "id",
};
export default {
  name: "ShuttleBoxDedicated",
  data() {
    return {
      filterNothing: false,
      filterText: "",
      defaultProps: defaultProps,
      defaultExpandedKeys: [],
      currentNodeKey: "",
      currentSelectIndexCode: "",
      keyCode: "personIndexCode",
      leftSearchValue: "personName",
      rightSearchValue: "personName",
      currentRow: null,
      currentCode: "",
    };
  },
  props: {
    treeData: {
      type: Array,
      default() {
        return [];
      },
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    disabledData: {
      type: String,
      default: "",
    },
    currentCodes: {
      type: String,
      default: "",
    },
  },
  watch: {
    treeData(val) {
      if (val[0]) {
        let _indexCode = val[0][defaultProps.id];
        this.defaultExpandedKeys = [_indexCode];
        this.currentNodeKey = _indexCode;
        this.currentSelectIndexCode = _indexCode;
        this.$nextTick(() => {
          this.$refs.tree && this.$refs.tree.setCurrentKey(_indexCode);
        });
        this.$emit("ShuttleEvent", {
          type: "getLeftData",
          payload: {
            indexCode: _indexCode,
          },
        });
      }
    },
    leftTableDataFilterSelect: {
      handler: function (val) {
        if (this.currentCode) {
          this.setCurrent(this.currentCode);
        } else {
          this.setCurrent(this.currentCodes);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mixins: [ShuttleBoxMixin, renderContentTree],
  methods: {
    handleBeforeChange(value,done) {
      this.rightTableDataFilterSelect.forEach(item => {
        this.$set(item, 'isDefaultApprovalUser', false)
      })
      done()
    },
    handleCurrentChange(val) {
      val && val.personIndexCode && (this.currentCode = val.personIndexCode);
      this.currentRow = val;
    },
    // 树
    TreeHandleIconClick() {
      const first = getFirstObjectInTree(
        this.treeData,
        this.filterText,
        defaultProps.label
      );
      if (first && first[defaultProps.id]) {
        this.filterNothing = false;
        this.$nextTick(() => {
          this.TreeHandleNodeClick(first);
          this.$refs.tree &&
            this.$refs.tree.setCurrentKey(first[defaultProps.id]);
          this.$refs.tree.filter(this.filterText);
          this.$refs.tree.$refs.scrollbar.setScroll(0, 0);
        });
      } else {
        this.filterNothing = true;
        this.$refs.tree.filter(this.filterText);
      }
    },
    TreeClearIconClick() {
      this.filterNothing = false;
      let _indexCode = this.treeData[0][defaultProps.id];
      this.currentSelectIndexCode = _indexCode;
      this.$refs.tree.filter("");
      this.$nextTick(() => {
        this.$refs.tree && this.$refs.tree.$refs.scrollbar.setScroll(0, 0);
        this.$refs.tree && this.$refs.tree.setCurrentKey(_indexCode);
        this.treeData[0] && this.TreeHandleNodeClick(this.treeData[0]);
      });
    },
    TreeHandleNodeClick(data) {
      this.leftSearchInput = "";
      this.currentSelectIndexCode = data[defaultProps.id];
      this.$emit("ShuttleEvent", {
        type: "getLeftData",
        payload: {
          indexCode: data[defaultProps.id],
        },
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data[defaultProps.label].indexOf(value) !== -1;
    },
    leftHandleIconClick() {
      this.$emit("ShuttleEvent", {
        type: "getLeftData",
        payload: {
          indexCode: this.currentSelectIndexCode,
          [this.leftSearchValue]: this.leftSearchInput,
        },
      });
    },
    leftClearIconClick() {
      // this.leftSearchInput = ''
      this.$emit("ShuttleEvent", {
        type: "getLeftData",
        payload: {
          indexCode: this.currentSelectIndexCode,
        },
      });
    },
    setRightData(data) {
      this.rightTableData = data;
      this.rightClearIconClick();
    },
    closeDialog() {
      this.resetTree();
    },
    onsubmit() {
      // if (!this.rightTableData.length && !this.currentRow) {
      //   return this.$message("请至少选择一个人员");
      // }
      this.$emit("ShuttleEvent", {
        type: "selectData",
        payload: {
          data: this.multiple ? this.rightTableData : this.currentRow,
          // close: this.closeDialog,
        },
      });
    },
    onclose() {
      this.$emit("ShuttleEvent", {
        type: "close",
        payload: {
          close: this.closeDialog,
        },
      });
    },
    beforeCLose(done) {
      this.resetTree();
      this.$emit("ShuttleEvent", {
        type: "beforeCLose",
        payload: {
          done,
        },
      });
    },
    resetTree() {
      this.setRightData([]);
      this.filterText = "";
      this.currentCode = "";
      this.TreeClearIconClick();
      this.leftSearchInput = "";
      let _indexCode = this.treeData[0][defaultProps.id];
      this.defaultExpandedKeys = [_indexCode];
      this.currentNodeKey = _indexCode;
      this.currentSelectIndexCode = _indexCode;
      this.$refs.tree && this.$refs.tree.setCurrentKey(_indexCode);
      this.$emit("ShuttleEvent", {
        type: "getLeftData",
        payload: {
          indexCode: _indexCode,
        },
      });
    },
    setCurrent(id) {
      const row = this.leftTableData.filter((v) => v[this.keyCode] === id);
      this.$refs.leftMultipleTable &&
        this.$refs.leftMultipleTable.setCurrentRow(row[0]);
    },
    selectable(column) {
      return this.disabledData !== column.personIndexCode;
    },
  },
};
</script>
<style lang="less" rel="stylesheet/less">
.shuttlebox_dialogDedicated {
  &.single .el-dialog {
    width: 635px !important;
    margin-left: -317.5px !important;
  }

  .el-dialog__body .el-dialog__body-wrapper {
    padding: 0;
  }

  .dialog-footer {
    .el-button {
      width: 96px;
      position: relative;
      left: 10px;
      top: 44px;
    }
  }

  .el-table__row {
    cursor: pointer;
  }
  .el-table-column--radio .cell {
    font-size: 14px;
  }
}
</style>
<style lang="less" rel="stylesheet/less" scope>
.ShuttleBoxDedicated {
  box-sizing: border-box;
  height: 500px;
  width: 80% !important;
  display: flex;
  position: relative;
  left: 10px;
  bottom: -17px;
  .sider {
    width: 280px;
    border: 1px solid #e5e5e5;
    border-right: 0;
    padding: 8px;
    display: flex;
    flex-direction: column;
  }

  .tree-wrap {
    position: relative;
    flex: 1;
    overflow: hidden;
    margin-top: 8px
  }

  .left,
  .right {
    flex: 1;
    border: 1px solid #e5e5e5;
  }

  .middle {
    width: 66px;
    height: 80px;
    text-align: center;
    position: relative;
    top: 50%;
    margin-top: -40px;

    .el-button {
      margin: 4px 0;
    }

    .el-button + .el-button {
      margin-left: 0;
    }
  }

  .left-title,
  .right-title {
    box-sizing: border-box;
    height: 48px;
    line-height: 48px;
    padding: 0 21px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    letter-spacing: 0;
  }

  .tree-title {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    letter-spacing: 0;
  }

  .left-search,
  .right-search {
    box-sizing: border-box;
    padding: 0 16px;
    display: flex;

    & > .el-select {
      box-sizing: border-box;
      margin-right: 8px;
      flex: 1;
    }

    & > .el-input {
      flex: 3;
    }
  }

  .left-table,
  .right-table {
    box-sizing: border-box;
    width: 100%;
    height: ~"calc(100% - 98px)";
    position: relative;

    .el-table {
      border-left: 0;
    }

    .el-table:after {
      width: 0;
    }

    .el-table .el-table__body-wrapper:before,
    .el-table:before {
      height: 0;
    }
  }

  .left-table-cantainer,
  .right-table-cantainer {
    position: absolute;
    top: 0;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    padding: 0 16px;
    margin-top: 8px
  }

  .el-table__body-wrapper {
    top: 37px !important;
    position: static !important;
  }

  .tree_empty_text {
    color: #5e6e82;
    font-size: 14px;
    position: absolute;
    width: 94%;
    top: 21px;
    left: 112px;
  }
}
</style>
