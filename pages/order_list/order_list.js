var u_data = '';
var is_data = [0, 0, 0, 0];

var eapi = getApp().url.url_api;
var alert = getApp().alert;
var loading = getApp().loading;
var Toast = getApp().Toast;
var share = getApp().share;

Page({
  data: {
    itemData: u_data,
    navItem: ['未支付', '服务中', '已完成', '全部订单'],
    showItem: 4,
    is_data: is_data

  },
  onLoad: function (options) {
    var that = this;
    getApp().login(eapi, that);//授权
    // that.setData({
    //   showItem: options.type
    // })
    loading();
    that.index();
  },
  onShareAppMessage: function () {
    return {
      title: share().title,
      path: share().path,
      imageUrl: share().imageUrl,
    }
  },
  onPullDownRefresh: function () {
    var that = this;

    that.index();
  },
  navToggle: function (e) {
    var that = this;
    that.setData({
      showItem: e.target.dataset.id + 1,
    });
    loading();
    that.index();
  },

  index: function () {
    var that = this;
    wx.showNavigationBarLoading();
    wx.request({
      method: 'POST',
      data: {
        uid: wx.getStorageSync('uid'),
        status: that.data.showItem
      },
      url: eapi + '/order/orders',
      success: function (res) {
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
        wx.hideLoading();
        if (res.data.code == 0) {
          that.setData({
            itemData: res.data.data,
          })
        } else {
          alert(res.data.msg);
        }
        console.log(that.data.itemData);
      }

    })
  }


})
