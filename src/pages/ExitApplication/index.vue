<template>
  <watermarkContent>
    <div class="exitApplication">
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="待办" name="0"> </el-tab-pane>
          <el-tab-pane label="已完成" name="1"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="ctrl-box" v-show="activeName == '0'">
        <div class="ctrl-item add-box" @click="addHandle">
          <i class="h-icon-add"></i><span class="icon-desc">新建</span>
        </div>
      </div>
      <div class="content-box">
        <FilterSearchBoxForApplicate>
          <FilterSearchItem>
            <div class="item-lable">办案区</div>
            <div class="item-input">
              <el-select
                v-model="searchForm.areaIndexCodes"
                filterable
                placeholder="请选择"
                clear
                multiple
              >
                <el-option
                  v-for="item in areaList"
                  :key="item.areaIndexCode"
                  :label="item.areaName"
                  :value="item.areaIndexCode"
                >
                </el-option>
              </el-select>
            </div>
          </FilterSearchItem>
          <FilterSearchItem>
            <div class="item-lable">申请人</div>
            <div class="item-input">
              <el-input
                v-model="searchForm.applyUserName"
                placeholder="请输入"
              ></el-input>
            </div>
          </FilterSearchItem>
          <FilterSearchItem :is-col2="true">
            <div class="item-lable">申请时间</div>
            <div class="item-input">
              <el-date-picker
                v-model="timeArr"
                type="datetimerange"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :style="{ width: '100%' }"
              >
              </el-date-picker>
            </div>
          </FilterSearchItem>
          <FilterSearchItem>
            <div class="item-lable">审批状态</div>
            <div class="item-input">
              <el-select v-model="applyStatus" placeholder="请选择" clear>
                <el-option
                  v-for="item in approveStatusList"
                  :key="item.key"
                  :label="item.name"
                  :value="item.key"
                  v-show="activeName == item.used"
                >
                </el-option>
              </el-select>
            </div>
          </FilterSearchItem>
          <FilterSearchItem :is-btn="true">
            <el-button type="primary" @click="searchHandle"> 搜索 </el-button>
            <el-button @click="resetHandle"> 重置 </el-button>
          </FilterSearchItem>
        </FilterSearchBoxForApplicate>
        <FilterSearchContent>
          <el-table
            ref="autoTable"
            :data="tableData"
            force-scroll
            style="width: 100%"
            v-loading="loading"
            @sort-change="handleClickSort"
          >
            <el-table-column type="index" label="序号" width="55">
            </el-table-column>
            <el-table-column
              prop="suspectPhotoUrl"
              label="照片"
              show-overflow-title
            >
              <template slot-scope="scope">
                <el-tooltip
                 placement="top"
                >
                <div slot="content">
                  <img
                    v-if="scope.row.suspectPhotoUrl"
                    :src="scope.row.suspectPhotoUrl"
                    alt=""
                    width="135px"
                    height="180px"
                  />
                  <img
                    v-else
                    :src="require('../../assets/image/u5576.png')"
                    width="135px"
                    height="180px"
                  />
                </div>
                <img
                  v-if="scope.row.suspectPhotoUrl"
                  :src="scope.row.suspectPhotoUrl"
                  alt=""
                  width="39px"
                  height="39px"
                />
                 <img
                  v-else
                  :src="require('../../assets/image/u5576.png')"
                  width="39px"
                  height="39px"
                 />
               </el-tooltip>
             </template>
            </el-table-column>
            <el-table-column
              prop="suspectName"
              :resizable="false"
              label="涉案人姓名"
              show-overflow-title
              width="180"
            >
              <template slot-scope="scope">
                <span
                  class="table-register-name"
                  :title="scope.row.suspectName"
                  :style="
                    scope.row.fastSolve == 1
                      ? 'max-width:calc(100% - 115px);'
                      : 'max-width:calc(100%);'
                  "
                  >{{ scope.row.suspectName }}</span
                >
                <span
                  class="status-icon green-icon"
                  v-if="scope.row.fastSolve == 1"
                  >快办</span
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="registerSex"
              label="性别"
              show-overflow-title
            >
              <template slot-scope="scope">
                <span v-for="item in dictData.sex" :key="item.key">{{
                  item.key == scope.row.sex ? item.name : ""
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="suspectType"
              :resizable="false"
              label="人员类型"
              show-overflow-title
              width="120"
            >
              <template slot-scope="scope">
                <span
                  v-for="item in dictData.suspectType"
                  :key="item.key"
                  class="status-icon"
                  :class="{
                    'red-icon': scope.row.suspectType == 1,
                    'blue-icon': scope.row.suspectType == 2,
                    'gray-icon':
                      scope.row.suspectType != 1 && scope.row.suspectType != 2,
                    'display-none': item.key != scope.row.suspectType,
                  }"
                  >{{
                    item.key != scope.row.suspectType ? "" : item.name
                  }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="deptName"
              label="办案部门"
              show-overflow-title
              width="88"
            >
            </el-table-column>
            <el-table-column
              prop="hostPoliceName"
              label="主办民警"
              show-overflow-title
              width="88"
            >
            </el-table-column>
            <el-table-column prop="areaName" label="办案区" show-overflow-title>
            </el-table-column>

            <el-table-column prop="caseCause" label="案由" show-overflow-title>
              <template slot-scope="scope">
                {{ briefMap[scope.row.caseCause] }}
              </template>
            </el-table-column>
            <el-table-column
              prop="applyUserName"
              label="申请人"
              show-overflow-title
            >
            </el-table-column>
            <el-table-column prop="applyType" label="类型" show-overflow-title>
              <template slot-scope="scope">
                <span v-if="scope.row.applyType == 1">入区预约</span>
                <span v-if="scope.row.applyType == 2">入区申请</span>
                <span v-if="scope.row.applyType == 3">出区申请</span>
                <span v-if="scope.row.applyType == 4">临时出区申请</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="applyTime"
              label="申请时间"
              show-overflow-title
              width="170"
              sortable="custom"
            >
              <template slot-scope="scope">
                {{ $moment(scope.row.applyTime).format("YYYY-MM-DD HH:mm:ss") }}
              </template>
            </el-table-column>
            <el-table-column
            prop="entryTime"
            label="在区时长"
            show-overflow-title
            width="88"
          >
            <template slot-scope="scope">
              {{ $duration(scope.row.entryTime, scope.row.outTime) }}
            </template>
          </el-table-column>
            <el-table-column
              prop="applyStatus"
              :resizable="false"
              label="审批状态"
              show-overflow-title
              width="100"
            >
              <template slot-scope="scope">
                <span
                  class="status-icon blue-icon"
                  v-if="scope.row.applyStatus == 0"
                  :class="{ 'blue-icon': scope.row.applyStatus == 0 }"
                  >待审批</span
                >
                <span
                  class="status-icon red-icon"
                  v-if="scope.row.applyStatus == 1"
                  :class="{ 'red-icon': scope.row.applyStatus == 1 }"
                  >已退回</span
                >
                <span
                  class="status-icon green-icon"
                  v-if="scope.row.applyStatus == 2"
                  :class="{ 'green-icon': scope.row.applyStatus == 2 }"
                  >已审批</span
                >
                <span
                  class="status-icon green-icon"
                  v-if="scope.row.applyStatus == 3"
                  :class="{ 'green-icon': scope.row.applyStatus == 3 }"
                  >已预约</span
                >
                <span
                  class="status-icon gray-icon"
                  v-if="scope.row.applyStatus == 4"
                  :class="{ 'gray-icon': scope.row.applyStatus == 4 }"
                  >已作废</span
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="registerStatus"
              :resizable="false"
              label="使用状态"
              show-overflow-title
              width="100"
              v-if="activeName == '1'"
            >
              <template slot-scope="scope">
                <span
                  v-if="scope.row.registerStatus == 2"
                  >未使用</span
                >
                <span
                  class="inDistrict"
                  v-if="scope.row.registerStatus == 3"
                  >已使用</span
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" show-overflow-title width="200">
              <template slot-scope="scope">
                <span
                  class="table-ctrl-btn"
                  @click="viewHandle(scope.row.applyIndexCode)"
                  >详情</span
                >
                <span
                  class="table-ctrl-btn"
                  v-if="scope.row.applyStatus == 1"
                  @click="updateHandle(scope.row.applyIndexCode)"
                  >编辑</span
                >
                <span
                  class="table-ctrl-btn"
                  v-if="
                    scope.row.applyStatus == 1 &&
                    scope.row.applyUser == currentUser
                  "
                  @click="cancelHandle(scope.row.applyIndexCode)"
                  >作废</span
                >
                <span
                  class="table-ctrl-btn"
                  v-show="showFlag"
                  @click="delHandle(scope.row.applyIndexCode)"
                  >删除</span
                >
              </template>
            </el-table-column>
          </el-table>
        </FilterSearchContent>
      </div>
      <div class="pagination-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.pageNo"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="searchForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageTotal"
        >
        </el-pagination>
      </div>
      <el-dialog
        title="选择出区对象"
        :visible.sync="exitDialogVisible"
        size="small"
        :area="1300"
      >
        <el-table
          ref="singleTable"
          :data="tableDataTemp"
          highlight-current-row
          @current-change="peosonCurrentChange"
          style="width: 100%"
          height="517"
        >
          <el-table-column type="radio"> </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="60"
          ></el-table-column>
          <el-table-column
            prop="registerPhotoUrl"
            label="照片"
            show-overfloe-title
          >
            <template slot-scope="scope">
               <el-tooltip
                 placement="top"
                >
                <div slot="content">
                  <img
                    v-if="scope.row.registerPhotoUrl"
                    :src="scope.row.registerPhotoUrl"
                    alt=""
                    width="135px"
                    height="180px"
                  />
                  <img
                    v-else
                    :src="require('../../assets/image/u5576.png')"
                    width="135px"
                    height="180px"
                  />
                </div>
                <img
                  v-if="scope.row.registerPhotoUrl"
                  :src="scope.row.registerPhotoUrl"
                  alt=""
                  width="30px"
                  height="30px"
                />
                 <img
                  v-else
                  :src="require('../../assets/image/u5576.png')"
                  width="30px"
                  height="30px"
                 />
               </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="registerName"
            :resizable="false"
            label="涉案人姓名"
            width="215"
            show-overflow-title
          >
            <template slot-scope="scope">
              <span
                class="table-register-name"
                :title="scope.row.registerName"
                :style="
                  scope.row.fastSolve == 1
                    ? 'max-width:calc(100% - 78px);'
                    : 'max-width:calc(100%);'
                "
                >{{ scope.row.registerName }}</span
              >
              <span
                class="status-icon green-icon"
                v-if="scope.row.fastSolve == 1"
                >快办</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="registerSex" label="性别" show-overflow-title>
            <template slot-scope="scope">
              <span v-for="item in dictData.sex" :key="item.key">{{
                item.key == scope.row.registerSex ? item.name : ""
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="suspectType"
            :resizable="false"
            label="人员类型"
            show-overflow-title
          >
            <template slot-scope="scope">
              <span
                v-for="item in dictData.suspectType"
                :key="item.key"
                class="status-icon"
                :class="{
                  'red-icon': scope.row.personType == 1,
                  'blue-icon': scope.row.personType == 2,
                  'gray-icon':
                    scope.row.personType != 1 && scope.row.personType != 2,
                  'display-none': item.key != scope.row.personType,
                }"
                >{{ item.key != scope.row.personType ? "" : item.name }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="deptName" label="办案部门" show-overflow-title>
          </el-table-column>
          <el-table-column
            prop="hostPoliceName"
            label="主办民警"
            show-overflow-title
          >
          </el-table-column>
          <el-table-column prop="areaName" label="办案区" show-overflow-title>
          </el-table-column>
          <el-table-column prop="caseCause" label="案由" show-overflow-title>
            <template slot-scope="scope">
              {{ briefMap[scope.row.caseCause] }}
            </template>
          </el-table-column>
          <el-table-column
            prop="entryTime"
            label="在区时长"
            show-overflow-title
          >
            <template slot-scope="scope">
              {{ $duration(scope.row.entryTime, scope.row.outTime) }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="peosonPageSizeChange"
          @current-change="peosonPageNoChange"
          :current-page="searchForExit.pageNo"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="searchForExit.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="peosonTotal"
        >
        </el-pagination>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="checkPeosonSure">确 定</el-button>
          <el-button @click="exitDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </watermarkContent>
</template>
<script>
import FilterSearchBoxForApplicate from "../../components/FilterSearchBoxForApplicate/FilterSearchBoxForApplicate";
import FilterSearchItem from "../../components/FilterSearchItem/FilterSearchItem";
import FilterSearchContent from "../../components/FilterSearchContent/FilterSearchContent";
import server from "../../server/exitApplication";

export default {
  name: "ExitApplication",
  data() {
    return {
      activeName: "0",
      loading: false,
      areaList: [],
      timeArr: "",
      dictData: {
        sex: [],
        suspectType: [],
      },
      applyStatus: "",
      approveStatusList: [
        { typeCode: "approveStatus", key: "1", name: "已退回", used: 0 },
        { typeCode: "approveStatus", key: "2", name: "已审批", used: 1 },
        { typeCode: "approveStatus", key: "0", name: "待审批", used: 0 },
        { typeCode: "approveStatus", key: "4", name: "已作废", used: 1 },
      ],
      searchForm: {
        applyTypes: [3],
        areaIndexCodes: [],
        applyUserName: "",
        applyStatus: [0, 1],
        pageNo: 1,
        pageSize: 20,
        applyTime: {
          startTime: "",
          endTime: "",
        },
        sortby: 'applyTime'
      },
      order: "desc",
      searchForExit: {
        applyType: 3,
        pageNo: 1,
        pageSize: 10,
      },
      lastestParams: null,
      pageTotal: 0,
      tableData: [],
      tableDataTemp: [],
      multipleSelection: [],
      briefMap: {},
      showFlag: false,
      exitDialogVisible: false, //点击添加弹框
      peosonList: [],
      peosonTotal: 1,
      peosonCurrentItem: {},
      currentUser: "",
      currentUserInfo: {}
    };
  },
  activated() {
    this.checkFunctionAuth();
    this.loadPersonInfoByUserCode();
    this.lastestParams
      ? this.exitApplicaitionSearch(this.lastestParams)
      : this.exitApplicaitionSearch();
  },
  mounted() {
    this.searchForm = { ...this.searchForm, pageNo: 1 };
    this.findAuthUserPlaceList(); // 获取办案区列表
    this.inqDict(); // 获取字典列表
  },
  methods: {
    //分页查询办案区出入区申请记录
    async exitApplicaitionSearch(lastestParams) {
      let params = {};
      if (lastestParams) {
        params = lastestParams;
      } else {
        let applyTime = {};
        applyTime.startTime =
          this.timeArr &&
          this.timeArr[0] &&
          this.$moment(this.timeArr[0]).format();
        applyTime.endTime =
          this.timeArr &&
          this.timeArr[1] &&
          this.$moment(this.timeArr[1]).format();
        this.lastestParams = params = {
          ...this.searchForm,
          order: this.order,
          applyStatus: this.applyStatus
            ? [Number(this.applyStatus)]
            : this.searchForm.applyStatus,
          applyTime,
          searchType: 0,
        };
      }
      this.loading = true;
      const result = await server.exitApplicaitionSearch(params);
      const { data } = result;
      if (data.code === "0") {
        this.tableData = data.data.list;
        this.pageTotal = data.data.total;
        this.loading = false;
      } else {
        this.loading = false;
        this.$messagebox(result);
      }
    },
    //按申请时间排序
    handleClickSort(column) {
      if (column.column) {
        column.order == "ascending"
          ? (this.order = "asc")
          : (this.order = "desc");
        this.exitApplicaitionSearch();
      }
    },
    //切换选项卡触发的事件
    handleClick(tab, event) {
      this.$refs.autoTable.columns[11].order = ''
      this.applyStatus = "";
      this.order = "desc";
      this.searchForm = {
        ...this.searchForm,
        applyStatus: tab.name == "0" ? [0, 1] : [2, 3, 4],
        pageNo: 1,
      };
      this.exitApplicaitionSearch();
    },
    // 查询按钮点击回调
    searchHandle() {
      this.searchForm.pageNo = 1;
      this.exitApplicaitionSearch();
    },
    // 重置按钮回调
    resetHandle() {
      this.$refs.autoTable.columns[11].order = ''
      this.timeArr = "";
      this.applyStatus = "";
      this.order = "desc";
      this.searchForm = {
        ...this.searchForm,
        areaIndexCodes: [],
        applyUserName: "",
        pageNo: 1,
        pageSize: 20,
      };
      this.exitApplicaitionSearch();
    },
    // 每页展示数量改变
    handleSizeChange(pageSize) {
      this.searchForm = { ...this.searchForm, pageSize: pageSize, pageNo: 1 };
      this.lastestParams = {
        ...this.lastestParams,
        pageSize: pageSize,
        pageNo: 1,
      };
      this.exitApplicaitionSearch(this.lastestParams);
    },
    // 页码改变
    handleCurrentChange(pageNo) {
      this.searchForm = { ...this.searchForm, pageNo: pageNo };
      this.lastestParams = { ...this.lastestParams, pageNo: pageNo };
      this.exitApplicaitionSearch(this.lastestParams);
    },
    // 列表删除
    delHandle(rowId) {
      this.$nextTick(() => {
        let elMessageBox = document.getElementsByClassName("el-message-box--small")[0].style
        elMessageBox.position = ''
        elMessageBox.left = ''
      })
      this.$confirm("确认删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "question",
      }).then(async () => {
        let params = {
          applyIndexCode: rowId,
        };
        const result = await server.deleteExitApplication(params);
        const { data } = result;
        if (data.code === "0") {
          this.$message.success("删除成功");
          this.exitApplicaitionSearch();
        } else {
          this.$messagebox(result);
        }
      });
    },
    // 作废
    cancelHandle(rowId) {
      this.$nextTick(() => {
        let elMessageBox = document.getElementsByClassName("el-message-box--small")[0].style
        elMessageBox.position = ''
        elMessageBox.left = ''
      })
      this.$confirm("确认作废?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "question",
      }).then(async () => {
        let params = {
          applyIndexCode: rowId,
        };
        const result = await server.cancelExitApplication(params);
        const { data } = result;
        if (data.code === "0") {
          this.$message.success("作废成功");
          this.exitApplicaitionSearch();
        } else {
          this.$messagebox(result);
        }
      });
    },
    // 编辑跳转
    updateHandle(applyIndexCode) {
      applyIndexCode &&
        this.$router.push({ path: "addEdit", query: { id: applyIndexCode } });
    },
    // 详情跳转
    viewHandle(applyIndexCode) {
      applyIndexCode &&
        this.$router.push({
          path: "detailsPage",
          query: { id: applyIndexCode, currentUser: this.currentUser },
        });
    },
    //确认选择出区对象
    checkPeosonSure() {
      if (this.peosonCurrentItem && "registerName" in this.peosonCurrentItem) {
        this.exitDialogVisible = false;
        this.$router.push({
          path: "addEdit",
          query: { peosonCurrentItem: this.peosonCurrentItem,currentUserInfo:this.currentUserInfo },
        });
      } else {
        this.$message.error("请选择出区对象");
      }
    },
    // 添加
    addHandle() {
      this.exitDialogVisible = true;
      this.searchForExit = {
        ...this.searchForExit,
        pageNo:1,
        pageSize: 10
      }
      this.getRegisterInfoList();
    },
    // 出区人员列表每页展示数量改变
    peosonPageSizeChange(pageSize) {
      this.searchForExit = {
        ...this.searchForExit,
        pageSize: pageSize,
        pageNo: 1,
      };
      this.getRegisterInfoList();
    },
    // 出区人员列表页码改变
    peosonPageNoChange(pageNo) {
      this.searchForExit = { ...this.searchForExit, pageNo: pageNo };
      this.getRegisterInfoList();
    },
    // 选择出区人员change
    peosonCurrentChange(val) {
      this.peosonCurrentItem = val;
    },
    // 选择出区对象列表查询
    async getRegisterInfoList() {
      let params = {
        ...this.searchForExit,
      };
      const result = await server.searchRegisterInfoForLeaveApply(params);
      const { data } = result;
      if (data.code === "0") {
        this.tableDataTemp = data.data.list;
        this.peosonTotal = data.data.total;
      } else {
        this.$messagebox(result);
      }
    },
    // 获取办案区
    async findAuthUserPlaceList() {
      const result = await server.findAuthUserPlaceList();
      const { data } = result;
      if (data.code === "0") {
        this.areaList = data.data.list;
      } else {
        this.$messagebox(result);
      }
    },
    // 获取字典
    async inqDict() {
      const result = await server.inqDict();
      const { data } = result;
      if (data.code === "0") {
        this.dictData = {
          sex: data.data.sex,
          suspectType: data.data.suspectType,
        };
        const briefMap = {};
        data.data.brief.forEach((v) => {
          briefMap[v.key] = v.name;
        });
        this.briefMap = briefMap;
      } else {
        this.$messagebox(result);
      }
    },
    // 是否显示删除按钮
    async checkFunctionAuth() {
      const result = await server.checkFunctionAuth({
        functionCode: "casehandlingmgt_casehandlingmgt0120_f0002",
      });
      const { data } = result;
      if (data.code === "0") {
        this.showFlag = data.data;
      } else {
        this.$messagebox(result);
      }
    },
    // 获取当前登录用户
    async loadPersonInfoByUserCode() {
      const result = await server.loadPersonInfoByUserCode();
      const { data } = result;
      if (data.code === "0") {
        if(data.data) {
          this.currentUser = data.data.personCode;
          this.currentUserInfo =data.data
        }else{
          this.currentUser = ""
          this.currentUserInfo = {}
        }
      } else {
        this.$messagebox(result);
      }
    },
  },
  mixins: [],
  components: {
    FilterSearchBoxForApplicate,
    FilterSearchItem,
    FilterSearchContent,
  },
};
</script>
<style lang="less" rel="stylesheet/less">
.exitApplication {
  position: relative;
  // padding: 0px 8px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  border: solid 8px #f2f2f2;
  * {
    box-sizing: border-box;
  }
  .ctrl-box {
    font-size: 14px;
    color: #4d4d4d;
    padding: 0px 16px;
    position: absolute;
    top: 60px;
    z-index: 1;
    .ctrl-item {
      display: inline-block;
      vertical-align: middle;
      height: 32px;
      padding: 4px;
      cursor: pointer;
      margin-right: 16px;
      &:hover {
        background: rgba(0, 0, 0, 0.08);
      }
      &.filter-box {
        float: right;
      }
      i {
        font-size: 24px;
        display: inline-block;
        vertical-align: middle;
      }
      .icon-desc {
        display: inline-block;
        vertical-align: middle;
        margin-left: 4px;
      }
    }
  }
  .content-box {
    height: ~"calc(100% - 95px)";
    position: relative;
    bottom: 14px;
    .status-icon {
      font-size: 14px;
      line-height: 22px !important;
    }
    .filter-search-box .search-box .search-btn {
      padding-top: 4px !important;
    }
    // .filter-search-content {
    //   height: ~"calc(100% - 57px)" !important 
    // }
    .table-ctrl-btn {
      border-right: solid 1px #e6e6e6;
      padding: 0px 8px;
      font-size: 14px;
      color: #2080f7;
      cursor: pointer;
      &:first-child {
        padding-left: initial;
      }
      &:last-child {
        padding-right: initial;
        border-right: none;
      }
    }
    .el-table td{
      height: 46px !important;
    }
  }
  .tag-select-box {
    .tag-label {
      display: inline-block;
      vertical-align: middle;
    }
    .tag-select {
      width: 260px;
      display: inline-block;
      vertical-align: middle;
    }
  }
  .pagination-box {
    box-shadow: 0px -1px 0px #f2f2f2;
    padding: 0 16px;
    box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
    bottom: 23px;
  }
}
  .status-icon {
      font-size: 14px!important
   }
   .inDistrict{
  color: #FF0000
}
</style>
