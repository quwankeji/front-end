<template>
  <div class="content-wrap">
    <div class="square_header border">
      <el-icon @click="back()"><ArrowLeft /></el-icon>
      <span> 趣玩详情</span>
    </div>
    <div class="content" v-loading="data.loading">
      <div class="padding border comment_item">
        <div class="list_item">
          <div class="compose_user">
            <el-avatar
              :size="30"
              :max="30"
              :src="data.invitationDetail?.portrait"
            />
            <div class="comment_name">
              <el-link type="info">{{ data.invitationDetail?.name }}</el-link>
            </div>
            <div class="location_time">
              {{ data.invitationDetail?.location }}&nbsp·&nbsp{{
                dateFormatPipe(
                  data.invitationDetail?.createdTime,
                  "YYYY-MM-DD HH:mm"
                )
              }}
            </div>
          </div>
          <!-- 主要内容 -->
          <div class="comment_content">
            <!-- 文字部分 -->
            <p class="text">
              {{ data.invitationDetail?.content }}
            </p>
            <!-- 图片 -->
            <div
              class="demo-image__preview"
              v-if="
                data.invitationDetail?.imagesList &&
                data.invitationDetail?.imagesList.length > 0
              "
            >
              <div
                class="image_item"
                v-for="(url, index) in data.invitationDetail?.imagesList"
                :key="url.id + index"
              >
                <el-image
                  :src="url.imgUrl"
                  :preview-src-list="[data.invitationDetail?.imagesList]"
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
            <div
              class="opt-item"
              @click.stop="pointLike(1, data.invitationDetail)"
            >
            <n-icon size="20">
                <like-outlined v-if="!data.invitationDetail?.userLikeStatus"></like-outlined>
                <like-filled
                  v-if="data.invitationDetail?.userLikeStatus"
                  color="#f56c6c"
                ></like-filled>
              </n-icon>
              <span>{{
                data.invitationDetail?.likesList &&
                data.invitationDetail?.likesList.length
              }}</span>
            </div>
            <div class="opt-item">
              <n-icon size="20">
                <comment-20-regular></comment-20-regular>
              </n-icon>
              <span>{{ data.invitationDetail?.commentsList.length }}</span>
            </div>
            <div
              class="opt-item"
              @click.stop="pointStar(1, data.invitationDetail)"
            >
            <n-icon size="20">
                <star-12-regular
                  v-if="!data.invitationDetail?.userFavoriteStatus"
                ></star-12-regular>
                <star-12-filled
                  v-if="data.invitationDetail?.userFavoriteStatus"
                  color="#ff7600"
                ></star-12-filled>
              </n-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="padding border comment_active">
        <div class="top_input">
          <div class="compose_user">
            <el-avatar
              :size="30"
              :max="30"
              :src="data.invitationDetail?.portrait"
            />
          </div>
          <div class="compose_textarea">
            <el-input
              v-model.trim="data.addData.commentText"
              :autosize="{ minRows: 2, maxRows: 4 }"
              maxlength="100"
              show-word-limit
              type="textarea"
              resize="none"
              placeholder="写评论..."
            />
          </div>
        </div>
        <div class="fb">
          <el-button type="primary" @click="commentFun">发表</el-button>
        </div>
      </div>
      <div
        class="border comment_list_box"
        v-if="data.invitationDetail?.commentsList.length > 0"
      >
        <div
          class="comment_list_item padding"
          v-for="(item, index) in data.invitationDetail?.commentsList"
          :key="item.id + index"
        >
          <div class="compose_user">
            <div class="left">
              <el-avatar
                :size="30"
                :max="30"
                :src="data.invitationDetail?.portrait"
              />
              <div class="comment_name">
                <el-link type="info">{{ item?.userVO?.name }}</el-link>
              </div>
            </div>
            <div class="right">
              <!-- <span class="reply" @click="replay(item)">回复</span> -->
              <el-icon
                class="delete"
                v-if="userInfo?.id === item.userId"
                @click.stop="deleteComment(item.id)"
                ><DeleteFilled
              /></el-icon>
            </div>
          </div>
          <p class="comment_content">
            {{ item.commentText }}
          </p>
          <!-- <div class="info_msg">
            <span class="time">{{ dateFormatPipe(item.updatedTime) }}&nbsp</span
            >·
            <span class="location">&nbsp{{ item.location }}</span>
            <span class="reply">回复</span>
          </div> -->
          <!-- <div class="bottom_reply">
            <div class="reply_item">
              <div class="reply_user_info">
                <a href="">maoburu</a>
                <span>上海市&nbsp·&nbsp6个月前</span>
              </div>
              <div class="reply_content">
                <p>
                  # 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽#
                  滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽#
                  滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽#
                  滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽#
                  滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽#
                  滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽#
                  滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽#
                  滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽#
                  滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽# 滑稽#
                  滑稽
                </p>
                <span>回复</span>
              </div>
            </div>
            <div class="reply_item">
              <div class="reply_user_info">
                <a href="">maoburu2</a>
                <span>上海市&nbsp·&nbsp6个月前</span>
              </div>
              <div class="reply_content">
                <p># 滑稽#</p>
                <span>回复</span>
              </div>
            </div>
            <div class="reply_item">
              <div class="reply_user_info">
                <a href="">maoburu3</a>
                <span>上海市&nbsp·&nbsp6个月前</span>
              </div>
              <div class="reply_content">
                <p># sssssssssssssss</p>
                <span>回复</span>
              </div>
            </div>
          </div>
          <div class="reply-compose-wrap" v-if="item.showReplayText">
            <div class="reply-input-wrap">
              <el-input
                v-model="item.commentText"
                maxlength="100"
                show-word-limit
                placeholder="请输入回复内容..."
                class="input-with-select"
              >
                <template #append>
                  <el-button type="primary" @click="addTag">发表</el-button>
                </template>
              </el-input>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { UploadProps, UploadUserFile } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { dateFormatPipe } from "@/util/index";
