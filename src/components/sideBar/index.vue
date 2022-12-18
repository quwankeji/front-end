<template>
  <div class="sidebar-wrap">
    <div class="logo-wrap">
      <el-image :src="LOGO" :fit="true" />
    </div>
    <div class="menu">
      <el-menu
        router
        :default-active="router.currentRoute.value.fullPath"
        class="el-menu-vertical-demo"
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          广场
        </el-menu-item>
        <el-menu-item index="/team">
          <n-icon size="20">
            <people-team-32-regular />
          </n-icon>
          组队
        </el-menu-item>
        <el-badge
          :value="data.messageNum"
          class="item"
          v-if="store.getters.getUserInfo && data.messageNum"
        >
          <el-menu-item index="/message">
            <n-icon size="18">
              <bell-regular />
            </n-icon>
            消息通知
          </el-menu-item>
        </el-badge>
        <!--  <el-menu-item index="1">
          <el-icon><House /></el-icon>
          话题
        </el-menu-item>
        <el-menu-item index="2">
          <el-icon><House /></el-icon>
          话题
        </el-menu-item>
        <el-menu-item index="3">
          <el-icon><House /></el-icon>
          主页
        </el-menu-item>
        <el-menu-item index="4">
          <el-icon><House /></el-icon>
          提醒
        </el-menu-item> -->
        <!-- <el-menu-item
          index=""
          @click="openChat"
          v-if="store.getters.getUserInfo"
        >
          <el-icon><ChatRound /></el-icon>
          聊天
        </el-menu-item> -->
        <el-menu-item index="/collect" v-if="store.getters.getUserInfo">
          <n-icon size="20">
                <star-12-regular
                ></star-12-regular>
            </n-icon>

          收藏
        </el-menu-item>

        <el-menu-item
          index="/message"
          v-if="store.getters.getUserInfo && data.messageNum === 0"
        >
          <el-icon><Star /></el-icon>
          消息通知
        </el-menu-item>
        <el-menu-item index="/my" v-if="store.getters.getUserInfo">
          <n-icon size="18">
              <user-regular />
            </n-icon>
          
          我的
        </el-menu-item>
      </el-menu>
    </div>
    <div class="user_wrap">
      <el-button
        v-if="!store.getters.getUserInfo"
        type="text"
        class="login"
        @click="loginFun"
        >登录</el-button
      >
      <el-button
        v-if="!store.getters.getUserInfo"
        type="text"
        class="register"
        @click="loginFun"
        >注册</el-button
      >
      <el-avatar
        v-if="store.getters.getUserInfo"
        :size="30"
        :max="30"
        :src="store.getters.getUserInfo.portrait"
      />
      <div v-if="store.getters.getUserInfo">
        <div>
          <span class="user_name">{{ store.getters.getUserInfo?.name }}</span
          ><n-icon :size="20" @click="loginOut"><log-out-outline /></n-icon>
        </div>
        <p class="signature" :title="store.getters.getUserInfo?.signature">
          {{ store.getters.getUserInfo?.signature }}
        </p>
      </div>
    </div>
  </div>

  <el-dialog v-model="data.dialogTableVisible" :width="1200" title="会话">
    <chat />
  </el-dialog>
  <login ref="loginDialog"></login>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { NIcon, NBadge, useMessage } from "naive-ui";
import LOGO from "@/assets/img/logo.png";
import { userInfo } from "@/util/user";
import { LogOutOutline } from "@vicons/ionicons5";
import { PeopleTeam32Regular,Star12Regular } from "@vicons/fluent";
import { BellRegular,UserRegular } from "@vicons/fa";

import request from "@/http/request";
import chat from "@/components/chat/index.vue";
import login from "@/views/login/index.vue";
const loginDialog = ref(null);
const router: any = useRouter();
const store = useStore();

const data = reactive({
  dialogTableVisible: false,
  showLogin: true,
  messageNum: 0,
});
//------------聊天
const openChat = () => {
  if (!localStorage.rongYunToken) {
    return ElMessage({
      message: "请先登录！",
      type: "error",
    });
  }
  data.dialogTableVisible = true;
};
const loginFun = () => {
  store.commit("setUserVisible", true);
};
const loginOut = () => {
  store.commit("removeUserInfo", () => {
    router.push({
      path: "/",
    });
    ElMessage({
      message: "登出成功！",
      type: "success",
      duration: 5000,
    });
    window.location.reload();
  });
};
const getMessageNum = () => {
  request({
    url: `/business/notice/get/number`,
    method: "get",
  })
    .then((res: any) => {
      data.messageNum = res;
    })
    .catch((err) => {
      ElMessage({
        message: err,
        type: "error",
      });
    });
};
onMounted(() => {
  debugger
  let timer = null;
  if (store.getters.getUserInfo) {
    timer = setInterval(() => {
      getMessageNum();
    }, 2000);
  } else {
    clearInterval(timer);
  }
});
</script>

<style lang="less" scoped>
@import "@/assets/css/sideBar.less";
</style>
