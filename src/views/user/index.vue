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
          :action="'/file/path'"
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
          <span class="base-label">个性签名：</span
          >
          <el-input
            style="width: 250px;"
            v-if="data.editSignature"
            v-model.trim="data.signature"
            @blur="set('signature', data.signature, 'editSignature')"
            :placeholder="store.getters.getUserInfo.signature"
          />
          <span v-if="!data.editSignature">{{
            store.getters.getUserInfo.signature
          }}</span>
          <el-icon @click="data.editSignature = !data.editSignature"><Edit /></el-icon>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import axios from "axios";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage, ElMessageBox,UploadInstance, UploadProps, UploadRawFile,genFileId  } from "element-plus";
import request from "@/http/request"; // 引入封装的request.js文件
import { requestUserInfoById } from "@/util/user"; // 引入封装的request.js文件
import { getToken } from "@/util/user";
import { useStore } from "vuex";
const store = useStore();
const headUpload = ref<UploadInstance>()
const data: any = reactive({
  userName: "",
  sex: "",
  phone: "",
  signature: "",
  portrait:"",
  editName: false,
  editSex: false,
  editPhone: false,
  editSignature: false,
});
//------------文件上传part
const handleExceed: UploadProps['onExceed'] = (files) => {
  headUpload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  headUpload.value!.handleStart(file)
  submitUpload()
}
const submitUpload = () => {
  headUpload.value!.submit()
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
      set('portrait',data.portrait)
    }
  },
};
const set = (str: any, val: any, val2: any) => {
  request({
    url: `/user/update`,
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
        store.commit("setUserInfo");
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
</script>
<style lang="less" scoped>
@import "@/assets/css/common/invitation.less";
.content-wrap {
  .comment_item {
  height: calc(100% - 116px);
}

.title {
  height: 34px;
  line-height: 34px;
  font-size: 16px;
}
::v-deep .user-info {
  .head-image{
    width: 100px;
    display: flex;
    justify-content: center;
    margin-top: 10px;
    margin-bottom: 30px;
    .el-button{
      background: transparent;
    color: #fff;
    &:hover{
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
  .el-upload-list{
    display: none;
  }
}
}

</style>
