// pages/pay/pay.js
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

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    loading();
    var that = this;
    getApp().login(eapi, that);//授权
    that.setData({
      orderid: that.options.id,
    })
    wx.request({
      url: eapi + '/order/pay_info',
      data: {
        uid: wx.getStorageSync('uid'),
        orderid: that.options.id
      },
      method: 'post',
      success: function (res) {
        console.log(res.data.data.price);
        if (res.data.code == 0) {
          that.setData({
            infor: res.data.data,
          })
          console.log(that.data.price);
        } else {
          alert(res.data.msg);
        }
        wx.hideLoading();
      }
    })

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
  pay: function (e) {
    var that = this;
    console.log(e);
    if (e.detail.value.type == 'card') {
      if (that.data.infor.sxcard_status == 0){
        alert('您还没有宿卡，请选择微信支付或前往购买宿卡。');
        return false;
      }
      that.setData({
        sk_pay: 1
      })
      return false;
    }
    if (that.data.pay == '1') {
      return false;
    }
    that.setData({
      pay: 1
    })
    wx.request({
      url: eapi + '/order/payment',
      data: {
        uid: wx.getStorageSync('uid'),
        orderid: that.data.orderid
      },
      method: 'post',
      success: function (res) {
        if (res.data.code == 0) {
          that.wx_pay(res.data.data);
        } else {
          alert(res.data.msg);
        }
        that.setData({
          pay: 0,
        })
      }
    })
  },
  wx_pay: function (pay) {//唤醒微信支付，支付成功后跳转订单详情页
    var that = this;
    wx.requestPayment({
      timeStamp: pay.timeStamp,
      nonceStr: pay.nonceStr,
      package: pay.package,
      signType: pay.signType,
      paySign: pay.paySign,
      success: function (res) {
        Toast('支付成功');
        wx.setStorageSync('pay', 'ok');
        var t = setTimeout(function () {
          wx.navigateBack();   //返回上一个页面
        }, 1500)
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  colse_sk_pay: function () {//关闭宿卡支付密码框
    var that = this;
    that.setData({
      sk_pay: 0
    })
  },
  pass_sk_pay: function (e) {//输入宿卡支付密码支付
    var that = this;
    if (that.data.pass_sk_pay ==1){
      return false;
    }
    console.log(e.detail.value.pass);
    that.setData({
      pass_sk_pay: 1
    })
    wx.request({
      url: eapi +'/sxcard/payment',
      data: {
        uid:wx.getStorageSync('uid'),
        orderid: that.data.orderid,
        paypwd: e.detail.value.pass
      },
      method: 'post',
      success: function(res) {
        console.log(res);
        if(res.data.code==0){
          Toast('支付成功');
          wx.setStorageSync('pay', 'ok');
          var t = setTimeout(function(){
            wx.navigateBack();   //返回上一个页面
          }, 1500)
        }else{
          alert(res.data.msg);
        }
        that.setData({
          pass_sk_pay: 0
        })
      },
    })


  }
})