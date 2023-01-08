<template>
  <div class="content-wrap border">
    <div class="square_header ">消息通知</div>
    <el-tabs
    v-model="data.read"
    type="card"
    class="demo-tabs "
    @tab-click="change"

  >
  <el-tab-pane label="未读" :name="0"></el-tab-pane>
    <el-tab-pane label="全部" name=""></el-tab-pane>
  </el-tabs>
    <div class="comment_item ">
      <ul class="list_item_box">
        <li
          v-for="i in data.collectList"
          :key="i"
          class="infinite-list-item"
          :class="{'have_read':i.haveRead===0}"
          @click="toDetail(i)"
        >
          <div class="left_box">
            <div class="user">
              <el-avatar :size="30" :max="30" :src="i.portrait" />
            </div>
            <div>
              <p class="title">{{ i.name }}</p>
              <p v-if="i.type!==3" class="text-ellipsis-many">{{!i.type?'点赞':i.type===1?'评论':'收藏'}}了你的帖子</p>
              <p v-if="i.type===1">{{i.context}}</p>
              <p v-if="i.type===3">加入了您的组队</p>
            </div>
          </div>
          <el-image
            v-if="i.imagesList.length > 0"
            style="min-width: 50px;max-width: 50px;"
            :src="i.imagesList[0]?.imgUrl"
            :preview-src-list="[i.imagesList[0]?.imgUrl]"
            fit="fit"
            lazy
          ></el-image>
        </li>
      </ul>
      <!-- <div v-if="loadingShow" class="floor">
              <div class="floor_text">正在加载</div>
            </div>
            <div v-if="loadingError" class="floor">
              <div class="floor_text">加载失败</div>
            </div> -->
     
    </div>
    <el-pagination
        :hide-on-single-page="data.collectList.length === 0"
        :page-sizes="[10, 15, 20, 25]"
        layout="prev, pager, next"
        :total="data.total"
        :default-page-size="data.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@/http/request";
import { setToken, requestUserInfo, getRongyunToken } from "@/util/user";
const router = useRouter();
const data = reactive({
  collectList: [] as any,
  busy: false,
  pageNum: 1,
  pageSize: 20,
  total:0,
  read:0
});
const handleSizeChange = (val: number) => {
  data.pageSize = val;
  getList();
};
const handleCurrentChange = (val: number) => {
  data.pageNum = val;
  getList();
};
const change = (val,event)=>{
  data.read = val.paneName;
  getList()
}
const getList = () => {
  request({
    url: `/api/business/business/notice/page`,
    method: "post",
    data: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      haveRead:data.read
    },
    loading:true

  })
    .then((res: any) => {
      if (res && res.list.length > 0) {
        data.collectList = res.list;
      }
      // if (data.listItem.pageNum <= 10) {
      //   return;
      // }
    })
    .catch((err) => {
      ElMessage({
        message: err,
        type: "error",
      });
    });
};
//------------跳转详情页part
const toDetail = (val: any) => {
  let path = ''
  if(val.tagType==1){
    path = "/square/detail"
  }else{
    path= "/team/teamDetail"
  }
  router.push({
    path: path,
    query: {
      id: val.tagId,
      messageId:val.id,
      haveRead:val.haveRead===0
    },
  });
};
onMounted(() => {
  getList();
});
</script>
<style lang="less" scoped>
@import "@/assets/css/common/invitation.less";
:deep(.el-tabs__header){
  margin-bottom: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.24);
  .el-tabs__nav{
    border: none;
  }
  .el-tabs__item{
    border: none;
  }
}
.content-wrap{
 border-bottom: none !important;
  .comment_item{
  padding-bottom:0;

  }
  .infinite-list-item{
    padding-left:18px !important;

  }
  .have_read{
    font-weight: 600;
    position: relative;
    &::before{
      display: inline-block;
      left: 4px;
    top: 33px;
      content: '';
      width: 6px;
    height: 6px;
    position: absolute;
    background: #f56c6c;
    border-radius: 50%;
    }
  }
}
.comment_item {
  height: calc(100% - 172px) !important;
  overflow-y: auto;
  .infinite-list-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.24);
    max-height: 122px;
    //   .el-avatar {
    //     margin-right: 10px;
    //   }
    .el-image{
      margin-top:8px;

      }
    .left_box {
      display: flex;
      
    }
    .user {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 10px;
      margin-top:8px;
    }
    .title {
      font-size: 16px;
    }
  }
}
</style>
