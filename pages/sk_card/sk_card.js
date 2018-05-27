// pages/sk_card/sk_card.js
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
    swiper: [
      { 'card': 'card-1.jpg', 'btn': '购买', 'name': '心意卡', 'time': '2017-12-15', 'price':'298', 'number':'10','opened':'true' },
      { 'card': 'card-2.jpg', 'btn': '购买赠送', 'name': '心意卡2', 'time': '2018-02-14', 'price': '298', 'number': '10','opened': 'false' }
    ],
    text_ul:['使用心意卡，洗一件衣服平均只需3元','少抽一包烟就可让老婆少洗10件衣服','少喝一点酒就可送她一张心意卡','......'],
    inst:['1、一张心意卡可洗10次，每次最多可洗10件；','2、只限于洗衣，鞋子、家纺、窗帘、不抵扣心意卡次数；','3、高端奢饰品牌衣服不抵扣心意卡次数；','4、皮质、皮草类衣服不抵扣心意卡次数']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var cc = moment().subtract(-1, 'month').calendar(); 
    console.log(cc);
    var that=this;
    loading();
    getApp().login(eapi, that);//授权
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
    var that=this;
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
  purchase: function (e) {//购买宿卡按钮
    var that = this;
    if (e.target.dataset.opened =='false'){
      alert('赠送功能即将开放，敬请期待！');     
      return false;
    }
    loading();
    if (that.data.sk_pay == 1) {
      return false;
    }
    that.setData({
      sk_pay: 1
    })
    wx.request({
      url: eapi + '/sxcard/recharge',
      data: {
        uid: wx.getStorageSync('uid'),
      },
      method: 'post',
      success: function (res) {
        that.setData({
          sk_pay: 0
        })
        wx.hideLoading();
        if (res.data.code == 0) {
          that.wx_pay(res.data.data);
        } else {
          alert(res.data.msg);
        }
      }
    })
  },
  wx_pay: function (pay) {//唤醒微信支付
    var that = this;
    wx.requestPayment({
      timeStamp: pay.timeStamp,
      nonceStr: pay.nonceStr,
      package: pay.package,
      signType: pay.signType,
      paySign: pay.paySign,
      success: function (res) {
        Toast('支付成功');
        // wx.setStorageSync('pay', 'ok');

        that.index();
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  index:function(){//
  var that=this;
  wx.showNavigationBarLoading();
  wx.request({
    url: eapi +'/sxcard/lists',
    data: {
      uid:wx.getStorageSync('uid')
    },
    method: 'post',
    success: function(res) {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      wx.hideLoading();
      if(res.data.code ==0){
        that.setData({
          card: res.data.data
        })
      }else{
        alert(res.data.msg);
      }
    }
  })

  }
})