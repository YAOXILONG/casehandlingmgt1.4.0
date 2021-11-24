<template>
  <watermarkContent>
    <div class="register-add-edit-box add-edit-from-box full">
      <PathDesc :path-desc-arr="pathDescArr" :is-back="true"></PathDesc>
      <el-button
        type="primary"
        size="small"
        v-if="!this.queryParam.id"
        class="out-person-btn check-in"
        @click="handleCheckIn"
      >
        入区签到
      </el-button>
      <el-button
        type="primary"
        size="small"
        class="out-person-btn"
        @click="outPersonShow"
      >
        临时出区人员
      </el-button>
      <div class="add-edit-from-back" v-loading="formLoading">
        <StepStatueContent
          :step-statue="[
            2,
            this.detailData.doBodyCheck,
            this.detailData.doGoodsStorage,
            this.detailData.doCollected,
            this.detailData.doDrugCheck,
            this.detailData.doGoodsReturn,
            0,
          ]"
        ></StepStatueContent>
        <div class="scroll-box">
          <el-scrollbar wrap-class="el-scrollbar__wrap">
            <el-form
              :model="ruleForm"
              :rules="rules"
              label-width="150px"
              ref="ruleForm"
            >
              <div class="form-title">
                <span class="desc1">办案场所</span>
              </div>
              <el-row :gutter="150" class="form-row-box">
                <el-col :span="12">
                  <el-form-item label="办案区" prop="areaCode">
                    <el-select
                      v-model="ruleForm.areaCode"
                      placeholder="请选择"
                      @change="areaChange"
                      :disabled="!!this.queryParam.id"
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
                </el-col>
                <el-col :span="12"> </el-col>
              </el-row>
              <div class="form-title">
                <span class="desc1">涉案人基本信息</span>
                <el-switch
                  v-model="catchInfoSwitch"
                  size="small"
                  class="small-seitch"
                >
                </el-switch>
                <span class="desc2">{{
                  catchInfoSwitch ? '隐藏附加选项' : '显示附加选项'
                }}</span>
              </div>
              <el-row :gutter="150" class="form-row-box">
                <el-col :span="12">
                  <div class="person-photo-box">
                    <div class="person-photo-item">
                      <div class="photo-img" v-if="registerPhotoUrl">
                        <div class="showphoto-img">
                          <img :src="registerPhotoUrl" />
                          <img
                            v-if="registerPhoto2Url"
                            :src="registerPhoto2Url"
                            alt=""
                          />
                          <div
                            class="person-pass-icon"
                            :class="{
                              'not-pass':
                                this.ruleForm.registerCompareResult == 1,
                            }"
                            v-if="registerPhotoUrl && registerPhoto2Url"
                          >
                            {{
                              this.ruleForm.registerCompareResult == 1
                                ? '不通过'
                                : '通过'
                            }}
                          </div>
                          <div
                            class="important-tag"
                            v-if="this.ruleForm.keyPersonTag"
                          >
                            <span>重点</span>
                          </div>
                        </div>
                      </div>
                      <div
                        class="hover-box"
                        v-if="!this.queryParam.id"
                        :style="{ width: registerPhotoUrl ? '30%' : '100%' }"
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
                          <el-button class="photoButton" type="primary">
                            上传
                          </el-button>
                        </el-upload>
                        <el-button
                          class="upload-btn photoButton margintop24"
                          type="primary"
                          @click.stop="connectCatchPhoto"
                        >
                          抓拍
                        </el-button>
                        <el-button
                          v-if="
                            showphotocompare &&
                            !registerPhoto2Url &&
                            registerPhotoUrl
                          "
                          class="upload-btn photoButton margintop24"
                          @click.stop="checkphoto"
                        >
                          智能识别
                        </el-button>
                      </div>
                    </div>
                    <div class="person-tag" v-if="this.ruleForm.keyPersonTag">
                      <span
                        class="person-tag-item"
                        v-for="(item, index) in ruleForm.keyPersonTag.split(
                          ','
                        )"
                        :key="index"
                        :title="keyPersonVal[item]"
                      >
                        {{ keyPersonVal[item] }}
                      </span>
                    </div>
                  </div>
                  <el-form-item
                    label="证件类型"
                    prop="idcardType"
                    :rules="[
                      {
                        required: false,
                        message: '请选择',
                        trigger: 'change,blur',
                      },
                    ]"
                  >
                    <!-- required: checkFACE, -->
                    <el-select
                      v-model="ruleForm.idcardType"
                      placeholder="请选择"
                      clear
                    >
                      <el-option
                        v-for="item in dictData.certificateType"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    ref="idcardNoForm"
                    label="证件号码"
                    prop="idcardNo"
                    :rules="[
                      {
                        required: false,
                        message: '请输入',
                        trigger: 'change,blur',
                      },
                      { validator: checkIsIdentity },
                    ]"
                  >
                    <!-- required: checkFACE || checkIdCardNo -->
                    <el-input
                      v-model="ruleForm.idcardNo"
                      @blur="getRegisterBirth('ruleForm')"
                      :maxlength="30"
                    ></el-input>

                    <div
                      class="search-btn"
                      @click="searchPersonInfoShow"
                      v-if="showidcardsearch && ruleForm.idcardType == 111"
                    >
                      智能获取
                    </div>
                  </el-form-item>
                  <el-form-item
                    label="人员类型"
                    prop="personType"
                    v-if="dictData.suspectType.length < 5"
                  >
                    <el-radio
                      class="radio"
                      v-model="ruleForm.personType"
                      :label="item.key"
                      v-for="item in dictData.suspectType"
                      :key="item.key"
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-form-item>
                  <el-form-item label="人员类型" prop="personType" v-else>
                    <el-select
                      v-model="ruleForm.personType"
                      placeholder="请选择"
                      filterable
                    >
                      <el-option
                        v-for="item in personTypeList"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="曾用名"
                    prop="usedName"
                    v-if="catchInfoSwitch"
                  >
                    <el-input
                      v-model="ruleForm.usedName"
                      :maxlength="30"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="民族"
                    prop="nation"
                    v-if="catchInfoSwitch"
                  >
                    <el-select
                      v-model="ruleForm.nation"
                      placeholder="请选择"
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
                    label="文化程度"
                    prop="educationDegree"
                    v-if="catchInfoSwitch"
                  >
                    <el-select
                      v-model="ruleForm.educationDegree"
                      placeholder="请选择"
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
                    v-if="catchInfoSwitch"
                  >
                    <el-input v-model="ruleForm.job" :maxlength="30"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="姓名" prop="registerName">
                    <el-input
                      v-model="ruleForm.registerName"
                      :maxlength="30"
                    ></el-input>
                    <div
                      class="form-right-btn six"
                      @click="checkPersonShow"
                      v-if="!queryParam.id"
                    >
                      选择涉案人员
                    </div>
                  </el-form-item>
                  <el-form-item label="性别" prop="registerSex">
                    <el-radio
                      class="radio"
                      v-model="ruleForm.registerSex"
                      :label="item.key"
                      v-for="item in dictData.sex"
                      :key="item.key"
                    >
                      {{ item.name }}
                    </el-radio>
                  </el-form-item>
                  <el-form-item label="出生日期" prop="registerBirth">
                    <el-date-picker
                      v-model="ruleForm.registerBirth"
                      type="date"
                      placeholder="选择日期范围"
                      :style="{ width: '100%' }"
                      :max-time-is-now="true"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="现住址" prop="address">
                    <el-input
                      v-model="ruleForm.address"
                      :maxlength="100"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="户籍地址" prop="registerAddr">
                    <el-input
                      v-model="ruleForm.registerAddr"
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
                    label="定位手环"
                    prop="bandsNo"
                    v-if="checkPlace"
                  >
                    <el-input
                      v-model="ruleForm.bandsNo"
                      v-show="!!queryParam.id"
                      :disabled="!!queryParam.id"
                    ></el-input>
                    <el-select
                      v-model="ruleForm.bandsNo"
                      v-show="!!!queryParam.id"
                      placeholder="点击此文本框后刷手环"
                      filterable
                      :disabled="!!queryParam.id"
                      clear
                      @focus="tagInputFocusHandle('bandsNo')"
                      @blur="tagInputBlurHandle('bandsNo')"
                    >
                      <el-option
                        v-for="(item, index) in TagInfoListShouhuan"
                        :key="index"
                        :label="item.tagUuid"
                        :value="item.tagUuid"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="体温" prop="temperature">
                    <el-input
                      v-model="ruleForm.temperature"
                      placeholder="请输入"
                      :maxlength="6"
                      @input="updateTemperatureValue()"
                    >
                      <span slot="suffix" style="padding-right: 6px">℃</span>
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    label="国家/地区"
                    prop="nationality"
                    v-if="catchInfoSwitch"
                  >
                    <el-select
                      v-model="ruleForm.nationality"
                      placeholder="请选择"
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
                    prop="politicalStatus"
                    v-if="catchInfoSwitch"
                  >
                    <el-select
                      v-model="ruleForm.politicalStatus"
                      placeholder="请选择"
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
                    label="工作单位"
                    prop="workUnit"
                    v-if="catchInfoSwitch"
                  >
                    <el-input
                      v-model="ruleForm.workUnit"
                      :maxlength="30"
                    ></el-input>
                  </el-form-item>
                  <el-form-item
                    label="担任人大代表"
                    prop="congress"
                    v-if="catchInfoSwitch"
                  >
                    <el-radio
                      class="radio"
                      v-model="ruleForm.congress"
                      label="1"
                    >
                      是
                    </el-radio>
                    <el-radio
                      class="radio"
                      v-model="ruleForm.congress"
                      label="0"
                    >
                      否
                    </el-radio>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="form-title">
                <span class="desc1">办案关联信息</span>
                <el-switch
                  v-model="caseInfoSwitch"
                  size="small"
                  class="small-seitch"
                >
                </el-switch>
                <span class="desc2">{{
                  caseInfoSwitch ? '隐藏附加选项' : '显示附加选项'
                }}</span>
              </div>
              <el-row :gutter="150" class="form-row-box">
                <el-col :span="12">
                  <el-form-item label="警情" prop="policeSituationNo">
                    <el-input
                      v-model="ruleForm.policeSituationNo"
                      :maxlength="100"
                      @change="policeSituationNoChange"
                      :disabled="true"
                    ></el-input>
                    <div
                      class="form-right-btn"
                      @click="checkpoliceSituationShow"
                    >
                      关联警情
                    </div>
                    <div class="form-right-r-btn" @click="clearpoliceSituation">
                      清空警情
                    </div>
                  </el-form-item>
                  <el-form-item label="案件" prop="caseIndexCode">
                    <el-input
                      v-model="ruleForm.caseIndexCodeLable"
                      :maxlength="100"
                      @change="caseChange"
                      :disabled="true"
                    ></el-input>
                    <div class="form-right-btn" @click="checkCaseShow">
                      关联案件
                    </div>
                    <div class="form-right-r-btn" @click="clearCase">
                      清空案件
                    </div>
                    <!--
                  <el-select
                    v-model="ruleForm.caseIndexCode"
                    filterable
                    placeholder="请选择"
                    @change="caseChange"
                    :disabled="!!queryParam.id"
                    clear
                  >
                     :disabled="!!queryParam.id&&!!detailData.caseNo"
                    <el-option
                      v-for="(item,index) in caseInfoList"
                      :key="index"
                      :label="item.caseNo ? `${item.name}(${item.caseNo})`: `${item.name}`"
                      :value="item.indexCode"
                    >
                    </el-option>
                  </el-select>
                  -->
                  </el-form-item>
                  <el-form-item label="案由" prop="caseCause">
                    <ElMoreSelect
                      v-model="ruleForm.caseCause"
                      :options="dictData.brief"
                    ></ElMoreSelect>
                  </el-form-item>
                  <el-form-item label="主办民警" prop="hostPoliceIndexCode">
                    <el-input
                      v-model="ruleForm.hostPolice"
                      placeholder="请选择"
                      :disabled="true"
                    ></el-input>
                    <div
                      class="form-right-btn"
                      v-show="!!!queryParam.id"
                      @click="changeHostPolice"
                    >
                      选择民警
                    </div>
                    <!-- <ElMorePersonSelect v-model="ruleForm.hostPoliceIndexCode"
                                      :disabledOpt="ruleForm.auxiliaryPoliceIndexCode"
                                      @changeData="police1Change"
                                      :disabled="!!queryParam.id"
                                      :options="policeList"></ElMorePersonSelect> -->
                    <!-- <el-select v-model="ruleForm.policeAccessId"
                             placeholder="请选择"
                             filterable
                             :disabled="!!this.queryParam.id"
                             @change="police1Change"
                             clear>
                    <el-option v-for="item in policeAccessIdList"
                               :key="item.userIndexCode"
                               :label="`${item.realName}(${item.username})`"
                               :value="item.userIndexCode"
                               :disabled="item.userIndexCode==ruleForm.policeAccessId2">
                    </el-option>
                  </el-select> -->
                  </el-form-item>
                  <el-form-item
                    label="主办胸卡"
                    prop="cardNo"
                    v-if="checkPlace"
                  >
                    <el-input
                      v-model="ruleForm.cardNo"
                      v-show="!!queryParam.id || ruleForm.cardNo"
                      :disabled="!!queryParam.id || card1Dis"
                    ></el-input>
                    <el-select
                      v-model="ruleForm.cardNo"
                      v-show="!(!!queryParam.id || ruleForm.cardNo)"
                      placeholder="点击此文本框后刷胸卡"
                      filterable
                      :disabled="!!this.queryParam.id || card1Dis"
                      @focus="tagInputFocusHandle('cardNo')"
                      @blur="tagInputBlurHandle('cardNo')"
                      clear
                    >
                      <el-option
                        v-for="(item, index) in TagInfoListXiongka"
                        :key="index"
                        :label="item.tagUuid"
                        :value="item.tagUuid"
                        :disabled="item.tagUuid == ruleForm.cardNo2"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="快办" prop="fastSolve">
                    <el-radio
                      class="radio"
                      v-model="ruleForm.fastSolve"
                      label="1"
                    >
                      是
                    </el-radio>
                    <el-radio
                      class="radio"
                      v-model="ruleForm.fastSolve"
                      label="0"
                    >
                      否
                    </el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="同案标记" prop="sameCaseTag">
                    <el-select
                      v-model="ruleForm.sameCaseTag"
                      placeholder="请选择"
                      filterable
                      :disabled="!!ruleForm.caseIndexCode"
                      clear
                    >
                      <el-option
                        v-for="(item, index) in sameTagListAll"
                        :key="index"
                        :label="item.tagName"
                        :value="item.tagCode"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="办案部门" prop="deptCode">
                    <SelectWithTree
                      v-model="ruleForm.deptCode"
                      :tree-data="deptList"
                      :default-props="defaultProps"
                      :simple-data="true"
                      node-key="deptIndexCode"
                      parent-key="parentIndexCode"
                      @change="deptChange"
                      :disabled="deptShow"
                    ></SelectWithTree>
                    <div class="form-right-btn" @click="changeDept">
                      选择部门
                    </div>
                  </el-form-item>
                  <el-form-item label="入区原由" prop="registerType">
                    <el-select
                      v-model="ruleForm.registerType"
                      placeholder="请选择"
                      filterable
                      clear
                    >
                      <el-option
                        v-for="item in registerTypeList"
                        :key="item.key"
                        :label="item.name"
                        :value="item.key"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="协办民警"
                    prop="auxiliaryPoliceIndexCode"
                  >
                    <el-input
                      v-model="ruleForm.auxiliaryPolice"
                      placeholder="请选择"
                      :disabled="true"
                    ></el-input>
                    <div
                      class="form-right-btn"
                      v-show="!!!this.queryParam.id"
                      @click="changeAuxiliaryPolice"
                    >
                      选择民警
                    </div>
                    <!-- <ElMorePersonSelect v-model="ruleForm.auxiliaryPoliceIndexCode"
                                      :disabledOpt="ruleForm.hostPoliceIndexCode"
                                      @changeData="police2Change"
                                      :disabled="!!this.queryParam.id"
                                      :options="policeList"></ElMorePersonSelect> -->
                    <!-- <el-select v-model="ruleForm.policeAccessId2"
                             placeholder="请选择"
                             filterable
                             :disabled="!!this.queryParam.id"
                             @change="police2Change"
                             clear>
                    <el-option v-for="item in policeAccessIdList"
                               :key="item.userIndexCode"
                               :label="`${item.realName}(${item.username})`"
                               :value="item.userIndexCode"
                               :disabled="item.userIndexCode==ruleForm.policeAccessId">
                    </el-option>
                  </el-select> -->
                  </el-form-item>
                  <el-form-item
                    label="协办胸卡"
                    prop="cardNo2"
                    v-if="checkPlace"
                  >
                    <el-input
                      v-model="ruleForm.cardNo2"
                      v-show="!!queryParam.id || ruleForm.cardNo2"
                      :disabled="!!queryParam.id || card2Dis"
                    ></el-input>
                    <el-select
                      v-model="ruleForm.cardNo2"
                      v-show="!(!!queryParam.id || ruleForm.cardNo2)"
                      placeholder="点击此文本框后刷胸卡"
                      filterable
                      :disabled="!!this.queryParam.id || card2Dis"
                      @focus="tagInputFocusHandle('cardNo2')"
                      @blur="tagInputBlurHandle('cardNo2')"
                      clear
                    >
                      <el-option
                        v-for="(item, index) in TagInfoListXiongka"
                        :key="index"
                        :label="item.tagUuid"
                        :value="item.tagUuid"
                        :disabled="item.tagUuid == ruleForm.cardNo"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="文书编号"
                    prop="docNo"
                    v-if="caseInfoSwitch"
                  >
                    <el-input
                      v-model="ruleForm.docNo"
                      :maxlength="30"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="form-title">
                <span class="desc1">电子签名</span>
              </div>
              <el-row :gutter="10" class="sign-box">
                <el-col :span="12">
                  <div class="sign-lable">
                    <span>办案民警</span>
                  </div>
                  <div class="sign-ctrl-box">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="signHandle('policeSign')"
                    >
                      开始采集
                    </el-button>
                    <div class="sign-area-box">
                      <img :src="policeSignUrl" v-show="policeSignUrl" alt="" />
                      <span class="tip"> 签字处 </span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="sign-lable">
                    <span>管理员</span>
                  </div>
                  <div class="sign-ctrl-box">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="signHandle('managerSign')"
                    >
                      开始采集
                    </el-button>
                    <div class="sign-area-box">
                      <img
                        :src="managerSignUrl"
                        v-show="managerSignUrl"
                        alt=""
                      />
                      <span class="tip"> 签字处 </span>
                    </div>
                  </div>
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
          保存
        </el-button>
        <el-button class="add-edit-btn" @click="goBack"> 取消 </el-button>
      </div>
      <el-dialog
        title="选择临时出区人员"
        :visible.sync="outPersonDialogVisible"
        size="small"
        :area="[950, 556]"
      >
        <div class="out-person-box">
          <div
            class="out-person-card"
            v-for="(item, index) in outPersonData"
            :key="index"
            :class="{
              active: outPersonCheckedData.registerId == item.registerId,
            }"
            @click="outPersonCheckedHandle(item)"
          >
            <div class="img-box">
              <img
                :src="item.registerPhotoUrl"
                alt=""
                v-if="!!item.registerPhotoUrl"
              />
              <img
                class="default-img"
                :src="require('../../assets/image/u5576.png')"
                alt=""
                v-else
              />
            </div>
            <div class="content-box">
              <div class="content-row">
                <span class="content-col-1"
                  >姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</span
                >
                <span class="content-col-2" :title="item.registerName">{{
                  item.registerName
                }}</span>
              </div>
              <div class="content-row">
                <span class="content-col-1"
                  >性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</span
                >
                <span class="content-col-2" v-if="item.registerSex == 1"
                  >男</span
                >
                <span class="content-col-2" v-if="item.registerSex == 2"
                  >女</span
                >
              </div>
              <div class="content-row">
                <span class="content-col-1"
                  >年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄：</span
                >
                <span class="content-col-2">{{ item.registerAge }}</span>
              </div>
              <div class="content-row">
                <span class="content-col-1">办案民警：</span>
                <span class="content-col-2" :title="item.hostPoliceName">{{
                  item.hostPoliceName
                }}</span>
                <!--  :title="item.policeAccessName">{{ item.policeAccessName }}</span> -->
              </div>
              <div class="content-row">
                <span class="content-col-1"
                  >案&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;件：</span
                >
                <span class="content-col-2" :title="item.caseName">{{
                  item.caseName
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="backSure">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="选择人员"
        :visible.sync="personDialogVisible"
        size="small"
        :area="[950, 556]"
      >
        <div class="person-dialog-title">
          <el-input
            clearable
            placeholder="请输入姓名或证件号"
            suffix-icon="h-icon-search"
            v-model="personSearchForm.searchParam"
            class="person-search-input"
            :on-icon-click="getSupectsInfoList"
            :clear-icon-click="getSupectsInfoList"
          >
          </el-input>
        </div>

        <el-table
          ref="singleTable"
          :data="personList"
          highlight-current-row
          @current-change="personCurrentChange"
          style="width: 100%"
          height="320"
        >
          <el-table-column
            type="radio"
            :selectable="selectable"
          ></el-table-column>
          <el-table-column type="index" label="序号" width="60">
          </el-table-column>
          <el-table-column prop="name" label="姓名" show-overflow-title>
          </el-table-column>
          <!-- <el-table-column
          prop="nameUsed"
          label="曾用名"
          show-overflow-title
        >
        </el-table-column> -->
          <el-table-column
            prop="certificateType"
            label="证件类型"
            show-overflow-title
          >
            <template slot-scope="scope">
              <span
                v-for="(item, index) in dictData.certificateType"
                :key="index"
              >
                {{ item.key == scope.row.certificateType ? item.name : '' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="certificateNo"
            label="证件号码"
            show-overflow-title
          >
          </el-table-column>
          <el-table-column prop="caseName" label="案件名称" show-overflow-title>
          </el-table-column>
          <el-table-column prop="caseCode" label="案件编号" show-overflow-title>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="personPageSizeChange"
          @current-change="personPageNoChange"
          :current-page="personSearchForm.pageNo"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="personSearchForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="checkPersonSure">确 定</el-button>
          <el-button @click="personDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
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
          height="320"
        >
          <el-table-column
            type="radio"
            :selectable="selectable"
          ></el-table-column>
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
        class="faceResult-dialog"
        :area="[1110, 604]"
        title="识别结果"
        :visible.sync="dialogFormVisible3"
      >
        <div class="dialog-content">
          <template v-for="item in faceResult">
            <div
              class="faceResult-item"
              :key="item.personId"
              :class="{ normal: !item.keyPersonTag }"
              @click="selectFaceResult(item)"
            >
              <el-checkbox
                class="selectresult"
                :value="checkedFaceResult.personId === item.personId"
              ></el-checkbox>
              <div class="faceResult-img">
                <img :src="item.url" alt="" />
                <div class="important-tag" v-if="item.keyPersonTag">
                  <span>重点</span>
                </div>
              </div>
              <div class="faceResult-percent">
                <div class="faceResult-percent-value">
                  {{ item.similarity }}%
                </div>
              </div>
              <div class="faceResult-content">
                <ul>
                  <li>
                    <span class="faceResult-label">姓名</span>
                    <span class="faceResult-value" :title="item.name">{{
                      item.name
                    }}</span>
                  </li>
                  <li>
                    <span class="faceResult-label">籍贯</span>
                    <span class="faceResult-value" :title="item.nativePlace">{{
                      item.nativePlace
                    }}</span>
                  </li>
                  <li>
                    <span class="faceResult-label"> 身份证号 </span>
                    <span class="faceResult-value" :title="item.personId">
                      {{ item.personId }}
                    </span>
                  </li>
                  <li>
                    <span class="faceResult-label">当前地址</span>
                    <span
                      class="faceResult-value"
                      :title="item.nativePlaceAddr"
                    >
                      {{ item.nativePlaceAddr }}
                    </span>
                  </li>
                  <li v-if="item.keyPersonTag">
                    <span class="faceResult-label">重点人员</span>
                    <span class="faceResult-value">
                      <el-popover
                        placement="bottom"
                        width="200"
                        trigger="hover"
                        :content="getTag(item.keyPersonTag)"
                      >
                        <span slot="reference">
                          {{ getTag(item.keyPersonTag) }}
                        </span>
                      </el-popover>
                    </span>
                  </li>
                  <li v-else>
                    <span class="faceResult-label">--</span
                    ><span class="faceResult-value">--</span>
                  </li>
                </ul>
              </div>
            </div>
          </template>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="confirmSelectFaceResult">
            确 定
          </el-button>
          <el-button @click="setDialogFormVisible3(false)"> 取 消 </el-button>
        </div>
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
          height="345"
        >
          <el-table-column
            type="radio"
            :selectable="selectable"
          ></el-table-column>
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
                    'YYYY-MM-DD HH:mm:ss'
                  )) ||
                '--'
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
                    'YYYY-MM-DD HH:mm:ss'
                  )) ||
                '--'
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
      <el-dialog
        title="选择入区人员"
        :visible.sync="checkInDialogVisible"
        size="small"
        :area="1300"
        class="checkInDialogVisible"
      >
        <el-table
          ref="tableDataTemp"
          :data="tableDataTemp"
          highlight-current-row
          @current-change="peosonCurrentChange"
          style="width: 100%"
          height="519"
          @sort-change="handleClickSort"
        >
          <el-table-column type="radio"> </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="60"
          ></el-table-column>
          <el-table-column
            prop="suspectPhotoUrl"
            label="照片"
            show-overfloe-title
          >
            <template slot-scope="scope">
              <el-tooltip placement="top">
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
            prop="suspectName"
            :resizable="false"
            label="涉案人姓名"
            width="150"
            show-overflow-title
          >
            <template slot-scope="scope">
              <span
                class="table-register-name"
                :title="scope.row.suspectName"
                :style="
                  scope.row.fastSolve == 1
                    ? 'max-width:calc(100% - 78px);'
                    : 'max-width:calc(100%)'
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
          <el-table-column prop="sex" label="性别" show-overflow-title width="60">
            <template slot-scope="scope">
              <span v-for="item in dictData.sex" :key="item.key">{{
                item.key == scope.row.sex ? item.name : ''
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="suspectType"
            :resizable="false"
            label="人员类型"
            show-overflow-title
            width="100"
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
                >{{ item.key != scope.row.suspectType ? '' : item.name }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="deptName" label="办案部门" show-overflow-title width="100">
          </el-table-column>
          <el-table-column
            prop="hostPoliceName"
            label="主办民警"
            show-overflow-title
            width="100"
          >
          </el-table-column>
          <!-- <el-table-column prop="areaName" label="办案区" show-overflow-title>
          </el-table-column> -->
          <el-table-column prop="caseCause" label="案由" show-overflow-title>
            <template slot-scope="scope">
              {{ briefMapSp[scope.row.caseCause] }}
            </template>
          </el-table-column>
          <el-table-column
            prop="applyUserName"
            label="申请人"
            show-overflow-title
          >
          </el-table-column>
          <el-table-column
            prop="applyType"
            label="类型"
            show-overflow-title
            width="90"
          >
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
            sortable="custom"
            width="160"
          >
            <template slot-scope="scope">
              {{ $moment(scope.row.applyTime).format('YYYY-MM-DD HH:mm:ss') }}
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
              <span v-if="scope.row.applyStatus == 3">--</span>
              <span
                class="status-icon gray-icon"
                v-if="scope.row.applyStatus == 4"
                :class="{ 'gray-icon': scope.row.applyStatus == 4 }"
                >已作废</span
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="peosonPageSizeChange"
          @current-change="peosonPageNoChange"
          :current-page="SearchForCheckIn.pageNo"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="SearchForCheckIn.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="peosonTotal"
        >
        </el-pagination>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="checkPeosonSure">确 定</el-button>
          <el-button @click="checkInDialogVisible = false">取 消</el-button>
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
    </div>
  </watermarkContent>
</template> 
<script>
import PathDesc from './components/PathDesc'
import server from '../../server/register'
import StepStatueContent from '../../components/StepStatueContent/StepStatueContent'
import SelectWithTree from '../../components/SelectWithTree/SelectWithTree'
import ElMoreSelect from '../../components/ElMoreSelect/ElMoreSelect'
import ElMorePersonSelect from '../../components/ElMorePersonSelect/ElMorePersonSelect'
import { validateIdentity, validateMobile } from '../../mixin/validate.mixins'
import ShuttleBox from '@/components/ShuttleBoxNew/index'
var validateLength = (rule, value, callback) => {
  if (!/^[0-9]{6}$/g.test(value)) {
    callback(new Error('请输入数字且长度为6'))
  } else {
    callback()
  }
}

export default {
  name: 'RegisterPointEdit',
  data() {
    let queryParam = this.$route.query
    var checkSpCode = (rule, value, callback) => {
      if (/['/\\:*?""<>|]/g.test(value)) {
        callback(new Error('不能包含 \' / \\ : * ? " < > | 这些特殊字符'))
      } else {
        callback()
      }
    }
    var checkNumAndCode = (rule, value, callback) => {
      if (!/^[0-9a-zA-Z]{0,}$/g.test(value)) {
        callback(new Error('请输入数字和字母'))
      } else {
        callback()
      }
    }

    return {
      checkIdCardNo: false,
      checkedFaceResult: '',
      faceResult: [],
      dialogFormVisible3: false,
      showidcardsearch: false,
      showphotocompare: false,
      deptShow: true,
      uploadLoading: false,
      outPersonDialogVisible: false,
      personDialogVisible: false,
      personList: [],
      total: 1,
      personSearchForm: {
        searchParam: '',
        pageNo: 1,
        pageSize: 20,
      },
      personCUrrentItem: {},
      caseDialogVisible: false,
      caseList: [],
      caseTotal: 1,
      caseSearchForm: {
        param: '',
        start: 1,
        limit: 20,
      },
      caseCurrentItem: {},
      catchInfoSwitch: false,
      caseInfoSwitch: false,
      formLoading: false,
      pathDescArr: ['入区登记', `${queryParam.id ? '编辑' : '添加'}入区信息`],
      queryParam: queryParam,
      detailData: {},
      outPersonData: [],
      outPersonCheckedData: '',
      registerPhotoUrl: '',
      registerPhoto2Url: '',
      signBox: 'policeSign',
      policeSignUrl: '',
      managerSignUrl: '',
      ruleForm: {
        registerName: '',
        registerSex: '1',
        registerBirth: '',
        idcardType: '111',
        idcardNo: '',
        registerAddr: '',
        keyPersonTag: '',
        registerPhoto: '',
        registerPhoto2: '',
        registerCompareResult: '', // 人证比对结果
        telPhone: '',
        address: '',
        usedName: '',
        nationality: '',
        nation: '',
        politicalStatus: '',
        educationDegree: '',
        workUnit: '',
        job: '',
        congress: '',
        personType: '',
        caseIndexCode: '',
        caseIndexCodeLable: '',
        bandsNo: '',
        caseCause: '',
        fastSolve: '0',
        areaCode: '',
        areaName: '',
        deptCode: '',
        deptName: '',
        hostPoliceIndexCode: '',
        hostPolice: '',
        hostPoliceData: {},
        hostPoliceName: '',
        cardNo: '',
        auxiliaryPoliceIndexCode: '',
        auxiliaryPolice: '',
        auxiliaryPoliceData: {},
        auxiliaryPoliceName: '',
        cardNo2: '',
        policeSign: '',
        managerSign: '',
        sameCaseTag: '',
        docNo: '',
        registerType: '',
        readDevice: '1',
        policeSituationNo: '',
        policeSituationId: '',
      },
      keyPersonTagList: [],
      rules: {
        // 姓名
        registerName: [
          {
            required: true,
            message: this.$t('casehandlingmgt_commonCheckRequiredInput'),
            trigger: 'change,blur',
          },
          {
            min: 1,
            max: 30,
            message: this.$t('casehandlingmgt_commonCheckLength', ['1', '30']),
            trigger: 'change,blur',
          },
          { validator: checkSpCode, trigger: 'change,blur' },
        ],
        // 户籍地址
        usedName: [{ validator: checkSpCode, trigger: 'change,blur' }],
        // 性别
        registerSex: [
          { required: true, message: '请选择', trigger: 'change,blur' },
        ],
        // 证件号   验证写在表单中
        // idcardNo: [
        //  { validator: checkIsIdentity., trigger: 'change,blur' } : ''
        // ],
        // 联系电话
        telPhone: [
          {
            min: 0,
            max: 11,
            message: '请输入0-11位数字',
            trigger: 'change,blur',
          },
          { validator: validateMobile, trigger: 'change,blur' },
        ],
        // 户籍地址
        registerAddr: [{ validator: checkSpCode, trigger: 'change,blur' }],
        // 工作单位
        workUnit: [{ validator: checkSpCode, trigger: 'change,blur' }],
        // 担任职务
        job: [{ validator: checkSpCode, trigger: 'change,blur' }],
        // 现住址
        address: [{ validator: checkSpCode, trigger: 'change,blur' }],
        // 案由
        caseCause: [{ validator: checkSpCode, trigger: 'change,blur' }],
        // 文书编号
        docNo: [{ validator: checkNumAndCode, trigger: 'change,blur' }],
        // 人员类型
        personType: [
          { required: true, message: '请选择', trigger: 'change,blur' },
        ],
        // 办案区
        areaCode: [
          { required: true, message: '请选择', trigger: 'change,blur' },
        ],
        // 办案部门
        deptCode: [
          { required: true, message: '请选择', trigger: 'change,blur' },
        ],
        // 主办民警
        hostPoliceIndexCode: [
          { required: true, message: '请选择', trigger: 'change,blur' },
        ],
        // 协办民警
        // policeAccessId2: [
        //   { required: true, message: '请选择', trigger: 'change,blur' }
        // ]
        temperature: [{ validator: checkSpCode, trigger: 'change,blur' }],
      },
      deptList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      areaList: [],
      dictData: {
        certificateType: [],
        nation: [],
        registerType: [],
        brief: [],
        political: [],
        nationality: [],
        education: [],
        sex: [],
        suspectType: [],
        keyPersonTag: [],
      },
      keyPersonVal: {}, // 重点人员的标签
      briefSlow: [],
      policeList: [],
      sameTagListAll: [],
      caseInfoList: [],
      TagInfoListShouhuan: [],
      TagInfoListXiongka: [],
      card1Dis: false,
      card2Dis: false,
      socketPersonCard: null,
      socketPersonCard2: null,
      socket: null,
      socketCardNo: '',
      placeDeviceData: {},
      focusKey: '',
      checkPlace: false,
      checkFACE: false,
      submitFormLoading: false,
      registerTypeList: [], // 入区原由
      personTypeList: [], // 人员类型
      showkey: [],
      content: '',
      // 警情
      policeSituationDialogVisible: false,
      policeSituationList: [],
      policeSituationTotal: 1,
      policeSituationSearchForm: {
        reportContent: '',
        pageNo: 1,
        pageSize: 20,
      },
      policeSituationCurrentItem: {},
      policeSituationInfoSwitch: false,
      orgTreeSingle: [],
      personByOrg: [],
      boxLoading: false,
      briefMap: {},
      briefMapSp: {},
      checkInDialogVisible: false, //点击入区签到弹框
      peosonList: [],
      peosonTotal: 1,
      peosonCurrentItem: {},
      SearchForCheckIn: {
        pageNo: 1,
        pageSize: 10,
        areaIndexCodes: [],
        sortby: 'applyTime'
      },
      tableDataTemp: [],
      order: 'desc',
      ipMark: ''
    }
  },
  watch: {
    'ruleForm.idcardType': {
      handler: function (val) {
        let string = this.ruleForm.idcardNo
        val == '123'
          ? (this.checkIdCardNo = true)
          : (this.checkIdCardNo = false)
        this.ruleForm.idcardNo = ''
        this.$nextTick(() => {
          this.ruleForm.idcardNo = string
        })
      },
      immediate: true,
    },
  },
  mounted() {
    this.connectSocket()
    this.findAuthUserPlaceList() // 获取办案区列表
    this.findAuthDeptList() // 获取部门列表
    this.inqDict() // 获取字典列表
    // this.queryPagePersons(1)// 获取警员账号信息
    this.getCaseInfoList() // 获取案件列表
    this.getFaceServerType()
    this.getWatermark()
  },
  beforeDestroy() {
    this.socket && this.socket.close()
    this.socketPersonCard && this.socketPersonCard.close()
    this.socketPersonCard2 && this.socketPersonCard2.close()
  },
  methods: {
    confirmSelectFaceResult() {
      if (this.checkedFaceResult) {
        this.ruleForm.idcardNo = this.checkedFaceResult.personId
        this.ruleForm.registerSex = this.checkedFaceResult.sex
        this.ruleForm.registerName = this.checkedFaceResult.name
        this.ruleForm.keyPersonTag = this.checkedFaceResult.keyPersonTag
        this.ruleForm.registerAddr = this.checkedFaceResult.nativePlace
        this.ruleForm.address = this.checkedFaceResult.nativePlaceAddr
        this.ruleForm.nation =
          this.checkedFaceResult.nation &&
          parseInt(this.checkedFaceResult.nation) + ''
        // this.ruleForm.registerBirth = this.$moment(this.checkedFaceResult.birth, 'YYYYMMDD')
        // this.registerPhotoUrl = this.checkedFaceResult.url
        this.setDialogFormVisible3(false)
        this.$refs['ruleForm'].validateField('idcardNo', (valid) => {
          if (!valid) {
            this.ruleForm.registerBirth = this.$moment(
              this.checkedFaceResult.birth).format('YYYY-MM-DD')
          } else {
            this.ruleForm.registerBirth = ''
          }
        })
      } else {
        this.$message.info('请选择人员')
      }
    },
    selectFaceResult(item) {
      this.checkedFaceResult = item
    },
    setDialogFormVisible3(bool) {
      this.dialogFormVisible3 = bool
    },
    // 自定义校验
    checkIsIdentity(rule, value, callback) {
      if (value) {
        if (this.ruleForm.idcardType === '111') {
          validateIdentity(rule, value, callback)
        } else if (this.ruleForm.idcardType == '123') {
          validateLength(rule, value, callback)
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 连接身份证
    connectPersonCard() {
      if (this.socket && this.socket.readyState === 1) {
        let jsonObj = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol", "commentcmd":"btoolsprotocol://CenterUrl:${this.$centerUrl};Toollist:PROT_BToolCardReaderProtocol;CmdLine:BToolCardReaderProtocol://IReaderType:2;"}}`
        this.socket.send(jsonObj)
      } else {
        this.connectSocket(this.connectPersonCard)
      }
    },
    // 处理身份证数据
    async personCardDataCtrl(_data) {
      if (
        _data &&
        _data.Code === 0 &&
        _data.Result &&
        _data.Result.CommentType === 2
      ) {
        this.ruleForm.idcardNo = _data.Result.Data.Num
        this.ruleForm.registerSex = _data.Result.Data.Gender
        this.ruleForm.registerName = _data.Result.Data.Name
        this.ruleForm.registerAddr = _data.Result.Data.Address
        this.ruleForm.nation = parseInt(_data.Result.Data.Folk) + ''
        _data.Result.Data.Birthday &&
          (this.ruleForm.registerBirth = this.$moment(
            _data.Result.Data.Birthday).format('YYYY-MM-DD'))
        await this.getTemporaryRegisterInfoList() // 获取临时出区人员列表
        let outPersons = this.outPersonData.filter((item) => {
          return item.idcardNo && item.idcardNo === this.ruleForm.idcardNo
        })
        if (outPersons.length > 0) {
          this.outPersonCheckedData = outPersons[0]
          this.outPersonDialogVisible = true
        }
        let base64Str = _data.Result.Data.Photo
        const result = await server.uploadbase64({ base64Str })
        const { data } = result
        if (data.code === '0') {
          this.registerPhotoUrl = data.data.fileUrl
          this.ruleForm.registerPhoto = data.data.fileName
        } else {
          this.$messagebox(result)
        }
      }
    },
    // 连接胸卡
    connectTag() {
      let jsonObj = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol", "commentcmd":"btoolsprotocol://CenterUrl:${this.$centerUrl};Toollist:PROT_BToolCardReaderProtocol;CmdLine:BToolCardReaderProtocol://IReaderType:1;"}}`
      this.socket.send(jsonObj)
    },
    // 处理胸卡数据
    tagDataCtrl(_data) {
      if (
        _data &&
        _data.Code === 0 &&
        _data.Result &&
        _data.Result.CommentType === 1
      ) {
        this.socketCardNo = _data.Result.Data.CardCode
        this.focusKey && this.tagInputFocusHandle(this.focusKey)
      }
    },
    // 连接btools工具
    connectSocket(callback) {
      let socketHost =
        window.location.protocol.indexOf('https') > -1
          ? 'wss://127.0.0.1:18001/WebS_Js'
          : 'ws://127.0.0.1:18000/WebS_Js'
      try {
        this.socket = new WebSocket(socketHost)
        this.socket.onopen = () => {
          // 发送检测插件助手是否安装请求
          let jsonObj =
            '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol"}}'
          this.socket.send(jsonObj)
        }
        this.socket.onerror = () => {
          // 连接失败，通信中间件未安装
          callback && this.$message('检测到您未安装插件助手')
        }
        this.socket.onmessage = async (data) => {
          // onMessageCallback(data)
          let _data = JSON.parse(data.data)
          if (
            _data &&
            _data.comment &&
            _data.comment.commenttype === 'checkapp'
          ) {
            // 检测插件助手是否安装
            if (_data.comment.resultCode === '1') {
              if (!this.queryParam.id) {
                // this.connectPersonCard()// 连接身份证
                this.connectTag() // 连接胸卡
              }
              if (callback) {
                callback()
              }
            } else {
              this.$message('检测到您未安装插件助手')
            }
          } else {
            if (!this.queryParam.id) {
              this.catchPhotoDataCtrl(_data)
              this.tagDataCtrl(_data)
              this.personCardDataCtrl(_data)
            }
            this.signToolDataCtrl(_data)
          }
        }
        this.socket.onclose = () => {
          this.socket = null
        }
      } catch (err) {
        console.log(err)
      }
    },

    // 抓拍
    async connectCatchPhoto() {
      const result = await server.playerParam({})
      const { data } = result
      if (data.code === '0') {
        const hikUrl =
          'btoolsprotocol://CenterUrl:' +
          this.$centerUrl +
          ';toollist:PROT_imagecaptureprotocol;CmdLine:imagecaptureprotocol://language:' +
          'zh_CN' +
          ';cameraType:' +
          'usbCamera' +
          ';NginxIp:' +
          data.data.nginxIp +
          ';NginxPort:' +
          data.data.nginxPort +
          ';sg:' +
          data.data.sg +
          ';protocolType:' +
          data.data.protocol +
          ';context:' +
          'casehandlingmgt/service/rs/v3/uploadPhoto' +
          ';faceMode:1;captureType:personMgr;'
        let jsonObj = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol", "commentcmd":"${hikUrl}"}}`
        this.socket.send(jsonObj)
      } else {
        this.$messagebox(result)
      }
    },
    // 抓拍数据处理
    catchPhotoDataCtrl(_data) {
      if (_data.fileUrl && _data.fileName) {
        this.registerPhotoUrl = _data.fileUrl
        this.ruleForm.registerPhoto = _data.fileName
        this.registerPhoto2Url = ''
        this.ruleForm.registerPhoto2 = ''
      }
    },

    // 连接签字板
    async connectSignTool() {
      if (this.socket && this.socket.readyState === 1) {
        let jsonObj = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol", "commentcmd":"btoolsprotocol://CenterUrl:${this.$centerUrl};Toollist:PROT_BToolCardReaderProtocol;CmdLine:BToolCardReaderProtocol://MethodType:1;SignType:0;"}}`
        this.socket.send(jsonObj)
      } else {
        this.connectSocket(this.connectSignTool)
      }
    },
    // 签字数据处理
    async signToolDataCtrl(_data) {
      if (
        _data &&
        _data.Code === 0 &&
        _data.Result &&
        _data.Result.CommentType === 4
      ) {
        let base64Str = _data.Result.Data.ImgData
        const result = await server.uploadbase64({ base64Str })
        const { data } = result
        if (data.code === '0') {
          this[this.signBox + 'Url'] = data.data.fileUrl
          this.ruleForm[this.signBox] = data.data.fileName
        } else {
          this.$messagebox(result)
        }
      }
    },
    async getFaceServerType() {
      const params = {}
      const result = await server.getFaceServerType(params)
      const { data } = result
      if (data.code === '0') {
        this.showidcardsearch = data.data.indexOf('certificateNo') > -1
        this.showphotocompare = data.data.indexOf('facePic') > -1
        // 0:无,1:身份证号识别,2:人脸识别),如果返回1,2则表示身份证和人脸比对都支持
      } else {
        this.$messagebox(result)
      }
    },
    async checkphoto() {
      const imageType = this.registerPhotoUrl.indexOf('http') > -1 ? '1' : '2'
      const params = {
        imageType,
        image: this.registerPhotoUrl,
      }
      const result = await server.compareFaceResult(params)
      const { data } = result
      if (data.code === '0') {
        this.faceResult = data.data || []
        this.setDialogFormVisible3(true)
      } else {
        this.$messagebox(result)
      }
    },
    // 获取重点人员
    getTag(val) {
      let arr = []
      arr = val.split(',')
      let showArr = []
      arr.forEach((info) => {
        showArr.push(this.keyPersonVal[info])
      })
      return showArr.join(',')
    },
    // 连接人证设备
    personCard() {
      let socketHost =
        this.$protocolType.indexOf('https') > -1
          ? `wss://${this.$nginxIp}:${this.$nginxPort}/casehandlingmgt/webSocket`
          : `ws://${this.$nginxIp}:${this.$nginxPort}/casehandlingmgt/webSocket`
      // let socketHost = window.location.protocol.indexOf('https') > -1
      //   ? `wss://${window.location.host}/casehandlingmgt/webSocket`
      //   : `ws://${window.location.host}/casehandlingmgt/webSocket`
      try {
        this.socketPersonCard = new WebSocket(socketHost)
        this.socketPersonCard.onopen = () => {
          let jsonObj = `{'flag':'${this.placeDeviceData.networkAddr}'}`
          this.socketPersonCard.send(jsonObj)
        }
        this.socketPersonCard.onerror = () => {
          this.$message.error('人证设备连接失败')
        }
        this.socketPersonCard.onmessage = async (data) => {
          let _data = JSON.parse(data.data)
          this.ruleForm.idcardNo = _data.certificateNumber
          this.ruleForm.registerSex =
            _data.registerGender === 'male' ? '1' : '2'
          this.ruleForm.registerName = _data.name
          this.ruleForm.registerAddr = _data.address
          _data.bornTime &&
            (this.ruleForm.registerBirth = this.$moment(
              _data.bornTime).format('YYYY-MM-DD'))
          this.registerPhotoUrl = _data.previewUrl
          this.registerPhoto2Url = _data.previewUrl2
          this.ruleForm.registerPhoto = _data.photoCode
          this.ruleForm.registerPhoto2 = _data.photoCode2
          this.ruleForm.registerCompareResult = _data.matchResult + ''
          this.ruleForm.nation = _data.nation && parseInt(_data.nation) + ''
          await this.getTemporaryRegisterInfoList() // 获取临时出区人员列表
          let outPersons = this.outPersonData.filter((item) => {
            return item.idcardNo && item.idcardNo === this.ruleForm.idcardNo
          })
          if (outPersons.length > 0) {
            this.outPersonCheckedData = outPersons[0]
            this.outPersonDialogVisible = true
          }
        }
        this.socketPersonCard.onclose = () => {
          this.socketPersonCard = null
        }
      } catch (err) {
        console.log(err)
      }
    },
    async getWatermark() {
      const res = await server.getWatermark()
      const {data} = res
      if(data.code == '0') {
        this.ipMark = data.data.ipMark
        this.personCard2()
      }else{
        this.$messagebox(res)
      }
    },
    // 连接人证设备2
    personCard2() {
      let socketHost =
        this.$protocolType.indexOf('https') > -1
          ? `wss://${this.$nginxIp}:${this.$nginxPort}/casehandlingmgt/webSocketExtra`
          : `ws://${this.$nginxIp}:${this.$nginxPort}/casehandlingmgt/webSocketExtra`
      try {
        this.socketPersonCard2 = new WebSocket(socketHost)
        this.socketPersonCard2.onopen = () => {
          let jsonObj = `{'flag':'${this.ipMark}'}`
          this.socketPersonCard2.send(jsonObj)
        }
        this.socketPersonCard2.onerror = () => {
          this.$message.error('人证设备连接失败')
        }
        this.socketPersonCard2.onmessage = async (data) => {
          let _data = JSON.parse(data.data)
          this.ruleForm.idcardNo = _data.certificateNumber
          this.ruleForm.registerSex =  _data.registerGender
          this.ruleForm.registerName = _data.name
          this.ruleForm.registerAddr = _data.address
          _data.bornTime &&
            (this.ruleForm.registerBirth = this.$moment(
              _data.bornTime).format('YYYY-MM-DD'))
          this.registerPhotoUrl = _data.previewUrl
          this.registerPhoto2Url = _data.previewUrl2
          this.ruleForm.registerPhoto = _data.photoCode
          this.ruleForm.registerPhoto2 = _data.photoCode2
          this.ruleForm.registerCompareResult = _data.matchResult + ''
          this.ruleForm.nation = _data.nation && parseInt(_data.nation) + ''
          if(_data.temperature) {
            this.ruleForm.temperature = _data.temperature
          }
          if(_data.certificateType) {
            this.ruleForm.idcardType = _data.certificateType
          }
          await this.getTemporaryRegisterInfoList() // 获取临时出区人员列表
          let outPersons = this.outPersonData.filter((item) => {
            return item.idcardNo && item.idcardNo === this.ruleForm.idcardNo
          })
          if (outPersons.length > 0) {
            this.outPersonCheckedData = outPersons[0]
            this.outPersonDialogVisible = true
          }
        }
        this.socketPersonCard2.onclose = () => {
          this.socketPersonCard2 = null
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 开始采集签字信息
    signHandle(signBox) {
      this.signBox = signBox
      this[this.signBox + 'Url'] = ''
      this.ruleForm[this.signBox] = ''
      this.connectSignTool()
    },
    // 胸卡socket获取
    tagInputFocusHandle(key) {
      this.focusKey = key
      if (!this.socketCardNo) {
        return
      }
      let isGet = false
      if (key === 'bandsNo') {
        this.TagInfoListShouhuan.forEach((item) => {
          if (this.socketCardNo === item.tagUuid) {
            isGet = true
          }
        })
        if (isGet) {
          this.ruleForm[key] = this.socketCardNo
        } else {
          this.$message('暂无此手环数据')
        }
      } else {
        if (
          this.ruleForm[key === 'cardNo' ? 'cardNo2' : 'cardNo'] ===
          this.socketCardNo
        ) {
          this.$message('不可绑定同一胸卡')
          return false
        }
        this.TagInfoListXiongka.forEach((item) => {
          if (this.socketCardNo === item.tagUuid) {
            isGet = true
          }
        })
        if (isGet) {
          this.ruleForm[key] = this.socketCardNo
        } else {
          this.$message('暂无此胸卡数据')
        }
      }
    },
    tagInputBlurHandle(key) {
      this.focusKey = ''
    },
    // 开启手动更换部门
    changeDept() {
      this.deptShow = false
    },
    // 案件切换
    caseChange(data) {
      if (data) {
        this.ruleForm.sameCaseTag = ''
        this.caseInfoList.forEach((item) => {
          if (item.caseIndexCode === data) {
            this.ruleForm.caseCause = item.brief && item.brief + '' || ''
          }
        })

        if (this.ruleForm.caseCause && this.briefMap[this.ruleForm.caseCause]) {
          let caseCause = JSON.parse(
            JSON.stringify(this.briefMap[this.ruleForm.caseCause])
          )
          this.dictData.brief.splice(caseCause.index, 0, caseCause.value)
          this.briefMap[this.ruleForm.caseCause] = null
        }
      }
    },
    // 警情切换
    policeSituationNoChange() {},
    // 部门切换回调
    deptChange(data) {
      if (data.name) {
        this.ruleForm.deptName = data.name
      }
    },
    // 办案区切换
    areaChange(data) {
      this.areaList.forEach((item) => {
        if (data === item.areaIndexCode) {
          this.ruleForm.areaName = item.areaName
        }
      })
      this.getLocationAbility()
      this.getPlaceDevice()
      this.getSameTagListAll() // 获取同案标记列表
    },
    // 校验是否有定位系统
    async getLocationAbility() {
      const result = await server.getLocationAbility({
        areaCode: this.ruleForm.areaCode,
      })
      const { data } = result
      if (data.code === '0') {
        this.checkPlace = !!(
          data.data &&
          data.data.length > 0 &&
          data.data.indexOf('RFID') > -1
        )
        this.checkFACE = !!(
          data.data &&
          data.data.length > 0 &&
          data.data.indexOf('FACE') > -1
        )
        if (this.checkPlace) {
          this.getTagInfoList(1) // 获取手环列表
          this.getTagInfoList(2) // 获取胸卡列表
        }
      } else {
        this.checkPlace = false
      }
    },
    // 主办民警切换
    async police1Change(val) {
      if (!val) {
        return
      }
      this.deptShow &&
        !this.queryParam.id &&
        this.policeList.forEach((item) => {
          if (item.personCode === val) {
            this.ruleForm.deptCode = item.deptCode
          }
        })
      let params = {
        personIndexCode: val,
      }
      const result = await server.getPoliceInfoByPersonIndexCode(params)
      const { data } = result
      if (data.code === '0') {
        if (data.data) {
          this.police1Info = data.data
          this.ruleForm.cardNo = data.data.cardNo
          this.card1Dis = true
        } else {
          this.ruleForm.cardNo = ''
          this.card1Dis = false
        }
      } else {
        this.$messagebox(result)
      }
    },
    // 协办民警切换
    async police2Change(val) {
      if (!val) {
        return
      }
      let params = {
        personIndexCode: val,
      }
      const result = await server.getPoliceInfoByPersonIndexCode(params)
      const { data } = result
      if (data.code === '0') {
        if (data.data) {
          this.police2Info = data.data
          this.ruleForm.cardNo2 = data.data.cardNo
          this.card2Dis = true
        } else {
          this.ruleForm.cardNo2 = ''
          this.card2Dis = false
        }
      } else {
        this.$messagebox(result)
      }
    },
    // 获取人员库列表
    async getSupectsInfoList() {
      const result = await server.getSupectsInfoList(this.personSearchForm)
      const { data } = result
      if (data.code === '0') {
        this.personList = data.data.list
        this.total = data.data.total
      } else {
        this.$messagebox(result)
      }
    },
    // 获取案件列表
    async getCaseInfoList() {
      const result = await server.getCaseInfoList(this.caseSearchForm)
      const { data } = result
      if (data.code === '0') {
        this.caseList = data.data.list
        this.caseTotal = data.data.total
      } else {
        this.$messagebox(result)
      }
    },
    // 获取警情列表
    async getpoliceSituationInfoList() {
      const result = await server.getpoliceSituationInfoList(
        this.policeSituationSearchForm
      )
      const { data } = result
      if (data.code === '0') {
        this.policeSituationList = data.data.list
        this.policeSituationTotal = data.data.total
      } else {
        this.$messagebox(result)
      }
    },
    // 选择人员弹窗
    checkPersonShow() {
      this.getSupectsInfoList() // 获取涉案人员列表
      this.personDialogVisible = true
    },
    // 人员库列表条件搜索
    personSearchHandle() {},
    // 人员库列表搜索条件清空
    personSearchClearHandle() {
      this.getSupectsInfoList()
    },
    // 人员列表每页展示数量改变
    personPageSizeChange(pageSize) {
      this.personSearchForm.pageSize = pageSize
      this.personSearchForm.pageNo = 1
      this.getSupectsInfoList()
    },
    // 人员列表页码改变
    personPageNoChange(pageNo) {
      this.personSearchForm.pageNo = pageNo
      this.getSupectsInfoList()
    },
    // 选择人员change
    personCurrentChange(val) {
      this.personCUrrentItem = val
    },
    // 选择案件弹窗
    checkCaseShow() {
      this.caseDialogVisible = true
      this.getCaseInfoList()
    },
    // 清除案件
    clearCase() {
      this.ruleForm = {
        ...this.ruleForm,
        caseIndexCode: '',
        caseIndexCodeLable: '',
      }
    },
    // 案件列表条件搜索
    caseSearchHandle() {},
    // 案件列表搜索条件清空
    caseSearchClearHandle() {
      this.getCaseInfoList()
    },
    // 案件列表每页展示数量改变
    casePageSizeChange(pageSize) {
      this.caseSearchForm.limit = pageSize
      this.caseSearchForm.start = 1
      this.getCaseInfoList()
    },
    // 案件列表页码改变
    casePageNoChange(pageNo) {
      this.caseSearchForm.start = pageNo
      this.getCaseInfoList()
    },
    // 选择案件change
    caseCurrentChange(val) {
      this.caseCurrentItem = val
    },
    // 选择警情弹窗
    checkpoliceSituationShow() {
      this.policeSituationDialogVisible = true
      this.policeSituationCurrentItem = {}
      this.getpoliceSituationInfoList()
    },
    // 清除警情
    clearpoliceSituation() {
      this.ruleForm = {
        ...this.ruleForm,
        policeSituationNo: '',
        policeSituationId: '',
      }
    },
    // 警情列表条件搜索
    policeSituationSearchHandle() {},
    // 警情列表搜索条件清空
    policeSituationSearchClearHandle() {
      this.getpoliceSituationInfoList()
    },
    // 警情列表每页展示数量改变
    policeSituationPageSizeChange(pageSize) {
      this.policeSituationSearchForm.pageSize = pageSize
      this.policeSituationSearchForm.pageNo = 1
      this.getpoliceSituationInfoList()
    },
    // 警情列表页码改变
    policeSituationPageNoChange(pageNo) {
      this.policeSituationSearchForm.pageNo = pageNo
      this.getpoliceSituationInfoList()
    },
    // 选择警情change
    policeSituationCurrentChange(val) {
      this.policeSituationCurrentItem = val
    },
    // 警情选择确认
    checkpoliceSituationSure() {
      if (
        this.policeSituationCurrentItem &&
        this.policeSituationCurrentItem.policeSituationId
      ) {
        this.ruleForm.policeSituationId =
          this.policeSituationCurrentItem.policeSituationId
        this.ruleForm.policeSituationNo =
          this.policeSituationCurrentItem.policeSituationNo
        this.policeSituationDialogVisible = false
      } else {
        this.$message('请选择警情')
      }
    },

    // 人员选择确认
    checkPersonSure() {
      if (this.personCUrrentItem && this.personCUrrentItem.name) {
        this.personDialogVisible = false
        this.registerPhotoUrl = this.personCUrrentItem.photoUrl
        this.registerPhoto2Url = this.personCUrrentItem.photo2Url
        this.ruleForm = {
          ...this.ruleForm,
          registerName: this.personCUrrentItem.name || '',
          registerSex:
            this.personCUrrentItem.sex || this.personCUrrentItem.sex === 0
              ? this.personCUrrentItem.sex + ''
              : '',
          registerBirth: this.personCUrrentItem.birthday
            ? this.$moment(this.personCUrrentItem.birthday).format('YYYY-MM-DD')
            : '',
          idcardType: (this.personCUrrentItem.certificateType || '') + '',
          idcardNo: this.personCUrrentItem.certificateNo || '',
          registerAddr: this.personCUrrentItem.registerAddress || '',
          registerPhoto: this.personCUrrentItem.photo || '',
          registerPhoto2: this.personCUrrentItem.photo2 || '',
          registerCompareResult:
            this.personCUrrentItem.registerCompareResult || '',
          telPhone: this.personCUrrentItem.phoneNumber || '',
          address: this.personCUrrentItem.address || '',
          usedName: this.personCUrrentItem.nameUsed || '',
          nationality: (this.personCUrrentItem.nationality || '') + '',
          nation: (this.personCUrrentItem.nation || '') + '',
          politicalStatus: (this.personCUrrentItem.political || '') + '',
          educationDegree: (this.personCUrrentItem.education || '') + '',
          workUnit: this.personCUrrentItem.workUnit || '',
          job: this.personCUrrentItem.job || '',
          congress:
            this.personCUrrentItem.npcMember === 0 ||
            this.personCUrrentItem.npcMember === 1
              ? this.personCUrrentItem.npcMember + ''
              : '',
          caseIndexCode: this.personCUrrentItem.caseIndexCode || '',
          caseCause: this.personCUrrentItem.caseCause || '',
          caseIndexCodeLable: this.personCUrrentItem.caseCode
            ? this.personCUrrentItem.caseName +
              '(' +
              this.personCUrrentItem.caseCode +
              ')'
            : '',
          peopleCode: this.personCUrrentItem.indexCode,
          personType:
            this.personCUrrentItem.type || this.personCUrrentItem.type === 0
              ? this.personCUrrentItem.type + ''
              : '',
          policeSituationNo: this.personCUrrentItem.policeSituationNo,
          policeSituationId: this.personCUrrentItem.policeSituationId,
          deptCode:this.personCUrrentItem.orgCode,
          deptName: this.personCUrrentItem.orgName
        }
      } else {
        this.$message('请选择人员')
      }
    },
    // 案件选择确认
    checkCaseSure() {
      if (this.caseCurrentItem && this.caseCurrentItem.indexCode) {
        this.caseDialogVisible = false
        let caseCause =
          this.caseCurrentItem.accusation &&
          this.caseCurrentItem.accusation + ''

        this.ruleForm = {
          ...this.ruleForm,
          caseIndexCode: this.caseCurrentItem.indexCode,
          caseIndexCodeLable:
            this.caseCurrentItem.name + '(' + this.caseCurrentItem.caseNo + ')',
          caseCause: caseCause || '',
          deptCode: this.caseCurrentItem.orgCode || '',
          deptName: this.caseCurrentItem.orgName || '',
        }
        if (caseCause && this.briefMap[caseCause]) {
          console.log(this.briefMap[caseCause])
          let _caseCause = JSON.parse(JSON.stringify(this.briefMap[caseCause]))
          this.dictData.brief.splice(_caseCause.index, 0, _caseCause.value)
          this.briefMap[caseCause] = null
        }
      } else {
        this.$message('请选择案件')
      }
    },
    // 展示临时出区人员
    async outPersonShow() {
      await this.getTemporaryRegisterInfoList() // 获取临时出区人员列表
      if (this.outPersonData && this.outPersonData.length > 0) {
        this.outPersonDialogVisible = true
      } else {
        this.$message('暂无临时出区人员')
      }
    },
    // 选择临时出区人员
    async outPersonCheckedHandle(item) {
      this.outPersonCheckedData = item
    },
    // 回区确认
    async backSure() {
      if (!this.outPersonCheckedData.registerId) {
        this.$message('请选择人员')
        return
      }
      let params = {
        registerId: this.outPersonCheckedData.registerId,
      }
      const result = await server.updateRegisterBackInfo(params)
      const { data } = result
      if (data.code === '0') {
        this.$message.success('回区成功')
        this.outPersonDialogVisible = false
        this.goBack()
      } else {
        this.$messagebox(result)
      }
    },
    // 获取入区人员详情
    async getRegisterInfoVo() {
      if (!this.queryParam.id) {
        return false
      }
      this.formLoading = true
      const params = { registerId: this.queryParam.id }
      const result = await server.getRegisterInfoVo(params)
      const { data } = result
      if (data.code === '0' && data.data) {
        let _data = data.data
        this.detailData = _data
        this.registerPhotoUrl = _data.registerPhotoUrl
        this.registerPhoto2Url = _data.registerPhotoUrl2
        this.policeSignUrl = _data.policeSignUrl
        this.managerSignUrl = _data.managerSignUrl
        this.ruleForm = {
          registerName: _data.registerName || '',
          registerSex: _data.registerSex + '',
          registerBirth: _data.registerBirth
            ? this.$moment(_data.registerBirth).format('YYYY-MM-DD')
            : '',
          idcardType: (_data.idcardType && _data.idcardType + '') || '',
          idcardNo: _data.idcardNo || '',
          registerAddr: _data.registerAddr || '',
          registerPhoto: _data.registerPhoto || '',
          registerPhoto2: _data.registerPhoto2 || '',
          registerCompareResult: _data.registerCompareResult || '',
          telPhone: _data.telPhone || '',
          address: _data.address || '',
          usedName: _data.usedName || '',
          nationality: (_data.nationality && _data.nationality + '') || '',
          nation: (_data.nation && _data.nation + '') || '',
          politicalStatus:
            (_data.politicalStatus && _data.politicalStatus + '') || '',
          educationDegree:
            (_data.educationDegree && _data.educationDegree + '') || '',
          workUnit: _data.workUnit || '',
          job: _data.job || '',
          congress:
            _data.congress || _data.congress === 0 ? _data.congress + '' : '',
          personType: _data.personType || '',
          bandsNo: _data.bandsNo || '',
          caseIndexCode: _data.caseIndexCode || '',
          caseIndexCodeLable: _data.caseIndexCodeLable || '',
          caseCause: _data.caseCause || '',
          fastSolve: _data.fastSolve + '' || '0',
          areaCode: _data.areaCode || '',
          areaName: _data.areaName || '',
          deptCode: _data.deptCode || '',
          deptName: _data.deptName || '',
          hostPoliceIndexCode: _data.hostPoliceIndexCode || '',
          hostPolice: _data.hostPoliceName
            ? `${_data.hostPoliceName}(${_data.hostPoliceNo || '--'})`
            : '',
          hostPoliceData: {
            personName: _data.hostPoliceName || '',
            personIndexCode: _data.hostPoliceIndexCode || '',
            certificateNumber: _data.hostPoliceNo || '',
          },
          hostPoliceName: _data.hostPoliceName || '',
          cardNo: _data.cardNo || '',
          auxiliaryPoliceIndexCode: _data.auxiliaryPoliceIndexCode || '',
          auxiliaryPolice: _data.auxiliaryPoliceName
            ? `${_data.auxiliaryPoliceName}(${_data.auxiliaryPoliceNo || '--'})`
            : '',
          auxiliaryPoliceData: {
            personName: _data.auxiliaryPoliceName || '',
            personIndexCode: _data.auxiliaryPoliceIndexCode || '',
            certificateNumber: _data.auxiliaryPoliceNo || '',
          },
          auxiliaryPoliceName: _data.auxiliaryPoliceName || '',
          cardNo2: _data.cardNo2 || '',
          policeSign: _data.policeSign || '',
          managerSign: _data.managerSign || '',
          sameCaseTag: _data.sameCaseTag || '',
          docNo: _data.docNo || '',
          registerType: (_data.registerType && _data.registerType + '') || '',
          readDevice: _data.readDevice || '1',
          peopleCode: _data.peopleCode || '',
          policeSituationNo: _data.policeSituationNo,
          policeSituationId: _data.policeSituationId,
          temperature: _data.temperature,
        }
        // 入区原由
        this.registerTypeList = []
        let checkType = this.ruleForm.registerType
        this.dictData.registerType.forEach((val) => {
          if (val.key == checkType) {
            this.registerTypeList.push(val)
          } else {
            if (val.used === 0) {
              this.registerTypeList.push(val)
            }
          }
        })
        // 人员类型 personTypeList
        this.personTypeList = []
        let checkType2 = this.ruleForm.personType
        this.dictData.suspectType.forEach((val) => {
          if (val.key == checkType2) {
            this.personTypeList.push(val)
          } else {
            if (val.used === 0) {
              this.personTypeList.push(val)
            }
          }
        })
        this.$nextTick(() => {
          this.ruleForm.caseCause = _data.caseCause || ''
          if (_data.caseCause && this.briefMap[_data.caseCause]) {
            let _caseCause = JSON.parse(
              JSON.stringify(this.briefMap[_data.caseCause])
            )
            this.dictData.brief.splice(_caseCause.index, 0, _caseCause.value)
            this.briefMap[_data.caseCause] = null
          }
        })
      } else {
        this.$messagebox(result)
      }
      this.formLoading = false
    },
    // 表单提交
    submitForm(formName) {
      if (this.submitFormLoading) {
        return false
      }
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let params = this.ruleForm
          if (this.checkFACE && !params.registerPhoto) {
            this.$message.error('请上传照片')
            return
          }
          let hostPoliceName = ''
          let hostPoliceNo = ''
          let auxiliaryPoliceName = ''
          let auxiliaryPoliceNo = ''
          hostPoliceName = this.ruleForm.hostPoliceData.personName
          hostPoliceNo = this.ruleForm.hostPoliceData.certificateNumber
          auxiliaryPoliceName = this.ruleForm.auxiliaryPoliceData.personName
          auxiliaryPoliceNo =
            this.ruleForm.auxiliaryPoliceData.certificateNumber
          params = {
            ...params,
            hostPoliceName,
            auxiliaryPoliceName,
            hostPoliceNo,
            auxiliaryPoliceNo,
            registerBirth:params.registerBirth?this.$moment(params.registerBirth).format('YYYY-MM-DD') : ''
          }
          if (this.queryParam.id) {
            params['registerId'] = this.queryParam.id
          }
          this.submitFormLoading = true
          const result = await server.saveOrUpdateRegisterInfo(params)
          const { data } = result
          if (data.code === '0') {
            this.$message.success('保存成功')
            this.submitFormLoading = false
            this.goBack()
          } else {
            this.submitFormLoading = false
            this.$messagebox(result)
          }
        } else {
          return false
        }
      })
    },
    // 获取出生日期
    getRegisterBirth(formName) {
      this.$refs[formName].validateField('idcardNo', (errorMessage) => {
        if (!errorMessage) {
          let birthday = ''
          let value = this.ruleForm.idcardNo
          if (value.length === 15) {
            birthday = '19' + value.substr(6, 6)
          }
          if (value.length === 18) {
            birthday = value.substr(6, 8)
          }
          
          let _birthday = birthday &&this.$moment(birthday).format('YYYY-MM-DD') || ''
          if(_birthday == 'Invalid date'){
            this.ruleForm.registerBirth = ''
          }else {
            this.ruleForm.registerBirth = _birthday
          }
        } else {
          return false
        }
      })
    },
    beforeUpload(file) {
      let path = file.name
      let type = path
        .substring(path.lastIndexOf('.'), path.length)
        .toUpperCase()
      let uploadLoading = false
      // const isJPG = file.type === 'image/jpeg'
      console.log(file)
      if (
        type === '.JPG' ||
        type === '.JPEG' ||
        type === '.PNG' ||
        type === '.BMP'
      ) {
        this.uploadLoading = true
      } else {
        this.$message('请上传jpg,jpeg,jpg,png类型的图片')
        return false
      }
      // this.uploadLoading = true
    },
    // 自定义上传
    async uploadAuto(value) {
      let file = value.file
      let formData = new FormData()
      formData.append('file', file)
      const result = await server.uploadFile(formData, {
        transformRequest: [
          function (data) {
            return data
          },
        ],
        headers: {
          post: { 'Content-Type': 'multipart/form-data' },
        },
      })
      const { data } = result
      if (data.code === '0') {
        this.registerPhotoUrl = data.data.fileUrl
        this.ruleForm.registerPhoto = data.data.fileName
        this.registerPhoto2Url = ''
        this.ruleForm.registerPhoto2 = ''
      } else {
        this.$messagebox(result)
      }
      this.uploadLoading = false
    },
    // 获取场所对应的设备
    async getPlaceDevice() {
      let params = {
        areaCode: this.ruleForm.areaCode,
      }
      const result = await server.getPlaceDevice(params)
      const { data } = result
      if (data.code === '0') {
        // witness人证
        this.placeDeviceData = data.data
        if (data.data.indefityType === 'witness' && data.data.networkAddr) {
          this.personCard() // 连接人证设备
        } else {
          this.connectPersonCard()
        }
      } else {
        this.$messagebox(result)
      }
    },
    // 获取办案区
    async findAuthUserPlaceList() {
      const result = await server.findAuthUserPlaceList()
      const { data } = result
      if (data.code === '0') {
        this.areaList = data.data.list
        if (this.areaList[0]) {
          this.ruleForm.areaCode = this.areaList[0].areaIndexCode
          this.ruleForm.areaName = this.areaList[0].areaName
          // this.getPlaceDevice()
          // this.getSameTagListAll() // 获取同案标记列表
          // this.getTagInfoList(1) // 获取手环列表
          // this.getTagInfoList(2) // 获取胸卡列表
        }
      } else {
        this.$messagebox(result)
      }
    },
    // 获取办案部门
    async findAuthDeptList() {
      const result = await server.findAuthDeptList()
      const { data } = result
      if (data.code === '0') {
        this.deptList = data.data
      } else {
        this.$messagebox(result)
      }
    },
    // 获取字典
    async inqDict() {
      const result = await server.inqDict()
      const { data } = result
      if (data.code === '0') {
        let briefList = []
        let briefMap = {}
        data.data.brief &&
          data.data.brief.forEach((v) => {
            if (v.used == 0) {
              briefList.push(v)
            } else {
              briefMap[v.key] = {
                index: briefList.length,
                value: v,
              }
            }
          })
        this.briefMap = briefMap
        const briefMapSp = {}
        data.data.brief.forEach((v) => {
          briefMapSp[v.key] = v.name
        })
        this.briefMapSp = briefMapSp
        this.dictData = {
          certificateType: data.data.certificateType,
          nation: data.data.nation,
          registerType: data.data.registerType,
          brief: briefList,
          political: data.data.political,
          nationality: data.data.nationality,
          education: data.data.education,
          sex: data.data.sex,
          suspectType: data.data.suspectType,
          keyPersonTag: data.data.keyPersonTag,
        }
        // 入区原由
        this.registerTypeList = this.dictData.registerType.filter((val) => {
          return val.used === 0
        })
        // 人员类型
        this.personTypeList = this.dictData.suspectType.filter((val) => {
          return val.used === 0
        })
        let keyPersonVal = {}
        this.dictData.keyPersonTag.forEach((v) => {
          keyPersonVal[v.key] = v.name
        })
        this.keyPersonVal = keyPersonVal
      } else {
        this.$messagebox(result)
      }
      this.getRegisterInfoVo() // 获取人员详细信息
    },
    // 获取标签列表
    async getTagInfoList(tagType) {
      const params = {
        areaCode: this.ruleForm.areaCode,
        tagType: tagType,
      }
      const result = await server.getTagInfoList(params)
      const { data } = result
      if (data.code === '0') {
        tagType === 1 && (this.TagInfoListShouhuan = data.data)
        tagType === 2 && (this.TagInfoListXiongka = data.data)
      } else {
        this.$messagebox(result)
      }
    },
    // 获取临时出区人员
    async getTemporaryRegisterInfoList() {
      const params = {
        areaCode: this.ruleForm.areaCode,
      }
      const result = await server.getTemporaryRegisterInfoList(params)
      const { data } = result
      if (data.code === '0') {
        this.outPersonData = data.data
      } else {
        this.$messagebox(result)
      }
    },
    // 获取警员账号信息
    async queryPagePersons(number, param) {
      let params = {
        ...param,
        pageNo: number,
        pageSize: 1000,
      }
      const result = await server.queryPagePersons(params)
      const { data } = result
      if (data.code === '0') {
        if (number == 1) {
          this.personByOrg = data.data.list
        } else {
          this.personByOrg = this.personByOrg.concat(data.data.list)
        }
        if (data.data.pageNo != Math.floor(data.data.total / 1000) + 1) {
          console.log('hhh', 1)
          this.queryPagePersons(data.data.pageNo - 0 + 1, param)
        }
      } else {
        this.$messagebox(result)
      }
    },
    // 获取同案标记列表
    async getSameTagListAll() {
      const params = {
        areaCode: this.ruleForm.areaCode,
      }
      const result = await server.getSameTagListAll(params)
      const { data } = result
      if (data.code === '0') {
        this.sameTagListAll = data.data
      } else {
        this.$messagebox(result)
      }
    },
    // 获取案件列表
    // async getCaseInfoList () {
    //  const params = {}
    // const {data} = await server.getCaseInfoList(params)
    // if (data.code === '0') {
    // this.caseInfoList = data.data.list
    // } else {
    // this.$message.error(this.$t(data.code))
    // }
    // },
    goBack() {
      this.$router.push({ name: 'index', params: {} })
    },
    async searchPersonInfoShow() {
      if (!this.ruleForm.idcardNo) {
        this.$message('请输入身份证号')
        return
      }
      const params = {
        cardNo: this.ruleForm.idcardNo,
      }
      const result = await server.compareFaceResult(params)
      const { data } = result
      if (data.code === '0') {
        if (data.data.length > 0) {
          this.$refs['ruleForm'].validateField('idcardNo', (valid) => {
            if (!valid) {
              this.ruleForm = {
                ...this.ruleForm,
                idcardNo: data.data[0].personId,
                registerSex: data.data[0].sex,
                registerName: data.data[0].name,
                keyPersonTag: data.data[0].keyPersonTag,
                registerAddr: data.data[0].nativePlace,
                address: data.data[0].nativePlaceAddr,
                nation:
                  data.data[0].nation && parseInt(data.data[0].nation) + '',
                registerBirth: this.$moment(data.data[0].birth).format('YYYY-MM-DD'),
              }
            } else {
              return false
            }
          })
        } else {
          this.$message('暂无匹配人员信息')
        }
      } else {
        this.$messagebox(result)
      }
    },
    ShuttleEvent(val) {
      console.log(1, val)
      if (val && val.type == 'close') {
        val.payload.close()
      } else if (val.type == 'getLeftData') {
        if (
          this.$refs.ShuttleBoxSingle &&
          !this.$refs.ShuttleBoxSingle.dialogFormVisible
        ) {
          return
        }
        let params = {
          deptIndexCodeList: [val.payload.indexCode],
          personName: val.payload.personName ? val.payload.personName : '',
        }
        console.log('hhh', 2)
        this.queryPagePersons(1, params)
      } else if (val.type == 'selectData') {
        this.ruleForm.hostPoliceIndexCode = val.payload.data.personIndexCode
        this.ruleForm.hostPoliceData = val.payload.data
        // this.ruleForm.deptCode = val.payload.data.deptCode
        this.ruleForm.hostPolice = `${val.payload.data.personName}(${
          val.payload.data.certificateNumber || '--'
        })`
        let setData = async () => {
          let params = {
            personIndexCode: val.payload.data.personIndexCode,
          }
          const result = await server.getPoliceInfoByPersonIndexCode(params)
          const { data } = result
          if (data.code === '0') {
            if (data.data) {
              this.police1Info = data.data
              this.ruleForm.cardNo = data.data.cardNo || ''
              this.ruleForm.deptCode = data.data.deptCode
              this.card1Dis = true
            } else {
              this.police1Info = {}
              this.ruleForm.cardNo = ''
              this.card1Dis = false
            }
          } else {
            this.$messagebox(result)
          }
        }
        setData()
        // this.ruleForm.policeTel1 = val.payload.data.mobile
        val.payload.close()
      } else if (val.type == 'beforeCLose') {
        val.payload.done()
      }
    },
    ShuttleEvent1(val) {
      console.log(2, val)
      if (val && val.type == 'close') {
        val.payload.close()
      } else if (val.type == 'getLeftData') {
        if (
          this.$refs.ShuttleBoxSingle1 &&
          !this.$refs.ShuttleBoxSingle1.dialogFormVisible
        ) {
          return
        }
        let params = {
          deptIndexCodeList: [val.payload.indexCode],
          personName: val.payload.personName ? val.payload.personName : '',
        }
        console.log('hhh', 3)
        this.queryPagePersons(1, params)
      } else if (val.type == 'selectData') {
        this.ruleForm.auxiliaryPoliceIndexCode =
          val.payload.data.personIndexCode
        this.ruleForm.auxiliaryPoliceData = val.payload.data
        this.ruleForm.auxiliaryPolice = `${val.payload.data.personName}(${val.payload.data.certificateNumber})`
        let setData = async () => {
          let params = {
            personIndexCode: val.payload.data.personIndexCode,
          }
          const result = await server.getPoliceInfoByPersonIndexCode(params)
          const { data } = result
          if (data.code === '0') {
            if (data.data) {
              this.police2Info = data.data
              this.ruleForm.cardNo2 = data.data.cardNo || ''
              this.card2Dis = true
            } else {
              this.police2Info = {}
              this.ruleForm.cardNo2 = ''
              this.card2Dis = false
            }
          } else {
            this.$messagebox(result)
          }
        }
        setData()
        // this.ruleForm.policeTel2 = val.payload.data.mobile
        val.payload.close()
      } else if (val.type == 'beforeCLose') {
        val.payload.done()
      }
    },
    async changeHostPolice() {
      const result = await server.loadOrgTree()
      const { data } = result
      if (data.code === '0') {
        console.log(this.$refs.ShuttleBoxSingle)
        this.orgTreeSingle = data.data
        this.$refs.ShuttleBoxSingle.dialogFormVisible = true
      } else {
        this.$messagebox(result)
      }
    },
    async changeAuxiliaryPolice() {
      console.log(333, this.ruleForm)
      const result = await server.loadOrgTree()
      const { data } = result
      if (data.code === '0') {
        console.log(this.$refs.ShuttleBoxSingle1)
        this.orgTreeSingle = data.data
        this.$refs.ShuttleBoxSingle1.dialogFormVisible = true
      } else {
        this.$messagebox(result)
      }
    },
    handleCheckIn() {
      this.getApproval()
    },
    // 查询办案区配置参数
    async getApproval() {
      const { data } = await server.getApproval({
        areaIndexCode: this.ruleForm.areaCode,
      })
      if (data.code === '0') {
        if (data.data) {
          let _data = JSON.parse(JSON.stringify(data.data))
          let applyStatus = []
          _data.entryApproval == 1
            ? (applyStatus = [2, 3])
            : (applyStatus = [0, 2, 3])
          this.SearchForCheckIn = {
            ...this.SearchForCheckIn,
            applyStatus,
            applyTypes: [1, 2],
            applyTime: _data.signOutTime
              ? {
                  startTime: this.$moment(
                    new Date().getTime() -
                      _data.signOutTime * 1000 * 60 * 60 * 24
                  ).format(),
                  endTime: this.$moment(new Date().getTime()).format(),
                }
              : {
                  startTime: this.$moment(
                    new Date().getTime() - 1 * 1000 * 60 * 60 * 24
                  ).format(),
                  endTime: this.$moment(new Date().getTime()).format(),
                },
          }
        } else {
          let applyStatus = [0, 2, 3]
          this.SearchForCheckIn = {
            ...this.SearchForCheckIn,
            applyStatus,
            applyTypes: [1, 2],
            applyTime: {
              startTime: this.$moment(
                new Date().getTime() - 1 * 1000 * 60 * 60 * 24
              ).format(),
              endTime: this.$moment(new Date().getTime()).format(),
            },
          }
        }
        this.SearchForCheckIn = {
          ...this.SearchForCheckIn,
          pageSize: 10,
          pageNo: 1,
        }
        this.order="desc"
        let searchType = '0'
        this.entryApplicaitionSearch(searchType)
      } else {
        this.$message.error(this.$i18n.t(data.code))
      }
    },
    //确认选择入区对象
    checkPeosonSure() {
      if (this.peosonCurrentItem && 'suspectName' in this.peosonCurrentItem) {
        this.getEntryApplication(this.peosonCurrentItem.applyIndexCode)
      } else {
        this.$message.error('请选择入区人员！')
      }
    },
    //获取选择入区人员详细信息
    async getEntryApplication(applyIndexCode) {
      const result = await server.getEntryApplication({ applyIndexCode })
      const { data } = result
      if (data.code === '0') {
        this.checkInDialogVisible = false
        let _data = data.data
        this.registerPhotoUrl = _data.suspectPhotoUrl
        this.ruleForm = {
          ...this.ruleForm,
          applyIndexCode: _data.applyIndexCode || '',
          registerName: _data.suspectName || '',
          registerSex: _data.sex || _data.sex === 0 ? _data.sex + '' : '',
          registerBirth: _data.birthday ? this.$moment(_data.birthday).format('YYYY-MM-DD') : '',
          idcardType: (_data.certificateType || '') + '',
          idcardNo: _data.certificateNo || '',
          registerAddr: _data.permanentAddress || '',
          registerPhoto: _data.suspectPhoto || '',
          telPhone: _data.telPhone || '',
          address: _data.currentAddress || '',
          usedName: _data.usedName || '',
          nationality: (_data.nationality || '') + '',
          nation: (_data.nation || '') + '',
          politicalStatus: (_data.political || '') + '',
          educationDegree: (_data.education || '') + '',
          workUnit: _data.workUnit || '',
          job: _data.job || '',
          congress:
            _data.npcMember === 0 || _data.npcMember === 1
              ? _data.npcMember + ''
              : '',
          caseIndexCode: _data.caseIndexCode || '',
          caseCause: _data.caseCause || '',
          caseIndexCodeLable: _data.caseIndexCode
            ? _data.caseName + '(' + _data.caseNo + ')'
            : '',
          personType:
            _data.suspectType || _data.suspectType === 0
              ? _data.suspectType + ''
              : '',
          policeSituationNo: _data.policeSituationNo,
          areaCode: _data.areaIndexCode || '',
          areaName: _data.areaName || '',
          deptCode: _data.deptIndexCode || '',
          deptName: _data.deptName || '',
          registerType: (_data.applyReason && _data.applyReason + '') || '',
          docNo: _data.docNo || '',
          hostPoliceIndexCode: _data.hostPoliceIndexCode || '',
          hostPolice: _data.hostPoliceName
            ? `${_data.hostPoliceName}(${_data.hostPoliceNo || '--'})`
            : '',
          hostPoliceData: {
            personName: _data.hostPoliceName || '',
            personIndexCode: _data.hostPoliceIndexCode || '',
            certificateNumber: _data.hostPoliceNo || '',
          },
          hostPoliceName: _data.hostPoliceName || '',
          auxiliaryPoliceIndexCode: _data.auxiliaryPoliceIndexCode || '',
          auxiliaryPolice: _data.auxiliaryPoliceName
            ? `${_data.auxiliaryPoliceName}(${_data.auxiliaryPoliceNo || '--'})`
            : '',
          auxiliaryPoliceData: {
            personName: _data.auxiliaryPoliceName || '',
            personIndexCode: _data.auxiliaryPoliceIndexCode || '',
            certificateNumber: _data.auxiliaryPoliceNo || '',
          },
          auxiliaryPoliceName: _data.auxiliaryPoliceName || '',
        }
      } else {
        this.$messagebox(result)
      }
    },
    // 入区人员列表每页展示数量改变
    peosonPageSizeChange(pageSize) {
      this.SearchForCheckIn = {
        ...this.SearchForCheckIn,
        pageSize: pageSize,
        pageNo: 1,
      }
      let searchType = '1'
      this.entryApplicaitionSearch(searchType)
    },
    // 入区人员列表页码改变
    peosonPageNoChange(pageNo) {
      this.SearchForCheckIn = { ...this.SearchForCheckIn, pageNo: pageNo }
      let searchType = '1'
      this.entryApplicaitionSearch(searchType)
    },
    // 选择入区人员change
    peosonCurrentChange(val) {
      this.peosonCurrentItem = val
    },
    // 选择入区对象列表查询
    async entryApplicaitionSearch(type) {
      let params = {
        ...this.SearchForCheckIn,
        order: this.order,
        areaIndexCodes: [this.ruleForm.areaCode],
        registerStatus: [1],
      }
      const result = await server.entryApplicaitionSearch(params)
      const { data } = result
      if (data.code === '0') {
        if (data.data.list.length) {
          this.checkInDialogVisible = true
          this.tableDataTemp = data.data.list
          if(type == '0') {
            this.$nextTick(() => {
              this.$refs.tableDataTemp.columns[11].order = ''
            })
          }
          this.peosonTotal = data.data.total
        } else {
          this.$message.warning('当前办案区无申请记录！')
        }
      } else {
        this.$messagebox(result)
      }
    },
    //按申请时间排序
    handleClickSort(column) {
      if (column.column) {
        column.order == 'ascending'
          ? (this.order = 'asc')
          : (this.order = 'desc')
        let searchType = '1'
        this.entryApplicaitionSearch(searchType)
      }
    },
    updateTemperatureValue() {
      this.$nextTick((_) => {
        if (!/^\d*$/.test(this.ruleForm.temperature)) {
          // 去除非数字的字符
          this.ruleForm.temperature = this.ruleForm.temperature.replace(
            /^\D*(\d*(?:\.\d{0,2})?).*$/g,
            '$1'
          )
        }
        this.ruleForm.temperature =
          this.ruleForm.temperature !== '' &&
          parseFloat(this.ruleForm.temperature) > 99.9
            ? 99.9
            : this.ruleForm.temperature
      })
    },
    selectable(row, index) {
      return true
    },
  },
  components: {
    PathDesc,
    StepStatueContent,
    SelectWithTree,
    ElMoreSelect,
    ElMorePersonSelect,
    ShuttleBox,
  },
}
</script>
<style lang="less" rel="stylesheet/less">
.register-add-edit-box {
  min-width: 1366px;
  height: 100%;
  overflow: hidden;
  color: #4d4d4d;
  box-sizing: border-box;
  position: relative;

  * {
    box-sizing: border-box;
  }

  .out-person-btn {
    position: absolute;
    right: 15px;
    top: 9px;
  }
  .check-in {
    position: absolute;
    right: 130px;
  }

  .person-pass-icon {
    position: absolute;
    width: 56px;
    height: 56px;
    font-size: 14px;
    text-align: center;
    border-radius: 56px;
    background: #3bcd8d;
    color: #ffffff;
    line-height: 56px;
    left: 100px;
    top: 60px;

    &.not-pass {
      background: #ff3d00;
    }

    &:after {
      content: '';
      width: 52px;
      height: 52px;
      position: absolute;
      left: 2px;
      top: 2px;
      border: solid 2px #ffffff;
      border-radius: 54px;
      box-sizing: border-box;
    }
  }

  .scroll-box {
    height: ~'calc(100% - 100px)';

    .form-title {
      font-size: 14px;
      padding-left: 12px;
      height: 48px;
      line-height: 40px;
      border-bottom: solid 1px #e6e6e6;
      border-top: solid 8px #f2f2f2;

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
      padding: 16px 0px 5px 0px;
      width: 100%;

      .el-col {
        box-sizing: border-box;
        .el-form-item {
          padding-left: 16px;
          box-sizing: border-box;
        }
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
    position: relative;
    text-align: right;
    padding-left: 150px;
    transition: all 0.3s;

    .person-photo-item {
      background: #fbfbfb;
      border: 1px dashed #b2b2b2;
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
        width: 70%;
        display: inline-block;
        padding: 11px 0;
        float: left;

        img {
          height: 170px;
          width: 124px;
        }

        .showphoto-img {
          width: 256px;
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
          content: '';
          display: block;
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

.showphoto-img {
}

.important-tag {
  position: absolute;
  top: 6px;
  right: -35px;
  width: 100px;
  height: 20px;
  transform: rotate(45deg);
  background: #fe6967;
  font-size: 14px;
  white-space: nowrap;
  text-align: center;
  color: #ffffff;
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

    .key-person {
    }
  }

  .selectresult {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}

.person-tag {
  display: inline-block;
  text-align: left;
  width: 100%;
  height: auto;
}

.person-tag-item {
  background: #fff4f4;
  border: 1px solid #ff7070;
  border-radius: 16px;
  font-size: 14px;
  color: #ff3232;
  letter-spacing: 0;
  text-align: center;
  padding: 5px 16px;
  max-width: 298px;
  display: inline-block;
  margin: 8px 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
    &:hover {
      &:after {
        content: '';
        display: block;
        width: 34px;
        height: 34px;
        position: absolute;
        right: -17px;
        top: -17px;
        border: 17px solid transparent;
        box-sizing: border-box;
        border-left: 17px solid #aeaeae;
        transform: rotate(-45deg);
      }

      &:before {
        content: '';
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
    &.active {
      &:after {
        content: '';
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
        content: '';
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
      width: ~'calc(100% - 120px)';
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
          width: ~'calc(100% - 72px)';
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
.checkInDialogVisible {
  .el-dialog {
    .el-dialog__body {
      height: 599px !important;
    }
  }
}
.status-icon {
  font-size: 14px !important;
}
</style>
