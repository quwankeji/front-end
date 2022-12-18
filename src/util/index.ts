
import moment from 'moment'
//------------格式化时间part
export const dateFormatPipe = (date: Date, type: String) => {
    if (date){
  return moment(date).format(type);
    }else {
      return '';
    }
  };
  export const dateCompare = (startDate: Date, endDate: Date) => {
    if(startDate&&endDate){
      return moment(startDate).valueOf()>moment(endDate).valueOf();
    }
  };
/**
 * 浮点数
 * @param text 
 * @param dig //保留的小数点位数
 * @param fill //是否需要补0
 * @param round //是否四舍五入
 */
 export function toFloat(text, dig: any = 2, fill = false, round = false) {
  if (text) {
    let num: any = 1
    for (let i = 1; i <= dig; i++) {
      num += '0';
    }
    text = !round ? Math.floor(parseFloat(text) * num) / num : Math.round(parseFloat(text) * num) / num
    if (fill) {
      let nums = (text || 0).toString().split(".")
      text = nums[0] + "." + (nums[1] || '0').padEnd(dig, "0")
    }
  }
  return text

}

