<template>
  <div class="content-wrap">
    <div class="square_header border">收藏列表</div>
    <div class="comment_item border">
      <ul class="list_item_box">
        <li
          v-for="i in data.collectList"
          :key="i"
          class="infinite-list-item"
          @click="toDetail(i)"
        >
          <div class="left_box">
            <div class="user">
              <el-avatar :size="30" :max="30" :src="i.portrait" />
              <span>{{ i.name }}</span>
            </div>
            <div  v-if="!i.remark">
              <p class="title">{{ i.title }}</p>
              <p class="text-ellipsis-many">{{ i.content }}</p>
            </div>
            <div  v-else>
              <p class="text-ellipsis-many">{{ i.remark }}</p>
            </div>
          </div>
          <el-image
            v-if="i.imagesList.length > 0"
            style="min-width: 100px;max-width: 100px;"
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
      <el-pagination
        :hide-on-single-page="data.collectList.length === 0"
        :page-sizes="[10, 15, 20, 25]"
        layout=" prev, pager, next"
        :total="data.total"
        :default-page-size="data.pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
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
  total:0
});
const handleSizeChange = (val: number) => {
  data.pageSize = val;
  getList();
};
const handleCurrentChange = (val: number) => {
  data.pageNum = val;
  getList();
};
const getList = () => {
  request({
    url: `/api/business/business/favorite/page`,
    method: "post",
    data: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
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
    },
  });
};
onMounted(() => {
  getList();
});
</script>
<style lang="less" scoped>
@import "@/assets/css/common/invitation.less";
.comment_item {
  height: calc(100% - 116px) !important;
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
    .left_box {
      display: flex;
    }
    .user {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 10px;
    }
    .title {
      font-size: 16px;
    }
  }
}
</style>
