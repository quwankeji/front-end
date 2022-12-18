import axios from 'axios'
import { ElMessage, ElMessageBox } from "element-plus";
import { showLoading, hideLoading } from './loading'
import {removeToken} from "@/util/user"; // 引入封装的request.js文件
import store from '@/store/user'

const service = axios.create({
    baseURL: '',//.env文件配置接口地址
    timeout: 40 * 1000, // 超时
    loading:false,
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        //存储token
        if(config.loading){
            showLoading()
        }
        if(localStorage.token) {
            config.headers.Authorization = "Bearer "+localStorage.token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        setTimeout(() => {
            hideLoading()
          }, 200)
        // 接收后台参数状态
        const res = response;
        if(res.code == 20000 || res.status == 200 || res.success || res.ErrorCode == 20000) {
            return res.data;
        }else {
            let message = (res.error && res.error.message) || res.message || res.msg || '未知错误';
            ElMessage({
                message,
                type: 'error',
                duration: 5 * 1000
            });
            return Promise.reject(
                new Error(res.message || (res.error &&res.error.message) || '未知错误')
            );
        }
    },
    error => {
        setTimeout(() => {
            hideLoading()
          }, 200)
        if(error.response) {
            let code = error.response.status;
            if(code == 401) { 
                // removeToken('token');
                // removeToken('userInfo');
                // store.commit('setUserInfo')
                store.commit('removeUserInfo')
                store.commit('setUserVisible',true)
                return Promise.reject(
                    new Error('您还未登录或登录过期,请先登录！')
                );
            }
            return Promise.reject(error.response.data);
        }else {
            return Promise.reject(error.response.data);
        }
    }
)
export default service;