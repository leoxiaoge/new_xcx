var eapi = getApp().url.url_api;
var alert = getApp().alert;
var loading = getApp().loading;
var Toast = getApp().Toast;
var share = getApp().share;
Page({
  data: {
  },
  onLoad: function (options) {
    loading();
    var that = this;
    getApp().login(eapi, that);//授权
    var price = options.price;
    if (price != undefined){
      that.setData({
        price:price
      })
    }
    that.index();
  },
  onShareAppMessage: function () {
    return {
      title: share().title,
      path: share().path,
      imageUrl: share().imageUrl,
    }
  },
  index:function(){
    var that=this;
    wx.request({
      url: eapi +'/order/coupon',
      data: {
        uid:wx.getStorageSync('uid'),
        price: that.data.price
      },
      method: 'post',
      success: function(res) {
        console.log(res)
        if(res.data.code == 0){
          that.setData({
            card: res.data.data
          })
        }else{
          alert(res.data.msg);
        }
        wx.hideLoading();
      }
    })
  },
  select:function(e){
    var that=this;
    var price = that.data.price;
    if (price == undefined){
      return false;
    }
    var card=that.data.card;
    var index = e.currentTarget.dataset.index;
    console.log(card[index]);
    if(price < card[index].l_price){
      alert('满' + card[index].l_price + '元可用,当前订单未满' + card[index].l_price+'元');
    }else{
      wx.setStorageSync('card', card[index]);
      wx.navigateBack();
    }
  }
})