// agreement.js
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
    type_title: ['用户协议','用户充值协议','洗宿理赔细则'],//协议名称，把所有协议放到一个页面
  },
  onLoad: function (options) {
    var that = this;
    getApp().login(eapi, that);//授权
    var types = options.type;
    that.setData({
      types: types
    })
    wx.setNavigationBarTitle({
      title: that.data.type_title[that.data.types]
    })

  },
  onShareAppMessage: function () {
    return {
      title: share().title,
      path: share().path,
      imageUrl: share().imageUrl,
    }
  },
}) 