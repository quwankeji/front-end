<template>
  <div class="content-wrap">
    <div class="square_header border">
      <span> 个人中心</span>
    </div>
    <div class="comment_item border">
      <div class="list_item padding user-info">
        <div class="title">基本信息</div>
        <!-- {{store.getters.getUserInfo}} -->

        <el-image
          style="width: 100px; height: 100px"
          :src="store.getters.getUserInfo.portrait"
          :fit="true"
        />
        <p class="head-image">
          <el-upload
            ref="headUpload"
            class="upload"
            :action="'/api/file/file/path'"
            :accept="upLoad.accept"
            :before-upload="(file:any) => upLoad.handleBeforeUpload(file, upLoad.accept)"
            :on-success="upLoad.handleSuccess"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="data.fileList"
            :headers="{ Authorization: `Bearer ${getToken()}` }"
          >
            <el-button>更改头像</el-button>
          </el-upload>
        </p>
        <p>
          <span class="base-label">用户名：</span>
          <el-input
            v-if="data.editName"
            v-model.trim="data.userName"
            @blur="set('name', data.userName, 'editName')"
            :placeholder="store.getters.getUserInfo.name"
          />
          <span v-if="!data.editName">{{
            store.getters.getUserInfo.name
          }}</span>
          <el-icon @click="data.editName = !data.editName"><Edit /></el-icon>
        </p>
        <p>
          <span class="base-label">性别：</span>
          {{ store.getters.getUserInfo.sex }}
          <!-- <el-input
            v-if="data.editSex"
            v-model="data.sex"
            @blur="set('sex', data.sex,'editSex')"
            :placeholder="store.getters.getUserInfo.sex"
          />
          <span v-if="!data.editSex">{{ store.getters.getUserInfo.sex }}</span>
          <el-icon @click="data.editSex = !data.editSex"><Edit /></el-icon> -->
        </p>
        <!-- <p>
          <span class="base-label">手机号：</span
          >
          <el-input
            v-if="data.editPhone"
            v-model.trim="data.phone"
            @blur="set('phone', data.phone, 'editPhone')"
            :placeholder="store.getters.getUserInfo.phone"
          />
          <span v-if="!data.editPhone">{{
            store.getters.getUserInfo.phone
          }}</span>
          <el-icon @click="data.editPhone = !data.editPhone"><Edit /></el-icon>
        </p> -->
        <p>
          <span class="base-label">个性签名：</span>
          <el-input
            style="width: 250px"
            v-if="data.editSignature"
            v-model.trim="data.signature"
            @blur="set('signature', data.signature, 'editSignature')"
            :placeholder="store.getters.getUserInfo.signature"
          />
          <span v-if="!data.editSignature">{{
            store.getters.getUserInfo.signature
          }}</span>
          <el-icon @click="data.editSignature = !data.editSignature"
            ><Edit
          /></el-icon>
        </p>
      </div>
      <div class="friends-list">
        <ul class="infinite-list">
          <li v-for="i in data.friendList" :key="i" class="infinite-list-item" @click="openChat(i)">
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
    </div>
    
  <el-dialog v-model="data.dialogVisible" :width="1200" title="发起聊天">
    <el-input
    v-model="data.textarea"
    :rows="5"
    maxlength="100"
    show-word-limit
    resize="none"
    type="textarea"
    placeholder="请输入消息"
  />
<div style="margin-top: 10px;text-align: right;">
  <el-button type="success" @click="sendMessage">发送</el-button>
</div>
 
  </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import axios from "axios";
