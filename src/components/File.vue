<template>
  <div class="mainContent">
    <el-button icon="h-icon-add" @click="onAddLine">添加</el-button>
    <i class="redStar">*</i>
    <el-table :data="fileList" style="width: 1080px;margin-top: 8px">
      <el-table-column prop="flieType" label="文书类型" width="320">
        <template slot-scope="scope">
          <SelectWithTree
            v-model="scope.row.fileTree"
            :tree-data="treeData"
            :default-props="defaultProps"
            node-key="code"
            clear
          >
          </SelectWithTree>
        </template>
      </el-table-column>
      <el-table-column prop="name" show-overflow-tooltip label="附件">
        <template slot-scope="scope">
          <div
            class="cell-item"
            v-for="(file, index) in scope.row.fileList"
            :key="file.indexCode"
          >
            <span class="operationBtn filesPhoto">
              <span @click="download(file)" :title="file.name">
                {{ file.name }}
                <!-- <img :src="imgFileUrl" alt="" /> -->
              </span>
              <i
                class="h-icon-tip_error filesDelete"
                title="删除"
                @click.stop="deleteFile(scope.$index, index)"
              >
              </i>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            icon="h-icon-capture"
            class="actionBtn"
            @click="openCatchPhoto(scope)"
          >
          </el-button>
          <el-upload
            class="actionBtn"
            action="/casehandlingmgt/ui/foundation/file/upload.do"
            :http-request="uploadFile"
            :before-upload="beforeUpload"
            :multiple="false"
            :show-file-list="false"
          >
            <el-button
              icon="h-icon-upload"
              @click="submitUpload(scope)"
            ></el-button>
          </el-upload>
          <el-button
            icon="h-icon-delete"
            @click="onDelete(scope.$index)"
            class="actionBtn"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="bigPicDialog"
      :area="[800, 600]"
      no-scrollbar
      class="big-pic-dialog"
      top="middle"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="big-pic-box">
        <img class="big-pic-item" :src="imgFileUrl" v-show="imgFileUrl" alt />
        <i class="pic-download h-icon-download" @click="downloadPic"></i>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import server from "../server/common";
import SelectWithTree from "./SelectWithTree";

