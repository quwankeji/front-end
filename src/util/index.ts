
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
//------------比较时间part

  
