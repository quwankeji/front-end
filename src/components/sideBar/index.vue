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
        <el-menu-item index="4">
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import LOGO from "@/assets/img/logo.png";
</script>

<style lang="less" scoped>
@import "@/assets/css/sideBar.less";
</style>
