<template>
  <div class="main">
    <!-- 侧边栏 -->
    <!-- <sideBar /> -->
    <div class="content-wrap">
      <square />
    </div>
    <!-- <rightBar /> -->
  </div>
</template>
<script>
import { ref, onMounted, toRefs } from "vue";
import sideBar from "@/components/sideBar/index.vue";
import rightBar from "@/components/rightBar/index.vue";
import square from "@/views/square/square.vue";

export default {
  components: {
    sideBar,
    rightBar,
    square,
  },
  setup(props, context) {
    const commer = ref(null); //获取div元素
    const methods = {
      clickChild: function (params) {
        commer.value.btnClick();
      },
    };
    return {
      commer, //此处不需要用...
      ...methods,
    };
  },
};
</script>
<style lang="less" scoped></style>
