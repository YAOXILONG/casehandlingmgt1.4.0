<template>
  <watermarkContent>
    <div class="elerecordpage" v-loading="loading">
      <div class="search_box">
        <el-form
          ref="form"
          :model="form"
          grid-layout
          :label-grid="labelGrid"
          :content-grid="contentGrid"
        >
          <el-form-item label="办案区">
            <el-select v-model="form.areaIndexCodes" placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option
                v-for="item in areaOptions"
                :key="item.areaIndexCode"
                :label="item.areaName"
                :value="item.areaIndexCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房间状态">
            <el-select v-model="form.status" clear placeholder="请选择">
              <el-option label="全部" value></el-option>
              <el-option label="审讯中" :value="2"></el-option>
              <el-option label="空闲" :value="0"></el-option>
              <el-option label="已分配" :value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房间名称">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item class="form-btns">
            <el-button type="primary" @click="onSubmit"> 查询 </el-button>
            <el-button class="btn_padding" @click="onReset"> 重置 </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="content_box">
        <div class="roomlist_con" v-if="roomList.length">
          <el-scrollbar
            wrap-class="el-scrollbar__wrap"
            view-class="el-scrollbar__view"
          >
            <template v-for="item in roomList">
              <div class="room_item" :key="item.roomInfo.roomIndexCode">
                <img
                  v-if="!item.roomInfo.pic"
                  class="room_img"
                  :src="roomDefault"
                  alt="img"
                />
                <img
                  v-else
                  class="room_img"
                  :src="item.roomInfo.pic"
                  alt="img"
                />
                <div class="room_img_mask">
                  <template v-if="item.interrogationInfo">
                    <div
                      class="room_capacity"
                      v-if="item.cds && item.cds.length"
                    >
                      <template v-for="cd in item.cds">
                        <div class="room_capacity_item" :key="cd.id">
                          <i class="icon-cd"></i>
                          <div class="room_capacity_per">
                            <div
                              class="room_capacity_per_value"
                              :style="{
                                width:
                                  cd.totalSpace === 0
                                    ? '0'
                                    : (cd.usedSpace / cd.totalSpace) * 100 +
                                      '%',
                              }"
                            ></div>
                          </div>
                          <div class="room_capacity_count">
                            {{ cd.usedSpace }}MB |{{ cd.totalSpace }}MB
                          </div>
                        </div>
                      </template>
                    </div>
                    <div class="room_capacity" v-else>
                      <div class="room_capacity_item">
                        <div class="room_capacity_count">
                          {{ messageType[item.messageType] }}
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
                <div class="room_info">
                  <div class="room_name">
                    <img
                      class="img-home"
                      :src="item.roomInfo.status === 0 ? free : use"
                    />
                    <span class="room_name_value" :title="item.roomInfo.name">{{
                      item.roomInfo.name
                    }}</span>
                  </div>
                  <div class="room_status">
                    <template v-if="item.roomInfo.status === 0">
                      <div class="free">空闲</div>
                    </template>
                    <template v-if="item.roomInfo.status === 2">
                      <div class="working">
                        <span class="working_text">
                          <template
                            v-if="
                              item.interrogationInfo &&
                              item.interrogationInfo.model === 1
                            "
                          >
                            提讯中
                          </template>
                          <template v-else>审讯中</template>
                        </span>
                        <Time
                          class="working_time"
                          :input="item.interrogationInfo.startTime"
                          :sys-time="sysTime"
                        ></Time>
                      </div>
                    </template>
                    <template v-if="item.roomInfo.status === 4">
                      <div class="allocated">已分配</div>
                    </template>
                  </div>
                  <template
                    v-if="
                      item.operateAuth &&
                      item.interrogationInfo &&
                      item.interrogationInfo.suspectCode
                    "
                  >
                    <div class="room_case_object">
                      <span class="room_case_label">审讯对象：</span>
                      <span
                        class="room_case_value"
                        :title="item.interrogationInfo.suspectName"
                        >{{ item.interrogationInfo.suspectName }}</span
                      >
                    </div>
                    <div class="room_case_name">
                      <span class="room_case_label">案件名称：</span>
                      <span
                        class="room_case_value"
                        :title="item.interrogationInfo.caseName"
                        >{{ item.interrogationInfo.caseName }}</span
                      >
                    </div>
                    <div class="room_case_person">
                      <span class="room_case_label">办案人员：</span>
                      <span
                        class="room_case_value"
                        :title="
                          getString(
                            item.interrogationInfo.interrogationHandlers
                          )
                        "
                        >{{
                          getString(
                            item.interrogationInfo.interrogationHandlers
                          )
                        }}</span
                      >
                    </div>
                  </template>
                  <template v-else-if="item.operateAuth">
                    <div class="room_info empty">暂无审讯信息</div>
                  </template>
                  <template v-else>
                    <div class="room_info empty">无权限</div>
                  </template>
                </div>
                <template
                  v-if="
                    item.interrogationInfo && item.interrogationInfo.model === 1
                  "
                >
                  <div class="room_action model">正在远程提讯...</div>
                </template>
                <template v-else>
                  <WithoutRecord
                    @endTrial="endTrial"
                    :room-data="item"
                    :cuser-name="cusername"
                    v-if="type === 1"
                  />
                  <WithRecord
                    @endTrial="endTrial"
                    :room-data="item"
                    :cuser-name="cusername"
                    v-else-if="type === 0"
                  />
                </template>
              </div>
            </template>
          </el-scrollbar>
        </div>
        <div class="roomlist_con empty" v-else>
          <div class="empty_con">
            <img src="../../assets/image/default_empty_l.png" alt />
            <div>暂无数据</div>
          </div>
        </div>
      </div>
      <div class="pagination_box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        ></el-pagination>
      </div>
    </div>
  </watermarkContent>
