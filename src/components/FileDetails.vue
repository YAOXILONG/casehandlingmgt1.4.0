<template>
  <div class="fileBoxTable">
    <el-table
      :data="fileList"
      style="width: 1080px"
      :highlight-current-row="false"
    >
      <el-table-column prop="documentName" label="文书类型" width="320">
      </el-table-column>
      <el-table-column prop="name" label="附件" width="760">
        <template slot-scope="scope">
          <div
            class="showFile"
            v-for="file in scope.row.fileInfos"
            :title="file.name"
            @click="download(file)"
            :key="file.indexCode"
          >
            {{ file.name }}
          </div>
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
export default {
  name: "FileDetails",
  props: {
    fileList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      tableData: [],
      bigPicDialog: false,
      imgFileUrl: ""
    };
  },
  methods: {
    async download(file) {
      // if (file.downloadUrl) {
      //   window.open(file.downloadUrl);
      // } else {
      //   const result = await server.getDownloadUrl({
      //     indexCode: file.indexCode
      //   });
      //   const { data } = result;
      //   if (data.code === "0") {
      //     window.open(data.data);
      //   } else {
      //     this.$messagebox(result);
      //   }
      // }

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
  }
};
</script>

<style lang="less" rel="stylesheet/less">
.fileBoxTable {
  width: 1080px;
  margin-top: 26px;
  .showFile {
    font-size: 14px;
    color: #2196f3;
    letter-spacing: 0;
    line-height: 20px;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    &:hover {
      color: #2080f7;
      text-decoration: underline;
    }
  }
  .el-table_1_column_2 {
    padding: 16px 0;
  }
}
</style>