import request from "@/http/request"; // 引入封装的request.js文件
import { pointStar, pointLike } from "@/util/common.ts";
import { userInfo } from "@/util/user";
import { NIcon } from "naive-ui";
import { LikeFilled, LikeOutlined } from "@vicons/antd";
import { Comment20Regular, Star12Regular, Star12Filled } from "@vicons/fluent";
import axios from "axios";
const route = useRoute();
const router = useRouter();
const data = reactive({
  id: "" as any,
  loading: false,
  textarea: "",
  fileList: [],
  invitationDetail: {
    imagesList: [],
    likesList: [],
    commentsList: [],
  } as any,
  userImg:
    "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
  addData: {
    //提交数据
    commentText: "",
    imgUrlList: [] as any,
    title: "",
    videoUrl: "",
  },
});

const srcList = [
  "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
  "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
  "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
  "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
  "https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg",
  "https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg",
];

const upLoad = {
  //文件上传part
  accept: "image/jpg,image/jpeg,image/png,video/mp4",
  handleBeforeUpload: (file: any, accept: any) => {
    let validateList: any = [];
    accept.split(",").forEach((item: any) => {
      validateList.push(item.split("/")[1]);
    });
    var fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
    if (validateList.indexOf(fileSuffix) === -1) {
      ElMessage({
        message: `请上传${accept}格式的图片`,
        type: "warning",
      });
      return false;
    }
  },
  handleSuccess: (response: any, file: any, fileList: any) => {
    if (response.success && fileList.length > 0) {
      data.fileList = fileList;
    }
  },
};
//------------获取详情part
const getDetail = () => {
  data.id = route.query.id;
  data.loading = true;
  request({
    url: `/api/business/business/tags/get/${data.id}`,
    method: "get",
    loading: true,
  })
    .then((res: any) => {
      data.invitationDetail = res.retObject;
      data.loading = false;
    })
    .catch((err) => {
      ElMessage({
        message: err,
        type: "error",
      });
    });
};
const replay = (item: any) => {
  item.showReplayText = true;
};
const addTag = (item: any) => {
  item.showReplayText = true;
};

//------------发表评论part
const commentFun = () => {
  if (data.addData.commentText === "") {
    return ElMessage({
      message: "评论内容不能为空",
      type: "warning",
    });
  }
  let params: any = {
    commentText: data.addData.commentText,
    parentId: null,
    tagId: data.id,
    tagType: 1, ///朋友圈1、组队2
    userId: userInfo.id,
  };
  request({
    url: `/api/business/business/comment/add`,
    method: "post",
    data: params,
    loading: true,
  })
    .then((res: any) => {
      getDetail();
      data.addData.commentText = "";
      ElMessage({
        message: "发布成功",
        type: "success",
      });
    })
    .catch((err) => {
      ElMessage({
        message: err,
        type: "error",
      });
    });
};
//------------删除评论part
const deleteComment = (id: any) => {
  ElMessageBox.confirm("您确定要删除该评论吗?", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then(() => {
    data.loading = true;
    request({
      url: `/api/business/business/comment/${id}`,
      method: "delete",
      loading: true,
    })
      .then((res: any) => {
        data.loading = false;
        getDetail();
        ElMessage({
          message: "删除成功",
          type: "success",
        });
      })
      .catch((err) => {
        data.loading = false;
        ElMessage({
          message: err,
          type: "error",
        });
      });
  });
};
//------------返回上级part
const back = () => {
  router.go(-1);
};

onMounted(() => {
  getDetail();
  if (route.query.haveRead) {
    request({
      url: `/api/business/business/notice/read?id=${route.query.messageId}`,
      method: "post",
      loading: true,
    })
      .then((res: any) => {})
      .catch((err) => {
        ElMessage({
          message: err,
          type: "error",
        });
      });
  }
});
</script>

<style lang="less" scoped>
@import "@/assets/css/common/invitation.less";
@import "@/assets/css/square/detail.less";
.el-loading-mask {
  z-index: 9;
}
</style>
