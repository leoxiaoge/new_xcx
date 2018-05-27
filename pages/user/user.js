// pages/user/user.js
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
    ball: [['优惠券', 'coupon','','张'], ['宿卡', 'sk_card','','次'], ['积分',  '','','分']],
    bar: [['宿卡赠送', 'give', '', 'give','new'],['每日签到', '', 'opened', 'bar-1'], ['常用地址', 'address', '','bar-2'], ['关于宿洗', 'about', '','bar-3'], ['分享宿洗', 'share', '','bar-4'], ['问题帮助', 'help', '','bar-5'], ['招募配送小哥', 'recruit', 'opened','bar-8']],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    getApp().login(eapi, that);//授权
    that.user();
    that.index();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that =this;
    that.index();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: share().title,
      path: share().path,
      imageUrl: share().imageUrl,
    }
  },
  callmeTap: function () {//拨打电话
    wx.makePhoneCall({
      phoneNumber: '13714763091'
    })
  },
  opened: function () {//功能未开放提示
    alert('即将开放，敬请期待！')
  },
  user:function(){
    var that=this;
    wx.getUserInfo({
      lang: 'zh_CN',
      success: function(res) {
        console.log(res.userInfo);
        that.setData({
          get_user: res.userInfo
        })
      }
    })
  },
  index:function(){
    wx.showNavigationBarLoading();
    var that=this;
    wx.request({
      url: eapi +'/user/info',
      data: {
        uid:wx.getStorageSync('uid')
      },
      method: 'post',
      success: function(res) {
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh();
        if(res.data.code == 0){
          var data=res.data.data;//接口获取的数据
          var ball=that.data.ball;
          data.remainder = data.remainder.toFixed(2);//余额保留两位小数
          ball[0][2] = data.coupon;
          ball[1][2] = data.sxCard;
          ball[2][2] = data.integral;
          that.setData({
            user:data,
            ball:ball
          })
        }else{
          alert(res.data.mag)
        }
      },
    })
  }
})