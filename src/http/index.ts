// 出口文件index.ts
import ZWRequest from './request'
import NODEENV from './config'
console.log(NODEENV)
const zwRequest = new ZWRequest({
  baseURL: NODEENV.BASE_URL, // 配置参数
  timeout: NODEENV.timeout // 配置参数
})
export default zwRequest