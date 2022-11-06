
import moment from 'moment'

const dateFormatPipe = (date: Date, type: String) => {
    if (date){
  return moment(date).format(type);
    }else {
      return '';
    }
  };
  export {dateFormatPipe};
  
