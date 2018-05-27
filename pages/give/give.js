// pages/give/give.js
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
    wx.getUserInfo({
      success: function (res) {
        console.log(res.userInfo.nickName);
        that.setData({
          name: res.userInfo.nickName
        })
      }
    })
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
  onPullDownRefresh: function (res) {
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
  onShareAppMessage: function (res) {
    var that = this;
    console.log(res.from);
    if (res.from === 'button') {// 来自页面内转发按钮
      console.log(res.target, '233333');
      var reg = /^1[3|4|5|7|8][0-9]{9}$/;//正则手机号码
      if (!reg.test(that.data.phone)){
        alert('手机号码有误');
      }else{
        return {
          title: that.data.name + '送您一张洗衣月卡',
          path: '/pages/receive/receive?id=123&phone=' + that.data.phone,
          imageUrl: '../../img/share.jpg',
          success: function (res) {
            // 转发成功
            alert('赠送信息已发出，请等待对方确认');
          }
        }
      }
    }
    // return {//右上角转发菜单
    //   title: share().title,
    //   path: share().path,
    //   imageUrl: share().imageUrl,
    // }
  },
  pnone_number: function (e) {//输入框监听手机号
    console.log(e.detail.value);
    var that = this;
    that.setData({
      phone: e.detail.value
    })
  },
  pay_sk: function () {//购买宿卡
  var that=this;
  loading();
    wx.request({
      url: eapi + '/sxcard/sxcard_love',
      data: {
        uid: wx.getStorageSync('uid')
      },
      method: 'post',
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        if (res.data.code == 0) {
          var pay = res.data.data;
          wx.requestPayment({
            timeStamp: pay.timeStamp,
            nonceStr: pay.nonceStr,
            package: pay.package,
            signType: pay.signType,
            paySign: pay.paySign,
            success: function (res) {
              Toast('支付成功');
              that.index();
            },
            fail: function (res) {
              console.log(res);
            }
          })
        } else {
          alert(res.data.msg);
        }




      }
    })
  },
  index:function(){
    var that=this;
    wx.request({
      url: eapi +'/sxcard/lovecard',
      data: {
        uid:wx.getStorageSync('uid')
      },
      method: 'post',
      success: function(res) {
        console.log(res);
        wx.hideLoading();
        wx.stopPullDownRefresh();
      },
    })
  },

  mark:function(){//赠送宿卡
  var that = this;
  if (that.data.send_mark == 1){
    that.setData({
      send_mark:0
    })
  }else{
    that.setData({
      send_mark:1
    })
  }
  }
})