export default {
  name: "File",
  mixins: [],
  props: {
    fileList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    tagCodes: {
      type: Array,
      default: () => {
        return [];
      }
    },
    isEdit: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  watch: {
    fileList(newV, oldV) {}
  },
  data() {
    return {
      bigPicDialog: false,
      imgFileUrl: "",
      defaultProps: {
        children: "detainConfigDocumentDTOS",
        label: "name",
        id: "code",
        selectable: data => {
          return data.parentId != 0;
        }
      },
      showArr: [],
      treeData: [],
      showTree: {},
      defaultExpandedKeys: [],
      subtype: "",
      csrfToken: "",
      bigPicSrc: "",
      photoType: "",
      currentHandle: -1,
      centerUrl: ""
    };
  },
  components: { SelectWithTree },
  methods: {
    // 获取文书类型
    async querySecTree() {
      const params = {
        tagCodes: this.tagCodes
      };
      const result = await server.querySecTree(params);
      const { data } = result;
      if (data.code === "0") {
        this.treeData = data.data || [];
      } else {
        this.$messagebox(result);
      }
    },
    // 添加一行
    onAddLine() {
      this.fileList.push({
        fileTree: null,
        fileList: []
      });
    },
    handleImg(type, picSrc, item) {
      this.bigPicSrc = picSrc;
      this.bigPicDialog = true;
      let list = item.name.split(".");
      let FileType = list[list.length - 1].toUpperCase();
      if (
        FileType === "JPG" ||
        FileType === "JPEG" ||
        FileType === "PNG" ||
        FileType === "BMP"
      ) {
        this.bigPicSrc = picSrc;
        this.bigPicDialog = true;
      } else {
        this.bigPicDialog = false;
        window.open(item.downloadUrl);
        this.bigPicSrc = "";
      }
    },
    async uploadFile(value, type) {
      let file = value.file;
      let formData = new FormData();
      formData.append("file", file);
      const result = await server.uploadFile(formData, {
        transformRequest: [
          function(data) {
            return data;
          }
        ],
        headers: {
          post: { "Content-Type": "multipart/form-data" },
          "X-CSRF-TOKEN": this.csrfToken
        }
      });
      const { data } = result;
      if (data.code === "0") {
        let list = this.fileList[this.currentHandle].fileList;
        if (list && list.length === 10) {
          this.$message("最多10个");
        } else {
          list.push(data.data);
          this.fileList[this.currentHandle].fileList = list;
        }
      } else {
        this.$messagebox(result);
      }
    },
    async getcsrfToken() {
      const result = await server.csrfToken();
      const { data } = result;
      if (data.code === "0") {
        this.csrfToken = data.data && data.data.token;
        // return callback()
      } else {
        this.$messagebox(result);
        // return callback()
      }
    },
    submitUpload(item) {
      this.currentHandle = item.$index;
    },
    beforeUpload(file) {
      let path = file.name;
      let type = path
        .substring(path.lastIndexOf("."), path.length)
        .toUpperCase();
      let isValidType = false;
      if (
        type === ".JPG" ||
        type === ".JPEG" ||
        type === ".DOCX" ||
        type === ".DOC" ||
        type === ".PDF" ||
        type === ".XLSX" ||
        type === ".XLS" ||
        type === ".PNG" ||
        type === ".BMP" ||
        type === ".RAR" ||
        type === ".ZIP"
      ) {
        isValidType = true;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;

      if (!isValidType) {
        this.$message.error("上传文件不符合要求，请重新上传!");
      }
      if (!isLt10M) {
        this.$message.error("单个上传文件大小不能超过 10MB!");
      }
      if (!(isValidType && isLt10M)) return false;
      return true;
    },
    deleteFile(index, _index) {
      this.fileList[index].fileList.splice(_index, 1);
    },
    async openCatchPhoto(scope) {
      if (this.socket && this.socket.readyState === 1) {
        const result = await server.getCameraCaptureInfo(); // {
        const { data } = result;
        if (data.code === "0") {
          this.photoType = 1;
          this.currentHandle = scope.$index;
          let _data = data.data;
          // {
          //   cameraType: "highMeter",
          //   componentId: "cluster",
          //   context: "casehandlingmgt/service/rs/v3/uploadPhoto",
          //   indexCode: null,
          //   language: "zh_CN",
          //   nginxIp: "10.19.141.116",
          //   nginxPort: 443,
          //   protocolType: "https",
          //   serviceType: "proxy",
          //   sg: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlzcyI6InhhdXRoLWF1dGhjIiwiZXhwIjoxNTkyMjA5MzgzLCJpYXQiOjE1OTIyMDIxODMsImp0aSI6IjNhYWYwMjA0ZmU1YTRjNzRhOTZiOThhZjFlZjU1MTgzIn0.JWlLPq9LB-0blzu647s6smBS-4SUgpETNocn7vqy30o"
          // }
          let faceMode = 0;
          _data.cameraType = "highMeter";
          // let jsonObj = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol:", "commentcmd":"btoolsprotocol://CenterUrl:${window.location.origin};toollist:PROT_imagecaptureprotocol;CmdLine:imagecaptureprotocol://language:${_data.language || 'zh_CN'};cameraType:${_data.cameraType};NginxIp:${_data.nginxIp};NginxPort:${_data.nginxPort};sg:${_data.sg};protocolType:${_data.protocolType};componentId:${_data.componentId};serviceType:${_data.serviceType};context:${_data.context};faceMode:${faceMode}"}}`
          let jsonObj = `{"comment":{"commenttype":"startapp", "context":"btoolsprotocol:", "commentcmd":"btoolsprotocol://CenterUrl:${
            this.centerUrl
          };toollist:PROT_imagecaptureprotocol;CmdLine:imagecaptureprotocol://language:${_data.language ||
            "zh_CN"};cameraType:highMeter;NginxIp:${_data.nginxIp};NginxPort:${
            _data.nginxPort
          };sg:${_data.sg};protocolType:${_data.protocolType};componentId:${
            _data.componentId
          };serviceType:${_data.serviceType};context:${
            _data.context
          };faceMode:${faceMode}${
            _data.indexCode ? ";indexCode:" + _data.indexCode : ""
          }"}}`;
          this.socket.send(jsonObj);
        } else {
          // this.$message.error('获取抓拍参数失败')
          this.$messagebox(result);
        }
      } else {
        this.connectSocket(this.openCatchPhoto, scope);
      }
    },
    // 抓拍数据处理
    catchPhotoDataCtrl(_data) {
      console.log("抓拍返回数据", _data);
      if (_data.indexCode && _data.name) {
        // 增加判断是否是拍照回来的数据
        if (this.photoType == 1) {
          let list = this.fileList[this.currentHandle].fileList;
          if (list && list.length === 10) {
            this.$message("最多10个");
          } else {
            list.push(_data);
            this.fileList[this.currentHandle].fileList = list;
          }
        }
      }
    },
    // 连接btools工具
    connectSocket(callback, scope) {
      let socketHost =
        window.location.protocol.indexOf("https") > -1
          ? "wss://127.0.0.1:18001/WebS_Js"
          : "ws://127.0.0.1:18000/WebS_Js";
      try {
        this.socket = new WebSocket(socketHost);
        this.socket.onopen = () => {
          // 发送检测插件助手是否安装请求
          let jsonObj =
            '{"comment":{"commenttype":"checkapp", "context":"btoolsprotocol"}}';
          this.socket.send(jsonObj);
        };
        this.socket.onerror = () => {
          // 连接失败，通信中间件未安装
          this.$message("检测到您未安装插件助手");
        };
        this.socket.onmessage = async data => {
          let _data = JSON.parse(data.data);
          console.log(_data);
          if (
            _data &&
            _data.comment &&
            _data.comment.commenttype === "checkapp"
          ) {
            // 检测插件助手是否安装
            if (_data.comment.resultCode === "1") {
              if (callback) {
                callback(scope);
              }
            } else {
              // this.socket = null
              this.$message("检测到您未安装插件助手");
            }
          } else {
            this.catchPhotoDataCtrl(_data);
            // this.signToolDataCtrl(_data)
          }
        };
        this.socket.onclose = () => {
          console.log(this.socket.readyState);
          this.socket = null;
        };
      } catch (err) {
        console.log(err);
      }
    },
    async getCenterUrl() {
      const result = await server.getCenterUrl();
      const { data } = result;
      if (data.code === "0") {
        if (data.data) {
          this.centerUrl = data.data;
        }
      } else {
        this.$messagebox(result);
      }
    },
    onDelete(index) {
      this.fileList.splice(index, 1);
    },
    async download(file) {
      if (file.downloadUrl) {
        let list = file.name.split(".");
        let FileType = list[list.length - 1].toUpperCase();
        if (
          FileType === "JPG" ||
          FileType === "JPEG" ||
          FileType === "PNG" ||
          FileType === "BMP"
        ) {
          this.imgFileUrl = file.downloadUrl;
          this.bigPicDialog = true;
        } else {
          window.open(file.downloadUrl);
        }
      } else {
        const result = await server.getDownloadUrl({
          indexCode: file.indexCode
        });
        const { data } = result;
        if (data.code === "0") {
          // window.open(data.data);
          // let blob = new Blob([data.data], { type: "image/png" });
          // let url = window.URL.createObjectURL(blob);
          let list = file.name.split(".");
          let FileType = list[list.length - 1].toUpperCase();
          if (
            FileType === "JPG" ||
            FileType === "JPEG" ||
            FileType === "PNG" ||
            FileType === "BMP"
          ) {
            this.imgFileUrl = data.data;
            this.bigPicDialog = true;
          } else {
            window.open(data.data);
          }

          // console.log(this.imgFileUrl);
          // this.imgFileUrl = data.data;
        } else {
          this.$messagebox(result);
        }
      }
    },
    downloadPic() {
      window.open(this.imgFileUrl);
    }
  },
  mounted() {
    this.querySecTree();
    this.getCenterUrl();
    this.getcsrfToken();
  }
};
</script>

<style lang="less" rel="stylesheet/less">
.mainContent {
  width: 1080px;
  margin-top: 26px;
  position: relative;
  .redStar {
    color: red;
    position: absolute;
    top: 50px;
    left: 75px;
    z-index: 2;
  }
  .actionBtn {
    float: left;
  }
  .cell-item {
    width: 100%;
    height: 32px;
    line-height: 32px;
    > .filesPhoto {
      max-width: 100%;
      height: 32px;
      line-height: 32px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      position: relative;
      padding-right: 32px;
      box-sizing: border-box;
      display: inline-block;
      color: #2196f3;
      > span {
        cursor: pointer;
        &:hover {
          color: #2080f7;
          text-decoration: underline;
        }
      }
      > .filesDelete {
        position: absolute;
        right: 0;
        top: 6px;
        font-size: 24px;
        cursor: pointer;
        color: #c0c0c0;
      }
    }
  }
}
</style>