</template>
<script>
import server from '../../server/elerecord'
import WithRecord from './ActionList/withrecord'
import WithoutRecord from './ActionList/withoutrecord'
import Time from '../../components/time'
import socket from '../../mixin/usefulSocket'
import free from '../../assets/image/icon-house1.png'
import use from '../../assets/image/icon-house2.png'
import roomDefault from '../../assets/image/roomDefault.png'

export default {
  name: 'EleRecordPage',
  data() {
    return {
      free,
      use,
      roomDefault,
      currentTime: 0,
      loading: false,
      areaOptions: [],
      roomList: [],
      roomIndexCodeList: [],
      interrogationCodeList: [],
      form: {
        areaIndexCodes: '',
        status: '',
        name: '',
      },
      labelGrid: {
        xl: 8,
        lg: 8,
        md: 8,
        sm: 8,
        xs: 8,
      },
      contentGrid: {
        xl: 16,
        lg: 16,
        md: 16,
        sm: 16,
        xs: 16,
      },
      pagination: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
      },
      messageType: {
        progress: '刻录中',
        close: '刻录关闭',
        cancel: '取消刻录',
        exception: '刻录异常',
      },
      sysTime: 0,
      searchForm: {},
      cusername: ''
    }
  },
  props: {
    type: {
      type: null,
      default() {
        return 0
      },
    },
  },
  mounted() {
    this.getCurrentTime()
    this.findArea()
    this.getBiluConfigFuc()
  },
  activated() {
    this.pageRoom()
  },
  components: {
    WithRecord,
    WithoutRecord,
    Time,
  },
  mixins: [socket],
  methods: {
    async messageHandle(msg) {
      if (msg.type === 'authorize') {
        this.pageRoom()
        return
      }
     
      if (
        msg.roomInfo &&
        this.roomIndexCodeList.includes(msg.roomInfo.roomIndexCode)
      ) {
        const result = await server.getWebSocketRoomInterrogation({roomIndexCode:msg.roomInfo.roomIndexCode})
        const {data} = result
        let index = this.roomIndexCodeList.indexOf(msg.roomInfo.roomIndexCode)
        this.roomList.splice(index, 1, { ...this.roomList[index], ...data })
      }

      if (
        (msg.cds || msg.messageType) &&
        this.roomIndexCodeList.includes(msg.roomCode)
      ) {
        let index = this.roomIndexCodeList.indexOf(msg.roomCode)
        this.roomList.splice(index, 1, {
          ...this.roomList[index],
          cds: msg.cds,
          messageType: msg.messageType,
        })
      }
    },
    endTrial() {
      this.pageRoom()
    },
    getCurrentTime() {
      this.currentTime = this.currentTime + 1
      this.sysTime = this.sysTime + 1000
      if (!(this.currentTime % 60)) {
        this.systemTime()
      }
      setTimeout(() => {
        this.getCurrentTime()
      }, 1000)
    },
    async systemTime() {
      this.currentTime = 0
      const res = await server.systemTime()
      const { data } = res
      if (data.code === '0') {
        this.sysTime = data.data.time
      } else {
        this.sysTime = new Date().getTime()
        this.$messagebox(res)
        // this.$message.error(this.$t(data.code))
      }
    },
    async findArea() {
      const res = await server.findAuthUserPlaceList()
      const { data } = res
      if (data.code === '0') {
        if (data.data && data.data.list) this.areaOptions = data.data.list
      } else {
        // this.$message.error(this.$t(data.code))
        this.$messagebox(res)
      }
    },
    setSearchForm() {
      this.pagination.currentPage = 1
      this.searchForm = {
        ...this.form,
      }
    },
    async pageRoom() {
      const params = {
        ...this.searchForm,
        pageNo: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
      }
      this.loading = true
      const res = await server.pageRoom(params)
      const { data } = res
      if (data.code === '0') {
        this.systemTime()
        this.roomList = data.data.list
        this.roomIndexCodeList = this.roomList.map(
          (v) => v.roomInfo.roomIndexCode
        )
        this.interrogationCodeList = this.roomList.map(
          (v) => v.interrogationInfo && v.interrogationInfo.indexCode
        )
        this.getBurnProgressList(this.interrogationCodeList)
        this.pagination.total = data.data.total
      } else {
        // this.$message.error(this.$t(data.code))
        this.$messagebox(res)
      }
      this.loading = false
    },
    //获取慧眼笔录对接配置
    async getBiluConfigFuc() {
      const result = await server.getBiluConfig();
      const { data } = result;
      if(data.code == '0') {
        if(data.data) {
           this.cusername = data.data.cUserName
        }
      }else {
        this.$messagebox(result)
      }
    },
    async getBurnProgressList(interrogationCodeList) {
      const indexCodes = interrogationCodeList.filter((v) => v).join(',')
      if (!indexCodes) return
      const params = {
        indexCodes,
      }
      this.loading = true
      const res = await server.getBurnProgressList(params)
      const { data } = res
      if (data.code === '0') {
        if (data.data) {
          data.data.forEach((v) => {
            const _index = this.interrogationCodeList.indexOf(
              v.interrogationCode
            )
            this.roomList.splice(_index, 1, {
              ...this.roomList[_index],
              cds: v.cds,
            })
          })
        }
      } else {
        // this.$message.error(this.$t(data.code))
        this.$messagebox(res)
      }
    },
    getString(list) {
      if (list && list.length) {
        let _list = []
        list.map((v) => {
          let val = v.personName
          if (_list.indexOf(val) === -1) {
            _list.push(val)
          }
        })
        return _list.join(',')
      } else {
        return ''
      }
    },
    onSubmit() {
      this.setSearchForm()
      this.pageRoom()
    },
    onReset() {
      this.pagination.pageSize = 20
      this.form.areaIndexCodes = ''
      this.form.status = ''
      this.form.name = ''
      this.$nextTick(() => {
        this.setSearchForm()
        this.pageRoom()
      })
    },
    handleSizeChange(val) {
      this.pagination.pageSize = val
      this.pagination.currentPage = 1
      this.pageRoom()
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val
      this.pageRoom()
    },
  },
}
</script>
<style lang="less" rel="stylesheet/less">
.elerecordpage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .pagination_box {
    height: 48px;
    padding: 0 16px;
    border-top: 1px solid #e6e6e6;
    overflow: hidden;
  }

  .el-scrollbar__wrap {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 8px;
    box-sizing: border-box;
  }

  .search_box {
    height: 48px;
    box-shadow: inset 0 -1px 0 0 #e5e5e5;

    .el-form {
      display: flex;
      padding: 8px 0;
    }

    .el-form-item {
      flex: 1;
      margin-bottom: 0;
    }

    .form-btns {
      text-align: right;
      box-sizing: border-box;

      button {
        width: 96px;
      }
    }

    .btn_padding {
      margin-right: 16px;
    }

    .el-form-item__content {
      white-space: nowrap;
    }
  }

  .content_box {
    flex: 1;
    border: 8px solid #f2f2f2;
    border-bottom: 0;
  }

  .roomlist_con {
    font-size: 0;
    height: 100%;
    width: 100%;

    &.empty {
      display: flex;

      .empty_con {
        margin: auto;
        width: 240px;
        height: 200px;

        img {
          width: 240px;
        }

        div {
          color: #ccc;
          text-align: center;
          height: 20px;
          line-height: 20px;
          font-size: 14px;
        }
      }
    }
  }

  .room_item {
    width: 361px;
    height: 380px;
    display: inline-block;
    margin: 8px;
    box-sizing: border-box;
    border-radius: 4px;
    background: #f9f9f9;
    overflow: hidden;
    position: relative;
  }

  .room_img_default {
    padding: 75px 150px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  .room_img {
    width: 362px;
    height: 204px;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  .room_img_mask {
    z-index: 2;
    position: relative;
    width: 362px;
    height: 204px;
    opacity: 0.5;
    background-image: linear-gradient(
      -180deg,
      rgba(0, 0, 0, 0) 60%,
      rgba(0, 0, 0, 0.57) 100%
    );
    border-radius: 4px 4px 0 0;
  }

  .room_remote {
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 14px;
    color: #fff;
    height: 32px;
    line-height: 32px;
    max-width: 50%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    i {
      font-size: 16px;
      padding: 8px;
    }
  }

  .room_remote_name {
    vertical-align: top;
    height: 32px;
    line-height: 28px;
  }

  .room_capacity {
    position: absolute;
    bottom: 8px;
    left: 8px;
    width: 120px;
  }

  .room_capacity_item {
    width: 120px;
    height: 20px;
    white-space: nowrap;
    color: #fff;
    font-size: 14px;

    i {
      font-size: 20px;
    }
  }

  .room_capacity_per {
    position: relative;
    vertical-align: top;
    display: inline-block;
    height: 4px;
    width: 44px;
    margin-top: 8px;
    margin-left: 4px;
    margin-right: 4px;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 4px;
      width: 44px;
      opacity: 0.3;
      background: #ffffff;
      border-radius: 2px;
      z-index: 1;
    }
  }

  .room_capacity_per_value {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 4px;
    border-radius: 2px;
    background-color: #ff854c;
    z-index: 2;
  }

  .room_capacity_count {
    vertical-align: top;
    display: inline-block;
    height: 20px;
    line-height: 20px;
  }

  .room_info {
    width: 100%;
    height: 128px;
    font-size: 0;
    border-bottom: 1px solid #e9e9e9;

    &.empty {
      line-height: 80px;
      text-align: center;
      font-size: 14px;
      color: #999;
    }
  }

  .room_name {
    display: inline-block;
    width: 180px;
    font-size: 16px;
    height: 48px;
    line-height: 24px;
    padding: 13px 0 12px 8px;
    box-sizing: border-box;
    color: #4d4d4d;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    i {
      padding: 4px;
    }
  }

  .room_name_value {
    vertical-align: top;
    display: inline-block;
    height: 24px;
    line-height: 24px;
    padding-left: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 139px;
  }

  .room_status {
    vertical-align: top;
    display: inline-block;
    width: 50%;
    font-size: 14px;
    height: 24px;
    line-height: 24px;
    padding: 12px 0;
    text-align: right;

    .free {
      display: inline-block;
      width: 76px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      color: #fff;
      border-radius: 4px 0 0 4px;
      font-size: 14px;
      background-color: #3bcd8d;
    }

    .allocated {
      display: inline-block;
      width: 76px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      color: #fff;
      border-radius: 4px 0 0 4px;
      font-size: 14px;
      background-color: #ff902e;
    }

    .connecting {
      display: inline-block;
      width: 76px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      color: #fff;
      border-radius: 4px 0 0 4px;
      font-size: 14px;
      background-color: #207ff7;
    }

    .working {
      display: inline-block;
      min-width: 147px;
      height: 24px;
      background-color: #fe6447;
      border-radius: 4px 0 0 4px;
      font-size: 0;
      text-align: left;
      border: 1px solid #fe6447;
      border-right: 0;
      box-sizing: border-box;
      vertical-align: top;
    }

    .working_text {
      vertical-align: top;
      display: inline-block;
      height: 24px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      min-width: 48px;
      width: auto;
      font-size: 14px;
      letter-spacing: 0;
      border-radius: 4px 0 0 4px;
      padding: 0 4px;
    }

    .working_time {
      font-family: 'DS-Digital';
      vertical-align: top;
      display: inline-block;
      width: 98px;
      height: 22px;
      line-height: 23px;
      font-size: 21px;
      color: #fe6447;
      letter-spacing: 0;
      text-align: center;
      background-color: #fff;
    }
  }

  .room_case_name,
  .room_case_person,
  .room_case_object {
    height: 22px;
    line-height: 22px;
    font-size: 14px;
    padding-left: 8px;
    width: 100%;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .room_case_label {
    color: #999999;
    font-size: 14px;
  }

  .room_case_value {
    width: 290px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .room_action {
    display: flex;
    line-height: 47px;
    height: 47px;
    font-size: 24px;

    &.model {
      text-align: center;
      display: block;
    }

    & > i {
      text-align: center;
      flex: 1;
      height: 16px;
      margin-top: 15px;
      border-right: 1px solid #e9e9e9;
      cursor: pointer;
    }

    & > i:last-of-type {
      border-right: 0;
    }

    .el-dropdown {
      height: 16px;
      width: 100%;
    }

    .el-dropdown-btn {
      vertical-align: top;
      font-size: 16px;
      width: 100%;
    }
  }

  .icon-uni:before {
    color: #fff;
  }

  .disableButton {
    color: #ccc !important;
    cursor: not-allowed !important;

    &:hover,
    &:active {
      color: #ccc !important;
    }
  }
}
</style>
