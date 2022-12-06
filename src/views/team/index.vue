<template>
  <div class="content-wrap">
    <div class="square_header border">
      组队
      <el-icon class="addTeam" @click="addTeam" title="发起组队"
        ><Plus /></el-icon>
    </div>
    <div class="compose_comment  border">
    </div>
    <div
      class="comment_item"
      v-infinite-scroll="getList"
      :infinite-scroll-disabled="data.listItem.loading"
      :infinite-scroll-immediate="true"
      infinite-scroll-distance="20"
      v-loading="data.loading"
    >
      <div
        class="list_item padding border"
        @click="toDetail(item.id)"
        v-for="(item, index) in data.listItem.invitationList"
        :key="item.id + index"
      >
        <div class="compose_user">
          <el-avatar :size="30" :max="30" :src="data.userImg" />
          <div class="comment_name">
            <el-link type="info">{{ item.userName }}</el-link>
          </div>
          <div class="location_time">
            {{ item.location }}&nbsp·&nbsp{{
              dateFormatPipe(item.updatedTime, "YYYY-MM-DD HH:mm")
            }}
            <el-icon
              class="delete"
              @click.stop="deleteInvitation(item.id)"
              v-if="item.userId === userInfo?.userId"
              ><DeleteFilled
            /></el-icon>
          </div>
        </div>
        <!-- 主要内容 -->
        <div class="comment_content">
          <!-- 文字部分 -->
          <p class="text">
            {{ item.content }}
          </p>
          <!-- 图片 -->
          <div class="demo-image__preview" v-if="item.imagesList.length > 0">
            <div
              class="image_item"
              v-for="(url, index) in item.imagesList"
              :key="url.id + index"
              @click.stop=""
            >
              <el-image
                :src="url.imgUrl"
                :preview-src-list="[url.imgUrl]"
                :initial-index="4"
                fit="cover"
                lazy
              />
            </div>
          </div>
          <div class="video">
            <!-- <vue3VideoPlay
              :src="video"
              poster="https://cdn.jsdelivr.net/gh/xdlumia/files/video-play/ironMan.jpg"
            /> -->
          </div>
          <!-- 视频 -->
        </div>
        <div class="bottom_function">
          <div class="opt-item" @click.stop="pointLike(item)">
            <el-icon :class="{ active: item.userLikeStatus }"
              ><Pointer
            /></el-icon>
            <span>{{ item.likesList?.length }}</span>
          </div>
          <div class="opt-item">
            <el-icon><ChatSquare /></el-icon>
            <span>{{ item.commentsList?.length }}</span>
          </div>
          <div class="opt-item">
            <el-icon :class="{ active: item.userLikeStatu }"><Star /></el-icon>
            <span>23</span>
          </div>
        </div>
      </div>
    </div>
  </div>
    <InitiateTeam ref="addTeamDialog" :getList="getList" />
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { dateFormatPipe } from "@/util/index";
import { userInfo } from "@/state/user";
import request from "@/http/request"; // 引入封装的request.js文件
import InitiateTeam from "@/components/team/InitiateTeam.vue";
const addTeamDialog = ref(null)

const router = useRouter();
const data = reactive({
  textarea: "",
  fileList: [],
  loading: false,
  userImg:
    "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
  
  listItem: {
    pageNum: 1,
    pageSize: 10,
    initLoading: true,
    loading: false,
    invitationList: [] as any,
  },
});
//------------发起组队
const addTeam = () => {
  addTeamDialog.value.data.visible = true
};
//------------获取列表part
const getList = () => {
  data.loading = true;
  data.listItem.loading = true;
  request({
    url: `/business/tags/get/page`,
    method: "post",
    data: {
      pageNum: data.listItem.pageNum,
      pageSize: data.listItem.pageSize,
      tagType:2
    },
  })
    .then((res: any) => {
      data.loading = false;
      if (res && res.list.length > 0) {
        data.listItem.invitationList = [...res.list];
      }
      data.listItem.pageNum++;
      // if (data.listItem.pageNum <= 10) {
      //   data.listItem.loading = false;
      //   return;
      // }
    })
    .catch((err) => {
      ElMessage({
                message:err,
                type: 'error',
                duration: 3000
            });
    });
};
//------------点赞part
const pointLike = (item: any) => {
  if (item.userLikeStatus === 1) {
    request({
      url: `/business/like/delete?tagId=${item.id}`,
      method: "delete",
    })
      .then((res: any) => {
          data.listItem.pageNum = 1;
          item.likesList.pop();
          item.userLikeStatus = null;
      })
      .catch((err) => {
        ElMessage({
          message: err.error_description,
          type: "error",
        });
      });
  } else {
    request({
      url: `/business/like/add`,
      method: "post",
      data: {
        statuType: 0, //0点赞  1取消点赞
        tagId: item.id,
      },
    })
      .then((res: any) => {
          data.listItem.pageNum = 1;
          item.userLikeStatus = 1;
          item.likesList.push({});
      })
      .catch((err) => {
        ElMessage({
          message: err.error_description,
          type: "error",
        });
      });
  }
};
//------------评论part
const commentFun = (item: any) => {
  request({
    url: `/business/comment/add`,
    method: "post",
    data: {
      comment: 0, //0点赞  1取消点赞
      parentId: null,
      tagId: item.id,
    },
  })
    .then((res: any) => {
        data.listItem.pageNum = 1;
        getList();
    })
    .catch((err) => {
      ElMessage({
        message: err.error_description,
        type: "error",
      });
    });
};
//------------删除帖子part
const deleteInvitation = (val: any) => {
  ElMessageBox.confirm("您确定要删除该帖子吗?", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then(() => {
    request({
      url: `/business/tags/delete/${val}`,
      method: "delete",
    })
      .then((res: any) => {
          data.listItem.pageNum = 1;
          getList();
          ElMessage({
            message: "删除成功",
            type: "success",
          });
      })
      .catch((err) => {
        ElMessage({
          message: err.error_description,
          type: "error",
        });
      });
  });
};
//------------跳转详情页part
const toDetail = (val: any) => {
  router.push({
    path: "/square/detail",
    query: {
      id: val,
    },
  });
};
</script>

<style lang="less" scoped>
@import "@/assets/css/square/square.less";
@import "@/assets/css/common/invitation.less";
</style>
