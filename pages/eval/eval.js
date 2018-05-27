// pages/eval/eval.js
var eapi = getApp().url.url_api;
var alert = getApp().alert;
var loading = getApp().loading;
var Toast = getApp().Toast;
var share = getApp().share;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number_mun:10,
    page:0,//初始页数
    dbou:0,//滑到底部防止短时间多次请求接口
    comment_list:[],//评论条数
    none:0//下拉是否还有数据0表示有1表示无 无则显示没有数据了
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    getApp().login(eapi, that);//授权
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight);
        that.setData({
          winheight: res.windowHeight
        })
      }
    })
    that.de();
  
  },
  onShareAppMessage: function () {
    return {
      title: share().title,
      path: share().path,
      imageUrl: share().imageUrl,
    }
  },
  de:function(){
    var that=this;
    if (that.data.dbou !=0 || that.data.none ==1){
      return false;
    }
    that.setData({
      dbou:1,
    })
    wx.request({
      url: 'https://www.qiaolibeilang.com/api/user/comment',
      method: 'post',
      data: {
        pages: that.data.page
      },
      success: function (res) {
        if(res.data.code == 0){
          console.log(that.data.page, res.data.data)
          if (res.data.data.length == 0){
            console.log('没数据了');
            that.setData({
              dbou: 0,
              none:1,
            })
            return false;
          }
          var add_data = that.data.comment_list.concat(res.data.data);
          that.setData({
            comment_list: add_data,
            dbou:0,
            page: that.data.page +1
          })
        }else{
          app.alert_1(res.msg);
          that.setData({
            dbou: 0,
          })
        }
      }
    })


    // var that = this;
    // this.extraLine.push(texts[this.extraLine.length % 12])
    // this.setData({
    //   text: this.extraLine.join('\n'),
    //   canAdd: this.extraLine.length < 12,
    //   canRemove: this.extraLine.length > 0
    // })
    // setTimeout(function () {
    //   that.setData({
    //     scrollTop: 99999
    //   });
    // }, 0)
    

  }
})