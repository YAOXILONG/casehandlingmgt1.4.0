<template>
  <el-dialog :title="dialogVisibleTitle"
             :area="[360, 450]"
             :visible.sync="dialogVisible"
             :before-close="handleCancel"
             size="small">
    <img class="dialogVisibleImg"
         :src="currentUrl"
         alt="">
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import server from '../../server/common'

export default {
  name: 'AppointManage',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    imgUrl: {
      type: String,
      default: ''
    },
    dialogVisibleTitle: {
      type: String,
      default: ''
    }
  },
  watch: {
    imgUrl (newV, oldV) {
      this.getImage()
    }
  },
  data () {
    return {
      currentUrl: ''
    }
  },
  created () {
    this.getImage()
  },
  methods: {
    handleCancel () {
      this.$emit('closeShowPhoto', false)
    },
    async getImage () {
      if (this.imgUrl) {
        let params = {
          'objectName': this.imgUrl
        }
        const ress = await server.findFileUrl(params)

        let res = ress.data
        if (res.code === '0') {
          this.currentUrl = res.data.fileUrl
        } else {
          this.$message.error(this.$t(res.code))
          this.currentUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABaCAIAAACwpMoFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYzRDBCN0JBMDdCRDExRTg4MUE0ODFBM0JDN0IzRUQwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYzRDBCN0JCMDdCRDExRTg4MUE0ODFBM0JDN0IzRUQwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjNEMEI3QjgwN0JEMTFFODgxQTQ4MUEzQkM3QjNFRDAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjNEMEI3QjkwN0JEMTFFODgxQTQ4MUEzQkM3QjNFRDAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4bhszUAAAJtElEQVR42uyd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'
        }
      }
    }

  },
  components: {}
}
</script>
<style lang="less" rel="stylesheet/less">
.dialogVisibleImg {
  width: 100%;
  height: 300px;
  display: inline-block;
}
</style>
