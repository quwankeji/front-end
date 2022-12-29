<template>
  <div class="content-wrap border">
    <div class="square_header">
      趣玩广场
      <el-icon class="chat" @click="openChat" title="消息会话"
        ><ChatRound
      /></el-icon>
    </div>
    <div class="comment_item">
      <div class="compose_comment padding">
        <div class="top_input">
          <div class="compose_user">
            <el-avatar
              :size="30"
              :max="30"
              :src="store.getters.getUserInfo?.portrait"
            />
          </div>
          <div class="compose_textarea">
            <!-- <el-input
            class="title"
            v-model="data.addData.title"
            type="text"
            placeholder="标题"
          /> -->
            <el-input
              v-model.trim="data.addData.content"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              resize="none"
              placeholder="说说您的新鲜事..."
            />
          </div>
        </div>
        <div class="upload_box">
          <div class="link_upload">
            <el-upload
              ref="tagUpload"
              class="tag-upload"
              :action="'/file/path'"
              :accept="upLoad.accept"
              list-type="picture"
              :before-upload="(file:any) => upLoad.handleBeforeUpload(file, upLoad.accept)"
              :on-success="upLoad.handleSuccess"
              :on-remove="handleRemove"
              :file-list="data.fileList"
              :headers="{ Authorization: `Bearer ${getToken()}` }"
            >
              <n-icon @click="submitUpload" size="20" color="#63e2b7">
                <image-outline />
              </n-icon>
            </el-upload>
          </div>
          <!-- <n-upload-trigger
                            #="{ handleClick }" abstract>
                            <n-button
                               
                                quaternary
                                circle
                                type="primary"
                            >
                                <template #icon>
                                    <n-icon
                                        size="20"
                                        color="var(--primary-color)"
                                    >
                                        <videocam-outline />
                                    </n-icon>
                                </template>
                            </n-button>
                        </n-upload-trigger> -->
          <div class="fb">
            <el-button type="primary" @click="addTag">发布</el-button>
          </div>
        </div>
      </div>
      <div class="list_item_box">
        <div
          class="list_item padding"
          @click="toDetail(item.id)"
          v-for="(item, index) in data.listItem.invitationList"
          :key="item.id + index"
        >
          <div class="compose_user">
            <el-avatar :size="30" :max="30" :src="item.portrait" />
            <div class="comment_name">
              <el-link type="info">{{ item.name }}</el-link>
            </div>
            <div class="location_time">
              {{ item.location }}&nbsp·&nbsp{{
                dateFormatPipe(item.createdTime, "MM-DD HH:mm")
              }}
              <el-icon
                class="delete"
                @click.stop="deleteInvitation(item.id)"
                v-if="item.userId === store.getters.getUserInfo?.id"
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
                  :preview-src-list="[item.imagesList]"
                  :initial-index="4"
                  fit="cover"
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
            <div class="opt-item" @click.stop="pointLike(1, item)">
              <n-icon size="20">
                <like-outlined v-if="!item.userLikeStatus"></like-outlined>
                <like-filled
                  v-if="item.userLikeStatus"
                  color="#f56c6c"
                ></like-filled>
              </n-icon>
              <span>{{ item.likesList.length }}</span>
            </div>
            <div class="opt-item">
              <n-icon size="20">
                <comment-20-regular></comment-20-regular>
              </n-icon>
              <span>{{ item.commentsList.length }}</span>
            </div>
            <div class="opt-item" @click.stop="pointStar(1, item)">
              <n-icon size="20">
                <star-12-regular
                  v-if="!item.userFavoriteStatus"
                ></star-12-regular>
                <star-12-filled
                  v-if="item.userFavoriteStatus"
                  color="#ff7600"
                ></star-12-filled>
              </n-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-pagination
      :hide-on-single-page="data.listItem.invitationList.length === 0"
      :page-sizes="[10, 15, 20, 25]"
      layout="prev, pager, next"
      :total="data.listItem.total"
      :default-page-size="data.listItem.pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <el-dialog v-model="data.dialogTableVisible" :width="1200" title="会话">
    <chat />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
