<template>
  <div class="AlarmLevel">
    <div class="item-block">
      <label>告警级别</label>
    </div>
    <div class="btnContent">
      <a
        v-for="item in itemList"
        class="btn"
        :key="item.val"
        :class="{ active: item.val === alarmLevel }"
        @click="handleClick(item.val)"
      >
        <i class="icon-alarm" :class="item.color"></i>
        <span>{{ item.level }}</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlarmLevel',
  props: {
    level: {
      type: Number,
      default: () => {
        return 0
      },
    },
  },
  data() {
    return {
      itemList: [
        {
          level: '高',
          val: 2,
          color: 'red',
        },
        {
          level: '中',
          val: 1,
          color: 'orange',
        },
        {
          level: '低',
          val: 0,
          color: 'yellow',
        },
      ],
      alarmLevel: -1,
    }
  },
  methods: {
    handleClick(val) {
      if (this.alarmLevel !== val) {
        this.alarmLevel = val
        this.$emit('alarmLevelChange', val)
      }
    },
  },
  mounted() {
    this.alarmLevel = this.level
  },
  watch: {
    level() {
      this.alarmLevel = this.level
    },
  },
}
</script>

<style lang="less" scoped>
@labelWidth: 120px;
.AlarmLevel {
  margin-bottom: 24px;
  .item-block {
    label {
      position: relative;
      width: @labelWidth;
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #484c6a;
      line-height: 1;
      padding: 10px 12px 10px 0;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
  .btnContent {
    height: 32px;
    font-size: 0;
    margin-left: @labelWidth;
    .btn {
      position: relative;
      display: inline-block;
      width: 66px;
      height: 30px;
      font-size: 14px;
      color: #333;
      line-height: 30px;
      text-align: center;
      text-decoration: none;
      border: 1px solid #e5e5e5;
      z-index: 1;
      &:nth-child(2),
      &:nth-child(3) {
        margin-left: -1px;
      }
      &.active {
        border-color: #2080f7;
        background: #2080f7;
        color: #fff;
        z-index: 2;
      }
      i {
        display: inline-block;
        font-size: 16px;
        vertical-align: text-bottom;
        margin-right: 8px;
        &.red {
          color: #fa3239;
        }
        &.orange {
          color: #ff8400;
        }
        &.yellow {
          color: #ffdf05;
        }
      }
      span {
        display: inline-block;
      }
    }
  }
}
</style>
