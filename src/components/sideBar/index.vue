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
        <el-menu-item index="/team" >
          <el-icon><House /></el-icon>
          组队
        </el-menu-item>
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
        <el-menu-item index="" @click="openChat" v-if="userInfo">
          <el-icon><ChatRound /></el-icon>
          聊天
        </el-menu-item>
        <el-menu-item index="5" v-if="userInfo">
          <el-icon><Pointer /></el-icon>
          点赞
        </el-menu-item>
        <el-menu-item index="6" v-if="userInfo">
          <el-icon><Star /></el-icon>
          收藏
        </el-menu-item>
        <!-- <el-menu-item index="7">
          <el-icon><House /></el-icon>
          钱包
        </el-menu-item>
        <el-menu-item index="8">
          <el-icon><House /></el-icon>
          设置
        </el-menu-item> -->
      </el-menu>
    </div>
    <div class="user_wrap">
      <el-button v-if="!userInfo" type="text" class="login" @click="loginFun">登录</el-button>
      <el-button v-if="!userInfo" type="text" class="register" @click="loginFun">注册</el-button>
      <el-avatar v-if="userInfo"
        :size="30"
        :max="30"
        src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
      />
      <span>{{userInfo?.name }}</span>
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
import { ElMessage, ElMessageBox } from "element-plus";
import LOGO from "@/assets/img/logo.png";
import { userInfo } from "@/state/user";
import chat from "@/components/chat/index.vue";
import login from "@/views/user/index.vue";
const loginDialog = ref(null);
const router: any = useRouter();
const data = reactive({
  dialogTableVisible: false,
  userVisible: false,
  showLogin: true,
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
  loginDialog.value.data.userVisible = true;
};
</script>

<style lang="less" scoped>
@import "@/assets/css/sideBar.less";
</style>
