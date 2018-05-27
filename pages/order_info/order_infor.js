// pages/order_info/order_infor.js
var eapi = getApp().url.url_api;
var alert = getApp().alert;
var loading = getApp().loading;
var Toast = getApp().Toast;
var share = getApp().share;
var fix_2 = getApp().fix_2;
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
    that.setData({//获得参数id并存入变量
      order_id: that.options.id,
    });
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
    var that = this;
    var card = wx.getStorageSync('card');
    wx.removeStorageSync('card')
    console.log(card);
    if (card != '') {//有优惠券信息返回
      var infor = that.data.infor;
      infor.order_price = infor.order_price - (card.discount - infor.coupon_price);
      console.log(infor);
      that.setData({
        infor: infor
      })
    }
    // 从支付页面返回
    var pay=wx.getStorageSync('pay');
    wx.removeStorageSync('pay')
    if(pay !=''){
      that.index();
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
    var that = this;

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
  index: function () {
    var that = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: eapi + '/order/order_details',
      method: 'post',
      data: {
        uid: wx.getStorageSync('uid'),
        orderid: that.data.order_id
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        var data = res.data.data;
        data.coupon_price = fix_2(data.coupon_price);
        data.distribution_price = fix_2(data.distribution_price);
        data.order_price = fix_2(data.order_price);
        if (data.first_free.price != undefined){
          data.first_free.price = fix_2(data.first_free.price)
        }
        if (res.data.code == 0) {
          that.setData({
            infor: data
          })
          that.order_info();
        } else {
          alert(res.data.msg);
        }
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    })

  },
  del_order: function (e) {//取消订单 删除订单
    var that = this;
    var link= e.currentTarget.dataset.url;
    that.setData({
      link:link
    })
    if (link = 'order_delete'){
      var content = '是否取消该订单？';
    }else{
      var content = '是否删除该订单？';
    }
    wx.showModal({
      title: '提示',
      content: content,
      confirmColor: '#1ca6f8',
      success: function (res) {
        if (res.confirm) {
          loading();
          wx.request({
            url: eapi + '/order/' + e.currentTarget.dataset.url,
            data: {
              uid: wx.getStorageSync('uid'),
              order_id: that.data.order_id,
            },
            success: function (d) {
              wx.hideLoading();
              if (d.data.code == 1) {
                Toast('取消成功');
                setTimeout(function () {
                  wx.redirectTo({ url: '/pages/order_list/order_list' })
                }, 1000);
              } else {
                alert(d.data.msg);
              }
            }
          })
        }
      }
    })
  },
  order_info: function () {//订单信息
    var that = this;
    var infor = that.data.infor
    var order_info = [
      { 'title': '订单编号', 'text': infor.order_number },
      { 'title': '联系人', 'text': infor.user_name },
      { 'title': '取件时间', 'text': infor.take_time },
      { 'title': '服务地址', 'text': infor.user_address },
      { 'title': '下单备注', 'text': infor.remarks },
    ];
    that.setData({
      order_info: order_info
    })
  },
  go_play: function () {//去支付按钮
    var that = this;
    var infor = that.data.infor
    if (that.data.pay == 1) {
      return false
    }
    that.setData({
      pay: 1,
    })

    wx.request({
      url: eapi + '/order/pay',
      data: {
        uid: wx.getStorageSync('uid'),
        orderid: that.data.order_id,
        coupon_id: infor.coupon_id,
        distribution_id: infor.distribution_id,
      },
      method: 'post',
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {
          if(res.data.msg =='reload'){
            alert('支付成功！')
            that.index();
            return false;
          }
          wx.navigateTo({ url: '/pages/pay/pay?id=' + that.data.order_id});
        } else {
          alert(res.data.msg);
        }
        that.setData({
          pay: 0
        })
      }
    })
  }
})