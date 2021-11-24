<template>
  <watermarkContent>
    <div class="IndexView">
      <div class="menu">
        <div class="scroll">
          <ul>
            <h-feedback-icon icon-name="h-icon-feedback_question_lg" />
            <button @click="btnQ">哈哈哈</button>
            <li class="margin" v-for="view in views" :key="view[0]">
              <ElButton type="primary" @click="clickHandler(view[0])">
                {{ view[0] + ':' + view[1] }} </ElButton
              ><span
                class="h-icon-done"
                :style="view[2] ? 'color:#d00' : 'color:#ececec'"
              ></span
              ><span
                class="labelName"
                :style="view[2] ? 'color:#d00' : 'color:#fff'"
                >完成</span
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </watermarkContent>
</template>

<script>
import EventBus from '../../mixin/EventBus'
// import markdown from './markdown'

export default {
  name: 'IndexView',
  data() {
    return {
      views: [
        ['appointManage', '预约管理', 1],
        ['register', '入区登记', 1],
        ['policeRegister', '民警入区登记', 0],
        ['infoCollection', '信息采集', 0],
        ['personalCheck', '人身检查', 0],
        ['temporaryStorageOfArticles', '物品登记', 0],
        ['returnOfGoods', '物品归还', 0],
        ['waitingManagement', '候问管理', 0],
        ['drugAbuseDetection', '吸毒检测', 0],
        ['ledgerManage', '电子台账', 0],
        ['exitRegistration', '出区登记', 0],
        ['accessAreaManagement', '审讯室分配', 0],
        ['elerecord', '本地审讯', 0],
        ['businessConfig', '业务活动配置', 0],
        ['policeManagement', '警情管理', 0],
        ['terminalApplicationManage', 'app安装包管理', 0],
        ['appParamConfig', 'APP参数配置', 0],
        ['accessControlAuthConfig', '门禁权限配置', 0],
        ['alarmQuery', '报警查询', 0],
        ['alarmconfig', '报警配置', 0],
        ['visitingRecord', '巡查记录'],
        ['hybiluConfig', '慧眼笔录对接配置'],
      ],
    }
  },
  mixins: [EventBus],
  methods: {
    clickHandler(view) {
      console.log(123, view)
      window.open(
        location.protocol +
          '//' +
          location.host +
          '/' +
          process.env.VUE_APP_CONTEXT +
          '/' +
          view +
          '.html'
      )
    },
    btnQ() {
      this.$confirm('确认删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'question',
      }).then(() => {})
    },
  },
}
</script>

<style lang="scss">
.IndexView {
  width: 100%;
  height: 100%;
  .h-icon-feedback_question_lg {
    font-size: 24px;
  }
  overflow: auto;

  display: flex;

  .margin {
    margin: 5px;
  }

  .el-button {
    max-width: 600px !important;
  }

  .demo {
    flex: 1;

    & > div {
      & + div {
        margin-top: 16px;
      }
    }
  }

  .menu {
    flex: 1;
    overflow: hidden;
    height: 100%;
  }

  .markdown {
    flex: 2;
  }

  .scroll {
    overflow: auto;
    height: 100%;
  }
  .h-icon-done {
    font-size: 32px;
    color: #d00;
    font-weight: 900;
    vertical-align: top;
  }
  .labelName {
    font-size: 16px;
    font-weight: 900;
    vertical-align: top;
  }
}
</style>
