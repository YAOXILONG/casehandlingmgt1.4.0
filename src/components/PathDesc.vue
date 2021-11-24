<template>
  <div class="path-desc-layout">
    <div class="path-desc-box">
      <h-page-container>
        <h-page-header :breadcrumb="pathDescArr"
                       :return-event="goBack"
                       return-icon />
      </h-page-container>
      <!-- <i
        class="h-icon-arrow_left"
        @click="goBack"
        v-if="isBack"
      ></i>
      <div class="path-box">
        <div
          class="path-item"
          v-for="(item,index) in breadcrumbs"
          :key="index"
        >
          {{ item }}
          <span class="spil-item">
            /
          </span>
        </div>
      </div> -->
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    pathDescArr: {
      type: Array,
      default: () => {
        return []
      }
    },
    isBack: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      breadcrumbs: []
    }
  },
  mounted () {
    this.$breadcrumb && this.$breadcrumb.length > 0 ? (this.breadcrumbs = [...this.$breadcrumb, ...this.pathDescArr]) : (this.breadcrumbs = [...this.pathDescArr])
  },
  methods: {
    // 回退
    goBack () {
      this.$router.push('/')
    }
  }
}
</script>
<style lang="less" rel="stylesheet/less">
.path-desc-layout {
  /*border-bottom: solid 1px #e5e5e5;*/
  .path-desc-box {
    overflow: hidden;
  }
}
.path-desc-box {
  box-sizing: border-box;
  overflow: hidden;
  // height: 48px;
  // padding: 13px 16px;
  // background: #ffffff;
  // .h-icon-arrow_left {
  //   display: inline-block;
  //   vertical-align: middle;
  //   margin-right: 10px;
  //   font-size: 24px;
  //   color: #4D4D4D;
  //   cursor: pointer;
  // }
  // .path-box {
  //   display: inline-block;
  //   vertical-align: middle;
  //   .path-item {
  //     display: inline-block;
  //     font-size: 14px;
  //     color: #999999;
  //     .spil-item {
  //       padding: 0px 8px;
  //     }
  //     &:last-child {
  //       color: #4d4d4d;
  //       .spil-item {
  //         display: none;
  //       }
  //     }
  //   }
  // }
  height: 48px;
  padding: 3px 16px;
  background: #ffffff;
  .h-page-header {
    border-bottom: solid 1px transparent;
    padding-left: 0px;
  }
  .h-page-container {
    height: 100%;
  }
}
</style>
