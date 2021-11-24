<template>
  <h-watermark class="watermark-wrapper">
    <template #chunk>
      <div>
        <!--  class="watermark-wrapper-con" -->
        <div v-for="item in Object.keys($watermarkContent)"
             :key="item">{{$watermarkContent[item]}}</div>
      </div>
    </template>
    <slot />
  </h-watermark>
</template>
<script>
export default {
  name: 'watermarkContent',
  data () {
    return {}
  },
  computed: {
  },
  props: {
    sysTime: {
      type: null,
      default () {
        return 0
      }
    }
  },
  methods: {}
}
</script>
<style lang="less">
.h-watermark.watermark-wrapper {
  height: 100%;
  width: 100%;
  // background: red;
  .h-watermark__overly {
    z-index: 99999;
  }
}

// .watermark-wrapper-con {
//   display: flex;
//   font-size: 24px;
//   width: 100px;
//   height: 100px;
//   align-items: center;
//   justify-content: center;
//   transform: rotate(-25deg);
//   color: rgba(0, 0, 0, 0.05);
// }
</style>
