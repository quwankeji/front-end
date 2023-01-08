<template>
  <div class="chat" style="display: flex">
    <div class="chat-conversation">
      <conversation-list ref="conversationList" base-size="10px" />
    </div>
    <div class="chat-message">
      <div class="chat-massage-list">
        <message-list ref="messageList" base-size="10px"></message-list>
      </div>
      <div class="chat-massage-editor">
        <message-editor ref="messageEditor" base-size="10px"></message-editor>
      </div>
    </div>
  </div>
</template>

<script>
import { defineCustomElements, imkit } from "@rongcloud/imkit";
import { ConversationType } from "@rongcloud/engine";
import { CoreEvent } from "@rongcloud/imkit";
export default {
  name: "RongYun",
  created() {
    // 应用初始化，务必保证此过程只执行一次
    defineCustomElements();
    this.initImkit()
  },
  mounted() {
    // 获取到标签元素
    const conversationList = this.$refs.conversationList;
    // 获取到标签元素
    const messageList = this.$refs.messageList;
    /**
     * 添加点击会话监听
     */
    conversationList.addEventListener(
      "tapConversation",
      this.handleTapConversation
    );

    /**
     * 添加删除会话监听
     */
    conversationList.addEventListener(
      "deleteConversation",
      this.handleDeleteConversation
    );
    /**
     * 添加点击消息监听
     * 注意：仅有点击图片消息和文件消息会触发监听
     */
    messageList.addEventListener("tapMessage", this.handleTapMessage);
    // connect 方法需要等待页面加载完成后进行调用
    this.createImkit();
  },
  
  methods: {
    handleTapConversation() {
      console.info("handleTapConversation");
    },
    handleDeleteConversation() {
      console.info("handleDeleteConversation");
    },
    handleTapMessage(e) {
      const data = e.detail;
      // 处理点击查看大图或文件消息下载等功能
      console.log("点击消息触发监听:", data);
    },
    //初始化imkit及初始化配置
    initImkit() {
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
            debugger
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
    },
    // 创建imkit连接
    createImkit() {
  let rongYunToken = localStorage.rongYunToken ?? null;

      imkit
        .connect(rongYunToken)
        .then((res) => {
          console.info("连接结果打印：", res);
          // 加载会话列表 CoreEvent 可通过 import { CoreEvent } from '@rongcloud/imkit' 获取
          imkit.emit(CoreEvent.CONVERSATION, true);
        });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.chat {
  width: 100%;
  height: 500px;
}

.chat-conversation {
  float: left;
  width: 30vw;
  height: 100%;
}

.chat-message {
  float: left;
  width: 70vw;
  height: 100%;
}

.chat-massage-list {
  height: calc(100% - 220px);
}

.chat-massage-editor {
  height: 220px;
}
</style>