// pages/feedback/feedback.js
var eapi = getApp().url.url_api;
var alert = getApp().alert;
var loading = getApp().loading;
var Toast = getApp().Toast;
var share = getApp().share;
var moment = require('../../utils/moment.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    getApp().login(eapi, that);//授权
  },
  onShareAppMessage: function () {
    return {
      title: share().title,
      path: share().path,
      imageUrl: share().imageUrl,
    }
  },
  sub_feedback: function (e) {
    var that = this;
    if (that.data.sub == 1) {
      return false;
    }
    var sub_day = moment().format('DD');//获取当前日期 日
    if (sub_day == wx.getStorageSync('feedback_day')){
      alert('今天已提交，改天再来吧!');
      return false;
    }
    if (e.detail.value.feedback == '') {
      alert('内容不能为空');
    }
    that.setData({
      sub: 1
    })
    wx.request({
      url: eapi + '/user/complaint',
      data: {
        text: e.detail.value.feedback,
        uid: wx.getStorageSync('uid'),
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 0) {
          wx.showModal({
            title: '提交成功',
            content: '非常感谢您的宝贵建议，宿洗祝您生活愉快！',
            showCancel: false,
            confirmColor: '#1ca6f8',
            success: function(res) {
              wx.navigateBack();   //返回上一个页面
            }
          })
        } else {
          alert(res.data.msg);
        }
        that.setData({
          sub: 0
        })
        wx.setStorageSync('feedback_day', moment().format('DD'));
      },
    })
  }
})