import { dateFormatPipe } from "@/util/index";
import { getToken } from "@/util/user";
import { pointStar, pointLike } from "@/util/common.ts";
import request from "@/http/request";
import type { UploadInstance, UploadProps, UploadUserFile } from "element-plus";
import { NIcon } from "naive-ui";
import { ImageOutline } from "@vicons/ionicons5";
import { LikeFilled, LikeOutlined } from "@vicons/antd";
import { Comment20Regular, Star12Regular, Star12Filled } from "@vicons/fluent";

Comment20Regular;

import chat from "@/components/chat/index.vue";
const tagUpload = ref<UploadInstance>();
const router = useRouter();
const route = useRoute();
const store = useStore();
const data = reactive({
  textarea: "",
  fileList: [],
  dialogTableVisible: false,
  userImg:
    "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
  addData: {
    //提交数据
    content: "",
    imgUrlList: [] as any,
    title: "",
    videoUrl: "",
  },
  listItem: {
    pageNum: 1,
    pageSize: 20,
    total: 0,
    initLoading: true,
    invitationList: [] as any,
  },
});
const handleSizeChange = (val: number) => {
  data.listItem.pageSize = val;
  getList();
};
const handleCurrentChange = (val: number) => {
  data.listItem.pageNum = val;
  getList();
};
//------------聊天
const openChat = () => {
  data.dialogTableVisible = true;
};
//------------文件上传part
const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
};

const submitUpload = () => {
  tagUpload.value!.submit();
};
const upLoad = {
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
      console.log("上传成功", data.fileList);
    }
  },
};

//------------发贴part
const addTag = () => {
  if (data.addData.content === "") {
    return ElMessage({
      message: "发布内容不能为空",
      type: "warning",
    });
  }
  let files: any = [];
  data.fileList.forEach((element: any) => {
    files.push(element.response.data);
  });
  data.addData.imgUrlList = files;

  request({
    url: `/api/business/business/tags/add`,
    method: "post",
    data: {
      content: data.addData.content,
      imgUrlList: data.addData.imgUrlList,
      title: data.addData.title,
      tagType: 1, ///朋友圈1、组队2
      // videoUrl: "string",
    },
    loading: true,
  })
    .then((res: any) => {
      // data.listItem.pageNum = 1;
      data.addData = {};
      getList();
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
//------------获取列表part
const getList = () => {
  request({
    url: `/api/business/business/tags/get/page`,
    method: "post",
    data: {
      pageNum: data.listItem.pageNum,
      pageSize: data.listItem.pageSize,
      tagType: 1,
    },
    loading: true,
  })
    .then((res: any) => {
      if (res && res.list.length > 0) {
        data.listItem.invitationList = [...res.list];
      }
      data.listItem.total = res.total;
    })
    .catch((err) => {
      ElMessage({
        message: err,
        type: "error",
      });
    });
};

//------------评论part
const commentFun = (item: any) => {
  request({
    url: `/api/business/business/comment/add`,
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
        message: err,
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
      url: `/api/business/business/tags/delete/${val}`,
      method: "delete",
      loading: true,
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
          message: err,
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
onMounted(() => {
  getList();
});
</script>

<style lang="less" scoped>
@import "@/assets/css/square/square.less";
@import "@/assets/css/common/invitation.less";
.content-wrap {
  height: 100%;
  position: relative;
  border-bottom: none !important;
  .comment_item {
    height: calc(100% - 116px);
    overflow-y: auto;
    padding-bottom: 0;
  }
  :deep(.upload_box) {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    .el-upload {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      &:hover {
        background-color: rgba(255, 255, 255, 0.09);
        color: #63e2b7;
      }
    }
    .el-upload-list {
      display: flex;
      width: 100%;
      grid-column-gap: 10px;
      margin-top: 0;
      flex-wrap: wrap;
    }
    .el-upload-list__item {
      max-width: 90px;
      padding: 0;
    }
    .el-upload-list__item-thumbnail {
      width: 100%;
      height: 90px;
    }
    .el-upload-list__item-info {
      display: none;
    }
    .el-upload-list__item-status-label,
    .el-icon--close {
      z-index: 999;
    }
  }
}
</style>
