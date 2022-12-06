
import request from "@/http/request"; // 引入封装的request.js文件
import { Json } from "@vicons/carbon";
//------------获取用户信息part
export const getUserInfo = (params) => {
    request({
        url:  `/user/info`,
        method: "post",
        data: params,
      })
        .then((res: any) => {
          localStorage.setItem('userInfo',JSON.stringify(res.retObject))
        })
        .catch((err) => {
            ElMessage({
                message: err.error_description,
                type: 'error'
            });
        });
  };
  //------------获取融云part
  export const getRongyunToken = (params) => {
  request({
      url:  `/token/rongcloud`,
      method: "get"
    })
      .then((res: any) => {
        localStorage.setItem('rongYunToken',res)
      })
      .catch((err) => {
          ElMessage({
              message: err,
              type: 'error'
          });
      });
};
  
