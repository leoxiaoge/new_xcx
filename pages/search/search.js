// pages/search/search.js
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
    hot: ['洗衬衫', '运动鞋清洗', '高档成衣', '配饰', '羽绒服清洗', '窗帘清洗', '沙发套', '牛仔裤', '西服', '婚纱'],
    history: ['高档成衣', '配饰', '羽绒服清洗', '窗帘清洗', '沙发套'],
    rearch: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    getApp().login(eapi, that);//授权
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
  index: function () {

  },
  rearch: function (res) {//匹配输入框
    var that = this;
    that.setData({
      rearch: res.detail.value
    })
    var bk = wx.getStorageSync('bk');
    console.log(bk);
  }

})