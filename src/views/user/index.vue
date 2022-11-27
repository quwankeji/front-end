<template>
  <el-form :model="data" label-width="120px">
    <el-form-item label="账号">
      <el-input v-model="data.username" />
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="data.password" type="password" />
    </el-form-item>
  </el-form>
  <el-form-item>
    <el-button type="primary" @click="onSubmit">提交</el-button>
  </el-form-item>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import axios from "axios";

// do not use same name with ref
const data = reactive({
  username: "",
  password: "",
  grant_type: "password",
  client_id: "client-app",
  client_secret: "123456",
});

const onSubmit = () => {
  console.log("submit!", data);
  axios
    .post("/oauth/token", data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    .then((res) => {
      console.log("res", res);
    });
};
</script>