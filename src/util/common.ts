import request from "@/http/request";
import { ElMessage, ElMessageBox } from "element-plus";
import { tr } from "element-plus/es/locale";
//------------点赞part
export const pointLike = (index:any,item: any) => {
  let options = {
    url: `/business/like/add`,
    method: "post",
    data: {
      statuType: 0, //0点赞  1取消点赞
      tagId: item.id,
    }
  };
  if (item.userLikeStatus === 1) {
    options = {
      url: `/business/like/delete?tagId=${item.id}`,
      method: "delete",
    };
  }
  request(options)
    .then((res: any) => {
      let str = '点赞成功'
      if (item.userLikeStatus === 1) {
        str = '取消成功'
        item.likesList.pop();
        item.userLikeStatus = null;
      } else {
        item.userLikeStatus = 1;
        item.likesList.push({});
      }
      ElMessage({
        message: str,
        type: "success",
      });
    })
    .catch((err) => {
      ElMessage({
        message: err,
        type: "error",
      });
    });
};
//------------收藏part
export const pointStar = (index:any,item: any) => {
  let options = {
    url: `/business/favorite/add`,
    method: "post",
    data: {
      remark:null, //0点赞  1取消点赞
      tagId: item.id,
      tagType: index, 
    },
  };
  let fun = (options)=>{
    request(options)
    .then((res: any) => {
      let str = '收藏成功'
      if (item.userFavoriteStatus) {
        item.userFavoriteStatus = false;
        str = '取消成功'
      } else {
        item.userFavoriteStatus = true;
      }
      ElMessage({
        message: str,
        type: "success",
      });
    })
    .catch((err) => {
      ElMessage({
        message: err,
        type: "error",
      });
    });
  }
  if (item.userFavoriteStatus) {
    options = {
      url: `/business/favorite/delete?tagId=${item.id}`,
      method: "delete",
    };
    fun(options)
  }else{
    ElMessageBox.prompt('', '备注', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
      .then(({ value }) => {
        options.data.remark =  value;
        fun(options)
      })
      .catch(() => {
      })
  }

 
};

//------------加入组队part
export const joinTeam = (item:any)=>{
  let type = item.userTeamStatus?'delete':'post'
  request({
      url: `/business/teammate/team?tagId=${item.id}`,
      method: type
    })
      .then((res: any) => {
        item.userTeamStatus = !item.userTeamStatus;
          ElMessage({
            message:item.userTeamStatus? "加入成功":'取消成功',
            type: "success",
          });
      })
      .catch((err) => {
        ElMessage({
          message: err,
          type: "error",
        });
      });
}
