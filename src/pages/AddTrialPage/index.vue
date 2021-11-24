<template>
  <div class="addtrial" v-loading="loading">
    <el-form
      ref="form"
      :model="form"
      grid-layout
      :label-grid="labelGrid"
      :content-grid="contentGrid"
      :rules="rules"
    >
      <el-form-item label="案件名称" prop="caseCode">
        <el-input
          :disabled="true"
          ref="caseInput"
          clearable
          :title="form.caseShowName"
          v-model="form.caseShowName"
        ></el-input>
        <!-- <el-input :disabled="true"
                  ref="caseInput"
                  suffix-icon="h-icon-close_round"
                  :on-icon-click="caseCodeDel"
                  v-model="form.caseShowName"></el-input> -->
        <!-- <el-select v-model="form.caseCode"
                   placeholder="请选择"
                   @change="caseCodeChange"
                   clear
                   filterable
                   :disabled="roomStatus === 4 && !!showFlag">
          <el-option v-for="item in caseList"
                     :key="item.indexCode"
                     :label="item.name+'（'+item.caseNo+'）'"
                     :value="item.indexCode">
          </el-option>
        </el-select> -->
        <i
          class="h-icon-close_round"
          v-show="form.caseShowName"
          @click="caseCodeDel"
        ></i>
        <span
          :class="hasCase ? 'extendSelectbtn' : 'extendbtn'"
          @click="addCase"
          v-show="hasCase"
        >
          添加案件</span
        >
        <!-- <el-button class="extendbtn "
                   type="iconButton"
                   icon="h-icon-add"
                   @click="addCase"
                   v-show="hasCase">
          添加案件
        </el-button> -->
        <span
          class="extendbtn"
          v-show="!(roomStatus === 4 && !!showFlag)"
          @click="checkCaseShow"
        >
          选择案件</span
        >
        <!-- <el-button :class="hasCase?'extendSelectbtn':'extendbtn'"
                   :disabled="roomStatus === 4 && !!showFlag"
                   type="iconButton"
                   icon="h-icon-add"
                   @click="checkCaseShow">
          选择案件
        </el-button> -->
      </el-form-item>
      <el-form-item label="审讯对象" prop="suspectCode">
        <el-select
          v-model="form.suspectCode"
          placeholder="请选择"
          @change="getCount"
          filterable
          :disabled="roomStatus === 4"
        >
          <el-option
            v-for="item in suspectList"
            :key="item.indexCode"
            :label="
              item.name +
              (item.certificateNo ? '（' + item.certificateNo + '）' : '') +
              (item.caseName ? '（' + item.caseName + '）' : '')
            "
            :value="item.indexCode"
          >
          </el-option>
        </el-select>
        <!-- <span class="extendbtn"
              v-show="!(roomStatus === 4)"
              @click="addObject"> 添加对象</span> -->
        <!-- <el-button class="extendbtn"
                   type="iconButton"
                   icon="h-icon-add"
                   v-show="!(roomStatus === 4)"
                   @click="addObject">
          添加对象
        </el-button> -->
      </el-form-item>
      <el-form-item label="审讯类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择" filterable>
          <el-option
            v-for="item in inquestTypeList"
            :key="item.key"
            :label="item.name"
            :value="item.key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="第几次审讯" prop="count">
        <el-input
          v-model="form.count"
          :maxlength="6"
          placeholder="请选择"
        ></el-input>
      </el-form-item>
      <el-form-item label="审讯部门" prop="org">
        <SelectWithTree
          v-model="form.org"
          :tree-data="orgData"
          :default-props="defaultOrgProps"
          node-key="indexCode"
          clear
        ></SelectWithTree>
      </el-form-item>
      <el-form-item label="审讯人" prop="worker">
        <SelectWithTree
          :multiple="true"
          v-model="form.worker"
          :tree-data="personData"
          :default-props="defaultPersonProps"
          node-key="indexCode"
          clear
        ></SelectWithTree>
      </el-form-item>
      <el-form-item label="记录人" prop="recorder">
        <SelectWithTree
          v-model="form.recorder"
          :tree-data="personData"
          :default-props="defaultPersonProps"
          target-type="person"
          node-key="indexCode"
          clear
        ></SelectWithTree>
      </el-form-item>
      <el-form-item label="录制人" prop="recer">
        <SelectWithTree
          v-model="form.recer"
          :tree-data="personData"
          :default-props="defaultPersonProps"
          target-type="person"
          node-key="indexCode"
          clear
        ></SelectWithTree>
      </el-form-item>
      <!--<el-form-item label="笔录启用">-->
      <!--<el-switch-->
      <!--on-text=""-->
      <!--off-text=""-->
      <!--v-model="form.isNote"-->
      <!--&gt;</el-switch>-->
      <!--</el-form-item>-->
      <el-form-item class="form-btns" v-if="form.indexCode">
        <el-button type="primary" @click="onSubmit"> 保存 </el-button>
        <el-button @click="cancel"> 取消 </el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      :area="[640, 560]"
      top="middle"
      :no-scrollbar="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      title="添加案件"
      @close="handleClose"
      :visible.sync="dialogFormVisible3"
    >
      <el-form
        ref="dialogform"
        grid-layout
        :label-grid="dialogLabelGrid"
        :content-grid="dialogContentGrid"
        :model="dialogform"
        :rules="dialogformRules"
      >
        <el-form-item label="案件名称" prop="name">
          <el-input
            v-model.trim="dialogform.name"
            :maxlength="30"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="案件编号" prop="caseNo">
          <el-input
            v-model.trim="dialogform.caseNo"
            :maxlength="30"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="承办人" prop="caseHandlers">
          <SelectWithTree
            v-model="dialogform.caseHandlers"
            :multiple="true"
            :tree-data="personData"
            :default-props="defaultPersonProps"
            node-key="indexCode"
          ></SelectWithTree>
        </el-form-item>
        <el-form-item label="办案部门" prop="org">
          <SelectWithTree
            v-model="dialogform.org"
            :tree-data="orgData"
            :default-props="defaultOrgProps"
            node-key="indexCode"
            clear
          ></SelectWithTree>
        </el-form-item>
        <el-form-item label="案件类型" prop="type">
          <el-select
            v-model="dialogform.type"
            placeholder="请选择"
            filterable
            @change="dialogCaseTypeChange"
            clear
          >
            <el-option
              v-for="item in caseTypeList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="案由" prop="accusation">
          <el-select
            v-model="dialogform.accusation"
            placeholder="请选择"
            filterable
            @change="dialogAccusationChange"
            clear
          >
            <el-option
              v-for="item in accusationList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简要案情">
          <el-input
            type="textarea"
            v-model="dialogform.remark"
            :maxlength="200"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveCase"> 确定 </el-button>
        <el-button @click="dialogFormVisible3 = false"> 取消 </el-button>
      </div>
    </el-dialog>
    <el-dialog
      class="addsubspect"
      :area="[640, 368]"
      top="middle"
      :no-scrollbar="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      @close="handleClose"
      title="添加对象"
      :visible.sync="dialogFormVisible4"
    >
      <el-form
        grid-layout
        :label-grid="dialogLabelGrid"
        :content-grid="dialogContentGrid"
        ref="dialogformForObject"
        :model="dialogformForObject"
        label-width="100px"
        :rules="dialogformForObjectRules"
      >
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model.trim="dialogformForObject.name"
            :maxlength="30"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select
            v-model="dialogformForObject.type"
            placeholder="请选择"
            filterable
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
        <el-form-item label="证件类型" prop="certificateType">
          <el-select
            v-model="dialogformForObject.certificateType"
            placeholder="请选择"
            @change="certificateTypeChange"
            filterable
            clear
          >
            <el-option
              v-for="item in certificateTypeList"
              :key="item.key"
              :label="item.name"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="证件号" prop="certificateNo">
          <el-input
            v-model.trim="dialogformForObject.certificateNo"
            :maxlength="30"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <template v-if="showMore">
          <el-form-item label="曾用名" prop="nameUsed">
            <el-input
              v-model.trim="dialogformForObject.nameUsed"
              :maxlength="30"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex" class="sexItem">
            <el-radio-group v-model="dialogformForObject.sex">
              <el-radio
                :label="item.key"
                v-for="item in sexList"
                :key="item.key"
              >
                {{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="电话" prop="phoneNumber">
            <el-input
              v-model.trim="dialogformForObject.phoneNumber"
              :maxlength="30"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="现住址" prop="address">
            <el-input
              v-model.trim="dialogformForObject.address"
              :maxlength="100"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="国籍" prop="nationality">
            <el-select
              v-model="dialogformForObject.nationality"
              placeholder="请选择"
              filterable
              clear
            >
              <el-option
                v-for="item in nationalityList"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="籍贯" prop="nativePlace">
            <el-input
              v-model.trim="dialogformForObject.nativePlace"
              :maxlength="30"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="民族" prop="nation">
            <el-select
              v-model="dialogformForObject.nation"
              placeholder="请选择"
              filterable
              clear
            >
              <el-option
                v-for="item in nationList"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="户籍地址" prop="registerAddress">
            <el-input
              v-model.trim="dialogformForObject.registerAddress"
              :maxlength="100"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="政治面貌" prop="political">
            <el-select
              v-model="dialogformForObject.political"
              placeholder="请选择"
              @change="politicalChange"
              filterable
              clear
            >
              <el-option
                v-for="item in politicalList"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入党时间" prop="joiningPartyTime">
            <el-input
              v-model.trim="dialogformForObject.joiningPartyTime"
              :maxlength="30"
              placeholder="请输入"
              :disabled="
                dialogformForObject.political !== '1' &&
                dialogformForObject.political !== '2'
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="是否政协委员" prop="cppccMember">
            <el-radio-group v-model="dialogformForObject.cppccMember">
              <el-radio :label="1"> 是 </el-radio>
              <el-radio :label="0"> 否 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否人大代表" prop="npcMember">
            <el-radio-group v-model="dialogformForObject.npcMember">
              <el-radio :label="1"> 是 </el-radio>
              <el-radio :label="0"> 否 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否党代表" prop="partyRepresentative">
            <el-radio-group v-model="dialogformForObject.partyRepresentative">
              <el-radio :label="1"> 是 </el-radio>
              <el-radio :label="0"> 否 </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="文化程度" prop="education">
            <el-select
              v-model="dialogformForObject.education"
              placeholder="请选择"
              filterable
              clear
            >
              <el-option
                v-for="item in educationList"
                :key="item.key"
                :label="item.name"
                :value="item.key"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker
              v-model="dialogformForObject.birthday"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="工作单位" prop="workUnit">
            <el-input
              v-model.trim="dialogformForObject.workUnit"
              :maxlength="30"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="职务" prop="job">
            <el-input
              v-model.trim="dialogformForObject.job"
              :maxlength="30"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="备注信息"
            prop="remark"
            class="remark"
            :label-grid="{ xl: 5, lg: 5, md: 5, sm: 5, sx: 5 }"
            :content-grid="{ xl: 16, lg: 16, md: 16, sm: 16, sx: 16 }"
          >
            <el-input
              v-model="dialogformForObject.remark"
              type="textarea"
              :rows="2"
              placeholder="请输入"
              :maxlength="200"
            ></el-input>
          </el-form-item>
        </template>
        <el-button
          v-else
          type="iconButton"
          class="showMoreButton"
          icon="h-icon-angledouble_down"
          @click="showMore = true"
        >
          展开更多
        </el-button>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSuspect"> 确定 </el-button>
        <el-button @click="dialogFormVisible4 = false"> 取消 </el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="选择案件"
      :visible.sync="caseDialogVisible"
      size="small"
      :area="[950, 556]"
    >
      <div class="person-dialog-title">
        <el-form :inline="true" label-width="110px" :model="caseSearchForm">
          <el-form-item label="案件名称">
            <el-input clearable v-model="caseSearchForm.caseName"></el-input>
          </el-form-item>
          <el-form-item label="案件编号">
            <el-input clearable v-model="caseSearchForm.caseNo"></el-input>
          </el-form-item>
          <el-form-item class="caseSearchBtn">
            <el-button type="primary" @click="findAllCase">搜索</el-button>
            <el-button @click="resetFindAllCase">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        ref="singleTable"
        :data="caseList"
        highlight-current-row
        @current-change="caseCurrentChange"
        style="width: 100%"
        height="340"
      >
        <el-table-column label="序号" type="index" width="60"></el-table-column>
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
  </div>
</template>
<script>
import server1 from '../../server/elerecord'
// import server2 from '../../server/remote'
import SelectWithTree from '../../components/SelectWithTree'
import {
  validateCommon,
  validateInt,
  validateIdentity,
  validateMobile,
} from '../../mixin/validate.mixins'

export default {
  name: 'AddTrialPage',
  data() {
    const _validateIdentity = (rule, value, callback) => {
      if (!value) return callback()
      if (this.dialogformForObject.certificateType !== '1') return callback()
      return validateIdentity(rule, value, callback)
    }
    return {
      showMore: false,
      loading: false,
      form: {
        indexCode: '',
        caseCode: '',
        caseShowName: '',
        suspectCode: '',
        type: '',
        count: 1,
        name: '',
        roomCode: '',
        roomName: '',
        isNote: false,
        org: {},
        worker: [],
        recorder: {},
        recer: {},
      },
      rules: {
        caseCode: [{ required: false, message: '请选择' }],
        suspectCode: [{ required: true, message: '请选择' }],
        type: [{ required: true, message: '请选择' }],
        count: [
          { required: true, message: '请输入' },
          { validator: validateInt },
        ],
        org: [
          { required: true, message: '请选择' },
          {
            validator: (rule, value, callback) => {
              if (!value.indexCode) {
                callback(new Error(`请选择`))
                return
              }
              callback()
            },
          },
        ],
        recorder: [
          { required: true, message: '请选择' },
          {
            validator: (rule, value, callback) => {
              if (!value.indexCode) {
                callback(new Error(`请选择`))
                return
              }
              callback()
            },
          },
        ],
        recer: [
          { required: true, message: '请选择' },
          {
            validator: (rule, value, callback) => {
              if (!value.indexCode) {
                callback(new Error(`请选择`))
                return
              }
              callback()
            },
          },
        ],
        worker: [
          { required: true, message: '请选择' },
          {
            validator: (rule, value, callback) => {
              if (!value.length) {
                callback(new Error(`请选择`))
                return
              }
              if (value && value.length > this.InterrogatorLimit) {
                callback(new Error(`人数限制${this.InterrogatorLimit}`))
                return
              }
              callback()
            },
          },
        ],
      },
      dialogformRules: {
        name: [
          { required: true, message: '请输入' },
          { validator: validateCommon },
        ],
        caseNo: [
          { required: true, message: '请输入' },
          { validator: validateCommon },
        ],
        caseHandlers: [{ required: true, message: '请选择' }],
      },
      dialogformForObjectRules: {
        name: [
          { required: true, message: '请输入' },
          { validator: validateCommon },
        ],
        type: [{ required: true, message: '请选择' }],
        certificateNo: [
          {
            validator: _validateIdentity,
          },
        ],
        phoneNumber: [
          {
            min: 0,
            max: 11,
            message: '请输入0-11位数字',
            trigger: 'change,blur',
          },
          { validator: validateMobile, trigger: 'change,blur' },
        ],
      },
      dialogLabelGrid: {
        xl: 5,
        lg: 5,
        md: 5,
        sm: 5,
        sx: 5,
      },
      dialogContentGrid: {
        xl: 16,
        lg: 16,
        md: 16,
        sm: 16,
        xs: 16,
      },
      labelGrid: {
        xl: 8,
        lg: 8,
        md: 8,
        sm: 8,
        xs: 8,
      },
      contentGrid: {
        xl: 8,
        lg: 8,
        md: 8,
        sm: 8,
        xs: 8,
      },
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      dialogform: {
        caseNo: '',
        name: '',
        org: {},
        type: '',
        accusation: '',
        caseHandlers: [],
        remark: '',
      },
      caseHandlers: [],
      dialogformForObject: {
        address: '',
        birthday: '',
        certificateNo: '',
        certificateType: '',
        cppccMember: '',
        education: '',
        job: '',
        joiningPartyTime: '',
        name: '',
        nameUsed: '',
        nation: '',
        nationality: '',
        nativePlace: '',
        npcMember: '',
        partyRepresentative: '',
        phoneNumber: '',
        political: '',
        registerAddress: '',
        remark: '',
        sex: '',
        type: '',
        workUnit: '',
      },
      formLabelWidth: '120px',
      suspectList: [],
      caseTypeList: [],
      inquestTypeList: [],
      accusationList: [],
      suspectTypeList: [],
      educationList: [],
      nationalityList: [],
      nationList: [],
      sexList: [],
      politicalList: [],
      certificateTypeList: [],
      orgData: [],
      defaultOrgProps: {
        children: 'children',
        label: 'name',
        id: 'indexCode',
        icon: 'icon',
      },
      personData: [],
      roomStatus: '',
      defaultPersonProps: {
        children: 'children',
        label: 'name',
        id: 'indexCode',
        icon: 'icon',
        disabled(data) {
          return data.type === 'dept'
        },
      },
      server: null,
      currentUser: null,
      InterrogatorLimit: 9999,
      showFlag: '', // 已分配-案件名称
      hasCase: false,
      caseDialogVisible: false,
      caseList: [],
      caseTotal: 1,
      caseSearchForm: {
        caseName: '',
        caseNo: '',
        start: 1,
        limit: 20,
      },
      caseCurrentItem: {},
    }
  },
  async mounted() {
    this.server = server1
    this.form.indexCode = this.$route.query.id
    this.form.roomCode = this.$route.query.roomCode
    this.form.roomName = this.$route.query.roomName
    this.form.name = this.$route.query.name
    this.roomStatus = this.$route.query.roomStatus // 房间状态-4是已分配
    this.getDict()
    // this.findAllCase()
    this.getDept()
    this.getAllPerson()
    if (this.$route.query.roomStatus == 4) {
      await this.getAllocated()
      await this.getCurrentUser('type')
    } else {
      this.hasCase = true
      if (this.form.indexCode) {
        await this.getCurrentUser()
        this.getInterrogationInfoByindexCode(this.form.indexCode)
      } else {
        this.finaAllSuspect()
        this.getCurrentUser()
      }
    }

    this.getDict()
    this.loadInterrogatorLimit()
  },
  components: { SelectWithTree },
  watch: {
    'form.caseShowName': {
      handler: function (val) {
        this.caseCodeChange(this.form.caseCode)
      },
      deep: true,
    },
  },
  methods: {
    politicalChange(val) {
      if (val !== '1' && val !== '2') {
        this.dialogformForObject.joiningPartyTime = ''
      }
    },
    certificateTypeChange() {
      this.$refs.dialogformForObject.validateField('certificateNo')
    },
    async loadInterrogatorLimit() {
      const res = await this.server.loadInterrogatorLimit()
      const { data } = res
      if (data.code === '0') {
        this.InterrogatorLimit = data.data.limit
      } else {
        this.$messagebox(res)
        // this.$message.error(this.$t(data.code))
      }
    },
    async getCurrentUser(type) {
      const res = await this.server.getCurrentUser()
      const { data } = res
      if (data.code === '0') {
        const { personName, orgName, orgCode, personCode } = data.data
        this.currentUser = data.data
        if (type != 'type') {
          if (!this.form.indexCode) {
            this.form.org = {
              indexCode: orgCode,
              name: orgName,
            }
            // 审讯人
            this.form.worker = [
              {
                indexCode: personCode,
                name: personName,
                parent: orgCode,
                extra: {
                  deptName: orgName,
                },
              },
            ]
            this.form.recorder = {
              indexCode: personCode,
              name: personName,
              parent: orgCode,
              extra: {
                deptName: orgName,
              },
            }
            this.form.recer = {
              indexCode: personCode,
              name: personName,
              parent: orgCode,
              extra: {
                deptName: orgName,
              },
            }
            setTimeout(() => {
              this.$refs['form'] && this.$refs['form'].resetValidates()
            }, 15)
          }
        }
      } else {
        this.$messagebox(res)
        // this.$message.error(this.$t(data.code))
      }
    },
    handleClose() {
      this.dialogform = {
        caseNo: '',
        name: '',
        org: {},
        type: '',
        accusation: '',
        caseHandlers: [],
        remark: '',
      }
      this.dialogformForObject = {
        address: '',
        birthday: '',
        certificateNo: '',
        certificateType: '',
        cppccMember: '',
        education: '',
        job: '',
        joiningPartyTime: '',
        name: '',
        nameUsed: '',
        nation: '',
        nationality: '',
        nativePlace: '',
        npcMember: '',
        partyRepresentative: '',
        phoneNumber: '',
        political: '',
        registerAddress: '',
        remark: '',
        sex: '',
        type: '',
        workUnit: '',
      }
    },
    addSuspect() {
      this.$refs['dialogformForObject'].validate(async (valid) => {
        if (valid) {
          const params = {
            ...this.dialogformForObject,
            birthday: !this.dialogformForObject.birthday
              ? ''
              : this.$moment(this.dialogformForObject.birthday).format(
                  'YYYY-MM-DD'
                ),
          }
          this.loading = true
          const res = await this.server.saveSuspect(params)
          const { data } = res
          this.loading = false
          if (data.code === '0') {
            this.suspectList.unshift({
              ...params,
              indexCode: data.data.indexCode,
            })
            this.form.suspectCode = data.data.indexCode
            this.dialogFormVisible4 = false
          } else {
            this.$messagebox(res)
            // this.$message.error(this.$t(data.code))
          }
        }
      })
    },
    dialogAccusationChange(val) {},
    dialogCaseTypeChange(val) {},
    saveCase() {
      this.$refs['dialogform'].validate(async (valid) => {
        if (valid) {
          const caseHandlers = this.dialogform.caseHandlers.map((v) => {
            return {
              personCode: v.indexCode,
              personName: v.name,
              orgCode: v.parent,
              orgName: v.extra.deptName,
            }
          })
          const params = {
            ...this.dialogform,
            orgCode: this.dialogform.org.indexCode,
            orgName: this.dialogform.org.name,
            caseHandlers,
          }
          this.loading = true
          const res = await this.server.saveCase(params)
          const { data } = res
          this.loading = false
          if (data.code === '0') {
            this.caseList.unshift({
              ...params,
              indexCode: data.data.indexCode,
            })
            console.log(params, params.name + '(' + params.caseNo + ')')
            this.form.caseCode = data.data.indexCode
            this.form.caseShowName = params.name + '(' + params.caseNo + ')'
            this.dialogFormVisible3 = false
          } else {
            this.$messagebox(res)
            // this.$message.error(this.$t(data.code))
          }
        }
      })
    },
    getSubmitParams() {
      const { name } = this.form
      const persons = this.form.worker.map((v) => {
        return {
          type: '1',
          personCode: v.indexCode,
          personName: v.name,
          orgCode: v.parent,
          orgName: v.extra.deptName,
        }
      })
      this.form.recorder.indexCode &&
        persons.push({
          type: '2',
          personCode: this.form.recorder.indexCode,
          personName: this.form.recorder.name,
          orgCode: this.form.recorder.parent,
          orgName: this.form.recorder.extra.deptName,
        })
      this.form.recer.indexCode &&
        persons.push({
          type: '3',
          personCode: this.form.recer.indexCode,
          personName: this.form.recer.name,
          orgCode: this.form.recer.parent,
          orgName: this.form.recer.extra.deptName,
        })
      return {
        caseCode: this.form.caseCode || '',
        suspectCode: this.form.suspectCode || '',
        type: this.form.type || '',
        count: this.form.count,
        roomCode: this.form.roomCode,
        roomName: this.form.roomName || this.$route.query.roomName,
        name,
        orgName: this.form.org.name,
        orgCode: this.form.org.indexCode,
        persons,
      }
    },
    onSubmit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.loading = true
          const params = this.getSubmitParams()
          params.indexCode = this.$route.query.id
          params.name = params.name || this.$route.query.name
          const res = await this.server.updateInterrogationByIndexCode(params)
          const { data } = res
          this.loading = false
          if (data.code === '0') {
            this.$router.push({ path: '/' })
          } else {
            // this.$message.error(this.$t(data.code))
            this.$messagebox(res)
          }
        }
      })
    },
    cancel() {
      this.$router.push({ path: '/' })
    },
    addCase() {
      const { personName, personCode, orgName, orgCode } = this.currentUser
      this.dialogform.org = {
        indexCode: orgCode || '',
        name: orgName || '',
      }
      this.dialogform.caseHandlers = [
        {
          indexCode: personCode,
          name: personName,
          parent: orgCode,
          extra: {
            deptName: orgName,
          },
        },
      ]
      this.dialogform.type = this.caseTypeList.length
        ? this.caseTypeList[0].key
        : ''
      this.dialogFormVisible3 = true
      this.$nextTick(() => {
        this.$refs['dialogform'].resetValidates()
      })

      this.loadDefaultCaseNo()
    },
    addObject() {
      this.dialogformForObject.type = this.suspectTypeList.length
        ? this.suspectTypeList[0].key
        : ''
      this.dialogformForObject.certificateType = this.certificateTypeList.length
        ? this.certificateTypeList[0].key
        : ''
      this.showMore = false
      this.dialogFormVisible4 = true
      this.$nextTick(() => {
        this.$refs.dialogformForObject.resetValidates()
      })
    },
    getCount(val) {
      if (!val) {
        return
      }
      const [suspect = {}] = this.suspectList.filter((v) => v.indexCode === val)
      if (!this.form.caseCode) {
        // const [suspect = {}] = this.suspectList.filter(v => v.indexCode === val);
        if (suspect.caseCode) {
          // const [_case = {}] = this.caseList.filter(v => v.indexCode === suspect.caseCode)
          // this.form.caseCode = _case.indexCode
          this.form.caseCode = suspect.caseCode
          this.form.caseShowName = suspect.caseName + '(' + suspect.caseNo + ')'
        } else {
          this.form.caseCode = ''
          this.form.caseShowName = ''
        }
      } else if (suspect.caseCode && suspect.caseCode != this.form.caseCode) {
        this.form.caseCode = ''
        this.form.caseShowName = ''
      }

      if (this.form.indexCode) {
        return
      }
      this.$nextTick(async () => {
        if (!this.form.suspectCode) {
          this.form.count = 1
          return
        }
        const params = {
          suspectCode: this.form.suspectCode,
          caseCode: this.form.caseCode,
        }
        const res = await this.server.getCount(params)
        const { data } = res
        if (data.code === '0') {
          this.form.count = data.data.count
        } else {
          this.$messagebox(res)
          // this.$message.error(this.$t(data.code))
        }
      })
    },
    caseCodeDel() {
      this.form.caseShowName = ''
      this.form.caseCode = ''
    },
    caseCodeChange(val) {
      this.getCount()
      this.$nextTick(() => {
        this.finaAllSuspect(val)
      })
    },
    async findAllCase() {
      let params = {
        pageNo: this.caseSearchForm.start,
        pageSize: this.caseSearchForm.limit,
        caseName: this.caseSearchForm.caseName,
        caseNo: this.caseSearchForm.caseNo,
      }
      const res = await this.server.findAllPage(params)
      const { data } = res
      if (data.code === '0') {
        this.caseList = data.data.list || []
        this.caseTotal = data.data.total || 0
      } else {
        this.$messagebox(res)
        // this.$message.error(this.$t(data.code))
      }
    },
    resetFindAllCase() {
      this.caseSearchForm = {
        caseName: '',
        caseNo: '',
        start: 1,
        limit: 20,
      }
      this.findAllCase()
    },
    async finaAllSuspect(caseCode, suspectCode) {
      const params = {
        caseCode,
        roomIndexCode: this.$route.query.roomCode,
      }
      const res = await this.server.finaAllSuspect(params)
      const { data } = res
      if (data.code === '0') {
        this.suspectList = data.data || []
        suspectCode && (this.form.suspectCode = suspectCode)
        this.$nextTick(() => {
          if (
            !this.suspectList.find((v) => v.indexCode === this.form.suspectCode)
          ) {
            this.form.suspectCode = ''
          }
        })
      } else {
        this.$messagebox(res)
        // this.$message.error(this.$t(data.code))
      }
    },
    async getDict() {
      const parmas = {
        codes:
          'sex,caseType,inquestType,brief,suspectType,certificateType,nationality,education,political,nation',
      }
      const res = await this.server.getDict(parmas)
      const { data } = res
      if (data.code === '0') {
        this.caseTypeList = data.data.caseType
        this.inquestTypeList = data.data.inquestType || []
        if (this.inquestTypeList.length && !this.form.indexCode) {
          this.form.type = this.inquestTypeList[0].key
        }
        this.accusationList = data.data.brief
        this.suspectTypeList = data.data.suspectType
        this.certificateTypeList = data.data.certificateType
        this.educationList = data.data.education
        this.politicalList = data.data.political
        this.nationalityList = data.data.nationality
        this.nationList = data.data.nation
        this.sexList = data.data.sex
      } else {
        this.$messagebox(res)
        // this.$message.error(this.$t(data.code))
      }
    },
    async getDept() {
      const res = await this.server.getDept()
      const { data } = res
      if (data.code === '0') {
        this.orgData = data.data
      } else {
        this.$messagebox(res)
        // this.$message.error(this.$t(data.code))
      }
    },
    async getAllPerson() {
      const res = await this.server.getAllPerson()
      const { data } = res
      if (data.code === '0') {
        this.personData = data.data
      } else {
        this.$messagebox(res)
        // this.$message.error(this.$t(data.code))
      }
    },
    // 已分配--获取信息
    async getAllocated() {
      const params = {
        roomIndexCode: this.form.roomCode,
      }
      const res = await this.server.getAllocated(params)
      console.log(res)
      const { data } = res
      if (data.code === '0') {
        // this.getDict()
        // this.getCurrentUser()
        const {
          indexCode,
          caseCode,
          caseName,
          caseNo,
          suspectCode,
          type,
          count,
          name,
          orgName,
          orgCode,
          interrogationHandlers,
          roomCode,
          roomName,
        } = data.data
        let worker = []
        let recorder = {}
        let recer = {}
        let org = {}
        if (data.data.orgCode) {
          org = {
            indexCode: orgCode || '',
            name: orgName || '',
          }
        }
        // 审讯人
        interrogationHandlers.forEach((v) => {
          switch (v.type) {
            case 1:
              worker.push({
                indexCode: v.personCode,
                name: v.personName,
                parent: v.orgCode,
                extra: {
                  deptName: v.orgName,
                },
              })
              break
            case 2:
              recorder = {
                indexCode: v.personCode,
                name: v.personName,
                parent: v.orgCode,
                extra: {
                  deptName: v.orgName,
                },
              }
              break
            case 3:
              recer = {
                indexCode: v.personCode,
                name: v.personName,
                parent: v.orgCode,
                extra: {
                  deptName: v.orgName,
                },
              }
              break
            default:
          }
        })
        this.form = {
          indexCode,
          caseCode: caseCode || '',
          caseShowName: caseCode
            ? (caseName || '') + '(' + (caseNo || '') + ')'
            : '',
          suspectCode: '',
          count,
          name,
          roomCode,
          roomName,
          org,
          worker,
          recorder,
          recer,
          type: type === null ? '' : type + '111',
        }
        this.showFlag = this.form.caseCode
        if (this.showFlag) {
          this.hasCase = false
          this.form.suspectCode = suspectCode || ''
        } else {
          this.hasCase = true
          this.finaAllSuspect(caseCode, suspectCode)
        }
        setTimeout(() => {
          this.$refs['form'] && this.$refs['form'].resetValidates()
        }, 15)
      } else {
        this.$messagebox(res)
        // this.$message.error(this.$t(data.code))
      }
    },
    async getInterrogationInfoByindexCode(indexCode) {
      const params = { indexCode }
      const res = await this.server.getInterrogationInfoByindexCode(params)
      const { data } = res
      if (data.code === '0') {
        const {
          indexCode,
          caseCode,
          suspectCode,
          type,
          count,
          name,
          orgName,
          orgCode,
          interrogationHandlers,
          roomCode,
          roomName,
          caseName,
          caseNo,
        } = data.data
        let worker = []
        let recorder = {}
        let recer = {}
        let org = {}
        if (data.data.orgCode) {
          org = {
            indexCode: orgCode || '',
            name: orgName || '',
          }
        }
        interrogationHandlers.forEach((v) => {
          switch (v.type) {
            case 1:
              worker.push({
                indexCode: v.personCode,
                name: v.personName,
                parent: v.orgCode,
                extra: {
                  deptName: v.orgName,
                },
              })
              break
            case 2:
              recorder = {
                indexCode: v.personCode,
                name: v.personName,
                parent: v.orgCode,
                extra: {
                  deptName: v.orgName,
                },
              }
              break
            case 3:
              recer = {
                indexCode: v.personCode,
                name: v.personName,
                parent: v.orgCode,
                extra: {
                  deptName: v.orgName,
                },
              }
              break
            default:
          }
        })
        this.form = {
          indexCode,
          caseCode: caseCode || '',
          caseShowName: caseCode
            ? (caseName || '') + '(' + (caseNo || '') + ')'
            : '',
          count,
          suspectCode,
          name,
          roomCode,
          roomName,
          org,
          worker,
          recorder,
          recer,
          type: type === null ? '' : type + '',
        }
        caseCode && this.finaAllSuspect(caseCode, suspectCode)
        setTimeout(() => {
          this.$refs['form'] && this.$refs['form'].resetValidates()
        }, 15)
      } else {
        this.$messagebox(res)
        // this.$message.error(this.$t(data.code))
      }
    },
    async loadDefaultCaseNo() {
      const res = await this.server.loadDefaultCaseNo()
      const { data } = res
      if (data.code === '0') {
        this.dialogform.caseNo = data.data.caseNo
      } else {
        this.$messagebox(res)
        // this.$message.error(this.$t(data.code))
      }
    },
    // 选择案件弹窗
    checkCaseShow() {
      this.caseSearchForm = {
        caseName: '',
        caseNo: '',
        start: 1,
        limit: 20,
      }
      this.caseDialogVisible = true
      this.findAllCase()
    },
    // 清除案件
    clearCase() {
      this.ruleForm = {
        ...this.ruleForm,
        caseIndexCode: '',
        caseIndexCodeLable: '',
      }
    },
    // 案件列表每页展示数量改变
    casePageSizeChange(pageSize) {
      this.caseSearchForm.limit = pageSize
      this.caseSearchForm.start = 1
      this.findAllCase()
    },
    // 案件列表页码改变
    casePageNoChange(pageNo) {
      this.caseSearchForm.start = pageNo
      this.findAllCase()
    },
    // 选择案件change
    caseCurrentChange(val) {
      this.caseCurrentItem = val
    },
    // 案件选择确认
    checkCaseSure() {
      if (this.caseCurrentItem && this.caseCurrentItem.indexCode) {
        this.caseDialogVisible = false
        this.form = {
          ...this.form,
          caseCode: this.caseCurrentItem.indexCode,
          caseShowName:
            this.caseCurrentItem.name + '(' + this.caseCurrentItem.caseNo + ')',
        }
        // this.$refs.caseInput.$emit('input',this.caseCurrentItem.name + '(' + this.caseCurrentItem.caseNo + ')')
        // form.caseCode
        // this.ruleForm = {
        //   ...this.ruleForm,
        //   caseIndexCode: this.caseCurrentItem.indexCode,
        //   caseIndexCodeLable: this.caseCurrentItem.name + '(' + this.caseCurrentItem.caseNo + ')',
        //   caseCause: this.caseCurrentItem.accusation && this.caseCurrentItem.accusation + '',
        //   deptCode: this.caseCurrentItem.orgCode || '',
        //   deptName: this.caseCurrentItem.orgName || '',
        // }
      } else {
        this.$message('请选择案件')
      }
    },
  },
}
</script>
<style lang="less" rel="stylesheet/less">
.addtrial {
  width: 100%;
  height: auto;
  background-color: #fff;

  .el-form {
    padding: 40px 0 16px;
  }

  .el-form-item__content {
    position: relative;
  }
  .h-icon-close_round {
    position: absolute;
    width: 24px;
    height: 75%;
    top: 8px;
    font-size: 16px;
    text-align: center;
    color: #666;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    color: #ccc;
    right: 4px;
    cursor: pointer;
    z-index: 1;
  }
  .extendbtn {
    position: absolute;
    top: 0;
    right: -72px;
    font-size: 14px;
    color: #2080f7;
    cursor: pointer;
  }
  .extendSelectbtn {
    position: absolute;
    top: 0;
    right: -150px;
    font-size: 14px;
    color: #2080f7;
    cursor: pointer;
  }
  .caseInput {
    .h-icon-close_round {
      display: none;
    }
  }
  .form-btns {
    button {
      width: 96px;
    }
  }

  .dialog-footer {
    button {
      width: 96px;
    }
  }

  .el-dialog .el-form {
    padding: 0;
  }

  .addsubspect {
    .el-form-item {
      display: inline-block;
      width: 45%;
      vertical-align: top;

      &.remark {
        width: 60%;
      }
    }

    .el-dialog__body {
      padding: 24px 0;
    }

    .showMoreButton {
      margin-left: 82px;

      &:hover,
      &:active {
        background: transparent;
      }
    }

    .el-date-editor.el-input {
      width: 183px;
    }

    .sexItem .el-form-item__content {
      white-space: nowrap;
    }
  }
}
.person-dialog-title {
  height: 42px;
  padding-bottom: 10px;

  .person-search-input {
    width: 240px;
  }
}
.el-form-item.caseSearchBtn {
  margin-left: 36px;
}
</style>
