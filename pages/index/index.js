//index.js
var eapi = getApp().url.url_api;
var alert = getApp().alert;
var loading = getApp().loading;
var Toast = getApp().Toast;
var share = getApp().share;
Page({
  data: {
    bannerlink: [
      'product/product?id=1',
      'sk_card/sk_card',
      'give/give',
      'product/product?id=1',
      //'product/product?id=1',
      //'give/give',//password/password?types
      //'public/public'
    ],
    menu: [
      ['洗鞋', '1', '2','0'],//3:0已开放，1未开放
      ['洗衣', '2', '1', '0'],
      ['洗家纺', '3', '4', '0'],
      ['窗帘清洗', '4', '5', '0'],
      ['高端成衣', '5', '2','1'],
      ['衣物修补', '6', '1','1'],
      ['团购', '7', '1','1'],
      ['酒店宿洗', '8', '7','0']
    ],
    menu2: [
      ['意见反馈', 'feedback', ''],
      ['服务介绍', 'service', ''],
      ['价格目录', 'price_list', ''],
      ['准时宝', 'time', 'opened']
    ],
    scroll_set: 0, //1代表已滚出banner，0代表未滚出banner]
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winheight: res.windowHeight
        })
      }
    })
    getApp().login(eapi,that);//授权
    that.index(); //获取首页数据
  },
  onShareAppMessage: function () {
    return {
      title: share().title,
      path: share().path,
      // imageUrl: share().imageUrl,
    }
  },
  scroll: function (e) { //页面滚动时对搜索框样式进行修改
    return false;//屏蔽搜索框
    var that = this;
    if (e.detail.scrollTop > 60 && that.data.scroll_set != 1) {
      that.setData({
        scroll_set: 1,
      })
      return false;
    }
    if (e.detail.scrollTop < 60 && that.data.scroll_set != 0) {
      that.setData({
        scroll_set: 0,
      })
    }
  },
  to_search: function () { //搜索框聚焦时跳转到搜索页面
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  index: function () {
    var that = this;
    wx.request({
      url: eapi + '/index/index',
      method: 'post',
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            index: res,
          })
        } else {
          alert(res.data.msg);
        }
      }
    })
  },
  opened: function () {//功能未开放提示
    alert('即将开放，敬请期待！')
  }
})