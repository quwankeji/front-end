<template>
  <el-dialog
    :destroy-on-close="true"
    v-model="data.visible"
    :width="700"
    title="发起组队"
    @close="onClose"
  >
    <div class="team_box">
      <el-form
        ref="teamForm"
        :model="data.formData"
        :rules="data.rules"
        label-width="130px"
      >
        <el-form-item label="活动标题：" prop="title">
          <el-input
            v-model="data.formData.title"
            :placeholder="'请输入活动标题'"
          />
        </el-form-item>
        <el-form-item label="活动人数：" prop="peopleNum">
          <el-input-number v-model="data.formData.peopleNum" :min="1" />
        </el-form-item>
        <el-form-item label="活动开始时间：" prop="startTime">
          <el-date-picker
            v-model="data.formData.startTime"
            type="datetime"
            placeholder="请选择活动开始时间"
            format="YYYY/MM/DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="活动结束时间：">
          <el-date-picker
            v-model="data.formData.endTime"
            type="datetime"
            placeholder="请选择活动结束时间"
            format="YYYY/MM/DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="活动内容：" prop="content">
          <el-input
            v-model="data.formData.content"
            type="textarea"
            :rows="6"
            resize="none"
            placeholder="请输入活动内容"
          />
        </el-form-item>
        <el-form-item label="图片/视频：" prop="content">
          <el-upload
            class="upload"
            :action="'/file/path'"
            :accept="upLoad.accept"
            :before-upload="(file:any) => upLoad.handleBeforeUpload(file, upLoad.accept)"
            :on-success="upLoad.handleSuccess"
            :file-list="data.fileList"
            :headers="{ Authorization: `Bearer ${getToken()}` }"
          >
            <el-icon :size="20" :color="'rgb(99,226,183)'"
              ><Document
            /></el-icon>
            <template #tip>
              <div v-if="data.fileList.length == 0" class="el-upload__tip">
                仅支持上传图片和视频文件。
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>

      <el-form-item>
        <el-button class="user_btn" type="primary" @click="onSubmit(teamForm)"
          >提交</el-button
        >
      </el-form-item>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, defineProps } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { upLoad } from "@/util/common.ts";
import request from "@/http/request";
import { getToken } from "@/util/user";
import { dateCompare } from "@/util/index";
//定义参数 已经选中的ITEMID
const props = defineProps({
  getList: {
    type: Function,
    default: Function,
    required: true,
  },
});
const teamForm = ref<FormInstance>();
const data = reactive({
  visible: false,
  fileList: [],
  formData: {
    tagType: 2, ///朋友圈1、组队2
    title: "",
    peopleNum: "",
    startTime: "",
    endTime: "",
    content: "",
    imgUrlList:[]
  },
  rules: {
    title: [{ required: true, message: "请输入活动标题", trigger: "blur" }],
    peopleNum: [{ required: true, message: "请输入活动人数", trigger: "blur" }],
    startTime: [
      { required: true, message: "请选择活动开始时间", trigger: "blur" },
    ],
    content: [{ required: true, message: "请输入活动内容", trigger: "blur" }],
  },
});

//------------发起组队part
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let files: any = [];
      data.fileList.forEach((element: any) => {
        files.push(element.response.data);
      });
      data.formData.imgUrlList = files;
      if (dateCompare(data.formData.startTime, data.formData.endTime)) {
        ElMessage({
          message: "结束时间不能大于开始时间",
          type: "warning",
        });
      }
      request({
        url: `/business/tags/add`,
        method: "post",
        data: data.formData,
      })
        .then((res: any) => {
          ElMessage({
            message: "提交成功",
            type: "success",
          });
          data.visible = false;
          props.getList();
        })
        .catch((err) => {
          ElMessage({
            message: err,
            type: "error",
          });
        });
    }
  });
};
//------------文件上传part
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
      data.fileList = fileList;
      console.log("上传成功", data.fileList);
    }
  },
};
const onClose = () => {
  data.visible = false;
};

// 将变量暴露出来
defineExpose({
  data,
});
</script>
<style lang="less" scoped>
.team_box {
  .el-menu {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-around;
    .el-form-item {
      margin-bottom: 25px;
      &.is-active {
        border-bottom: 2px solid #18a058;
        color: #18a058;
      }
    }
  }
  .user_btn {
    width: 100%;
    cursor: pointer;
    border: none;
    color: #18a058;
    background: rgba(24, 160, 88, 0.16);
    &:hover {
      background: rgba(24, 160, 88, 0.22);
    }
  }
}
</style>
