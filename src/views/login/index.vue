<template>
  <el-dialog
    :destroy-on-close="true"
    v-model="store.state.userVisible"
    :width="360"
    @close="onClose"
  >
    <div class="user_box">
      <el-menu
        :default-active="data.activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">登录</el-menu-item>
        <el-menu-item index="2">注册</el-menu-item>
      </el-menu>
      <el-form
        ref="loginForm"
        :model="data.formData"
        :rules="data.rules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="data.formData.username"
            :placeholder="
              data.activeIndex == '1' ? '请输入用户名' : '用户名注册后无法修改'
            "
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model.trim="data.formData.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item
          v-if="data.activeIndex == '2'"
          label="确认密码"
          prop="surePassword"
        >
          <el-input
            v-model.trim="data.formData.surePassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <el-form-item>
        <el-button class="user_btn" type="primary" @click="onSubmit(loginForm)"
          >提交</el-button
        >
      </el-form-item>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import axios from "axios";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "@/http/request"; // 引入封装的request.js文件
import { setToken, requestUserInfo, getRongyunToken } from "@/util/user"; // 引入封装的request.js文件
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const router = useRouter();
const store = useStore();

const loginForm = ref<FormInstance>();
const checkUserName = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入账号"));
  } else {
    if(data.activeIndex == '1' ){
      callback();
    }else{
      request({
      url: `/api/user/user/check?userName=${value}`,
      method: "get",
    })
      .then((res: any) => {
        if(!res){
          callback(new Error("账号已存在"));
        }else{
        callback();
        }
      })
      .catch((err) => {
        ElMessage({
          message: err,
          type: "error",
          duration: 5000,
        });
      });
    }
    
  }
};
const data = reactive({
  formData: {
    grant_type: "password",
    client_id: "client-app",
    client_secret: "123456",
    username: "",
    password: "",
    surePassword: "",
  },
  activeIndex: "1",
  rules: {
    username: [{ required: true,validator: checkUserName, trigger: "blur" }],
    password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    surePassword: [
      { required: true, message: "请输入确认密码", trigger: "blur" },
    ],
  },
});

//------------切换part
const handleSelect = (key, keyPath) => {
  data.activeIndex = key;
  data.formData.username = "";
  data.formData.password = "";
};
//------------登录或注册part
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let url = `/api/oauth/token`;
      let msg = "登录成功";
      let headers: any = {
        "Content-Type": "application/x-www-form-urlencoded",
      };
      let params: any = Object.assign({}, data.formData);
      if (data.activeIndex !== "1") {
        if (data.formData.password !== data.formData.surePassword) {
          return ElMessage({
            message: "密码和确认密码不一致！",
            type: "warning",
          });
        }
        headers = {};
        url = `/api/user/user/register`;
        msg = "注册成功";
        params = {
          name: data.formData.username,
          password: data.formData.password,
        };
      }
      request({
        url: url,
        method: "post",
        data: params,
        headers,
        loading: true,
      })
        .then((res: any) => {
          if (res && res.access_token) {
            setToken(res.access_token);
            getRongyunToken();
            requestUserInfo(
              {
                name: data.formData.username,
                password: data.formData.password,
              },
              () => {
                ElMessage({
                  message: msg,
                  type: "success",
                  duration: 5000,
                });
                
                window.location.reload();
              }
            );
          }

          onClose();
        })
        .catch((err) => {
          ElMessage({
            message: err,
            type: "error",
            duration: 5000,
          });
        });
    }
  });
};
const onClose = () => {
  store.commit("setUserVisible", false);
};

// 将变量暴露出来
defineExpose({
  data,
});
</script>
<style lang="less" scoped>
.el-dialog__body {
  padding-top: 0;
}

.user_box {
  margin-top: -22px;
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