import type { FormInstance, FormRules } from "element-plus";
import { defineCustomElements, imkit } from "@rongcloud/imkit";
import { ConversationType } from "@rongcloud/engine";
import { CoreEvent } from "@rongcloud/imkit";
import * as RongIMLib from '@rongcloud/imlib-next'
import {
  ElMessage,
  ElMessageBox,
  UploadInstance,
  UploadProps,
  UploadRawFile,
  genFileId,
} from "element-plus";
import request from "@/http/request"; // 引入封装的request.js文件
import { requestUserInfoById } from "@/util/user"; // 引入封装的request.js文件
import { getToken } from "@/util/user";
import { useStore } from "vuex";
const store = useStore();
const headUpload = ref<UploadInstance>();
const data: any = reactive({
  friendList: [] as any,
  busy: false,
  userName: "",
  textarea:"",
  sex: "",
  phone: "",
  signature: "",
  portrait: "",
  editName: false,
  editSex: false,
  editPhone: false,
  editSignature: false,
  dialogVisible:false,
  targetId:null
});
//------------文件上传part
const handleExceed: UploadProps["onExceed"] = (files) => {
  headUpload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  headUpload.value!.handleStart(file);
  submitUpload();
};
const submitUpload = () => {
  headUpload.value!.submit();
};
const openChat = (val)=>{
  data.targetId = val.relationUserId;
  data.name = val.name;
  data.dialogVisible = true;
}
const upLoad = {
  accept: "image/jpg,image/jpeg,image/png,video/mp4",
  handleBeforeUpload: (file: any, accept: any) => {
    let validateList: any = [];
    accept.split(",").forEach((item: any) => {
      validateList.push(item.split("/")[1]);
    });
    var fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
    if (validateList.indexOf(fileSuffix) === -1) {
      ElMessage({
        message: `请上传${accept}格式的图片`,
        type: "warning",
      });
      return false;
    }
  },
  handleSuccess: (response: any, file: any, fileList: any) => {
    if (response.success && fileList.length > 0) {
      data.portrait = fileList?.[0]?.response?.data;
      set("portrait", data.portrait);
    }
  },
};
//初始化imkit及初始化配置
const initImkit = () => {
  RongIMLib.init({ appkey: '25wehl3u2es7w' });
  createImkit()
}
const createImkit = () => {
  let rongYunToken = localStorage.rongYunToken ?? null;
  RongIMLib.connect(rongYunToken).then(res => {
  if (res.code === RongIMLib.ErrorCode.SUCCESS) {
    console.log('链接成功, 链接用户 id 为: ', res?.data?.userId);
  } else {
    console.warn('链接失败, code:', res.code)
  }
})
}
const sendMessage = ()=>{
  if(!data.textarea){
  return  ElMessage({
        message: "发送的消息内容不能为空",
        type: "warning",
      });
  }
    // 指定消息发送的目标会话
    const conversation = {
  // targetId
  targetId:data.targetId.toString(),
  name:data.name,
  // 会话类型：RongIMLib.ConversationType.PRIVATE | RongIMLib.ConversationType.GROUP
  conversationType: RongIMLib.ConversationType.PRIVATE
};

// 构建文本消息
const message = new RongIMLib.TextMessage({ content: data.textarea })
// 发送消息
RongIMLib.sendMessage(conversation, message).then(({ code, data }) => {
  if (code === 0) {
    ElMessage({
        message: "消息发送成功",
        type: "success",
      });
  } else {
    ElMessage({
        message: "消息发送失败",
        type: "success",
      });
  }
});

}
const load = () => {
  data.busy = true;
  request({
    url: `/api/user/user/relation`,
    method: "GET",
    data: {},
    loading: true,
  })
    .then((res: any) => {
      data.friendList = res.retObject;
      console.log(11111, res.retObject);
    })
    .catch((err) => {
      ElMessage({
        message: err,
        type: "error",
      });
    });
};
const set = (str: any, val: any, val2: any) => {
  request({
    url: `/api/user/user/update`,
    method: "PUT",
    data: {
      [str]: val,
    },
    loading: true,
  })
    .then((res: any) => {
      // store.getters.getUserInfo.name = data.userName;
      data[val2] = false;
      requestUserInfoById(store.getters.getUserInfo.id, () => {
        // store.commit("setUserInfo");
      });
      ElMessage({
        message: "修改成功",
        type: "success",
      });
    })
    .catch((err) => {
      ElMessage({
        message: err,
        type: "error",
      });
    });
};
onMounted(() => {
  initImkit();
  load();
});
</script>
<style lang="less" scoped>
@import "@/assets/css/common/invitation.less";
.content-wrap {
  .comment_item {
    height: calc(100% - 116px);
  }
  .friends-list {
    height: calc(100% - 298px);
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
      .el-avatar {
        margin-right: 10px;
      }
    }
    .infinite-list .infinite-list-item + .list-item {
      margin-top: 10px;
    }
  }
  .title {
    height: 34px;
    line-height: 34px;
    font-size: 16px;
  }
  :deep(.user-info) {
    .head-image {
      width: 100px;
      display: flex;
      justify-content: center;
      margin-top: 10px;
      margin-bottom: 30px;
      .el-button {
        background: transparent;
        color: #fff;
        &:hover {
          border: 1px solid #63e2b7;
          color: #63e2b7;
        }
      }
    }
    > p {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      .el-input {
        width: 140px;
      }
      .el-icon {
        margin-left: 10px;
        color: #63e2b7;
      }
      .base-label {
        margin-right: 5px;
        opacity: 0.75;
      }
    }
    .el-upload-list {
      display: none;
    }
  }
}
</style>
