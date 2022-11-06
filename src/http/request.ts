// 封装类
import axios from 'axios'
import { AxiosInstance, AxiosRequestConfig } from 'axios'
class ZWRequest {
  instance: AxiosInstance
  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
  }

  request(config: AxiosRequestConfig): void {
    this.instance.request(config).then((res) => {
      console.log(res) // 此处能成功打印出结果代表成功
    })
  }
}
export default ZWRequest
