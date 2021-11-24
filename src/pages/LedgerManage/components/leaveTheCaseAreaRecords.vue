<template>
  <el-scrollbar v-loading="loadingInstance"
                wrap-class="scrollbarWrap"
                view-class="scrollbarView"
                ref="scrollbar">
    <div id="leaveTheCaseAreaRecords"
         class="leaveTheCaseAreaRecords">
      <div class="leaveTheCaseAreaRecordsTableBox">
        <div class="tableContent">
          <div class="tableContentItem temporaryLeaveTable">
            <div class="tableItemTitle">
              <span></span>临时出入区
            </div>
            <div class="tableBox"
                 v-for="(item,index) in temporaryLeaveInfo"
                 v-show="temporaryLeaveInfo && temporaryLeaveInfo.length"
                 :key="index">
              <div class="tableItemContent tableSingItemContent">
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel ">
                      临时离开时间
                    </div>
                    <div class="tableItemCon"
                         :title="item.temporaryCreateTimeStr ? $moment(item.temporaryCreateTimeStr).format('YYYY-MM-DD HH:mm:ss'):''">
                      {{ item.temporaryCreateTimeStr ? $moment(item.temporaryCreateTimeStr).format('YYYY-MM-DD HH:mm:ss'):'' }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">
                      临时离开原因
                    </div>
                    <div class="tableItemCon"
                         :title="item.leaveReason == '0' ? item.otherReason : temporaryLeaveReasonMap[item.leaveReason]">
                      {{ item.leaveReason == '0' ? item.otherReason : temporaryLeaveReasonMap[item.leaveReason] }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">
                      登记人
                    </div>
                    <div class="tableItemCon"
                         :title="item.creatorUserName || ''">
                      {{ item.creatorUserName || '' }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">
                      返还时间
                    </div>
                    <div class="tableItemCon"
                         :title="item.temporaryBackTimeStr ? $moment(item.temporaryBackTimeStr).format('YYYY-MM-DD HH:mm:ss'):''">
                      {{ item.temporaryBackTimeStr ? $moment(item.temporaryBackTimeStr).format('YYYY-MM-DD HH:mm:ss'):'' }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="24">
                  <li class="tableItem tableSignItem">
                    <div class="tableItemLabel">
                      管理员签字
                    </div>
                    <div class="tableItemCon">
                      <div class="signContent">
                        <img :src="(item.managerSign && `/casehandlingmgt/common/getFile.do?fileName=${item.managerSign}`) || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABaCAIAAACwpMoFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYzRDBCN0JBMDdCRDExRTg4MUE0ODFBM0JDN0IzRUQwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYzRDBCN0JCMDdCRDExRTg4MUE0ODFBM0JDN0IzRUQwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjNEMEI3QjgwN0JEMTFFODgxQTQ4MUEzQkM3QjNFRDAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjNEMEI3QjkwN0JEMTFFODgxQTQ4MUEzQkM3QjNFRDAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4bhszUAAAJtElEQVR42uyd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'"
                             alt="">
                      </div>
                      <!-- {{ temporaryLeaveInfo.personSign }} -->
                    </div>
                  </li>
                </el-col>
              </div>
            </div>
            <div class="tableBox"
                 v-show="!temporaryLeaveInfo || !temporaryLeaveInfo.length">
              <div class="tableItemContent tableSingItemContent">
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel ">
                      临时离开时间
                    </div>
                    <div class="tableItemCon">
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">
                      临时离开原因
                    </div>
                    <div class="tableItemCon">
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">
                      登记人
                    </div>
                    <div class="tableItemCon">
                    </div>
                  </li>
                </el-col>
                <el-col :span="12">
                  <li class="tableItem">
                    <div class="tableItemLabel">
                      返还时间
                    </div>
                    <div class="tableItemCon">
                    </div>
                  </li>
                </el-col>
                <el-col :span="24">
                  <li class="tableItem tableSignItem">
                    <div class="tableItemLabel">
                      管理员签字
                    </div>
                    <div class="tableItemCon">
                      <div class="signContent">
                        <img :src="'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABaCAIAAACwpMoFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYzRDBCN0JBMDdCRDExRTg4MUE0ODFBM0JDN0IzRUQwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYzRDBCN0JCMDdCRDExRTg4MUE0ODFBM0JDN0IzRUQwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjNEMEI3QjgwN0JEMTFFODgxQTQ4MUEzQkM3QjNFRDAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjNEMEI3QjkwN0JEMTFFODgxQTQ4MUEzQkM3QjNFRDAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4bhszUAAAJtElEQVR42uyd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'"
                             alt="">
                      </div>
                      <!-- {{ temporaryLeaveInfo.personSign }} -->
                    </div>
                  </li>
                </el-col>
              </div>
            </div>
          </div>
          <div class="tableContentItem">
            <div class="tableItemTitle">
              <span></span>最终出区
            </div>
            <div class="tableBox">
              <div class="tableItemContent tableItemContentFirst">
                <el-col :span="8">
                  <li class="tableItem">
                    <div class="tableItemLabel">
                      最终离开时间
                    </div>
                    <div class="tableItemCon"
                         :title="finalLeaveInfo.finalCreateTimeStr ? $moment(finalLeaveInfo.finalCreateTimeStr).format('YYYY-MM-DD HH:mm:ss'):''">
                      {{ finalLeaveInfo.finalCreateTimeStr ? $moment(finalLeaveInfo.finalCreateTimeStr).format('YYYY-MM-DD HH:mm:ss'):'' }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="8">
                  <li class="tableItem">
                    <div class="tableItemLabel">
                      办案结果
                    </div>
                    <div class="tableItemCon"
                         :title="finalLeaveInfo.leaveReason == '0' ? finalLeaveInfo.otherReason : handleResultMap[finalLeaveInfo.leaveReason]">
                      {{ finalLeaveInfo.leaveReason == '0' ? finalLeaveInfo.otherReason : handleResultMap[finalLeaveInfo.leaveReason] }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="8">
                  <li class="tableItem">
                    <div class="tableItemLabel">
                      登记人
                    </div>
                    <div class="tableItemCon"
                         :title="finalLeaveInfo.creatorUserName || ''">
                      {{ finalLeaveInfo.creatorUserName || '' }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="24">
                  <li class="tableItem">
                    <div class="tableItemLabel">
                      管理员签字
                    </div>
                    <div class="tableItemCon">
                      <div class="signContent">
                        <img :src="finalLeaveInfo.managerSignPhotoUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABaCAIAAACwpMoFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYzRDBCN0JBMDdCRDExRTg4MUE0ODFBM0JDN0IzRUQwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYzRDBCN0JCMDdCRDExRTg4MUE0ODFBM0JDN0IzRUQwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjNEMEI3QjgwN0JEMTFFODgxQTQ4MUEzQkM3QjNFRDAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjNEMEI3QjkwN0JEMTFFODgxQTQ4MUEzQkM3QjNFRDAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4bhszUAAAJtElEQVR42uyd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'"
                             alt="">
                      </div>
                      <!-- {{ finalLeaveInfo.personSign }} -->
                    </div>
                  </li>
                </el-col>
              </div>
            </div>
          </div>
          <div class="tableContentItem">
            <div class="tableItemTitle">
              <span></span>物品归还
            </div>
            <div class="tableBox">
              <div class="tableItemContent tableItemContentTwo">
                <el-col :span="8">
                  <li class="tableItem">
                    <div class="tableItemLabel">
                      物品归还时间
                    </div>
                    <div class="tableItemCon"
                         :title="goodsManagerInfo.goodsBackCreateTimeStr ? $moment(goodsManagerInfo.goodsBackCreateTimeStr).format('YYYY-MM-DD HH:mm:ss'):''">
                      {{ goodsManagerInfo.goodsBackCreateTimeStr ? $moment(goodsManagerInfo.goodsBackCreateTimeStr).format('YYYY-MM-DD HH:mm:ss'):'' }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="8">
                  <li class="tableItem">
                    <div class="tableItemLabel">
                      物品处理情况
                    </div>
                    <div class="tableItemCon"
                         :title="goodsManagerInfo.backStatusInfo || ''">
                      {{ goodsManagerInfo.backStatusInfo || '' }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="8">
                  <li class="tableItem">
                    <div class="tableItemLabel">
                      登记人
                    </div>
                    <div class="tableItemCon"
                         :title="goodsManagerInfo.creatorUserName || ''">
                      {{ goodsManagerInfo.creatorUserName||'' }}
                    </div>
                  </li>
                </el-col>
                <el-col :span="24">
                  <li class="tableItem">
                    <div class="tableItemLabel">
                      领取人签字
                    </div>
                    <div class="tableItemCon">
                      <div class="signContent">
                        <img :src="goodsManagerInfo.personSignPhotoUrl || signImg"
                             alt="">
                      </div>
                      <!-- {{ goodsManagerInfo.personSign }} -->
                    </div>
                  </li>
                </el-col>
              </div>
            </div>
          </div>
          <div class="tableList clearfix">
            <div class="tableListLabel">
              <span>未返还物品清单</span>
            </div>
            <div class="tableListContent clearfix">
              <template>
                <div class="listHeader">
                  <el-col :span="1">
                    <div class="cell">
                      序号
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="cell">
                      物品名称
                    </div>
                  </el-col>
                  <el-col :span="2">
                    <div class="cell">
                      数量
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="cell">
                      单位
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="cell">
                      保管措施
                    </div>
                  </el-col>
                  <el-col :span="2">
                    <div class="cell">
                      涉案物品
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="cell">
                      物品描述
                    </div>
                  </el-col>
                  <el-col :span="2">
                    <div class="cell">
                      保管柜号
                    </div>
                  </el-col>
                  <el-col :span="2">
                    <div class="cell"
                         style="border: 0;">
                      处理状态
                    </div>
                  </el-col>
                  <el-col :span="2">
                    <div class="cell">
                      照片
                    </div>
                  </el-col>
                </div>
                <div class="noneInfoList"
                     v-if="!noBackGoodsStockInfoList.length || !noBackGoodsStockInfoList">
                  暂无数据
                </div>
                <div class="listWrap clearfix"
                     v-for="(item,index) in noBackGoodsStockInfoList"
                     :key="index"
                     v-else>
                  <el-col :span="1">
                    <div class="cell">
                      {{ index + 1 }}
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="cell"
                         :title="item.goodsName || ''">
                      {{ item.goodsName || '' }}
                    </div>
                  </el-col>
                  <el-col :span="2">
                    <div class="cell"
                         :title="item.stockNum || ''">
                      {{ item.stockNum || '' }}
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="cell"
                         :title="item.goodsUnit|| ''">
                      {{ item.goodsUnit || '' }}
                    </div>
                  </el-col>
                  <el-col :span="3">
                    <div class="cell">
                      <span v-show="item.keepType == 1">扣押</span>
                      <span v-show="item.keepType == 2">暂存</span>
                      <span v-show="item.keepType == 3">代保管</span>
                    </div>
                  </el-col>
                  <el-col :span="2">
                    <div class="cell">
                      <span v-show="item.goodsType == 1">否</span>
                      <span v-show="item.goodsType == 0">是</span>
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div class="cell"
                         :title="item.goodsDesc|| ''">
                      {{ item.goodsDesc || '' }}
                    </div>
                  </el-col>
                  <el-col :span="2">
                    <div class="cell"
                         :title="item.boxName|| ''">
                      {{ item.boxName|| '' }}
                    </div>
                  </el-col>
                  <el-col :span="2"
                          :title="returnStatusList[item.returnStatus].label || ''">
                    <div class="cell"
                         style="border: 0;">
                      <span class="returnStatusColor"
                            v-show="item.returnStatus"
                            :style="returnStatusList[item.returnStatus].color"></span>
                      <span class="returnStatusColor"
                            v-show="!item.returnStatus"
                            style="background: #FFCC00;"></span>
                      <span class="returnStatusLabel"
                            v-show="item.returnStatus">{{ returnStatusList[item.returnStatus].label }}</span>
                      <span class="returnStatusLabel"
                            v-show="!item.returnStatus">{{ returnStatusList[item.returnStatus].label }}</span>
                    </div>
                  </el-col>
                  <el-col :span="2">
                    <div :class="item.goodsPhoto ? 'cell operationBtn' : 'cell'"
                         @click="handleShowPhoto('存入照片',item.goodsPhoto)"
                         :title="item.goodsPhoto || ''">
                      {{ item.goodsPhoto || '' }}
                    </div>
                  </el-col>
                </div>
              </template>
            </div>
          </div>
          <div class="tableList clearfix">
            <div class="tableListLabel">
              <span>已返还物品清单</span>
            </div>
            <div class="tableListContent clearfix">
              <div class="noneInfoList"
                   v-if="!backGoodsStockInfoList.length || !backGoodsStockInfoList">
                暂无数据
              </div>
              <div v-else
                   class="listWrap clearfix"
                   v-for="(item, index) in backGoodsStockInfoList"
                   :key="index">
                <el-col :span="1">
                  <div class="cell">
                    {{ index + 1 }}
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="cell"
                       :title="item.goodsName || ''">
                    {{ item.goodsName || '' }}
                  </div>
                </el-col>
                <el-col :span="2">
                  <div class="cell"
                       :title="item.stockNum || ''">
                    {{ item.stockNum || '' }}
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="cell"
                       :title="item.goodsUnit || ''">
                    {{ item.goodsUnit || '' }}
                  </div>
                </el-col>
                <el-col :span="3">
                  <div class="cell">
                    <span v-show="item.keepType == 1">扣押</span>
                    <span v-show="item.keepType == 2">暂存</span>
                    <span v-show="item.keepType == 3">代保管</span>
                  </div>
                </el-col>
                <el-col :span="2">
                  <div class="cell">
                    <span v-show="item.goodsType == 1">否</span>
                    <span v-show="item.goodsType == 0">是</span>
                  </div>
                </el-col>
                <el-col :span="4">
                  <div class="cell"
                       :title="item.goodsDesc || ''">
                    {{ item.goodsDesc || '' }}
                  </div>
                </el-col>
                <el-col :span="2">
                  <div class="cell"
                       :title="item.boxName || ''">
                    {{ item.boxName || '' }}
                  </div>
                </el-col>
                <el-col :span="2">
                  <div class="cell"
                       style="border: 0;">
                    <span class="returnStatusColor"
                          v-show="item.returnStatus"
                          :style="returnStatusList[item.returnStatus].color"></span>
                    <span class="returnStatusColor"
                          v-show="!item.returnStatus"
                          style="background: #FFCC00;"></span>
                    <span class="returnStatusLabel"
                          v-show="item.returnStatus">{{ returnStatusList[item.returnStatus].label }}</span>
                    <span class="returnStatusLabel"
                          v-show="!item.returnStatus">{{ returnStatusList[item.returnStatus].label }}</span>
                  </div>
                </el-col>
                <el-col :span="2">
                  <div :class="item.goodsPhoto2 ? 'cell operationBtn' : 'cell'"
                       @click="handleShowPhoto('归还照片',item.goodsPhoto2)"
                       :title="item.goodsPhoto2 || ''">
                    {{ item.goodsPhoto2 || '' }}
                  </div>
                </el-col>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ShowPhoto :dialog-visible="dialogVisible"
                 :img-url="imgUrl"
                 @closeShowPhoto="handleCloseShowPhoto"
                 :dialog-visible-title="dialogVisibleTitle"></ShowPhoto>
    </div>
  </el-scrollbar>
</template>

<script>
import server from '../../../server/ledgerManage'
import ShowPhoto from '../../../components/ShowPhoto/index'
export default {
  name: 'InformationAcquisitionRecord',
  props: {
    currentRegisterId: {
      type: Number,
      default: 1
    },
    inqDictList: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    inqDictList: {
      handler: function (newV, oldV) {
        if (this.inqDictList) {
          this.temporaryLeaveReasonMap = this.computedDic(this.inqDictList.temporaryLeaveReason)
          this.handleResultMap = this.computedDic(this.inqDictList.handleResult)
          // this.findLeaveAreaInfo()
        }
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      returnStatusList: [
        {
          color: 'background: #FFCC00;',
          label: '待领取'
        }, {
          color: 'background: #3BCD8D;',
          label: '已归还'
        }, {
          color: 'background: #FE5332;',
          label: '已扣押'
        }, {
          color: 'background: #39B2FF;',
          label: '已代领'
        }, {}, {
          color: 'background: #FFA939;',
          label: '已代保管'
        }
      ],
      dialogVisible: false,
      imgUrl: '',
      dialogVisibleTitle: '',
      noBackGoodsStockInfoList: [], // 未返还物品清单
      backGoodsStockInfoList: [], // 已返还物品清单
      finalLeaveInfo: {}, // 最终离开
      temporaryLeaveInfo: {}, // 临时离区
      goodsManagerInfo: {}, // 物品归还
      temporaryLeaveReasonMap: {},
      handleResultMap: {},
      loadingInstance: false,
      signImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABaCAIAAACwpMoFAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjYzRDBCN0JBMDdCRDExRTg4MUE0ODFBM0JDN0IzRUQwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjYzRDBCN0JCMDdCRDExRTg4MUE0ODFBM0JDN0IzRUQwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjNEMEI3QjgwN0JEMTFFODgxQTQ4MUEzQkM3QjNFRDAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjNEMEI3QjkwN0JEMTFFODgxQTQ4MUEzQkM3QjNFRDAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4bhszUAAAJtElEQVR42uyd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'
    }
  },
  mixins: [],
  methods: {
    async findLeaveAreaInfo () {
      this.loadingInstance = true
      try {
        let params = {
          registerId: this.currentRegisterId
        }
        let res = await server.findLeaveAreaInfo(params)
        if (res.data.code === '0') {
          let data = res.data.data
          this.noBackGoodsStockInfoList = JSON.parse(JSON.stringify(data.noBackGoodsStockInfoList)) || []
          this.backGoodsStockInfoList = JSON.parse(JSON.stringify(data.backGoodsStockInfoList)) || []
          this.finalLeaveInfo = JSON.parse(JSON.stringify(data.finalLeaveInfo)) || {}
          this.temporaryLeaveInfo = JSON.parse(JSON.stringify(data.temporaryLeaveInfo)) || []
          this.goodsManagerInfo = JSON.parse(JSON.stringify(data.goodsManagerInfo)) || {}
          this.loadingInstance = false
        } else {
          this.loadingInstance = false
          this.$messagebox(res)
        }
      } catch {
        this.loadingInstance = false
      }
    },
    handleShowPhoto (title, url) {
      if (url) {
        this.imgUrl = url
        this.dialogVisibleTitle = title
        this.dialogVisible = true
      }
    },
    handleCloseShowPhoto (res) {
      let bloon = !!res
      this.imgUrl = ''
      this.dialogVisible = bloon
    },
    computedDic (list) {
      let dicMap = {}
      if (list && list.length) {
        for (let i = 0; i < list.length; i++) {
          dicMap[list[i].key] = list[i].name
        }
      }
      return dicMap
    }
  },
  created () {
    if (this.inqDictList) {
      this.temporaryLeaveReasonMap = this.computedDic(this.inqDictList.temporaryLeaveReason)
      this.handleResultMap = this.computedDic(this.inqDictList.handleResult)
      this.findLeaveAreaInfo()
    }
  },
  components: {
    ShowPhoto
  }
}
</script>

<style lang="less" rel="stylesheet/less">
.leaveTheCaseAreaRecords {
  width: 100%;
  height: 100%;
  .leaveTheCaseAreaRecordsTableBox {
    width: 980px;
    padding: 40px;
    margin: 40px auto;
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.2);
    background: #fff;
    height: auto;
    box-sizing: border-box;
    .leaveTheCaseAreaRecordsTitle {
      height: 40px;
      padding-bottom: 16px;
      box-sizing: border-box;
      > i {
        background: #2080f7;
        display: inline-block;
        width: 4px;
        height: 12px;
        margin-top: 4px;
      }
      > span {
        display: inline-block;
        height: 20px;
        font-family: PingFangSC-Regular;
        margin-left: 16px;
        font-size: 14px;
        color: #4d4d4d;
        letter-spacing: 0;
        line-height: 20px;
      }
    }
  }
  .tableContent {
    width: 100%;
    .tableContentItem {
      height: 220px;
      &.temporaryLeaveTable {
        padding-bottom: 30px;
        height: auto;
        .tableBox {
          height: 180px;
        }
      }
      .tableItemTitle {
        height: 40px;
        line-height: 40px;
        box-sizing: border-box;
        font-size: 14px;
        > span {
          display: inline-block;
          background: #2080f7;
          width: 4px;
          height: 16px;
          position: relative;
          top: 4px;
          margin-right: 8px;
        }
      }
      .tableBox {
        height: 150px;
        padding-top: 16px;
        padding: 16px 0 0 12px;
        box-sizing: border-box;
        .tableItemContent {
          height: 77px;
          border: 1px solid #ddd;
          border-bottom: none;
          border-right: none;
          .el-col {
            height: 38px;
            .tableItem {
              width: 100%;
              height: 100%;
              border-bottom: 1px solid #ddd;
              list-style: none;
              .tableItemLabel {
                width: 120px;
                position: relative;
                text-indent: 14px;
                font-family: PingFangSC-Semibold;
                font-size: 14px;
                color: #999999;
              }
              .tableItemLabel::before {
                content: "";
                display: block;
                position: absolute;
                width: 100%;
                height: 100%;
                opacity: 0.3;
                top: 0;
                left: 0;
                z-index: 1;
                background: #f2f2f2;
              }
              .tableItemCon {
                width: ~"calc(100% - 122px)";
                text-align: left;
                text-indent: 14px;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #4d4d4d;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
              > div {
                height: 38px;
                float: left;
                line-height: 38px;
                text-indent: 14px;
                border-right: 1px solid #ddd;
              }
            }
          }
          &.tableSingItemContent {
            height: 157px;
            .el-col:nth-last-of-type(1) {
              height: 80px;
              .tableSignItem {
                height: 80px;
                .tableItemLabel {
                  height: 80px;
                  line-height: 80px;
                }
                .tableItemCon {
                  height: 80px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  .signContent {
                    width: 120px;
                    height: 80px;
                    padding: 4px;
                    box-sizing: border-box;
                    img {
                      width: 100%;
                      height: 100%;
                    }
                  }
                }
              }
            }
          }
        }
        .tableItemContent.tableItemContentFirst,
        .tableItemContent.tableItemContentTwo {
          height: 118px;
          .el-col:nth-last-of-type(1) {
            height: 80px;
            .tableItemLabel {
              height: 80px;
              float: left;
              line-height: 80px;
              text-indent: 14px;
              border-right: 1px solid #ddd;
            }
            .tableItemCon {
              height: 80px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              .signContent {
                width: 120px;
                height: 80px;
                padding: 4px;
                box-sizing: border-box;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
        }
      }
    }
    .returnStatusColor {
      width: 8px;
      height: 8px;
      display: inline-block;
      border-radius: 4px;
      margin-right: 4px;
    }
    .operationBtn {
      display: inline-block;
      padding: 0 8px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #2080f7;
      letter-spacing: 0;
      line-height: 20px;
      cursor: pointer;
      &.cell {
        width: 100%;
        height: 35px !important;
        padding-right: 8px;
        box-sizing: border-box;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .canDelete {
        display: none;
      }
    }
  }
  .tableList {
    position: relative;
    padding-left: 120px;
    margin-bottom: 8px;
    box-sizing: border-box;
    width: 100%;
    min-height: 40px;
    border: 1px solid #ddd;
    border-right: none;
    border-bottom: none;
    .tableListLabel {
      width: 120px;
      height: 100%;
      position: absolute;
      left: 0px;
      top: 0px;
      background: #f2f2f2;
      border-bottom: 1px solid #ddd;
      text-indent: 14px;
      font-family: PingFangSC-Semibold;
      font-size: 14px;
      color: #999999;
      box-sizing: border-box;
      > span {
        width: 100%;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .tableListContent {
      width: 100%;
      border: 1px solid #ddd;
      border-top: none;
      border-bottom: none;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #4d4d4d;
      > .noneInfoList {
        width: 100%;
        height: 80px;
        border: 1px solid #ddd;
        border-top: none;
        border-left: none;
        line-height: 80px;
        text-align: center;
      }
      .listHeader {
        width: 100%;
        height: 36px;
        line-height: 36px;
        .el-col {
          background: #fafafa;
          border-bottom: 1px solid #ddd;
          box-sizing: border-box;
          .cell {
            font-size: 14px;
            padding-left: 8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            height: 38px;
            line-height: 38px;
          }
        }
      }
      .listWrap {
        width: 100%;
        .cell-item {
          height: 36px;
          line-height: 36px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .el-col {
          border-bottom: 1px solid #ddd;
          box-sizing: border-box;
        }
        .cell {
          font-size: 14px;
          padding-left: 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          height: 38px;
          line-height: 38px;
        }
        .listLine {
          .el-col {
            padding: 4px 8px;
            height: 40px;
          }
          .operationBtn {
            display: inline-block;
            padding: 0 8px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #2080f7;
            letter-spacing: 0;
            line-height: 20px;
            cursor: pointer;
          }
          .dividingLine {
            color: #ccc;
          }
          .picName {
            max-width: 130px;
            display: inline-block;
            vertical-align: top;
            color: #2080f7;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
            margin-left: 6px;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
}
</style>
