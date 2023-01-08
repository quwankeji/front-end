import { Json } from '@vicons/carbon';
import { getMessageNum } from '@/util/user';
import { createStore } from 'vuex'

export default createStore({
  state: {
    userInfo: localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')):null,
    userVisible: false,
    messageTimer:null,
    messageNum:0

  },
  getters:{
    getUserInfo(state) {
        return state.userInfo;
    },
    getUserVisible(state) {
      return state.userVisible;
  }
  },
  mutations: {
    // setUserInfo(state) {
    //   state.userInfo = null;
    // },
    removeUserInfo(state,callback) {

      state.userInfo = null;
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('rongYunToken')
      if(callback){
        callback()
      }

    },
    setUserVisible(state,val) {
      state.userVisible = val;
    },
    setMessageNum(state,val){
      state.messageNum =val;
    },
    setMessageTimer(state) {
      state.messageTimer  = setInterval(() => {
        getMessageNum();
      }, 2000);
    },
    removeMessageTimer(state){
       
    clearInterval( state.messageTimer);

      state.messageTimer = null;
    }
  },
  actions: {
  },
  modules: {
  }
})

