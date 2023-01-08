<template>
    <div class="whole-wrapper">
        aaaaaaaaaaaaa
      <!-- 左边的聊天列表 -->
      <div class="left_whole_wrapper">
        <!-- 搜索框 -->
        <div class="search">
          <el-input placeholder="搜索联系人" suffix-icon="el-icon-search" v-model="find" @input="searchChange"></el-input>
        </div>
        <!-- 聊天列表 -->
        <div class="left_wrapper" style="overflow-y:auto;" v-if="chatList">
          <div class="left-item" v-for="(item,index) in chatList" :key="index" @click="clickItem(item,index)" :class="{active:targetId==item.targetId}">
            <div class="left-item-left">
              <div class="left-item-head"><img :src="item.head"></div>
              <div class="left-item-info">
                <div class="left-item-info_title">{{item.name}}</div>
                <div class="left-item-info_content">{{item.info}}</div>
              </div>
            </div>
            <div class="left-item-time">
              <div class="left-item-time-time">{{item.time}}</div>
              <div class="left-item-time-number" v-if="item.number">{{item.number}}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 中间的对话-->
      <div class="center_whole_wrapper" v-if="dialogueInfo">
        <div class="center_wrapper">
          <!-- 上面的表头 -->
          <div class="center_wrapper_top">
            <div class="center_wrapper_top_name">{{dialogueInfo.name}}</div>
            <div class="center_wrapper_top_number">{{dialogueInfo.phone}}</div>
          </div>
          <!-- 中间的聊天框，尝试模拟数据 -->
          <div class="center_wrapper_center" style="overflow-y:auto;" ref="dialogue_box">
            <div class="item loading">{{loadText}}<span>{{"第" + pageNum + "页"}}</span></div>
            <div v-for="(item,index) in dialogueInfo.dialogueList" :key="index" :class="item.other?center_wrapper_center_item:center_wrapper_center_item_reserve">
              <div class="left-item-head"><img :src="item.head"></div>
              <!-- 文字 -->
              <div class="center-item-info_wrapper" v-if="item.text">
                <div class="center-item-tip">
                  <div class="center-item-info">{{item.text}}</div>
                  <div class="error-tip" v-if="item.send"><img src="../../../public/img/bg/error.png"></div>
                </div>
                <div class="center-item-time">{{item.date}}</div>
              </div>
              <!-- 图片 -->
              <div class="center-item-info_wrapper" v-if="item.img">
                <div class="center-item-tip">
                  <div class="center-item-info_img">
                    <el-image :src="item.img" :preview-src-list="item.srcList" :fit="contain" v-loading="item.loading">
                    </el-image>
                  </div>
                  <div class="error-tip" v-if="item.send"><img src="../../../public/img/bg/error.png"></div>
                </div>
                <div class="center-item-time">{{item.date}}</div>
              </div>
              <!-- 音频 -->
              <div class="center-item-info_wrapper" v-if="item.audio">
                <div class="center-item-tip">
                  <audio :src="item.audio" controls></audio>
                  <div class="error-tip" v-if="item.send"><img src="../../../public/img/bg/error.png"></div>
                </div>
                <div class="center-item-time">{{item.date}}</div>
              </div>
              <!-- 视频 -->
              <div class="center-item-info_wrapper" v-if="item.video">
                <div class="center-item-tip">
                  <video :src="item.video" controls></video>
                  <div class="error-tip" v-if="item.send"><img src="../../../public/img/bg/error.png"></div>
                </div><strong></strong>
                <div class="center-item-time">{{item.date}}</div>
              </div>
            </div>
          </div>
          <!-- 下面的输入框，发送 -->
          <div class="center_wrapper_right">
            <div class="icon-list">
              <!-- 表情 -->
              <div class="icon-item" title="表情">
                <el-popover placement="top" width="450" trigger="click">
                  <div style="width: 100%;height: 280px;display: flex;flex-wrap: wrap;overflow-y:auto;">
                    <div class="emoji_icon" style="width: 5%;padding: 10px;" v-for="(item,index) in emojiList" :key="index"
                      @click="clickEmoji(item.emoji)">{{item.emoji}}
                    </div>
                  </div>
                  <el-button slot="reference" style="border: none;padding:0;"><img class="icon-item-img" src="../../../public/img/bg/emoji.png"></el-button>
                </el-popover>
              </div>
              <!-- 上传文件 -->
              <div class="icon-item">
                <el-upload class="avatar-uploader" action="/api/blade-app/filemgr/upload" :show-file-list="false"
                  :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
                  <div class="icon-item" title="发送文件"><img class="icon-item-img" src="../../../public/img/bg/photo.png"></div>
                </el-upload>
              </div>
              <!-- 聊天记录 -->
              <div class="icon-item" title="聊天记录" @click="clickHistory"><img class="icon-item-img" src="../../../public/img/bg/record.png"></div>
              <!-- 模拟消息提醒弹框 -->
              <!-- <el-button
                plain
                @click="notifyByOrder">
                使用 HTML 片段
              </el-button> -->
            </div>
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea" @keyup.enter.native="sendTextarea"></el-input>
            <el-button type="primary" @click="sendTextarea">发送</el-button>
          </div>
        </div>
      </div>
  
      <!-- 右边的聊天记录 -->
      <div class="center_whole_wrapper right_whole_wrapper">
        <div class="center_wrapper right_wrapper" v-if="showHistory">
          <div class="center_wrapper_center right_wrapper_center" style="overflow-y:auto;" ref="dialogue_record">
            <div class="item loading">{{loadText1}}<span>{{"第" + pageNum1 + "页"}}</span></div>
            <div v-for="(item,index) in dialogueInfo.dialogueList" :key="index" :class="isOther?center_wrapper_center_item:center_wrapper_center_item_reserve">
              <div class="left-item-head"><img :src="item.head"></div>
              <!-- 文字 -->
              <div class="center-item-info_wrapper" v-if="item.text">
                <div class="center-item-name">{{item.name}}</div>
                <div class="center-item-info">{{item.text}}</div>
                <div class="center-item-time">{{item.date}}</div>
              </div>
              <!-- 图片 -->
              <div class="center-item-info_wrapper" v-if="item.img">
                <div class="center-item-name">{{item.name}}</div>
                <div class="center-item-info_img">
                  <el-image :src="item.img" :preview-src-list="item.srcList" :fit="contain">
                  </el-image>
                </div>
                <div class="center-item-time">{{item.date}}</div>
              </div>
              <!-- 音频 -->
              <div class="center-item-info_wrapper" v-if="item.audio">
                <div class="center-item-name">{{item.name}}</div>
                <audio :src="item.audio" controls></audio>
                <div class="center-item-time">{{item.date}}</div>
              </div>
              <!-- 视频 -->
              <div class="center-item-info_wrapper" v-if="item.video">
                <div class="center-item-name">{{item.name}}</div>
                <video :src="item.video" controls></video>
                <div class="center-item-time">{{item.date}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
    import {
      getToken,
      getChatList
    } from "@/api/app/chat";
    import {
      dateFormat
    } from "@/util/date.js";
  
    var RongIMLib = window.RongIMLib;
    var RongIMClient = RongIMLib.RongIMClient;
    var RongIMEmoji = RongIMLib.RongIMEmoji;
    export default {
      data() {
        return {
          chatList: [
            // {
            //   "targetId": "1123598821738675201",
            //   "head": "https://gitee.com/uploads/61/632261_smallweigit.jpg",
            //   "name": "济南亨达通汽修厂1",
            //   "info": "转账了，麻烦下午尽快发货。转账了，麻烦下午尽快发货。转账了，麻烦下午尽快发货。",
            //   "time": "17:45",
            //   "phone": "18888888888",
            //   "number": "3"
            // }
          ],
          //存储条件查询时 原来的数组
          findList: [],
          // 搜索联系人
          find: '',
          // 发送文字
          textarea: '',
          // 模拟对话
          dialogueInfo: {
            index: 0,
            hasMsg: true,
            targetId: "", //对方的id
            name: "", //对方的名字
            phone: "", //对方的手机号
            head: "https://gitee.com/uploads/61/632261_smallweigit.jpg", //对方的头像
            dialogueList: [
              //   {
              //   // 判断是对方
              //   other: true,
              //   head: "https://gitee.com/uploads/61/632261_smallweigit.jpg",
              //   text: "在吗？我发询价了（右后减震器、左后减震器防尘套）需要原厂件请尽快报价。",
              //   // img: "http://124.128.226.225:8083/upload/1301812392719626241.png",
              //   // audio: "https://www.w3school.com.cn/i/horse.ogg",
              //   // video: "https://www.w3school.com.cn/i/movie.ogg",
              //   date: "2019-07-17 9:25:15",
              //   send: false,
              //   name: "济南亨达通汽修厂1"
              // },
            ],
          },
          // 右边的聊天记录，用于判断是对方说的，ture,选择样式1
          isOther: true,
          center_wrapper_center_item: "center_wrapper_center_item",
          center_wrapper_center_item_reserve: "center_wrapper_center_item_reserve",
          // 判断是否显示聊天记录
          showHistory: false,
          // 点击的子项
          targetId: "",
          //我的targetId
          mytargetId: "",
          //我的头像
          myhead: '',
          //我的名字
          myname: '',
          // 上传文件
          fileList: [],
          imageUrl: '',
          // 新增上滚方法
          scrollHeight: 0,
          list: [],
          loadText: "加载中...",
          pageNum: 1,
          loadText1: "加载中...",
          pageNum1: 1,
          // 模拟图片放大
          url: 'http://gudian-qpc.oss-cn-hangzhou.aliyuncs.com/2020/1329338563854811138.png',
          srcList: [
            'http://gudian-qpc.oss-cn-hangzhou.aliyuncs.com/2020/1329338563854811138.png',
          ],
          loading: false,
          // 表情包列表
          emojiList: []
        }
      },
      created() {
        this.loadComments();
        getToken().then(res => {
          var appkey = 'vnroth0kvb2mo'
          var token = res.data.data;
          this.init(appkey, token)
          // 默认是当前对话
          this.targetId = this.dialogueInfo.targetId
        });
        // this.notifyByOrder();
      },
      // 将滚动条定位到底部
      updated() {
        // 中间的聊天框
        const dialogue_box = this.$refs.dialogue_box;
        dialogue_box.scrollTop = dialogue_box.scrollHeight;
        // 右边的聊天记录
        if (this.$refs.dialogue_record) {
          const dialogue_record = this.$refs.dialogue_record;
          dialogue_record.scrollTop = dialogue_record.scrollHeight;
          this.handleRightScroll();
        }
      },
      mounted() {
        this.handleCenterScroll();
      },
      methods: {
        //初始化个人信息
        loadComments() {
          var info = JSON.parse(localStorage.getItem("saber-userInfo"));
          this.myhead = info.content.avatar;
          this.myname = info.content.nick_name;
        },
  
        //初始化链接方法
        init: function(appkey, token) {
          var _this = this;
          var params = {
            appkey: appkey,
            token: token
          }
          RongIMEmoji.init();
          this.emojiList = RongIMLib.RongIMEmoji.list;
          RongIMClient.init(appkey, null, params);
          RongIMClient.setConnectionStatusListener({
            onChanged: function(status) {
              switch (status) {
                case RongIMLib.ConnectionStatus['CONNECTED']:
                case 0:
                  console.log('连接成功')
                  _this.$store.commit("SET_LINK_STATE", 1);
                  break
                case RongIMLib.ConnectionStatus['CONNECTING']:
                case 1:
                  console.log('连接中')
                  break
                case RongIMLib.ConnectionStatus['DISCONNECTED']:
                case 2:
                  console.log('当前用户主动断开链接')
                  break
                case RongIMLib.ConnectionStatus['NETWORK_UNAVAILABLE']:
                case 3:
                  console.log('网络不可用')
                  break
                case RongIMLib.ConnectionStatus['CONNECTION_CLOSED']:
                case 4:
                  console.log('未知原因，连接关闭')
                  break
                case RongIMLib.ConnectionStatus['KICKED_OFFLINE_BY_OTHER_CLIENT']:
                case 6:
                  console.log('用户账户在其他设备登录，本机被踢掉线')
                  break
                case RongIMLib.ConnectionStatus['DOMAIN_INCORRECT']:
                case 12:
                  console.log('当前运行域名错误，请检查安全域名配置')
                  break
              }
            }
          })
          RongIMClient.setOnReceiveMessageListener({
            // 接收到的消息
            onReceived: function(message) {
              // 判断消息类型
              switch (message.messageType) {
                case RongIMClient.MessageType.TextMessage:
                  _this.handleGetTxt(message);
                  break;
                case RongIMClient.MessageType.ImageMessage:
                  _this.handleGetImg(message);
                  break;
                case RongIMClient.MessageType.VoiceMessage:
                  _this.handleGetVoice(message);
                  break;
              }
            }
          })
          RongIMClient.connect(token, {
            onSuccess: function(userId) {
              console.log('链接成功，id：' + userId)
              _this.mytargetId = userId
              _this.getChatList(true);
            },
            onTokenIncorrect: function() {
              console.log('token无效')
            },
            onError: function(errorCode) {
              switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                  console.log('超时')
                  break;
                case RongIMLib.ConnectionState.UNACCEPTABLE_PAROTOCOL_VERSION:
                  console.log('不可接受的协议版本')
                  break;
                case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
                  console.log('appkey不正确')
                  break;
                case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
                  console.log('服务器不可用')
                  break;
              }
            }
          }, null)
        },
  
        //处理接收到的文字消息
        handleGetTxt: function(message) {
          var info = {
            text: RongIMEmoji.symbolToEmoji(message.content.content),
            date: dateFormat(new Date(message.sentTime), 'yyyy-MM-dd hh:mm:ss'),
            send: false
          }
          if (message.senderUserId == this.mytargetId) {
            //我发出去的(比如app端发出去的，pc端会收到)
            info.other = false;
            info.head = this.myhead
            info.name = this.myname
            this.chatList[this.dialogueInfo.index].info = RongIMEmoji.symbolToEmoji(message.content.content);
            this.dialogueInfo.dialogueList.push(info)
          } else if (message.senderUserId == this.dialogueInfo.targetId) {
            //对方发出去的
            info.other = true;
            info.head = this.dialogueInfo.head
            info.name = this.dialogueInfo.name
            this.chatList[this.dialogueInfo.index].info = RongIMEmoji.symbolToEmoji(message.content.content);
            this.dialogueInfo.dialogueList.push(info)
          } else {
            //聊天列表其他人发出去的（不是现在聊天的人）
            var flag = false;
            for (var i = 0; i < this.chatList.length; i++) {
              if (this.chatList[i].targetId == message.senderUserId) {
                flag = true;
                this.chatList[i].info = RongIMEmoji.symbolToEmoji(message.content.content);
                if (this.chatList[i].number == '') {
                  this.chatList[i].number = '1'
                } else {
                  this.chatList[i].number = (parseInt(this.chatList[i].number) + 1).toString();
                }
                break;
              }
            }
            if (!flag) {
              this.getChatList(false)
            }
          }
          // console.log('新消息 ' + message.targetId + ':' + JSON.stringify(message))
        },
  
        //处理图片方法
        handleGetImg: function(message) {
          var info = {
            srcList: [
              message.content.imageUri
            ],
            img: message.content.imageUri,
            date: dateFormat(new Date(message.sentTime), 'yyyy-MM-dd hh:mm:ss'),
            send: false
          }
          if (message.senderUserId == this.mytargetId) {
            //我发出去的(比如app端发出去的，pc端会收到)
            info.other = false;
            info.head = this.myhead
            info.name = this.myname
            this.chatList[this.dialogueInfo.index].info = '[图片]';
            this.dialogueInfo.dialogueList.push(info)
          } else if (message.senderUserId == this.dialogueInfo.targetId) {
            //对方发出去的
            info.other = true;
            info.head = this.dialogueInfo.head
            info.name = this.dialogueInfo.name
            this.chatList[this.dialogueInfo.index].info = '[图片]';
            this.dialogueInfo.dialogueList.push(info)
          } else {
            //聊天列表其他人发出去的（不是现在聊天的人）
            var flag = false;
            for (var i = 0; i < this.chatList.length; i++) {
              if (this.chatList[i].targetId == message.senderUserId) {
                flag = true;
                this.chatList[i].info = '[图片]';
                if (this.chatList[i].number == '') {
                  this.chatList[i].number = '1'
                } else {
                  this.chatList[i].number = (parseInt(this.chatList[i].number) + 1).toString();
                }
                break;
              }
            }
            if (!flag) {
              this.getChatList(false)
            }
          }
        },
  
        //处理语音方法
        handleGetVoice: function(message) {
          var info = {
            video: message.content.remoteUrl,
            date: dateFormat(new Date(message.sentTime), 'yyyy-MM-dd hh:mm:ss'),
            send: false
          }
          if (message.senderUserId == this.mytargetId) {
            //我发出去的(比如app端发出去的，pc端会收到)
            info.other = false;
            info.head = this.myhead
            info.name = this.myname
            this.chatList[this.dialogueInfo.index].info = '[语音]';
            this.dialogueInfo.dialogueList.push(info)
          } else if (message.senderUserId == this.dialogueInfo.targetId) {
            //对方发出去的
            info.other = true;
            info.head = this.dialogueInfo.head
            info.name = this.dialogueInfo.name
            this.chatList[this.dialogueInfo.index].info = '[语音]';
            this.dialogueInfo.dialogueList.push(info)
          } else {
            //聊天列表其他人发出去的（不是现在聊天的人）
            var flag = false;
            for (var i = 0; i < this.chatList.length; i++) {
              if (this.chatList[i].targetId == message.senderUserId) {
                flag = true;
                this.chatList[i].info = '[语音]';
                if (this.chatList[i].number == '') {
                  this.chatList[i].number = '1'
                } else {
                  this.chatList[i].number = (parseInt(this.chatList[i].number) + 1).toString();
                }
                break;
              }
            }
            if (!flag) {
              this.getChatList(false)
            }
          }
        },
  
        //获取左侧聊天列表方法
        getChatList: function(flag) {
          var _this = this;
          RongIMClient.getInstance().getConversationList({
            onSuccess: function(list) {
              //处理一下图片和语音
              list.forEach((item) => {
                switch (item.latestMessage.messageType) {
                  case "ImageMessage":
                    item.latestMessage.content.content = '[图片]'
                    break;
                  case "HQVoiceMessage":
                    item.latestMessage.content.content = '[语音]'
                    break;
                }
              })
              getChatList(JSON.stringify(list)).then(res => {
                var chatList = res.data.data
                chatList.forEach((item) => {
                  item.info = RongIMEmoji.symbolToEmoji(item.info)
                  if (item.time > new Date(new Date().toLocaleDateString()).getTime()) {
                    item.time = dateFormat(new Date(item.time), 'hh:mm')
                  } else if (item.time > (new Date(new Date().toLocaleDateString()).getTime() -
                      86400000)) {
                    item.time = '昨天'
                  } else {
                    item.time = dateFormat(new Date(item.time), 'MM-dd')
                  }
                })
                _this.chatList = chatList
                if (flag && _this.chatList.length > 0) {
                  _this.clickItem(_this.chatList[0], 0)
                }
              });
            },
            onError: function(error) {
              console(error)
            }
          }, null);
        },
  
        //清除未读方法（聊天列表左侧角标）
        clearCount: function(item) {
          var conversationType = RongIMLib.ConversationType.PRIVATE;
          var targetId = item.targetId;
          RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
            onSuccess: function() {},
            onError: function(error) {}
          });
          item.number = ''
        },
  
        //获取聊天记录
        getDialogueInfo: function(targetId, flag) {
          var _this = this;
          var conversationType = RongIMLib.ConversationType.PRIVATE;
          var targetId = targetId; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id
          var timestrap = flag ? 0 : null; // 默认传 null，若从头开始获取历史消息，请赋值为 0, timestrap = 0;
          var count = 20; // 每次获取的历史消息条数，范围 0-20 条，可以多次获取
          var data = [];
          RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
            onSuccess: function(list, hasMsg) {
  
              _this.dialogueInfo.hasMsg = hasMsg;
              list.forEach((item) => {
                var info = {
                  date: dateFormat(new Date(item.sentTime), 'yyyy-MM-dd hh:mm:ss'),
                  send: false
                }
                switch (item.messageType) {
                  case 'TextMessage':
                    info.text = RongIMEmoji.symbolToEmoji(item.content.content);
                    break;
                  case 'ImageMessage':
                    info.srcList = [
                      item.content.imageUri
                    ];
                    info.img = item.content.imageUri;
                    break;
                  case 'HQVoiceMessage':
                    info.video = item.content.remoteUrl;
                    break;
                }
                if (item.senderUserId == _this.mytargetId) {
                  info.other = false;
                  info.head = _this.myhead
                  info.name = _this.myname
                } else {
                  info.other = true;
                  info.head = _this.dialogueInfo.head
                  info.name = _this.dialogueInfo.name
                }
                data.push(info)
              })
              _this.dialogueInfo.dialogueList = [...data, ..._this.dialogueInfo.dialogueList]
            },
            onError: function(error) {
              console.log('GetHistoryMessages, errorcode:' + error);
            }
          });
        },
  
        //发送文字方法
        sendTxt: function(txt) {
          var msg = new RongIMLib.TextMessage({
            content: txt
          });
          var conversationType = RongIMLib.ConversationType.PRIVATE; // 单聊, 其他会话选择相应的会话类型即可
          var targetId = this.dialogueInfo.targetId; // 目标 Id
          var _this = this;
          var param = {
            other: false,
            head: _this.myhead,
            text: _this.textarea,
            send: false,
            date: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            name: "我"
          }
          RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
            onSuccess: function(message) {
              _this.dialogueInfo.dialogueList.push(param)
            },
            onError: function(errorCode, message) {
              param.send = true;
              _this.dialogueInfo.dialogueList.push(param);
              console.log('发送失败: ' + info + errorCode);
            },
          });
        },
  
        // 点击聊天列表的某一项
        clickItem(item, index) {
          this.dialogueInfo.index = index;
          this.dialogueInfo.targetId = item.targetId;
          this.dialogueInfo.name = item.name;
          this.dialogueInfo.head = item.head;
          this.dialogueInfo.phone = item.phone;
          this.dialogueInfo.hasMsg = true;
          // 设置选中的 targetId
          this.targetId = item.targetId;
          this.clearCount(item);
          this.dialogueInfo.dialogueList = [];
          //从头获取聊天记录
          this.getDialogueInfo(item.targetId, true);
          this.dialogueInfo.hasMsg = true;
          this.pageNum = 1;
          this.pageNum1 = 1;
        },
        getMore() {
          this.getDialogueInfo(this.dialogueInfo.targetId, false);
          this.pageNum++;
          this.pageNum1++;
        },
        // 搜索框变化
        searchChange() {
          //初始化的时候，给findList赋值
          if (this.findList.length == 0 && this.chatList.length != 0) {
            this.findList = this.chatList;
          }
          if (this.find == null || this.find == '') {
            this.chatList = this.findList;
            this.findList = [];
          } else {
            var list = [];
            this.findList.forEach((item) => {
              if (item.name.indexOf(this.find) != -1) {
                list.push(item)
              }
            })
            this.chatList = list
          }
        },
        // 点击发送
        sendTextarea() {
          if (this.textarea != '' && this.textarea != null) {
            this.sendTxt(this.textarea);
            this.chatList[this.dialogueInfo.index].info = this.textarea;
            this.chatList[this.dialogueInfo.index].time = dateFormat(new Date(), 'hh:mm')
            this.textarea = '';
          }
        },
        // 点击出现聊天记录
        clickHistory() {
          this.showHistory = !this.showHistory;
        },
        // 上传前校验
        beforeAvatarUpload(file) {
          const isImage = file.type.includes("image");
          const isLt2M = file.size / 1024 / 1024 < 20;
          if (!isImage) {
            this.$message.error("上传文件类型必须是图片!");
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
          }
          return isImage && isLt2M;
        },
        // 上传成功
        handleAvatarSuccess(res, file) {
          var url = res.data.url;
          var info = {
            srcList: [
              url
            ],
            loading: true,
            img: URL.createObjectURL(file.raw),
            date: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            send: false,
            other: false,
            head: this.myhead,
            name: this.myname,
          }
          this.chatList[this.dialogueInfo.index].info = '[图片]';
          this.chatList[this.dialogueInfo.index].time = dateFormat(new Date(), 'hh:mm');
          this.dialogueInfo.dialogueList.push(info);
  
          var index = this.dialogueInfo.dialogueList.length;
  
          var a = 150;
          var base64 = "";
          var canvas = document.createElement("canvas");
          var ctx = canvas.getContext('2d');
          var Img = new Image();
          Img.setAttribute("crossOrigin", 'anonymous')
          Img.src = url;
          Img.onload = function() {
            var width = ""
            var height = ""
            if (Img.width > Img.height) {
              width = a;
              height = a * Img.height / Img.width;
            } else {
              width = a * Img.width / Img.height;
              height = a;
            }
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(Img, 0, 0, width, height)
            base64 = canvas.toDataURL('image/jpeg')
          };
          var msg = new RongIMLib.ImageMessage({
            content: base64,
            imageUri: url
          });
          var conversationType = RongIMLib.ConversationType.PRIVATE; // 单聊, 其他会话选择相应的会话类型即可
          var targetId = this.dialogueInfo.targetId; // 目标 Id
          var _this = this;
          RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
            onSuccess: function(message) {
              if (_this.dialogueInfo.dialogueList.length >= index) {
                _this.dialogueInfo.dialogueList[index - 1].loading = false;
              }
            },
            onError: function(errorCode, message) {
              console.log('发送失败:' + info + errorCode);
            }
          });
        },
        // 中间聊天框的上滚事件
        handleCenterScroll() {
          // this.getMore();
          const dialogue_box = this.$refs.dialogue_box;
          //这里的定时是为了列表首次渲染后获取scrollHeight并滑动到底部
          setTimeout(() => {
            this.scrollHeight = dialogue_box.scrollHeight;
            dialogue_box.scrollTo(0, this.scrollHeight);
          }, 10);
          dialogue_box.addEventListener('scroll', (e) => {
            //这里的2秒钟定时是为了避免滑动频繁，节流
            setTimeout(() => {
              if (!this.dialogueInfo.hasMsg) {
                this.loadText = "加载完成";
                return;
              }
              //滑到顶部时触发下次数据加载
              if (e.target.scrollTop == 0) {
                //将scrollTop置为10以便下次滑到顶部
                e.target.scrollTop = 10;
                //加载数据
                this.getMore();
                setTimeout(() => {
                  e.target.scrollTo(0, this.scrollHeight - 30); //-30是为了露出最新加载的一行数据
                }, 100);
              }
            }, 2000);
          });
        },
        // 右边聊天记录的上滚事件
        handleRightScroll() {
          // this.getMore();
          const dialogue_record = this.$refs.dialogue_record;
          //这里的定时是为了列表首次渲染后获取scrollHeight并滑动到底部
          // setTimeout(() => {
          //   this.scrollHeight = dialogue_record.scrollHeight;
          //   dialogue_record.scrollTo(0, this.scrollHeight);
          // }, 10);
          dialogue_record.addEventListener('scroll', (e) => {
            //这里的2秒钟定时是为了避免滑动频繁，节流
            setTimeout(() => {
              if (!this.dialogueInfo.hasMsg) {
                // this.loadText = "加载完成";
                this.loadText1 = "加载完成";
                return;
              }
              //滑到顶部时触发下次数据加载
              if (e.target.scrollTop == 0) {
                //将scrollTop置为10以便下次滑到顶部
                e.target.scrollTop = 10;
                //加载数据
                this.getMore();
                //这里的定时是为了在列表渲染之后才使用scrollTo。
                setTimeout(() => {
                  e.target.scrollTo(0, this.scrollHeight - 30); //-30是为了露出最新加载的一行数据
                }, 100);
              }
            }, 2000);
          });
        },
        // 点击单个表情包
        clickEmoji(emoji) {
          this.textarea += emoji
        },
      }
    }
  </script>
  
  
  <style scoped>
    .whole-wrapper {
      display: flex;
      background: #fff;
      /* height: 700px; */
      height: 90%;
    }
  
    /* 左边部分 */
    .left_whole_wrapper {
      display: flex;
      flex-direction: column;
      width: 24%;
    }
  
    .left_wrapper {
      flex: 1;
    }
  
    .left-item {
      display: flex;
      justify-content: space-between;
      padding: 18px 24px;
    }
  
    .active {
      background: #ebebeb;
    }
  
    .left-item-left {
      display: flex;
    }
  
    .left-item-head>img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
    }
  
    .left-item-info {
      margin-left: 12px;
      max-width: 220px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
  
    .left-item-info_title {
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: left;
      color: #292929;
      /* 文字超出处理 */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  
    .left-item-info_content {
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: left;
      color: #909090;
      margin-top: 4px;
      /* 文字超出处理 */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  
    .left-item-time {
      display: flex;
      flex-direction: column;
      text-align: right;
      align-items: flex-end;
      margin-left: 20px;
    }
  
    .left-item-time-time {
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: right;
      color: #909090;
    }
  
    .left-item-time-number {
      width: 20px;
      height: 20px;
      line-height: 20px;
      border-radius: 50%;
      background: #ff4949;
      color: #ffffff;
      text-align: center;
      font-size: 12px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      margin-top: 5px;
    }
  
    .search {
      padding: 36px 24px;
      height: 5%;
    }
  
    /* 中间部分*/
    .center_whole_wrapper {
      flex: 1;
      background: #f8f8f8;
    }
  
    .center_wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  
    .center_wrapper_top {
      display: flex;
      align-items: center;
      padding: 30px 24px;
      flex: 1;
    }
  
    .center_wrapper_top_name {
      font-size: 18px;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      text-align: left;
      color: #292929;
    }
  
    .center_wrapper_top_number {
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: left;
      color: #292929;
      margin-left: 12px;
    }
  
    .center_wrapper_center {
      flex: 10;
      padding: 30px 24px 0px 24px;
      border-top: 1px solid #c7c7c7;
      border-bottom: 1px solid #c7c7c7;
    }
  
    .center_wrapper_center_item {
      display: flex;
      margin-bottom: 32px;
    }
  
    .center_wrapper_right {
      flex: 4;
      padding: 20px 20px;
      position: relative;
    }
  
    .center-item-info_wrapper {
      margin: 0px 16px;
    }
  
    .center-item-tip {
      display: flex;
      align-items: center;
    }
  
    .error-tip>img {
      width: 20px;
      margin: 0 10px;
    }
  
    .center-item-info {
      max-width: 336px;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: left;
      color: #909090;
      line-height: 22px;
      background: #f1f1f1;
      padding: 16px;
    }
  
    .center-item-time {
      font-size: 12px;
      font-family: PingFang SC, PingFang SC-Regular;
      font-weight: 400;
      text-align: left;
      color: #909090;
      line-height: 22px;
      margin-top: 12px;
    }
  
    /* 反向样式开始*/
    .center_wrapper_center_item_reserve {
      display: flex;
      flex-direction: row-reverse;
      margin-bottom: 32px;
    }
  
    .center_wrapper_center_item_reserve .center-item-time {
      text-align: right;
    }
  
    .center_wrapper_center_item_reserve {
      display: flex;
      flex-direction: row-reverse;
      margin-bottom: 32px;
    }
  
    .center_wrapper_center_item_reserve .center-item-tip {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
    }
  
    .center_wrapper_center_item_reserve .error-tip>img {
      width: 20px;
      margin: 0 10px;
    }
  
    /* 反向样式结束*/
  
    /* 右边样式 */
    .right_whole_wrapper {
      background: #fff;
    }
  
    .right_wrapper {
      flex: 1;
    }
  
    .right_wrapper_center {
      border: none;
      color: #909090;
    }
  
    .center-item-name {
      font-size: 12px;
    }
  
    .center-item-info {
      margin-top: 10px;
    }
  
    .center-item-info_img {
      width: 150px;
      /* height: 100px; */
    }
  
    .center-item-info_img>img {
      width: 100%;
      height: 100%;
    }
  
    /* 几个图标 */
    .icon-list {
      display: flex;
    }
  
    .icon-list>div:not(:first-child) {
      margin-left: 15px;
    }
  
    .icon-item-img {
      width: 25px;
    }
  
    /* 修改组件样式 */
    .whole-wrapper>>>.el-input__inner {
      border-radius: 30px;
    }
  
    .whole-wrapper>>>.el-textarea__inner {
      min-height: 80px;
      resize: none;
      border: none;
      background: #f8f8f8;
      padding: 5px 0px;
    }
  
    .whole-wrapper>>>.el-button--primary {
      width: 100px;
      height: 40px;
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  
    .loading {
      text-align: center;
      color: #909090;
    }
  
    .loading span {
      margin-left: 10px;
    }
  </style>
  
  