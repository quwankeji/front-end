<template>
    <div class="rightbar-wrap">
      <div class="copyright">
      <a class="ym">© 2023 quwan.tech</a>
      <a href="https://beian.miit.gov.cn/" target="_blank" class="hash-link nav-link">湘ICP备2023000923号-1</a>
    </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, onUnmounted } from "vue";
  import LOGO from "@/assets/img/logo.png";
  </script>
  
  <style lang="less" scoped>
//   @import "@/assets/css/sideBar.less";
.rightbar-wrap{
  margin-left: 10px;
  position: relative;
    height: 100%;
    width: 180px;
}
.copyright{
     /* background-color: #18181c; */
     position: absolute;
    width: 100%;
    bottom: 0;
    border-radius: 3px;
     text-align: center;
    font-size: 12px;
    padding: 12px 16px;
    line-height: 22px;
    text-align: left;
    background-color: #18181c;
    box-sizing: border-box;
    a{
      &.ym{
        color: rgba(255, 255, 255, 0.82);
      }
      display: block;
      color: #333;
    opacity: .75;
    height: 22px;
    line-height: 22px;
    }
}
  </style>
  