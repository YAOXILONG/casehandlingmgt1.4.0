<template>
  <watermarkContent>
    <div class="exit-application-detail-box add-edit-from-box full">
      <PathDesc :path-desc-arr="pathDescArr" :is-back="true"></PathDesc>
      <div class="visitingDetail">
        <el-table
          ref="autoTable"
          :data="tableData"
          force-scroll
          style="width: 100%"
        >
          <el-table-column label="序号" width="55">
            <template slot-scope="scope">
              <span :style="scope.row.exceptionStatus == 1?'color:red':''">
                {{scope.$index + 1}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="inspectionPhotoUrl"
            label="巡查照片"
            width="120"
            show-overflow-title
          >
            <template slot-scope="scope">
              <el-tooltip placement="top">
                <div slot="content">
                  <img
                    v-if="scope.row.inspectionPhotoUrl"
                    :src="scope.row.inspectionPhotoUrl"
                    alt=""
                    width="135px"
                    height="180px"
                  />
                  <img
                    v-else
                    :src="require('../../assets/image/u5576.png')"
                    width="135px"
                    height="180px"
                  />
                </div>
                <img
                  v-if="scope.row.inspectionPhotoUrl"
                  :src="scope.row.inspectionPhotoUrl"
                  alt=""
                  width="39px"
                  height="39px"
                />
                <img
                  v-else
                  :src="require('../../assets/image/u5576.png')"
                  width="39px"
                  height="39px"
                />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="inspectionTime"
            label="巡查时间"
            show-overflow-title
          >
            <template slot-scope="scope">
             <span :style="scope.row.exceptionStatus == 1?'color:red':''">
                {{
                $moment(scope.row.inspectionTime).format('YYYY-MM-DD HH:mm:ss')
              }}
             </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="policeName"
            :resizable="false"
            label="巡查人"
            show-overflow-title
          >
          <template slot-scope="scope">
             <span :style="scope.row.exceptionStatus == 1?'color:red':''">
                {{
                scope.row.policeName
              }}
             </span>
            </template>
          </el-table-column>
          <el-table-column prop="temperature" label="体温(℃)" show-overflow-title>
            <template slot-scope="scope">
             <span :style="scope.row.exceptionStatus == 1?'color:red':''">
                {{
                scope.row.temperature
              }}
             </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="bloodPressure"
            label="血压(mmHg)"
            show-overflow-title
          >
          <template slot-scope="scope">
             <span :style="scope.row.exceptionStatus == 1?'color:red':''">
                {{
                scope.row.bloodPressure
              }}
             </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="personStatus"
            label="人员状态"
            show-overflow-title
          >
            <template slot-scope="scope">
              <!-- 人员状态（1：候问中；2：审讯中；3：临时出区） -->
             <span :style="scope.row.exceptionStatus == 1?'color:red':''">
                {{
                scope.row.personStatus == 1
                  ? '候问中'
                  : scope.row.personStatus == 2
                  ? '审讯中'
                  : scope.row.personStatus == 3
                  ? '临时出区'
                  : ''
              }}
             </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="exceptionStatus"
            label="异常状态"
            show-overflow-title
          >
            <template slot-scope="scope">
              <!-- 异常状态（0：无异常；1：异常） -->
              <span :style="scope.row.exceptionStatus == 1?'color:red':''">
                {{
                scope.row.exceptionStatus == 0
                  ? '无异常'
                  : scope.row.exceptionStatus == 1
                  ? '异常'
                  : ''
              }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            show-overflow-title
            width="150"
          >
          <template slot-scope="scope">
              <!-- 异常状态（0：无异常；1：异常） -->
              <span :style="scope.row.exceptionStatus == 1?'color:red':''">
                {{scope.row.remark}}
                </span>
          </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </watermarkContent>
</template>

<script>
import PathDesc from './components/PathDesc'
import server from '../../server/visitingRecord'
export default {
  name: 'detailsPage',
  data() {
    return {
      pathDescArr: [
        `${this.$route.query.type==0 ? '在区人员' : '已出区人员'}`,
        '详情',
      ],
      tableData: [],
    }
  },
  methods: {
    async getInspectionInfoList() {
      const result = await server.getInspectionInfoList({
        registerIndexCode: this.$route.query.id,
      })
      const { data } = result
      if (data.code == 0) {
        this.tableData = data.data
      } else {
        this.$messagebox(res)
      }
    },
    goBack() {
      this.$router.push({ name: 'index', params: {} })
    },
  },
  created() {
    this.getInspectionInfoList()
  },
  components: { PathDesc },
}
</script>

<style lang="less" rel="stylesheet/less">
.exit-application-detail-box {
  min-width: 1366px;
  height: 100%;
  overflow: hidden;
  color: #4d4d4d;
  box-sizing: border-box;
  position: relative;

  * {
    box-sizing: border-box;
  }
  .visitingDetail {
    height: ~'calc(100% - 48px)';
    padding: 16px;
    background-color: #fff;
  }
}
</style>
