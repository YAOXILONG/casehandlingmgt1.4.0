<template>
  <div class="path-desc-box">
    <h-page-container>
      <h-page-header
        :breadcrumb="pathDescArr"
        :return-event="goBack"
        return-icon
      />
    </h-page-container>
  </div>
</template>
<script>
export default {
  props: {
    pathDescArr: {
      type: Array,
      default: () => {
        return ["admin"];
      },
    },
    isBack: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    // 回退
    goBack() {
      this.$router.push("/");
    },
  },
};
</script>
<style lang="less" rel="stylesheet/less">
.path-desc-box {
  box-sizing: border-box;
  height: 48px;
  padding: 3px 16px;
  border-bottom: solid 1px #e5e5e5;
  background: #ffffff;
  overflow: hidden;
  .h-page-header {
    border-bottom: solid 1px transparent;
    padding-left: 0px;
  }
  .h-icon-arrow_left {
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
    font-size: 24px;
    color: #4d4d4d;
    cursor: pointer;
  }
  .path-box {
    display: inline-block;
    vertical-align: middle;
    .path-item {
      display: inline-block;
      font-size: 14px;
      color: #999999;
      .spil-item {
        padding: 0px 8px;
      }
      &:last-child {
        color: #4d4d4d;
        .spil-item {
          display: none;
        }
      }
    }
  }
}
</style>
