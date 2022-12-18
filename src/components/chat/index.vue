<template>
  <div class="chat">
    <el-row>
      <el-col class="left-list" :span="8">
        <el-menu
          :default-active="data.activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="1">好友列表</el-menu-item>
          <el-menu-item index="2">会话列表</el-menu-item>
        </el-menu>
        <div v-if="data.activeIndex == '1'" class="friends-list">
          <ul
            class="infinite-list"
            v-infinite-scroll="load"
            infinite-scroll-throttle-delay="200"
            :infinite-scroll-disabled="data.busy"
            infinite-scroll-distance="10" 
          >
            <li
              v-for="i in data.friendList"
              :key="i"
              class="infinite-list-item"
            >
              
              <el-avatar :size="30" :max="30" :src="i.portrait" />
              {{ i.name }}
            </li>
            <!-- <div v-if="loadingShow" class="floor">
              <div class="floor_text">正在加载</div>
            </div>
            <div v-if="loadingError" class="floor">
              <div class="floor_text">加载失败</div> 
            </div> -->
          </ul>
        </div>
        <div v-if="data.activeIndex == '2'">
          <div class="chat-conversation">
            <conversation-list ref="conversationList" base-size="10px" />
          </div>
        </div>
      </el-col>
      <el-col :span="16"
        ><div class="grid-content ep-bg-purple-light" />
        <div class="chat-message">
          <div class="chat-massage-list">
            <message-list ref="messageList" base-size="10px"></message-list>
          </div>
          <div class="chat-massage-editor">
            <message-editor
              ref="messageEditor"
              base-size="10px"
            ></message-editor>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, refs } from "vue";
import infiniteScroll from "vue-infinite-scroll";
import { defineCustomElements, imkit } from "@rongcloud/imkit";
import { ConversationType } from "@rongcloud/engine";
import { CoreEvent } from "@rongcloud/imkit";
const data = reactive({
  friendList: [] as any,
  activeIndex: "1",
  busy: false,
});
const load = () => {
  data.busy = true;

  setTimeout(() => {
    for (var i = 0, j = 1; i < j; i++) {
      data.friendList.push({
          id: i ,
          userId: i ,
          relationUserId: 2,
          type: 0,
          createdTime: null,
          updatedTime: null,
          name: "small b son",
          sex: "男"+i,
          signature: "不要迷恋哥，"+i,
          portrait:
            "http://114.132.180.207:8888/group1/M00/00/01/CgAIBmOMqXSAMUetAAE5H1wqFPk86.jpeg",
      });
    }
    data.busy = false;
  }, 1000);
};
const handleSelect = (val: any) => {
  data.activeIndex = val;
  if (val === "2") {
    initEllements();
  }
};
const initEllements = () => {
  const conversationList: any = ref(null);
  //添加点击会话监听
  conversationList.addEventListener(
    "tapConversation"
    // this.handleTapConversation //回调处理函数
  );
  //添加删除会话监听
  conversationList.addEventListener(
    "deleteConversation"
    // this.handleDeleteConversation //回调处理函数
  );
  createImkit();
};
//初始化imkit及初始化配置
const initImkit = () => {
  var libOption = { appkey: "25wehl3u2es7w" };
  var custom_service = {
    // 获取用户详情
    getUserProfile: (userId) => {
      // 需要通过 userId 向应用服务器获取 user 信息，拼接成如下格式
      // 注意：userInfo 的 Key 不可修改
      const userInfo = {
        id: "0",
        name: "0",
        portraitUri: null,
      };
      return Promise.resolve(userInfo);
    },

    // 获取会话详情
    getConversationProfile: (conversations) => {
      // SDK 返回 conversations 为会话列表，可根据返回的 conversations 向应用服务器请求会话详情信息。
      // 请根据具体 conversation 信息匹配 name、portraitUri 拼接到 converationInfo 信息中。
      const promises = [];
      conversations.forEach((conversation) => {
        const converationInfo = {
          ...conversation,
          name: `会话名称`,
          portraitUri: `会话头像 URI`,
        };
        if (conversation == ConversationType.GROUP) {
          converationInfo.memberCount = 0; // memberCount 为群成员数量需要业务侧修改
        }
        // 只需要传递 converationInfo 信息，整体返回的数据格式不可改变
        promises.push(Promise.resolve(converationInfo));
      });
      return Promise.all(promises);
    },

    // 获取群组详情
    getGroupMembers: (conversation) => {
      // 通过 conversation 的 targetid 获取群组成员信息
      // groupMembers 为群组成员 list，需要构建成对象数组。
      // 特别注意：如果传递的群组成员信息不准确会影响 @ 信息的发送和群组成员昵称的展示
      const groupMembers = [
        {
          id: `【成员】成员 ID`,
          name: `【成员】name`,
          portraitUri: `【成员】头像 URI`,
        },
      ];
      return Promise.resolve();
    },
  };
  imkit.init({
    //以下两个属性为初始化必传参数
    service: custom_service,
    libOption: libOption,
  });
};
//创建融云连接
const createImkit = () => {
  let rongYunToken = localStorage.rongYunToken ?? null;
  // "8Le8Hqs25cM7RcKoc9mK4J/IAp9AdeV3@0153.cn.rongnav.com;0153.cn.rongcfg.com"
  console.log(rongYunToken);
  imkit.connect(localStorage.rongYunToken).then((res) => {
    console.info("连接结果打印：", res);
    // 加载会话列表 CoreEvent 可通过 import { CoreEvent } from '@rongcloud/imkit' 获取
    imkit.emit(CoreEvent.CONVERSATION, true);
  });
};
onMounted(() => {
  defineCustomElements();
  initImkit();
});
</script>

<style lang="less" scoped>
.chat {
  height: 500px;
  .el-row {
    height: 100%;
    .el-menu{
      display: flex;
      justify-content: space-between;
      li{
        width: 50%;
        &:hover,&.is-active{
          background: none;
        }
      }
    }
    .left-list {
      height: 100%;
      border-right: 1px solid #eee;
      .friends-list {
        height: calc(100% - 59px);
        .infinite-list {
          height: 100%;
          overflow-y: auto;
          list-style: none;
        }
        .infinite-list .infinite-list-item {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          height: 50px;
          margin: 10px;
          cursor: pointer;
          border-bottom: 1px solid #eee;
          .el-avatar{
            margin-right: 10px;
          }
        }
        .infinite-list .infinite-list-item + .list-item {
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
