<template>
  <div class="inOutApkList">
    <div class="btnTool">
      <el-button
        type="iconButton"
        icon="h-icon-upload"
        @click="showUploadDialog('uploadForm')"
      >
        上传
      </el-button>
      <el-button type="iconButton" icon="h-icon-delete" @click="deleteMore('')">
        批量删除
      </el-button>
      <el-button
        type="iconButton"
        icon="h-icon-filter"
        style="float: right"
        @click="onShowSearch"
        title="过滤"
        :class="showSearch ? 'active' : ''"
      >
      </el-button>
    </div>
    <div class="searchTeamBar" v-if="showSearch">
      <el-form :model="searchForm" label-width="120px" label-position="top">
        <el-row>
          <el-col :span="6">
            <el-form-item label="组件版本号">
              <el-input v-model="searchForm.version" placeholder="请输入">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="上传时间">
              <el-date-picker
                v-model="uploadTime"
                type="datetimerange"
                placeholder="选择日期范围"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="searchBtn">
            <el-button type="primary" class="btn96" @click="searchHandle">
              查询
            </el-button>
            <el-button @click="searcResethHandle" class="btn96">
              重置
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div
      class="tableWrap"
      :style="{ height: 'calc(100% - ' + topHeight + 'px)' }"
    >
      <el-table
        ref="multipleTable"
        :data="tableData"
        force-scroll
        style="width: 100%"
        class="noborder"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"> </el-table-column>
        <el-table-column type="index" label="编号" width="55">
        </el-table-column>
        <el-table-column prop="fileName" show-overflow-title label="名称">
        </el-table-column>
        <el-table-column prop="size" show-overflow-title label="大小">
          <template slot-scope="scope">
            {{ scope.row.size + 'MB' }}
          </template>
        </el-table-column>
        <el-table-column prop="version" show-overflow-title label="组件版本号">
        </el-table-column>
        <el-table-column
          prop="upgradeVersionCode"
          show-overflow-title
          label="内部版本号"
        >
        </el-table-column>
        <el-table-column prop="remark" show-overflow-title label="版本说明">
        </el-table-column>
        <el-table-column prop="uploadTime" show-overflow-title label="上传时间">
          <template slot-scope="scope">
            <span>
              {{
                scope.row.uploadTime &&
                $moment(scope.row.uploadTime).format('YYYY-MM-DD HH:mm:ss')
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="iconButton"
              size="mini"
              icon="h-icon-delete"
              @click="del(scope.row.fileIndexCode)"
            />
            <el-button
              type="iconButton"
              size="mini"
              icon="h-icon-download"
              @click="download(scope.row.fileIndexCode)"
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        slot="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.pageNo"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="searchForm.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>
    <el-dialog
      title="安装包上传"
      :visible.sync="dialogFormVisible"
      v-loading="loading"
      :before-close="beforeClose"
    >
      <div>
        {{ '请将安装包按照如下规则命名：组件名称_版本号.apk。例如：' + text }}
        <!--        请将安装包按照如下规则命名：组件名称_版本号.apk。例如：araphone_1.0.000220210305141400.apk-->
      </div>
      <el-form
        :model="uploadForm"
        label-position="top"
        :rules="rules"
        ref="uploadForm"
      >
        <el-form-item label="上传安装包(apk)" required>
          <el-upload
            class="my-upload-drag"
            drag
            action="/detainmgt-web/accompany/package/upload.do"
            :http-request="apkUpload"
            :before-upload="beforeUpload"
            :multiple="false"
            :show-file-list="true"
            :file-list="fileList"
            :on-change="uploadChangeHandle"
          >
            <!-- <img src="default_upload.svg"> -->
            <i class="h-icon-upload"></i>
            <div class="upload-drag-title">将文件拖到此处，或点击上传</div>
            <div class="upload-drag-text">
              仅支持上传apk文件，且一次只能上传一个文件，单个上传文件大小不能超过200MB
            </div>
            <!-- <div class="upload-drag-text">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</div> -->
          </el-upload>
        </el-form-item>
        <el-form-item label="版本说明">
          <el-input
            class=""
            type="textarea"
            :rows="4"
            resize
            placeholder="请输入"
            v-model="uploadForm.remark"
            :maxlength="200"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="apkUploadSure"> 确 定 </el-button>
        <el-button @click="beforeClose"> 取 消 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import server from '../../server/terminalApplicationManage'
export default {
  name: 'InOutApkList',
  props: {
    fileType: {
      type: String,
      default: () => {
        return 1
      },
    },
    activeShow: {
      type: Boolean,
      default: () => {
        return true
      },
    },
  },
  data() {
    return {
      labelPosition: 'top',
      loading: false,
      uploadTime: '',
      multipleSelection: [], // 选中table项
      isFilterBox: false,
      tableHeight: 600,
      // 列表查询form
      searchForm: {
        version: '',
        fileType: this.fileType,
        startTime: '',
        endTime: '',
        pageNo: 1,
        pageSize: 20,
      },
      // 列表数据
      tableData: [],
      total: 0,
      csrfToken: '',
      uploadForm: {
        remark: '',
      },
      dialogFormVisible: false,
      formData: null,
      fileList: [],
      showSearch: false,
      topHeight: 92,
      text: '',
      rules: {},
    }
  },
  mounted() {
    this.getcsrfToken()
    this.pageQuery()
  },
  watch: {
    // fileType (val) {
    //   this.searcResethHandle()
    //   // this.pageQuery()
    // },
    fileType: {
      handler: function (newV, oldV) {
        // console.log('newV', newV)
        if (newV) {
          this.searcResethHandle()
        }
        this.text = `${newV}_1.0.000220210305141400.apk`
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onShowSearch() {
      this.showSearch = !this.showSearch
      if (this.showSearch) {
        this.topHeight = 180
      } else {
        this.topHeight = 92
      }
    },
    beforeClose() {
      this.dialogFormVisible = false
      // this.$refs["uploadForm"].resetFields();
      this.uploadForm = {
        remark: '',
      }
      this.$refs['uploadForm'].resetValidates()
      this.$nextTick(() => {})
    },
    showUploadDialog(formName) {
      this.$refs['uploadForm'] && this.$refs['uploadForm'].resetValidates()
      this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs["uploadForm"].resetValidates();
      // });
      this.fileList = []
      this.formData = null
    },
    async getcsrfToken() {
      const result = await server.csrfToken()
      const { data } = result
      if (data.code === '0') {
        this.csrfToken = data.data && data.data.token
        // return callback()
      } else {
        this.$messagebox(result)
        // return callback()
      }
    },
    uploadChangeHandle(file, fileList) {
      this.fileList = [fileList[fileList.length - 1]]
    },
    async apkUpload(value, type) {
      // console.log('apkUpload')
      let file = value.file
      let formData = new FormData()
      formData.append('packageFile', file)
      formData.append('fileType', this.fileType)
      this.formData = formData
    },
    // 确定
    async apkUploadSure() {
      this.$refs['uploadForm'].validate(async (valid) => {
        if (valid) {
          if (this.fileList.length < 1 || !this.formData) {
            this.$message.error('请上传安装包')
            return false
          }
          this.formData.append('remark', this.uploadForm.remark)
          this.loading = true
          console.log('this.formData', this.formData)
          const result = await server.upload(this.formData, {
            transformRequest: [
              function (data) {
                return data
              },
            ],
            headers: {
              post: { 'Content-Type': 'multipart/form-data' },
              'X-CSRF-TOKEN': this.csrfToken,
            },
          })
          const { data } = result
          if (data.code === '0') {
            this.loading = false
            this.fileList = []
            this.beforeClose()
            this.searchHandle()
            // let list = this.fileList[this.currentHandle].fileList
            // if (list && list.length === 10) {
            //   this.$message('最多10个')
            // } else {
            //   list.push(data.data)
            //   this.fileList[this.currentHandle].fileList = list
            // }
          } else {
            this.$messagebox(result)
            this.loading = false
          }
        }
      })
    },
    beforeUpload(file) {
      // console.log('beforeUpload')
      let path = file.name
      // console.log('path', path)
      // let isWatchTerminal = false
      // let isSurveillanceTerminal = false
      // let aa = path.substring(0, 8)
      // console.log('aa', aa)
      // if (this.fileType === 'screen.watchTerminal' && aa === 'araphone') {
      //   isWatchTerminal = true
      // }
      // if (this.fileType === 'screen.surveillanceTerminal' && aa === 'asaphone') {
      //   isSurveillanceTerminal = true
      // }
      // if (this.fileType === 'screen.watchTerminal' && !isWatchTerminal) {
      //   this.fileList = []
      //   this.$message.error('室内只能上传araphone格式')
      //   return false
      // }
      // if (this.fileType === 'screen.surveillanceTerminal' && !isSurveillanceTerminal) {
      //   this.fileList = []
      //   this.$message.error('室外只能上传asaphone格式')
      //   return false
      // }
      let type = path
        .substring(path.lastIndexOf('.'), path.length)
        .toUpperCase()
      let isValidType = false
      if (type === '.APK') {
        isValidType = true
      }
      const isLt10M = file.size / 1024 / 1024 < 100
      if (!isValidType) {
        this.$message.error('上传文件不符合要求，请重新上传!')
      }
      if (!isLt10M) {
        this.$message.error('单个上传文件大小不能超过200MB!')
      }
      if (!(isValidType && isLt10M)) {
        this.fileList = []
        return false
      }
      return true
    },
    uploadSuccess() {},
    // 条件查询
    searchHandle() {
      console.log(this.uploadTime)
      const startTime =
        this.uploadTime &&
        this.$moment(this.uploadTime[0]).format('YYYY-MM-DD HH:mm:ss')
      const endTime =
        this.uploadTime &&
        this.$moment(this.uploadTime[1]).format('YYYY-MM-DD HH:mm:ss')
      this.searchForm = { ...this.searchForm, pageNo: 1, startTime, endTime }
      this.pageQuery()
    },
    // 条件重置
    searcResethHandle() {
      this.searchForm = {
        ...this.searchForm,
        pageNo: 1,
        version: '',
        startTime: '',
        endTime: '',
        fileType: this.fileType,
      }
      this.uploadTime = ''
      this.pageQuery()
    },
    // 页码改变回调
    handleCurrentChange(pageNo) {
      this.searchForm = { ...this.searchForm, pageNo }
      this.pageQuery()
    },
    // 每页条数改变回调
    handleSizeChange(pageSize) {
      this.searchForm = { ...this.searchForm, pageSize }
      this.pageNo = 1
      this.pageQuery()
    },
    // 筛选条件展示或隐藏
    // filterBoxChangeHandle () {
    //   this.isFilterBox = !this.isFilterBox
    //   this.$nextTick(() => {
    //     this.searchBoxAutoHeight()
    //   })
    // },
    // 查询列表数据
    async pageQuery() {
      let param = this.searchForm
      console.log('param', param)

      const result = await server.pageQuery(param)
      const { data } = result
      if (data.code === '0') {
        this.tableData = data.data.list
        this.total = data.data.total
      } else {
        this.$message.error(data.code)
        // this.$message.error(this.$t(data.code))
      }
    },
    // 删除节点
    del(fileIndexCode) {
      this.$confirm('确定删除此安装包吗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'question',
      })
        .then(async () => {
          const result = await server.delete({
            fileIndexCodes: [fileIndexCode],
          })
          const { data } = result
          if (data.code === '0') {
            this.$message.success('删除成功')
            this.searchHandle()
          } else {
            this.$message.error(data.code)
            // this.$message.error(this.$t(data.code))
          }
        })
        .catch(() => {})
    },
    deleteMore() {
      // console.log(this.multipleSelection)
      if (!this.multipleSelection || this.multipleSelection.length < 1) {
        return this.$message('请选择需要删除的安装包')
      }
      const fileIndexCodes = this.multipleSelection.map((item) => {
        return item.fileIndexCode
      })
      this.$confirm('确定批量删除选中的安装包吗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'question',
      })
        .then(async () => {
          const result = await server.delete({
            fileIndexCodes: fileIndexCodes,
          })
          const { data } = result
          if (data.code === '0') {
            this.$message.success('删除成功')
            this.searchHandle()
          } else {
            this.$message.error(data.code)
            // this.$message.error(this.$t(data.code))
          }
        })
        .catch(() => {})
    },
    // table勾选变化
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 下载安装包
    async download(fileIndexCode) {
      let downloadUrl = `/casehandlingmgt/accompany/package/download.do?fileIndexCode=${fileIndexCode}`
      // let downloadUrl = `http://10.16.68.21:8384/detainmgt-web/accompany/package/download.do?fileIndexCode=${fileIndexCode}`
      const result = await server.checkPackageExist({
        fileIndexCode: fileIndexCode,
      })
      const { data } = result
      if (data.code === '0') {
        console.log(data)
        window.open(downloadUrl)
      } else {
        this.$message.error(this.$t(data.code))
        // this.$message.error(this.$t(data.code))
      }
    },
    // 筛选查询条件区域自适应
    // searchBoxAutoHeight () {
    //   let searchBox = document.getElementById('search_box')
    //   let tableBox = document.getElementById('table_box')
    //   let width = searchBox.offsetWidth
    //   let colNumber = Math.floor(width / 330)
    //   this.$nextTick(() => {
    //     let searchItemArr = document.getElementsByClassName('search-item')
    //     for (let i = 0; i < searchItemArr.length; i++) {
    //       searchItemArr[i].style.width = `${100 / colNumber}%`
    //     }
    //     this.filterBoxHeight = searchBox.offsetHeight
    //     tableBox.style.height = `calc(100% - ${(this.filterBoxHeight &&
    //       this.filterBoxHeight + 10) + 96}px)`
    //   })
    // }
  },
}
</script>
<style lang="less" rel="stylesheet/less">
.inOutApkList {
  width: 100%;
  height: 100%;
  padding: 12px;
  padding-bottom: 0;
  box-sizing: border-box;
}
.in-out-apk-list {
  .my-upload {
    display: inline-block;
  }
}
.btnTool {
  height: 36px;
  padding-bottom: 4px;
  box-sizing: border-box;
  .active {
    background: #e0e0e0;
  }
}
.searchTeamBar {
  height: 88px;
  padding: 12px 12px 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  background: #f5f5f5;
  .el-date-editor--datetimerange.el-input {
    width: 100%;
  }
  .el-form-item {
    padding-right: 30px;
    margin-bottom: 12px;
  }
  .el-checkbox-group {
    vertical-align: top;
    margin-left: 16px;
  }
  .searchBtn {
    margin-top: 28px;
    text-align: right;
  }
}
.tableWrap {
  height: ~'calc(100% - 97px)';
  padding: 8px 0 0;
  box-sizing: border-box;
  .el-table {
    height: 100%;
  }
  .el-table.noborder {
    border: none;
    &:after {
      background: transparent;
    }
  }
}
.my-upload-drag {
  width: 100%;
  .el-upload {
    width: 100%;
  }
  .el-upload-dragger {
    width: 100%;
    .h-icon-upload {
      margin: 0px 0px;
    }
  }
  .upload-drag-title {
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.7);
  }
  .upload-drag-text {
    color: rgba(0, 0, 0, 0.4);
  }
}
</style>
