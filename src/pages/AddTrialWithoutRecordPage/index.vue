<template>
  <watermarkContent>
    <div class="AddTrialWithoutRecordPage">
      <div class="header breadcrumb">
        <!-- <el-breadcrumb separator="/">
        <el-button type="iconButton"
                   icon="h-icon-arrow_left"
                   @click="goback"></el-button>
        <el-breadcrumb-item>本地审讯</el-breadcrumb-item>
        <template v-if="id && !addInterrogation">
          <el-breadcrumb-item>编辑审讯</el-breadcrumb-item>
        </template>
        <template v-else>
          <el-breadcrumb-item>添加审讯</el-breadcrumb-item>
        </template>
      </el-breadcrumb> -->
        <PathDesc
          :path-desc-arr="[
            '本地审讯',
            `${id && !addInterrogation ? '编辑' : '添加'}审讯`,
          ]"
          :is-back="true"
        ></PathDesc>
        <div class="subhead">当前房间：{{ roomName }}</div>
      </div>
      <div class="main">
        <el-scrollbar
          wrap-class="el-scrollbar__wrap"
          view-class="el-scrollbar__view"
        >
          <AddTrial />
        </el-scrollbar>
      </div>
    </div>
  </watermarkContent>
</template>
<script>
import AddTrial from '../AddTrialPage/index'
import PathDesc from '../../components/PathDesc'

export default {
  name: 'AddTrialWithoutRecordPage',
  data() {
    return {
      id: '',
      roomName: '',
      roomCode: '',
      addInterrogation: false,
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this.addInterrogation =
      this.$route.query.addInterrogation == 'false'
        ? false
        : this.$route.query.addInterrogation == 'true'
        ? true
        : ''
    this.roomName = this.$route.query.roomName
    this.roomCode = this.$route.query.roomCode
  },
  methods: {
    goback() {
      this.$router.push({ path: '/' })
    },
  },
  components: {
    AddTrial,
    PathDesc,
  },
}
</script>
<style lang="less" rel="stylesheet/less">
.AddTrialWithoutRecordPage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    height: 74px;
    box-shadow: inset 0 -1px 0 0 #e5e5e5;
    box-sizing: border-box;
  }

  .breadcrumb {
    // padding: 14px 16px;
  }

  .main {
    flex: 1;
  }

  .el-scrollbar__wrap {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
