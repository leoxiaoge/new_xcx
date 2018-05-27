// pages/receive/receive.js
//index.js
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
    text: {
      'title': '心意卡使用说明',
      'text': ['1、一张心意卡可洗10次，每次最多可洗10件；', '2、只限于洗衣，鞋子、家纺、窗帘、不抵扣心意卡次数；', '3、高端奢饰品牌衣服不抵扣心意卡次数；', '4、皮质、皮草类衣服不抵扣心意卡次数；']
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    getApp().login(eapi, that);//授权
    console.log(options.id, options.phone);
    alert(options.phone);

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

  }
})