// pages/password/password.js
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
    types:['绑定手机号','设置支付密码'],//页面传参值不同选择显示的界面
    msg_code: '获取验证码',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    getApp().login(eapi, that);//授权
    if (that.options.types != undefined){
      wx.setNavigationBarTitle({
        title: that.data.types[that.options.types]
      })
      that.setData({
        types: that.options.types
      })
      console.log(that.data.types);
    }
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
  phone_no: function (e) {
    var that = this;
    that.setData({
      phone: e.detail.value
    })
    console.log(that.data.phone);
  },
  sub_password: function (e) {//确定按钮
    var that = this;
    if(that.data.sub==1){
      return false;
    }
    var get_code = wx.getStorageSync('code');
    console.log(e.detail.value.phone);
    var phone = e.detail.value.phone;
    var code = e.detail.value.code;
    var pass = e.detail.value.pass;
    var pass_confirm = e.detail.value.pass_confirm;
    console.log('确认密码:', pass_confirm)
    // if (get_code== undefined){
    //   alert('请先获取验证码');
    // }
    // if (phone != get_code.phone){
    //   alert('当前手机号码与获取验证码手机不相符');
    //   return false;
    // }
    // if(code != get_code.code){
    //   alert('验证码错误');
    //   return false;
    // }
    // if(that.data.types == 1){
    //   if(pass == ''){
    //     alert('宿卡支付密码不能为空');
    //   return false;
        
    //   }
    //   if (pass_confirm == ''){
    //     alert('确认密码不能为空');
    //     return false;
    //   }
    //   if (pass != pass_confirm) {
    //     alert('两次密码输入不一致');
    //     return false;
    //   }
    // }
    // var timestamp = Date.parse(new Date()) / 1000; 
    // if (timestamp - get_code.time>180){
    //   alert('验证码过期，请重新获取');
    //   return false;
    // }
    if ((Date.parse(new Date()) / 1000)-that.data.code_time > 180){
      alert('验证码过期，请重新获取');
      return false;
    }
    that.setData({
      sub: 1
    });
    if (that.data.types == 0) {//绑定手机号
      wx.request({
        url: eapi + '/user/login',
        data: {
          phone: phone,
          code: code,
          c_id: get_code.id,
          uid: wx.getStorageSync('uid')
        },
        method: 'post',
        success: function (res) {
          that.setData({
            sub: 0
          });
          if (res.data.msg == 'success') {
            wx.removeStorageSync('code');//绑定成功后清除缓存
            Toast('绑定成功');
            setTimeout(function () {
              wx.navigateBack();   //返回上一个页面
              // wx.reLaunch({
              //   url: '/pages/user/user',
              // })
            }, 1500);
          } else {
            alert(res.data.msg);
          }
        },
      })
    } else if (that.data.types == 1) {//修改设置密码
        wx.request({
          url: eapi + '/sxcard/setpaypw',
          data: {
            uid: wx.getStorageSync('uid'),
            phone: phone,
            code: code,
            paypwd: pass,
            repaypwd: pass_confirm,
          },
          method: 'post',
          success: function (res) {
            console.log(res);
            that.setData({
              sub:0
            })
            if (res.data.code == 0) {
              Toast(res.data.msg);
              setTimeout(function () {
                wx.navigateBack();   //返回上一个页面                
                // wx.reLaunch({
                //   url: '/pages/user/user',
                // })
              }, 1500);
            } else {
              alert(res.data.msg);
            }
          },
        })
    }
    // function pass() {
    //   wx.request({
    //     url: eapi + '/sxcard/setpaypw',
    //     data: {
    //       uid: wx.getStorageSync('uid'),
    //       phone: phone,
    //       code: code,
    //       paypwd: pass,
    //       repaypwd: pass_confirm,
    //     },
    //     method: 'post',
    //     success: function (res) {
    //       if (res.data.code == 0) {
    //         alert(res.data.mgs);
    //       } else {
    //         alert(res.data.mgs);
    //       }
    //     },
    //   })
    // }
    // function bind_phone(){
    //   wx.request({
    //     url: eapi + '/user/login',
    //     data: {
    //       phone: phone,
    //       code: code,
    //       c_id: get_code.id,
    //       uid: wx.getStorageSync('uid')
    //     },
    //     method: 'post',
    //     success: function (res) {
    //       that.setData({
    //         sub: 0
    //       });
    //       if (res.data.msg == 'success') {
    //         wx.removeStorageSync('code');//绑定成功后清除缓存
    //         Toast('绑定成功');
    //         setTimeout(function () {
    //           wx.reLaunch({
    //             url: '/pages/user/user',
    //           })
    //         }, 1500);
    //       } else {
    //         alert(res.data.msg);
    //       }
    //     },
    //   })
    // }
  },
  get_code: function () {//获取验证码
    var that = this;
    if (that.phone_code()) {
      alert('手机号码有误');
      return false
    }
    if (that.data.btn == 1) {//防短时间多次点击
      return false;
    }
    var c = 59;//60秒后重发
    that.setData({
      btn: 1,
      msg_code: c + 's后重发'
    })
    var intervalId = setInterval(function () {//计时器
      c = c - 1;
      that.setData({
        msg_code: c + 's后重发',
      })
      if (c == 0) {
        clearInterval(intervalId);
        that.setData({
          msg_code: '获取验证码',
          btn: 0,//60秒后恢复点击
        })
      }
    }, 1000)
    wx.request({
      url: eapi + '/sxcard/getcode',
      data: {
        phone: that.data.phone,
        uid:wx.getStorageSync('uid')
      },
      method: 'post',
      success: function (res) {
        // wx.setStorageSync('code', res.data.data);
        console.log(res);
        if (res.data.code == 0) {
          that.setData({
            code: res.data.data,
            code_time: Date.parse(new Date()) / 1000
          })
        } else {
          alert(res.data.msg);
        }
        console.log(that.data.code);
      },
    })




  },
  phone_code: function () {//验证手机号
    var that = this;
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;//正则手机号码   
    return !reg.test(that.data.phone);
  },
  setpass:function(){
    wx.request({
      url: eapi+'/sxcard/setpaypw',
      data: {

      },
      header: {},
      method: GET,
      dataType: json,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})  