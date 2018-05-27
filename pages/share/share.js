// share.js
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
    img:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    getApp().login(eapi, that);//授权
    // wx: wx.request({
    //   url: getApp().globalData.http_url + '/user/share_code',
    //   method: 'post',
    //   data: {
    //     id: wx.getStorageSync('user_id'),
    //   },
    //   success: function (res) {
    //     console.log(res);
    //     that.setData({
    //       img:res.data.data
    //     });
    
    //   }
    // })

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
    if (wx.openBluetoothAdapter) {
      wx.openBluetoothAdapter()
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
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
  share:function(){
    if (!wx.canIUse('button.open-type.share')){
      app.alert_1('当前微信版本过低，请先更新');
    }
  }
})