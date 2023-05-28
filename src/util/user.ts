
import request from "@/http/request"; // 引入封装的request.js文件
import { Json } from "@vicons/carbon";
import store from '@/store/user'

import { ElMessage, ElMessageBox } from "element-plus";

//------------设置token part
export const setToken = (token) => {
  localStorage.setItem('token',token)
}
//------------获取token part
export const getToken = (str) => {
    if(!localStorage.getItem('token')){
      return null
    }else{
      return localStorage.getItem('token')
    }
}
//------------删除缓存信息 part
export const removeToken = (str) => {
  localStorage.removeItem(str)
}
//------------请求用户信息part
export const userInfo =localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')) :null
//------------请求用户信息part
export const requestUserInfo = (params,callback) => {
    request({
        url:  `/api/user/user/info`,
        method: "post",
        data: params,
      loading:true

      })
        .then((res: any) => {
          localStorage.setItem('userInfo',JSON.stringify(res.retObject))
          callback()
        })
        .catch((err) => {
            ElMessage({
                message: err,
                type: 'error'
            });
        });
  };
  export const requestUserInfoById = (params,callback) => {
    request({
        url:  `/api/user/user/get/`+params,
        method: "get",
      loading:true

      })
        .then((res: any) => {
          localStorage.setItem('userInfo',JSON.stringify(res.retObject))
          callback()
        })
        .catch((err) => {
            ElMessage({
                message: err,
                type: 'error'
            });
        });
  };
  export const getMessageNum = () => {
    request({
      url: `/api/business/business/notice/get/number`,
      method: "get",
    })
      .then((res: any) => {
  store.commit('setMessageNum',res.retObject)
      })
      .catch((err) => {
        ElMessage({
          message: err,
          type: "error",
        });
      });
  };
  //------------获取融云part
  export const getRongyunToken = (params) => {
  request({
      url:  `/api/user/token/rongcloud`,
      method: "get",
      loading:true
    })
      .then((res: any) => {
        localStorage.setItem('rongYunToken',res.retObject)
      })
      .catch((err) => {
          ElMessage({
              message: err,
              type: 'error'
          });
      });
};
  
