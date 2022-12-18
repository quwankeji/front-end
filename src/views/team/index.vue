<template>
  <div class="content-wrap">
    <div class="square_header border">
      组队
      <el-icon class="addTeam" @click="addTeam" title="发起组队"
        ><Plus /></el-icon>
    </div>
    <div
      class="comment_item border"
    >
    <div class="list_item_box">
      <div
        class="list_item padding"
        v-for="(item, index) in data.listItem.invitationList"
        :key="item.id + index"
        @click="toDetail(item.id)"
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
              v-if="item.userId === userInfo?.id"
              ><DeleteFilled
            /></el-icon>
          </div>
        </div>
        <!-- 主要内容 -->
        <div class="comment_content">
          <!-- 文字部分 -->
          <p class="title">{{ item.title }}</p>
          <p class="text">
           <label>人数：</label> {{ item.peopleNum }}
          </p>
          <p class="text">
            <label>时间：</label>{{   dateFormatPipe(item.startTime, "YYYY-MM-DD HH:mm") }}&nbsp至&nbsp{{ dateFormatPipe(item.endTime, "YYYY-MM-DD HH:mm")}}
          </p>
          <p class="text">
            <label>内容：</label> {{ item.content }}
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
          <div class="opt-item"   @click.stop="joinTeam(item)">
            <n-icon size="20" :title="item.userTeamStatus?'取消加入':'加入组队'">
                <people-team-add-24-regular v-if="!item.userTeamStatus" />
                <people-team-32-filled v-if="item.userTeamStatus" color="#63e2b7" />
              </n-icon>
          </div>
          <div class="opt-item"  @click.stop="pointLike(2,item)">
            <n-icon size="20">
                <heart-outline v-if="!item.userLikeStatus" />
                <heart v-if="item.userLikeStatus" color="#f56c6c" />
              </n-icon>
              <span>{{ item.likesList.length }}</span>
          </div>
          <div class="opt-item" @click.stop="pointStar(2,item)">
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
  </div>
    <InitiateTeam ref="addTeamDialog" :getList="getList" />
</template>

<script lang="ts" setup>
import { ref, reactive, toRefs,onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { dateFormatPipe } from "@/util/index";
import { userInfo} from "@/util/user";
import request from "@/http/request"; // 引入封装的request.js文件
import { pointStar, pointLike,joinTeam } from "@/util/common.ts";
import { NIcon } from "naive-ui";
import { ImageOutline, HeartOutline, Heart } from "@vicons/ionicons5";
import { LikeFilled, LikeOutlined } from "@vicons/antd";
import { Comment20Regular, Star12Regular, Star12Filled,PeopleTeamAdd24Regular,PeopleTeam32Filled } from "@vicons/fluent";

import InitiateTeam from "@/components/team/InitiateTeam.vue";
const addTeamDialog:any = ref(null)

const router = useRouter();
const data = reactive({
  textarea: "",
  fileList: [],
  loading: false,
  userImg:
    "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
  
  listItem: {
    pageNum: 1,
    pageSize: 20,
    initLoading: true,
    loading: false,
    total:0,
    invitationList: [] as any,
  },
});
//------------发起组队
const addTeam = () => {
  addTeamDialog.value.data.visible = true
};
const handleSizeChange = (val: number) => {
  data.listItem.pageSize = val;
  getList();
};
const handleCurrentChange = (val: number) => {
  data.listItem.pageNum = val;
  getList();
};
//------------获取列表part
const getList = () => {
  request({
    url: `/business/tags/get/page`,
    method: "post",
    data: {
      pageNum: data.listItem.pageNum,
      pageSize: data.listItem.pageSize,
      tagType:2
    },
    loading:true

  })
    .then((res: any) => {
      if (res && res.list.length > 0) {
        data.listItem.invitationList = [...res.list];
      }
      data.listItem.total = res.total;
   
    })
    .catch((err) => {
      ElMessage({
                message:err,
                type: 'error',
                duration: 3000
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
    loading:true

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
    path: "/team/teamDetail",
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
  .comment_item{
 
height:  calc(100% - 118px);
overflow-y: auto;
.list_item_box{
  height:  100%;
overflow-y: auto;
}
  }
}
</style>
