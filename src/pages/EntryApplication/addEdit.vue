<template>
  <watermarkContent>
    <div class="entryApplication-add-edit-box add-edit-from-box full">
      <PathDesc :path-desc-arr="pathDescArr" :is-back="true"></PathDesc>
      <div class="add-edit-from-back" v-loading="formLoading">
        <div class="scroll-box">
          <el-scrollbar wrap-class="el-scrollbar__wrap">
            <el-form
              :model="ruleForm"
              :rules="rules"
              label-position="top"
              label-width="150px"
              ref="ruleForm"
            >
              <div class="form-title">
                <span class="desc1">涉案人员信息</span>
              </div>
              <el-row :gutter="100" class="form-row-box">
                <el-col :span="10">
                  <el-form-item label="姓名" prop="suspectName">
                    <el-input
                      v-model="ruleForm.suspectName"
                      :maxlength="30"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    ref="idcardNoForm"
                    label="证件号码"
                    prop="certificateNo"
                    :rules="[
                      {
                        required: checkIdCardNo,
                        message: '请输入',
                        trigger: 'change,blur',
                      },
                      { validator: checkIsIdentity },
                    ]"
                  >
                    <el-input
                      v-model="ruleForm.certificateNo"
                      @blur="getRegisterBirth('ruleForm')"
                      :maxlength="30"
                    >
                      <el-select
                        v-model="ruleForm.certificateType"
                        class="el-select--width-sm"
                        slot="prepend"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in dictData.certificateType"
                          :key="item.key"
                          :label="item.name"
                          :value="item.key"
                        >
                        </el-option>
                      </el-select>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="现住址" prop="currentAddress">
                    <el-input
                      v-model="ruleForm.currentAddress"
                      :maxlength="100"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="联系方式" prop="telPhone">
                    <el-input
                      v-model="ruleForm.telPhone"
                      :maxlength="11"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="国家/地区"
                    prop="nationality"
                    v-show="catchInfoSwitch"
                  >
                    <el-select
                      v-model="ruleForm.nationality"
                      placeholder="请选择"
                      filterable
                      clear
                    >
                      <el-option
                        v-for="item in dictData.nationality"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="政治面貌"
                    prop="political"
                    v-show="catchInfoSwitch"
                  >
                    <el-select
                      v-model="ruleForm.political"
                      placeholder="请选择"
                      filterable
                      clear
                    >
                      <el-option
                        v-for="item in dictData.political"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="文化程度"
                    prop="education"
                    v-show="catchInfoSwitch"
                  >
                    <el-select
                      v-model="ruleForm.education"
                      placeholder="请选择"
                      filterable
                      clear
                    >
                      <el-option
                        v-for="item in dictData.education"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="担任职务"
                    prop="job"
                    v-show="catchInfoSwitch"
                  >
                    <el-input v-model="ruleForm.job" :maxlength="30"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="ruleForm.sex">
                      <el-radio-button
                        class="radio"
                        :label="item.key"
                        v-for="item in dictData.sex"
                        :key="item.key"
                      >
                        {{ item.name }}
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="出生日期" prop="birthday">
                    <el-date-picker
                      v-model="ruleForm.birthday"
                      type="date"
                      placeholder="选择日期"
                      :style="{ width: '100%' }"
                      :max-time-is-now="true"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="户籍地址" prop="permanentAddress">
                    <el-input
                      v-model="ruleForm.permanentAddress"
                      :maxlength="100"
                    ></el-input>
                  </el-form-item>
                  <el-button
                    type="link"
                    class="isShowMore"
                    @click="showMoreBasicInfo"
                    v-show="!catchInfoSwitch"
                    >展开更多</el-button
                  >
                  <el-form-item
                    label="曾用名"
                    prop="usedName"
                    v-show="catchInfoSwitch"
                  >
                    <el-input
                      v-model="ruleForm.usedName"
                      :maxlength="30"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="民族"
                    prop="nation"
                    v-show="catchInfoSwitch"
                  >
                    <el-select
                      v-model="ruleForm.nation"
                      placeholder="请选择"
                      filterable
                      clear
                    >
                      <el-option
                        v-for="item in dictData.nation"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="担任人大代表"
                    prop="npcMember"
                    v-show="catchInfoSwitch"
                  >
                    <el-radio-group v-model="ruleForm.npcMember">
                      <el-radio-button
                        class="radio"
                        v-model="ruleForm.npcMember"
                        label="1"
                      >
                        是
                      </el-radio-button>
                      <el-radio-button
                        class="radio"
                        v-model="ruleForm.npcMember"
                        label="0"
                      >
                        否
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    label="工作单位"
                    prop="workUnit"
                    v-show="catchInfoSwitch"
                  >
                    <el-input
                      v-model="ruleForm.workUnit"
                      :maxlength="30"
                    ></el-input>
                  </el-form-item>
                  <el-button
                    type="link"
                    class="isShowMore"
                    @click="showMoreBasicInfo"
                    v-show="catchInfoSwitch"
                    >收起</el-button
                  >
                </el-col>
                <div class="person-photo-box">
                  <div class="person-photo-item">
                    <div class="photo-img">
                      <div class="showphoto-img">
                        <img v-if="suspectPhotoUrl" :src="suspectPhotoUrl" />
                        <img
                        v-else
                        :src="require('../../assets/image/u5576.png')"
                      />
                      </div>
                    </div>
                    <div
                      class="hover-box"
                      :style="{ width: suspectPhotoUrl ? '30%' : '100%' }"
                    >
                      <el-upload
                        :action="`/apis/person/uploadPhoto.do`"
                        class="upload-btn"
                        multiple
                        accept="image/jpg,image/jpeg,image/jpg"
                        :before-upload="beforeUpload"
                        :http-request="uploadAuto"
                        :show-file-list="false"
                      >
                        <el-button class="photoButton">
                          上传照片
                        </el-button>
                      </el-upload>
                    </div>
                  </div>
                </div>
              </el-row>
              <div class="form-title">
                <span class="desc1">办案信息</span>
              </div>
              <el-row :gutter="100" class="form-row-box">
                <el-col :span="12">
                  <el-form-item label="办案区" prop="areaIndexCode">
                    <el-select
                      v-model="ruleForm.areaIndexCode"
                      placeholder="请选择"
                      @change="areaChange"
                      :disabled="!!this.queryParam.id"
                      filterable
                      clear
                    >
                      <el-option
                        v-for="item in areaList"
                        :key="item.areaIndexCode"
                        :label="item.areaName"
                        :value="item.areaIndexCode"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="关联警情" prop="policeSituationNo">
                    <el-input
                      v-model="ruleForm.policeSituationNo"
                      :maxlength="100"
                      @change="policeSituationNoChange"
                      readonly
                      suffix-icon="h-icon-close_sm"
                      :on-icon-click="clearpoliceSituation"
                    >
                      <template slot="append"
                        ><el-button @click="checkpoliceSituationShow"
                          >选择</el-button
                        ></template
                      ></el-input
                    >
                  </el-form-item>
                  <el-form-item label="办案部门" prop="deptIndexCode">
                    <SelectWithTree
                      v-model="ruleForm.deptIndexCode"
                      :tree-data="deptList"
                      :default-props="defaultProps"
                      :simple-data="true"
                      node-key="deptIndexCode"
                      parent-key="parentIndexCode"
                      @change="deptChange"
                      :disabled="deptShow"
                    >
                    </SelectWithTree>
                  </el-form-item>
                  <el-form-item label="主办民警" prop="hostPoliceIndexCode">
                    <el-input
                      v-model="ruleForm.hostPolice"
                      placeholder="请选择"
                      readonly
                      suffix-icon="h-icon-close_sm"
                      :on-icon-click="clearHostPolice"
                    >
                      <template slot="append"
                        ><el-button @click="changeHostPolice"
                          >选择</el-button
                        ></template
                      >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="快办" prop="fastSolve">
                    <el-radio-group v-model="ruleForm.fastSolve">
                      <el-radio-button
                        class="radio"
                        v-model="ruleForm.fastSolve"
                        label="1"
                      >
                        是
                      </el-radio-button>
                      <el-radio-button
                        class="radio"
                        v-model="ruleForm.fastSolve"
                        label="0"
                      >
                        否
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="人员类型" prop="suspectType">
                    <el-select
                      v-model="ruleForm.suspectType"
                      placeholder="请选择"
                      filterable
                      clear
                    >
                      <el-option
                        v-for="item in suspectTypeList"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="关联案件" prop="caseIndexCode">
                    <el-input
                      v-model="ruleForm.caseIndexCodeLable"
                      :maxlength="100"
                      @change="caseChange"
                      readonly
                      suffix-icon="h-icon-close_sm"
                      :on-icon-click="clearCase"
                    >
                      <template slot="append"
                        ><el-button @click="checkCaseShow"
                          >选择</el-button
                        ></template
                      >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="案由" prop="caseCause">
                    <ElMoreSelect
                      v-model="ruleForm.caseCause"
                      :options="dictData.brief"
                    ></ElMoreSelect>
                  </el-form-item>
                  <el-form-item
                    label="协办民警"
                    prop="auxiliaryPoliceIndexCode"
                  >
                    <el-input
                      v-model="ruleForm.auxiliaryPolice"
                      placeholder="请选择"
                      readonly
                      suffix-icon="h-icon-close_sm"
                      :on-icon-click="clearAuxiliaryPolice"
                    >
                      <template slot="append"
                        ><el-button @click="changeAuxiliaryPolice"
                          >选择</el-button
                        ></template
                      >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="文书编号" prop="docNo">
                    <el-input
                      v-model="ruleForm.docNo"
                      :maxlength="30"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="form-title">
                <span class="desc1">申请信息</span>
              </div>
              <el-row :gutter="100" class="form-row-box">
                <el-col :span="12">
                  <el-form-item label="入区原由" prop="applyReason">
                    <el-select
                      v-model="ruleForm.applyReason"
                      placeholder="请选择"
                      filterable
                      clear
                    >
                      <el-option
                        v-for="item in applyReasonList"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="申请人" prop="applyUser">
                    <el-input
                      v-model="ruleForm.applyUserName"
                      placeholder="请选择"
                      readonly
                    >
                      <template slot="append"
                        ><el-button @click="changeApplyUser"
                          >选择</el-button
                        ></template
                      >
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="预计到达时间"
                    prop="estimatedArrivalTime"
                  >
                    <el-date-picker
                      v-model="ruleForm.estimatedArrivalTime"
                      type="datetime"
                      placeholder="选择到达时间"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item
                    label="审批人"
                    prop="approvalUser"
                    v-show="isEntryApproval"
                  >
                    <el-select
                      v-model="ruleForm.approvalUser"
                      placeholder="请选择"
                      filterable
                      clear
                    >
                      <el-option
                        v-for="item in approvalUserList"
                        :key="item.personIndexCode"
                        :label="`${item.personName}(${item.deptName})`"
                        :value="item.personIndexCode"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-scrollbar>
        </div>
      </div>
      <div class="form-btns">
        <el-button
          class="add-edit-btn"
          type="primary"
          @click="submitForm('ruleForm')"
        >
          确定
        </el-button>
        <el-button class="add-edit-btn" @click="goBack"> 取消 </el-button>
      </div>
      <el-dialog
        title="选择案件"
        :visible.sync="caseDialogVisible"
        size="small"
        :area="[950, 556]"
      >
        <div class="person-dialog-title">
          <el-input
            clearable
            placeholder="请输入案件名称或案件编号"
            suffix-icon="h-icon-search"
            v-model="caseSearchForm.param"
            class="person-search-input"
            :on-icon-click="getCaseInfoList"
            :clear-icon-click="getCaseInfoList"
          >
          </el-input>
        </div>

        <el-table
          ref="singleTable"
          :data="caseList"
          highlight-current-row
          @current-change="caseCurrentChange"
          style="width: 100%"
          height="342"
        > 
        <el-table-column type="radio"> </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="60"
          ></el-table-column>
          <el-table-column label="案件名称" show-overflow-title prop="name">
          </el-table-column>
          <el-table-column label="案件编号" show-overflow-title prop="caseNo">
          </el-table-column>
          <el-table-column
            label="办案部门"
            show-overflow-title
            prop="orgName"
          ></el-table-column>
        </el-table>
        <el-pagination
          @size-change="casePageSizeChange"
          @current-change="casePageNoChange"
          :current-page="caseSearchForm.start"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="caseSearchForm.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="caseTotal"
        >
        </el-pagination>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="checkCaseSure">确 定</el-button>
          <el-button @click="caseDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="选择警情"
        :visible.sync="policeSituationDialogVisible"
        size="small"
        :area="[950, 556]"
      >
        <div class="person-dialog-title">
          <el-input
            clearable
            placeholder="请输入报警内容"
            suffix-icon="h-icon-search"
            v-model="policeSituationSearchForm.reportContent"
            class="person-search-input"
            :on-icon-click="getpoliceSituationInfoList"
            :clear-icon-click="getpoliceSituationInfoList"
          >
          </el-input>
        </div>

        <el-table
          ref="singleTable"
          :data="policeSituationList"
          highlight-current-row
          @current-change="policeSituationCurrentChange"
          style="width: 100%"
          height="342"
        >
          <el-table-column type="radio"> </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="60"
          ></el-table-column>

          <el-table-column
            label="警情编号"
            show-overflow-title
            prop="policeSituationNo"
          >
          </el-table-column>
          <el-table-column
            label="报警内容"
            show-overflow-title
            prop="reportContent"
          >
          </el-table-column>

          <el-table-column
            label="报警时间"
            show-overflow-title
            prop="reportTime"
          >
            <template slot-scope="scope">
              {{
                (scope.row.reportTime &&
                  $moment(scope.row.reportTime).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )) ||
                "--"
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="接警时间"
            show-overflow-title
            prop="receiveTime"
          >
            <template slot-scope="scope">
              {{
                (scope.row.receiveTime &&
                  $moment(scope.row.receiveTime).format(
                    "YYYY-MM-DD HH:mm:ss"
                  )) ||
                "--"
              }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="policeSituationPageSizeChange"
          @current-change="policeSituationPageNoChange"
          :current-page="policeSituationSearchForm.pageNo"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="policeSituationSearchForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="policeSituationTotal"
        >
        </el-pagination>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="checkpoliceSituationSure"
            >确 定</el-button
          >
          <el-button @click="policeSituationDialogVisible = false"
            >取 消</el-button
          >
        </span>
      </el-dialog>
      <ShuttleBox
        ref="ShuttleBoxSingle"
        @ShuttleEvent="ShuttleEvent"
        :tree-data="orgTreeSingle"
        :currentCodes="ruleForm.hostPoliceIndexCode"
        :disabledData="ruleForm.auxiliaryPoliceIndexCode"
        :left-table-data="personByOrg"
        :multiple="false"
      ></ShuttleBox>
      <ShuttleBox
        ref="ShuttleBoxSingle1"
        @ShuttleEvent="ShuttleEvent1"
        :currentCodes="ruleForm.auxiliaryPoliceIndexCode"
        :disabledData="ruleForm.hostPoliceIndexCode"
        :tree-data="orgTreeSingle"
        :left-table-data="personByOrg"
        :multiple="false"
      ></ShuttleBox>
      <ShuttleBox
        ref="ShuttleBoxSingle2"
        @ShuttleEvent="ShuttleEvent2"
        :currentCodes="ruleForm.applyUser"
        :disabledData="disabledDataForApplyUser"
        :tree-data="orgTreeSingle2"
        :left-table-data="personByOrg"
        :multiple="false"
      ></ShuttleBox>
    </div>
  </watermarkContent>
</template> 
<script>
import PathDesc from "./components/PathDesc";
import server from "../../server/entryApplication";
import SelectWithTree from "../../components/SelectWithTree/SelectWithTree";
import ElMoreSelect from "../../components/ElMoreSelect/ElMoreSelect";
import { validateIdentity, validateMobile } from "../../mixin/validate.mixins";
import ShuttleBox from "@/components/ShuttleBoxNew/index";
var validateLength = (rule, value, callback) => {
  if (!/^[0-9]{6}$/g.test(value)) {
    callback(new Error("请输入数字且长度为6"));
  } else {
    callback();
  }
};

export default {
  name: "EntryApplicationEdit",
  data() {
    let queryParam = this.$route.query;
    var checkSpCode = (rule, value, callback) => {
      if (/['/\\:*?""<>|]/g.test(value)) {
        callback(new Error("不能包含 ' / \\ : * ? \" < > | 这些特殊字符"));
      } else {
        callback();
      }
    };
    var checkNumAndCode = (rule, value, callback) => {
      if (!/^[0-9a-zA-Z]{0,}$/g.test(value)) {
        callback(new Error("请输入数字和字母"));
      } else {
        callback();
      }
    };
    return {
      isEntryApproval: 0,
      checkIdCardNo: false,
      checkedFaceResult: "",
      deptShow: false,
      uploadLoading: false,
      personList: [],
      total: 1,
      personSearchForm: {
        searchParam: "",
        pageNo: 1,
        pageSize: 20,
      },
      caseDialogVisible: false,
      caseList: [],
      caseTotal: 1,
      caseSearchForm: {
        param: "",
        start: 1,
        limit: 20,
      },
      caseCurrentItem: {},
      catchInfoSwitch: false,
      caseInfoSwitch: false,
      formLoading: false,
      pathDescArr: ["入区申请", `${queryParam.id ? "编辑" : "新建"}`],
      queryParam: queryParam,
      suspectPhotoUrl: "",
      ruleForm: {
        estimatedArrivalTime: "", //预计到达时间
        suspectName: "",
        sex: "1",
        birthday: "",
        certificateType: "111",
        certificateNo: "",
        permanentAddress: "",
        suspectPhoto: "",
        telPhone: "",
        currentAddress: "",
        usedName: "",
        nationality: "",
        nation: "",
        political: "",
        education: "",
        workUnit: "",
        job: "",
        npcMember: "0",
        suspectType: "",
        caseIndexCode: "",
        caseName: "",
        caseIndexCodeLable: "",
        caseCause: "",
        caseNo: "",
        fastSolve: "0",
        areaIndexCode: "",
        areaName: "",
        deptIndexCode: "",
        deptName: "",
        hostPoliceIndexCode: "",
        hostPolice: "",
        hostPoliceData: {},
        hostPoliceName: "",
        auxiliaryPoliceIndexCode: "",
        auxiliaryPolice: "",
        auxiliaryPoliceData: {},
        auxiliaryPoliceName: "",
        docNo: "",
        applyReason: "",
        policeSituationNo: "",
        policeSituationIndexCode: "",
        reportContent: "",
        approvalUser: "",
        applyUser: "",
        applyUserData: {},
        applyUserName: "",
      },
      rules: {
        // 姓名
        suspectName: [
          {
            required: true,
            message: "请输入",
            trigger: "change,blur",
          },
          {
            min: 1,
            max: 30,
            message: this.$t("casehandlingmgt_commonCheckLength", ["1", "30"]),
            trigger: "change,blur",
          },
          { validator: checkSpCode, trigger: "change,blur" },
        ],
        // 户籍地址
        usedName: [{ validator: checkSpCode, trigger: "change,blur" }],
        // 性别
        sex: [{ required: true, message: "请选择", trigger: "change,blur" }],
        // 证件号   验证写在表单中
        // certificateNo: [
        //  { validator: checkIsIdentity., trigger: 'change,blur' } : ''
        // ],
        // 联系电话
        telPhone: [
          {
            min: 0,
            max: 11,
            message: "请输入0-11位数字",
            trigger: "change,blur",
          },
          { validator: validateMobile, trigger: "change,blur" },
        ],
        // 户籍地址
        permanentAddress: [{ validator: checkSpCode, trigger: "change,blur" }],
        // 工作单位
        workUnit: [{ validator: checkSpCode, trigger: "change,blur" }],
        // 担任职务
        job: [{ validator: checkSpCode, trigger: "change,blur" }],
        // 现住址
        currentAddress: [{ validator: checkSpCode, trigger: "change,blur" }],
        // 案由
        caseCause: [{ validator: checkSpCode, trigger: "change,blur" }],
        // 文书编号
        docNo: [{ validator: checkNumAndCode, trigger: "change,blur" }],
        // 人员类型
        suspectType: [
          { required: true, message: "请选择", trigger: "change,blur" },
        ],
        // 办案区
        areaIndexCode: [
          { required: true, message: "请选择", trigger: "change,blur" },
        ],
        // 审批人
        approvalUser: [{ required: true, message: "请选择", trigger: "change,blur" }],
        // 申请人
        applyUser: [{ required: true, message: "请选择", trigger: "change,blur" }],
        // 办案部门
        deptIndexCode: [
          { required: true, message: "请选择", trigger: "change,blur" },
        ],
        // 主办民警
        hostPoliceIndexCode: [
          { required: true, message: "请选择", trigger: "change,blur" },
        ],
        // 入区原由
        applyReason: [
          { required: true, message: "请选择", trigger: "change,blur" },
        ],
        // 预计到达时间
        estimatedArrivalTime: [
          {required: true, message: "请选择"},
        ],
      },
      deptList: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      areaList: [],
      dictData: {
        certificateType: [],
        nation: [],
        applyReason: [],
        brief: [],
        political: [],
        nationality: [],
        education: [],
        sex: [],
        suspectType: [],
      },
      briefSlow: [],
      policeList: [],
      caseInfoList: [],
      checkFACE: false,
      submitFormLoading: false,
      applyReasonList: [], // 入区原由
      suspectTypeList: [], // 人员类型
      content: "",
      // 警情
      policeSituationDialogVisible: false,
      policeSituationList: [],
      policeSituationTotal: 1,
      policeSituationSearchForm: {
        reportContent: "",
        pageNo: 1,
        pageSize: 20,
      },
      policeSituationCurrentItem: {},
      orgTreeSingle: [],
      orgTreeSingle2: [],
      personByOrg: [],
      briefMap: {},
      applyType: 1,
      approvalUserList: [],
      disabledDataForApplyUser: ''
    };
  },
  watch: {
    "ruleForm.certificateType": {
      handler: function (val) {
        let string = this.ruleForm.certificateNo;
        val == "123"
          ? (this.checkIdCardNo = true)
          : (this.checkIdCardNo = false);
        this.ruleForm.certificateNo = "";
        this.$nextTick(() => {
          this.ruleForm.certificateNo = string;
        });
      },
      immediate: true,
    },
  },
  mounted() {
    this.findAuthUserPlaceList(); // 获取办案区列表
    this.findAuthDeptList(); // 获取部门列表
    this.inqDict(); // 获取字典列表
    this.getCaseInfoList(); // 获取案件列表
  },
  methods: {
    showMoreBasicInfo() {
      this.catchInfoSwitch = !this.catchInfoSwitch;
    },
    selectFaceResult(item) {
      this.checkedFaceResult = item;
    },
    // 自定义校验
    checkIsIdentity(rule, value, callback) {
      if (value) {
        if (this.ruleForm.certificateType === "111") {
          validateIdentity(rule, value, callback);
        } else if (this.ruleForm.certificateType == "112") {
          validateIdentity(rule, value, callback);
        } else if (this.ruleForm.certificateType == "123") {
          validateLength(rule, value, callback);
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 开启手动更换部门
    changeDept() {
      this.deptShow = false;
    },
    // 案件切换
    caseChange(data) {
      if (data) {
        this.caseInfoList.forEach((item) => {
          if (item.caseIndexCode === data) {
            this.ruleForm.caseCause = item.brief && item.brief + "";
          }
        });

        if (this.ruleForm.caseCause && this.briefMap[this.ruleForm.caseCause]) {
          let caseCause = JSON.parse(
            JSON.stringify(this.briefMap[this.ruleForm.caseCause])
          );
          this.dictData.brief.splice(caseCause.index, 0, caseCause.value);
          this.briefMap[this.ruleForm.caseCause] = null;
        }
      }
    },
    // 警情切换
    policeSituationNoChange() {},
    // 部门切换回调
    deptChange(data) {
      if (data.name) {
        this.ruleForm.deptName = data.name;
      }
    },
    // 办案区切换
    areaChange(data) {
      if(data){
        this.areaList.forEach((item) => {
          if (data === item.areaIndexCode) {
            this.ruleForm.areaName = item.areaName;
          }
        });
        this.getApproval();
      }
    },
    // 查询办案区配置参数
    async getApproval() {
      this.approvalUserList = []
      this.$nextTick(()=>this.$refs.ruleForm.resetValidates())
      const { data } = await server.getApproval({
        areaIndexCode: this.ruleForm.areaIndexCode,
      });
        if (data.code === "0") {
          if (data.data) {
            var _data = JSON.parse(JSON.stringify(data.data));
            this.isEntryApproval = _data.entryApproval;
            this.isEntryApproval == 1
              ? (this.applyType = 2)
              : (this.applyType = 1);
            if(!this.queryParam.id) {
              this.ruleForm.approvalUser = _data.defaultApprovalUser || "";
            }
            if (this.isEntryApproval == 1 && _data.approvalUserList.length) {
              this.loadOrgPersonInfo(_data.approvalUserList);
            }
          } else{
              this.isEntryApproval= 0;
              this.applyType = 1;
              this.ruleForm.approvalUser = "---"
            }
            if(this.applyType ==1) {
              this.ruleForm.approvalUser = '---'
            }
        } else {
          this.$message.error(this.$i18n.t(data.code));
        }
    },
    //根据人员编码列表查找人员详细信息
    async loadOrgPersonInfo(approvalUserList) {
      const param = {
        personIndexCodes: approvalUserList,
      };
      const { data } = await server.loadOrgPersonInfo(param);
      if (data.code == "0") {
        this.approvalUserList = data.data;
      } else {
        this.$message.error(this.$i18n.t(data.code));
      }
    },
    clearHostPolice() {
      this.ruleForm = {
        ...this.ruleForm,
        hostPoliceIndexCode: "",
        hostPolice: "",
        hostPoliceData: {},
        hostPoliceName: "",
      }
    },
    clearAuxiliaryPolice() {
      this.ruleForm = {
        ...this.ruleForm,
        auxiliaryPoliceIndexCode: "",
        auxiliaryPolice: "",
        auxiliaryPoliceData: {},
        auxiliaryPoliceName: "",
      }
    },
    // 获取案件列表
    async getCaseInfoList() {
      const result = await server.getCaseInfoList(this.caseSearchForm);
      const { data } = result;
      if (data.code === "0") {
        this.caseList = data.data.list;
        this.caseTotal = data.data.total;
      } else {
        this.$messagebox(result);
      }
    },
    // 获取警情列表
    async getpoliceSituationInfoList() {
      const result = await server.getpoliceSituationInfoList(
        this.policeSituationSearchForm
      );
      const { data } = result;
      if (data.code === "0") {
        this.policeSituationList = data.data.list;
        this.policeSituationTotal = data.data.total;
      } else {
        this.$messagebox(result);
      }
    },
    // 选择案件弹窗
    checkCaseShow() {
      this.caseDialogVisible = true;
      this.getCaseInfoList();
    },
    // 清除案件
    clearCase() {
      this.ruleForm = {
        ...this.ruleForm,
        caseIndexCode: "",
        caseName: "",
        caseNo: "",
        caseIndexCodeLable: "",
      };
    },
    // 案件列表条件搜索
    caseSearchHandle() {},
    // 案件列表搜索条件清空
    caseSearchClearHandle() {
      this.getCaseInfoList();
    },
    // 案件列表每页展示数量改变
    casePageSizeChange(pageSize) {
      this.caseSearchForm.limit = pageSize;
      this.caseSearchForm.start = 1;
      this.getCaseInfoList();
    },
    // 案件列表页码改变
    casePageNoChange(pageNo) {
      this.caseSearchForm.start = pageNo;
      this.getCaseInfoList();
    },
    // 选择案件change
    caseCurrentChange(val) {
      this.caseCurrentItem = val;
    },
    // 选择警情弹窗
    checkpoliceSituationShow() {
      this.policeSituationDialogVisible = true;
      this.policeSituationCurrentItem = {};
      this.getpoliceSituationInfoList();
    },
    // 清除警情
    clearpoliceSituation() {
      this.ruleForm = {
        ...this.ruleForm,
        policeSituationNo: "",
        policeSituationIndexCode: "",
        reportContent: "",
      };
    },
    // 警情列表条件搜索
    policeSituationSearchHandle() {},
    // 警情列表搜索条件清空
    policeSituationSearchClearHandle() {
      this.getpoliceSituationInfoList();
    },
    // 警情列表每页展示数量改变
    policeSituationPageSizeChange(pageSize) {
      this.policeSituationSearchForm.pageSize = pageSize;
      this.policeSituationSearchForm.pageNo = 1;
      this.getpoliceSituationInfoList();
    },
    // 警情列表页码改变
    policeSituationPageNoChange(pageNo) {
      this.policeSituationSearchForm.pageNo = pageNo;
      this.getpoliceSituationInfoList();
    },
    // 选择警情change
    policeSituationCurrentChange(val) {
      this.policeSituationCurrentItem = val;
    },
    // 警情选择确认
    checkpoliceSituationSure() {
      if (
        this.policeSituationCurrentItem &&
        this.policeSituationCurrentItem.policeSituationId
      ) {
        this.ruleForm.policeSituationIndexCode = this.policeSituationCurrentItem.indexCode;
        this.ruleForm.policeSituationNo = this.policeSituationCurrentItem.policeSituationNo;
        this.ruleForm.reportContent = this.policeSituationCurrentItem.reportContent;
        this.policeSituationDialogVisible = false;
      } else {
        this.$message("请选择警情");
      }
    },
    // 案件选择确认
    checkCaseSure() {
      if (this.caseCurrentItem && this.caseCurrentItem.indexCode) {
        this.caseDialogVisible = false;
        let caseCause =
          this.caseCurrentItem.accusation &&
          this.caseCurrentItem.accusation + "";

        this.ruleForm = {
          ...this.ruleForm,
          caseIndexCode: this.caseCurrentItem.indexCode,
          caseName:
            this.caseCurrentItem.name,
          caseIndexCodeLable: this.caseCurrentItem.name + '(' + this.caseCurrentItem.caseNo + ')',
          caseNo: this.caseCurrentItem.caseNo,
          caseCause: caseCause,
          deptIndexCode: this.caseCurrentItem.orgCode || "",
          deptName: this.caseCurrentItem.orgName || "",
        };
        if (caseCause && this.briefMap[caseCause]) {
          // console.log(this.briefMap[caseCause]);
          let _caseCause = JSON.parse(JSON.stringify(this.briefMap[caseCause]));
          this.dictData.brief.splice(_caseCause.index, 0, _caseCause.value);
          this.briefMap[caseCause] = null;
        }
      } else {
        this.$message("请选择案件");
      }
    },
    // 获取入区人员详情
    async getEntryApplication() {
      if (!this.queryParam.id) {
        return false;
      }
      this.formLoading = true;
      const params = { applyIndexCode: this.queryParam.id };
      const result = await server.getEntryApplication(params);
      const { data } = result;
      if (data.code === "0" && data.data) {
        let _data = data.data;
        this.suspectPhotoUrl = _data.suspectPhotoUrl || '';
        this.ruleForm = {
          suspectName: _data.suspectName || "",
          sex: _data.sex + "",
          birthday: _data.birthday ? this.$moment(_data.birthday) : "",
          certificateType:
            (_data.certificateType && _data.certificateType + "") || "111",
          certificateNo: _data.certificateNo || "",
          permanentAddress: _data.permanentAddress || "",
          suspectPhoto: _data.suspectPhoto || "",
          telPhone: _data.telPhone || "",
          currentAddress: _data.currentAddress || "",
          usedName: _data.usedName || "",
          nationality: (_data.nationality && _data.nationality + "") || "",
          nation: (_data.nation && _data.nation + "") || "",
          political: (_data.political && _data.political + "") || "",
          education: (_data.education && _data.education + "") || "",
          workUnit: _data.workUnit || "",
          job: _data.job || "",
          npcMember:
            _data.npcMember || _data.npcMember === 0
              ? _data.npcMember + ""
              : "",
          suspectType: _data.suspectType || "",
          caseIndexCode: _data.caseIndexCode || "",
          caseName: _data.caseName || "",
          caseIndexCodeLable: _data.caseIndexCode?_data.caseName +"("+ _data.caseNo + ')' : "",
          caseNo: _data.caseNo || "",
          caseCause: _data.caseCause || "",
          fastSolve: _data.fastSolve + "" || "0",
          areaIndexCode: _data.areaIndexCode || "",
          areaName: _data.areaName || "",
          deptIndexCode: _data.deptIndexCode || "",
          deptName: _data.deptName || "",
          hostPoliceIndexCode: _data.hostPoliceIndexCode || "",
          hostPolice: _data.hostPoliceName
            ? `${_data.hostPoliceName}(${_data.hostPoliceNo || "无证件号"})`
            : "",
          hostPoliceData: {
            personName: _data.hostPoliceName || "",
            personIndexCode: _data.hostPoliceIndexCode || "",
            certificateNumber: _data.hostPoliceNo || "",
          },
          hostPoliceName: _data.hostPoliceName || "",
          auxiliaryPoliceIndexCode: _data.auxiliaryPoliceIndexCode || "",
          auxiliaryPolice: _data.auxiliaryPoliceName
            ? `${_data.auxiliaryPoliceName}(${_data.auxiliaryPoliceNo || "无证件号"})`
            : "",
          auxiliaryPoliceData: {
            personName: _data.auxiliaryPoliceName || "",
            personIndexCode: _data.auxiliaryPoliceIndexCode || "",
            certificateNumber: _data.auxiliaryPoliceNo || "",
          },
          auxiliaryPoliceName: _data.auxiliaryPoliceName || "",
          applyUser: _data.applyUser || "",
          applyUserData: {
            personName: _data.applyUserName || "",
            personIndexCode: _data.applyUser || "",
            certificateNumber: _data.applyUserNo || "",
          },
          applyUserName: _data.applyUserName || "",
          docNo: _data.docNo || "",
          applyReason: (_data.applyReason && _data.applyReason + "") || "",
          peopleCode: _data.peopleCode || "",
          policeSituationNo: _data.policeSituationNo,
          policeSituationIndexCode: _data.policeSituationIndexCode,
          reportContent: _data.reportContent,
          approvalUser: _data.approvalUser || "",
          estimatedArrivalTime:
            _data.estimatedArrivalTime ? this.$moment(_data.estimatedArrivalTime).format(
              "YYYY-MM-DD HH:mm:ss"
            ) : '',
        };
        // 入区原由
        this.applyReasonList = [];
        let checkType = this.ruleForm.applyReason;
        this.dictData.applyReason.forEach((val) => {
          if (val.key == checkType) {
            this.applyReasonList.push(val);
          } else {
            if (val.used === 0) {
              this.applyReasonList.push(val);
            }
          }
        });
        // 人员类型 suspectTypeList
        this.suspectTypeList = [];
        let checkType2 = this.ruleForm.suspectType;
        this.dictData.suspectType.forEach((val) => {
          if (val.key == checkType2) {
            this.suspectTypeList.push(val);
          } else {
            if (val.used === 0) {
              this.suspectTypeList.push(val);
            }
          }
        });
        this.$nextTick(() => {
          this.ruleForm.caseCause = _data.caseCause;
          if (_data.caseCause && this.briefMap[_data.caseCause]) {
            let _caseCause = JSON.parse(
              JSON.stringify(this.briefMap[_data.caseCause])
            );
            this.dictData.brief.splice(_caseCause.index, 0, _caseCause.value);
            this.briefMap[_data.caseCause] = null;
          }
        });
      } else {
        this.$messagebox(result);
      }
      this.formLoading = false;
    },
    // 表单提交
    submitForm(formName) {
     if (this.submitFormLoading) {
        return false;
      } 
        this.$refs[formName].validate(async (valid) => {
         if(this.approvalUserList.length) {
          var result = this.approvalUserList.findIndex(item =>{
            return item.personIndexCode == this.ruleForm.approvalUser
          });
          if(result < 0) {
            this.ruleForm = {
              ...this.ruleForm,
              approvalUser: ''
            }
            return false
          }
        }
        if (valid) {
          let params = this.ruleForm;
          // if (this.checkFACE && !params.suspectPhoto) {
          //   this.$message.error("请上传照片");
          //   return;
          // }
          let hostPoliceName = "";
          let hostPoliceNo = "";
          let auxiliaryPoliceName = "";
          let auxiliaryPoliceNo = "";
          let applyType = this.applyType;
          let applyUserName = "";
          let applyUserNo =""
          if (this.applyType == 1) {
            var approvalUser = "";
          }else{
            var approvalUser = this.ruleForm.approvalUser
          }
          let estimatedArrivalTime = this.$moment(
            this.ruleForm.estimatedArrivalTime
          ).format();
          let sex = Number(this.ruleForm.sex);
          hostPoliceName = this.ruleForm.hostPoliceData.personName;
          hostPoliceNo = this.ruleForm.hostPoliceData.certificateNumber;
          auxiliaryPoliceName = this.ruleForm.auxiliaryPoliceData.personName;
          auxiliaryPoliceNo = this.ruleForm.auxiliaryPoliceData.certificateNumber;
          applyUserName = this.ruleForm.applyUserData.personName;
          applyUserNo = this.ruleForm.applyUserData.certificateNumber;
          params = {
            ...params,
            estimatedArrivalTime,
            applyType,
            approvalUser,
            hostPoliceName,
            auxiliaryPoliceName,
            sex,
            hostPoliceNo,
            auxiliaryPoliceNo,
            applyUserName,
            applyUserNo,
            birthday:
              params.birthday &&
              this.$moment(params.birthday).format("YYYY-MM-DD"),
          };
          if (this.queryParam.id) {
            params["applyIndexCode"] = this.queryParam.id;
          }
          this.submitFormLoading = true;
          if (this.queryParam.id) {
            const result = await server.updateEntryApplication(params);
            const { data } = result;
            if (data.code === "0") {
              this.$message.success("保存成功");
              this.submitFormLoading = false;
              this.goBack();
            } else {
              this.submitFormLoading = false;
              this.$messagebox(result);
            }
          } else {
            const result = await server.addEntryApplication(params);
            const { data } = result;
            if (data.code === "0") {
              this.$message.success("保存成功");
              this.submitFormLoading = false;
              this.goBack();
            } else {
              this.submitFormLoading = false;
              this.$messagebox(result);
            }
          }
        } else {
          return false;
        }
      })
    },
    // 获取出生日期
    getRegisterBirth(formName) {
      this.$refs[formName].validateField("certificateNo", (errorMessage) => {
        if (!errorMessage) {
          let birthday = "";
          let value = this.ruleForm.certificateNo;
          if (value.length === 15) {
            birthday = "19" + value.substr(6, 6);
          }
          if (value.length === 18) {
            birthday = value.substr(6, 8);
          }
          birthday &&
            (this.ruleForm.birthday = this.$moment(birthday, "YYYYMMDD"));
        } else {
          return false;
        }
      });
    },
    beforeUpload(file) {
      let path = file.name;
      let type = path
        .substring(path.lastIndexOf("."), path.length)
        .toUpperCase();
      let uploadLoading = false;
      // console.log(file);
      if (
        type === ".JPG" ||
        type === ".JPEG" ||
        type === ".PNG" ||
        type === ".BMP"
      ) {
        this.uploadLoading = true;
      } else {
        this.$message("请上传jpg,jpeg,jpg,png类型的图片");
        return false;
      }
      // this.uploadLoading = true
    },
    // 自定义上传
    async uploadAuto(value) {
      let file = value.file;
      let formData = new FormData();
      formData.append("file", file);
      const result = await server.uploadFile(formData, {
        transformRequest: [
          function (data) {
            return data;
          },
        ],
        headers: {
          post: { "Content-Type": "multipart/form-data" },
        },
      });
      const { data } = result;
      if (data.code === "0") {
        this.suspectPhotoUrl = data.data.fileUrl;
        this.ruleForm.suspectPhoto = data.data.fileName;
      } else {
        this.$messagebox(result);
      }
      this.uploadLoading = false;
    },
    // 获取办案区
    async findAuthUserPlaceList() {
      const result = await server.findAuthUserPlaceList();
      const { data } = result;
      if (data.code === "0") {
        this.areaList = data.data.list;
        if (this.areaList[0]) {
          this.ruleForm.areaIndexCode = this.areaList[0].areaIndexCode;
          this.ruleForm.areaName = this.areaList[0].areaName;
        }
      } else {
        this.$messagebox(result);
      }
    },
    // 获取办案部门
    async findAuthDeptList() {
      const result = await server.findAuthDeptList();
      const { data } = result;
      if (data.code === "0") {
        this.deptList = data.data;
      } else {
        this.$messagebox(result);
      }
    },
    // 获取字典
    async inqDict() {
      const result = await server.inqDict();
      const { data } = result;
      if (data.code === "0") {
        let briefList = [];
        let briefMap = {};
        data.data.brief &&
          data.data.brief.forEach((v) => {
            if (v.used == 0) {
              briefList.push(v);
            } else {
              briefMap[v.key] = {
                index: briefList.length,
                value: v,
              };
            }
          });
        this.briefMap = briefMap;
        this.dictData = {
          certificateType: data.data.certificateType,
          nation: data.data.nation,
          applyReason: data.data.registerType,
          brief: briefList,
          political: data.data.political,
          nationality: data.data.nationality,
          education: data.data.education,
          sex: data.data.sex,
          suspectType: data.data.suspectType
        };
        // 入区原由
        this.applyReasonList = this.dictData.applyReason.filter((val) => {
          return val.used === 0;
        });
        // 人员类型
        this.suspectTypeList = this.dictData.suspectType.filter((val) => {
          return val.used === 0;
        });
      } else {
        this.$messagebox(result);
      }
      this.getEntryApplication(); // 获取人员详细信息
      if(this.queryParam.currentUserInfo) {
        this.ruleForm ={
          ...this.ruleForm,
          applyUser: this.queryParam.currentUserInfo.personCode || "",
          applyUserData: {
            personName: this.queryParam.currentUserInfo.name || "",
            personIndexCode: this.queryParam.currentUserInfo.personCode || "",
            certificateNumber: this.queryParam.currentUserInfo.cardNo || "",
          },
          applyUserName: this.queryParam.currentUserInfo.name || "",
        }
      }
    },
    // 获取警员账号信息
    async queryPagePersons(number, param) {
      let params = {
        ...param,
        pageNo: number,
        pageSize: 1000,
      };
      const result = await server.queryPagePersons(params);
      const { data } = result;
      if (data.code === "0") {
        if (number == 1) {
          this.personByOrg = data.data.list;
        } else {
          this.personByOrg = this.personByOrg.concat(data.data.list);
        }
        if (data.data.pageNo != Math.floor(data.data.total / 1000) + 1) {
          // console.log("hhh", 1);
          this.queryPagePersons(data.data.pageNo - 0 + 1, param);
        }
      } else {
        this.$messagebox(result);
      }
    },
    goBack() {
      this.$router.push({ name: "index", params: {} });
    },
    ShuttleEvent(val) {
      if (val && val.type == "close") {
        val.payload.close();
      } else if (val.type == "getLeftData") {
        if (
          this.$refs.ShuttleBoxSingle &&
          !this.$refs.ShuttleBoxSingle.dialogFormVisible
        ) {
          return;
        }
        let params = {
          deptIndexCodeList: [val.payload.indexCode],
          personName: val.payload.personName ? val.payload.personName : "",
        };
        this.queryPagePersons(1, params);
      } else if (val.type == "selectData") {
        this.ruleForm.hostPoliceIndexCode = val.payload.data.personIndexCode;
        this.ruleForm.hostPoliceData = val.payload.data;
        // this.ruleForm.deptIndexCode = val.payload.data.deptIndexCode
        this.ruleForm.hostPolice = `${val.payload.data.personName}(${
          val.payload.data.certificateNumber || "无证件号"
        })`;
        // this.ruleForm.policeTel1 = val.payload.data.telPhone
        val.payload.close();
      } else if (val.type == "beforeCLose") {
        val.payload.done();
      }
    },
    ShuttleEvent1(val) {
      if (val && val.type == "close") {
        val.payload.close();
      } else if (val.type == "getLeftData") {
        if (
          this.$refs.ShuttleBoxSingle1 &&
          !this.$refs.ShuttleBoxSingle1.dialogFormVisible
        ) {
          return;
        }
        let params = {
          deptIndexCodeList: [val.payload.indexCode],
          personName: val.payload.personName ? val.payload.personName : "",
        };
        this.queryPagePersons(1, params);
      } else if (val.type == "selectData") {
        this.ruleForm.auxiliaryPoliceIndexCode =
          val.payload.data.personIndexCode;
        this.ruleForm.auxiliaryPoliceData = val.payload.data;
        this.ruleForm.auxiliaryPolice = `${val.payload.data.personName}(${val.payload.data.certificateNumber || "无证件号"})`;
        val.payload.close();
      } else if (val.type == "beforeCLose") {
        val.payload.done();
      }
    },
    ShuttleEvent2(val) {
      if (val && val.type == "close") {
        val.payload.close();
      } else if (val.type == "getLeftData") {
        if (
          this.$refs.ShuttleBoxSingle2 &&
          !this.$refs.ShuttleBoxSingle2.dialogFormVisible
        ) {
          return;
        }
        let params = {
          deptIndexCodeList: [val.payload.indexCode],
          personName: val.payload.personName ? val.payload.personName : "",
        };
        this.queryPagePersons(1, params);
      } else if (val.type == "selectData") {
        this.ruleForm.applyUser =
          val.payload.data.personIndexCode;
        this.ruleForm.applyUserData = val.payload.data;
        this.ruleForm.applyUserName = `${val.payload.data.personName}`;
        val.payload.close();
      } else if (val.type == "beforeCLose") {
        val.payload.done();
      }
    },
    async changeHostPolice() {
      const result = await server.loadOrgTree();
      const { data } = result;
      if (data.code === "0") {
        // console.log(this.$refs.ShuttleBoxSingle);
        this.orgTreeSingle = data.data;
        this.$refs.ShuttleBoxSingle.dialogFormVisible = true;
      } else {
        this.$messagebox(result);
      }
    },
    //选择申请人
    async changeApplyUser() {
      const result = await server.loadOrgTree();
      const { data } = result;
      if (data.code === "0") {
        this.orgTreeSingle2 = data.data;
        this.$refs.ShuttleBoxSingle2.dialogFormVisible = true;
      } else {
        this.$messagebox(result);
      }
    },
    async changeAuxiliaryPolice() {
      const result = await server.loadOrgTree();
      const { data } = result;
      if (data.code === "0") {
        // console.log(this.$refs.ShuttleBoxSingle1);
        this.orgTreeSingle = data.data;
        this.$refs.ShuttleBoxSingle1.dialogFormVisible = true;
      } else {
        this.$messagebox(result);
      }
    },
  },
  components: {
    PathDesc,
    SelectWithTree,
    ElMoreSelect,
    ShuttleBox,
  },
};
</script>
<style lang="less" rel="stylesheet/less">
.entryApplication-add-edit-box {
  min-width: 1366px;
  height: 100%;
  overflow: hidden;
  color: #4d4d4d;
  box-sizing: border-box;
  position: relative;

  * {
    box-sizing: border-box;
  }


  .scroll-box {
    height: ~"calc(100%)";

    .form-title {
      font-size: 18px;
      padding-left: 102px;
      height: 48px;
      line-height: 40px;
      // border-bottom: solid 1px #e6e6e6;
      // border-top: solid 8px #f2f2f2;
      font-weight: 700;
      font-style: normal;
      color: #4d4d4d;
      &:first-child {
        border-top: none;
        height: 40px;
      }

      .desc1 {
        margin-right: 16px;
      }

      .small-seitch {
        margin-right: 8px;
      }

      .desc2 {
        color: #4d4d4d;
      }
    }

    .form-row-box {
      padding: 16px 0px 5px 89px;
      width: 100%;

      .el-col {
        box-sizing: border-box;
        .el-form-item {
          padding-left: 16px;
          box-sizing: border-box;
        }
      }
      .isShowMore {
        position: relative;
        left: 14px;
      }
    }
  }

  .form-right-btn {
    position: absolute;
    right: -61px;
    top: 0px;
    font-size: 14px;
    color: #2080f7;
    cursor: pointer;

    &.six {
      right: -90px;
    }
  }

  .search-btn {
    position: absolute;
    right: -56px;
    top: 0px;
    font-size: 12px;
    color: #2080f7;
    cursor: pointer;
  }

  .form-right-r-btn {
    position: absolute;
    right: -131px;
    top: 0px;
    font-size: 14px;
    color: #2080f7;
    cursor: pointer;

    &.six {
      right: -92px;
    }
  }

  .person-photo-box {
    height: auto;
    position: absolute;
    text-align: right;
    padding-left: 150px;
    transition: all 0.3s;
    right: 14px;

    .person-photo-item {
      // background: #fbfbfb;
      // border: 1px dashed #b2b2b2;
      display: inline-block;
      width: 100%;
      height: 200px;
      position: relative;
      margin-bottom: 32px;
      cursor: pointer;
      font-size: 0;
      .default-img {
        padding-top: 42px;
      }

      .photo-img {
        height: 100%;
        width: 100%;
        display: inline-block;
        padding: 11px 0;
        float: left;

        img {
          height: 170px;
          width: 124px;
        }

        .showphoto-img {
          width: 178px;
          height: 178px;
          background: #ffffff;
          border: 1px solid #d4d4d4;
          border-radius: 2px;

          margin: auto;
          text-align: center;
          padding: 2px;

          position: relative;

          overflow: hidden;
        }
      }

      .hover-box {
        float: right;
        vertical-align: top;
        text-align: center;
        /*padding-top: 64px;*/
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        //justify-content: space-evenly;
        &:before,
        &:after {
          content: "";
          display: block;
        }
        .el-upload {
          position: absolute;
          top: 209px;
          right: 40px
        }
        width: 100%;
        height: 100%;
        /*background: rgba(0, 0, 0, 0.6);*/
        /*position: absolute;*/
        /*left: 0px;*/
        /*top: 0px;*/

        .upload-pic {
          color: #ffffff;
          font-size: 20px;
        }
      }
    }
  }
}

.person-dialog-title {
  text-align: right;
  padding-bottom: 10px;

  .person-search-input {
    width: 240px;
  }
}

.content-desc {
  padding: 20px;
  text-align: center;
  color: #565656;

  .content-desc-item {
    padding: 10px;
  }
}

// .catch-pic {
//   color: #ffffff;
//   font-size: 20px;
// }

.photoButton {
  display: block;
  width: 88px;
  font-size: 14px;
  margin: 0 auto;
}

.margintop24 {
  /*margin-top: 24px;*/
}

.hover-box {
  .el-button {
    margin: 0 auto !important;
  }
}

.faceResult-dialog .el-dialog__body {
  min-height: 460px;
}


.dialog-content {
  min-height: 460px;
  font-size: 0;

  .faceResult-item {
    display: inline-block;
    vertical-align: top;
    width: 330px;
    height: 182px;
    background: #fff8f8;
    border: 1px solid #ff7f7f;
    border-radius: 2px;
    margin: 8px 7px;
    position: relative;
    cursor: pointer;

    &.normal {
      background: #f7f7f7;
      border: 1px solid #d7d7d7;
      border-radius: 2px;

      .faceResult-percent {
        background: rgba(16, 132, 111, 0.38);
        border: 1px solid rgba(51, 255, 238, 0.77);
      }
    }

    .faceResult-percent {
      position: absolute;
      top: 142px;
      left: 34px;
      width: 68px;
      height: 26px;
      padding: 3px;
      background: rgba(214, 36, 36, 0.38);
      border: 1px solid rgba(255, 81, 81, 0.77);
    }

    .faceResult-percent-value {
      width: 100%;
      height: 100%;
      font-size: 18px;
      color: #ffffff;
      letter-spacing: 1.35px;
      text-align: center;
    }

    .faceResult-img {
      position: absolute;
      top: 6px;
      left: 6px;
      width: 124px;
      height: 170px;
      overflow: hidden;

      img {
        width: 124px;
        height: 170px;
        display: inline-block;
        border: 1px solid #e5e5e5;
      }
    }

    .faceResult-content {
      width: 100%;
      height: 100%;
      padding-left: 136px;
      font-size: 14px;

      ul {
        padding: 11px 0;
      }

      li {
        margin: 10px 0;
      }
    }

    .faceResult-label {
      width: 60px;
      display: inline-block;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      color: #999999;
      letter-spacing: 0;
      vertical-align: top;
    }

    .faceResult-value {
      width: 116px;
      display: inline-block;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #494949;
      letter-spacing: 0;
      vertical-align: top;
    }
  }

  .selectresult {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}


.out-person-box {
  font-size: 0;
  .out-person-card {
    vertical-align: top;
    font-size: 14px;
    width: 302px;
    height: 132px;
    display: inline-block;
    margin-right: 6px;
    margin-bottom: 10px;
    cursor: pointer;
    border: solid 1px #e5e5e5;
    position: relative;

    &.active {
      &:after {
        content: "";
        display: block;
        width: 34px;
        height: 34px;
        position: absolute;
        right: -17px;
        top: -17px;
        border: 17px solid transparent;
        box-sizing: border-box;
        border-left: 17px solid #2080f7;
        transform: rotate(-45deg);
      }

      &:before {
        content: "";
        display: block;
        width: 10px;
        height: 5px;
        position: absolute;
        right: 2px;
        top: 3px;
        box-sizing: border-box;
        border-left: 1px solid #ffffff;
        border-bottom: 1px solid #ffffff;
        transform: rotate(-45deg);
        z-index: 2;
      }
    }

    .img-box {
      width: 120px;
      height: 100%;
      display: inline-block;
      background: #f2f2f2;
      vertical-align: middle;
      border-right: solid 1px #e9e9e9;

      img {
        width: 100%;
        height: 100%;

        &.default-img {
          width: auto;
          height: auto;
          border: none;
          padding: 12px;
        }
      }
    }

    .content-box {
      display: inline-block;
      width: ~"calc(100% - 120px)";
      padding-left: 10px;
      font-size: 14px;
      vertical-align: top;

      .content-row {
        margin-bottom: 4px;

        .content-col-1 {
          display: inline-block;
          width: 71px;
          vertical-align: middle;
          color: #999999;
        }

        .content-col-2 {
          white-space: nowrap;
          width: ~"calc(100% - 72px)";
          overflow: hidden;
          display: inline-block;
          text-overflow: ellipsis;
          vertical-align: middle;
          padding-left: 2px;
        }
      }
    }
  }
}
</style>
