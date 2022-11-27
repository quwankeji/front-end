<template>
  <div class="sidebar-wrap">
    <div class="logo-wrap">
      <el-image :src="LOGO" :fit="true" />
    </div>
    <div class="menu">
      <el-menu
        default-active="0"
        class="el-menu-vertical-demo"
      >
      
        <el-menu-item index="0">
          <el-icon><House /></el-icon>
          广场
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
        <el-menu-item index="4" @click="openChat">
          <el-icon><ChatRound /></el-icon>
          聊天
        </el-menu-item>
        <el-menu-item index="5">
          <el-icon><Pointer /></el-icon>
          点赞
        </el-menu-item>
        <el-menu-item index="6">
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
    <div class="user_button">
          <el-button type="text" @click="loginFun">登录</el-button>
          <el-button type="text" @click="loginFun">注册</el-button>
      </div>
  </div>
  <el-dialog v-model="data.dialogTableVisible" :width="1200" title="会话">
    <chat />
  </el-dialog>
  <el-dialog v-model="data.userVisible" :width="300" title="登录">
    <login />
  </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted,reactive } from "vue";
import LOGO from "@/assets/img/logo.png";
import chat from "@/components/chat/index.vue";
import login from "@/views/user/index.vue";

const data = reactive({
  dialogTableVisible:false,
  userVisible:false
})
//------------聊天
const openChat= () => {
  data.dialogTableVisible = true;
};
const loginFun = ()=>{
  data.userVisible = true;
}
</script>

<style lang="less" scoped>
@import "@/assets/css/sideBar.less";
</style>
