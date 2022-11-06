<template>
  <div class="content-wrap">
    <div class="square_header border">趣玩广场
      <el-icon class="chat" @click="openChat" title="消息会话"><ChatRound /></el-icon>
    </div>
    <div class="compose_comment padding border">
      <div class="top_input">
        <div class="compose_user">
          <el-avatar :size="30" :max="30" :src="data.userImg" />
        </div>
        <div class="compose_textarea">
          <el-input
            class="title"
            v-model="data.addData.title"
            type="text"
            placeholder="标题"
          />
          <el-input
            v-model="data.addData.content"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            resize="none"
            placeholder="说说您的新鲜事..."
          />
        </div>
      </div>
      <div class="link_upload">
        <el-upload
          class="upload"
          :action="'/file/path'"
          :accept="upLoad.accept"
          :before-upload="(file:any) => upLoad.handleBeforeUpload(file, upLoad.accept)"
          :on-success="upLoad.handleSuccess"
          :file-list="data.fileList"
        >
          <el-icon :size="20" :color="'rgb(99,226,183)'"><Document /></el-icon>
          <template #tip>
            <div v-if="data.fileList.length == 0" class="el-upload__tip">
              仅支持上传图片和视频文件。
            </div>
          </template>
        </el-upload>
        <!-- <el-icon :size="20" :color="'rgb(99,226,183)'"><Link /></el-icon> -->
      </div>
      <div class="fb">
        <el-button type="primary" @click="addTag">发布</el-button>
      </div>
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
            <el-link type="info">{{ item.userId }}{{ item.userName }}</el-link>
          </div>
          <div class="location_time">
            {{ item.location }}&nbsp·&nbsp{{
              dateFormatPipe(item.updatedTime, "YYYY-MM-DD HH:mm")
            }}
            <el-icon class="delete"
              @click.stop ="deleteInvitation(item.id)"
              v-if="item.userId === userInfo.userId"
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
            <el-icon :class="{'active':item.userLikeStatus}"><Pointer /></el-icon>
            <span>{{ item.likesList.length }}</span>
          </div>
          <div class="opt-item" @click="commentFun(item)">
            <el-icon><ChatSquare /></el-icon>
            <span>{{ item.commentsList.length }}</span>
          </div>
          <div class="opt-item">
            <el-icon :class="{'active':item.userLikeStatu}"><Star /></el-icon>
            <span>23</span>
          </div>
        </div>
      </div>
      <p
        :class="['loading', data.listItem.initLoading ? 'initloaing' : '']"
        v-if="data.listItem.loading"
      >
        {{ data.listItem.noticeText }}
      </p>
    </div>
  </div>
  <el-dialog v-model="data.dialogTableVisible" :width="1200" title="会话">
    <chat />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
import { dateFormatPipe } from "@/util/index";
import { userInfo } from "@/state/user";
import chat from "@/components/chat/index.vue";

import video from "@/assets/video/a.mp4";
import { tr } from "element-plus/es/locale";
const router = useRouter();
const data = reactive({
  textarea: "",
  fileList: [],
  loading:false,
  dialogTableVisible:false,
  userImg:
    "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
  addData: {
    //提交数据
    content: "",
    imgUrlList: [] as any,
    title: "",
    userId: userInfo.userId,
    videoUrl: "",
  },
  listItem: {
    pageNum: 1,
    pageSize: 10,
    initLoading: true,
    loading: false,
    noticeText: "努力加载中...",
    invitationList: [] as any,
  },
});
//------------聊天
const openChat= () => {
  data.dialogTableVisible = true;
}
//------------文件上传part
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
//------------发表评论part
const addTag = () => {
  data.loading = true;
  let files: any = [];
  data.fileList.forEach((element: any) => {
    files.push(element.response.data);
  });
  data.addData.imgUrlList = files;
  axios
    .post("/business/tags/add", {
      content: data.addData.content,
      imgUrlList: data.addData.imgUrlList ,
      title: data.addData.title,
      userId: 0,
      // videoUrl: "string",
    })
    .then(async function (res) {
      if (res.status === 200) {
        data.listItem.pageNum = 1;
        await getList();
        ElMessage({
          message: "发布成功",
          type: "success",
        });
      }
    });
};
//------------获取列表part
const getList = () => {
  data.loading = true;
  axios
    .post("/business/tags/get/page", {
      pageNum: data.listItem.pageNum,
      pageSize: data.listItem.pageSize,
    })
    .then(function (res) {
      data.listItem.pageNum++;
      if (res.data.list.length > 0) {
        data.listItem.invitationList = [...res.data.list];
      }
      data.listItem.loading = true;
      data.loading = false;

    });
};
//------------点赞part
const pointLike=(item:any)=>{
  if(item.userLikeStatus===1){
    axios
    .delete(`/business/like/delete?tagId=${item.id}&userId=${userInfo.userId}`)
    .then(function (res) {
      data.listItem.pageNum = 1;
      item.likesList.pop();
      item.userLikeStatus = null;
      console.log(item)
    });
  }else{
    axios
    .post("/business/like/add", {
        statuType: 0,//0点赞  1取消点赞
        tagId: item.id,
        userId: userInfo.userId
    })
    .then(function (res) {
      data.listItem.pageNum = 1;
      item.userLikeStatus = 1;
      item.likesList.push({});
    });
  }

}
//------------评论part
const commentFun=(item:any)=>{
    axios
    .post(`/business/comment/add`, {
      comment: 0,//0点赞  1取消点赞
      parentId:null,
      tagId: item.id,
      userId: userInfo.userId
    })
    .then(function (res) {
      data.listItem.pageNum = 1;
        getList();
    });
}
//------------删除帖子part
const deleteInvitation = (val: any) => {
  ElMessageBox.confirm(
    "您确定要删除该帖子吗?",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
    }
  ).then(() => {
    axios.delete(`/business/tags/delete/${val}`).then(function (res) {
      data.listItem.pageNum = 1;
        getList();
      ElMessage({
        message: "删除成功",
        type: "success",
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
