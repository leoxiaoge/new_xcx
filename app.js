//app.js
App({
  // onLaunch: function () {
  //   // 展示本地存储能力
  //   var logs = wx.getStorageSync('logs') || []
  //   logs.unshift(Date.now())
  //   wx.setStorageSync('logs', logs)

  //   // 登录
  //   wx.login({
  //     success: res => {
  //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //     }
  //   })
  //   // 获取用户信息
  //   wx.getSetting({
  //     success: res => {
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  //         wx.getUserInfo({
  //           success: res => {
  //             // 可以将 res 发送给后台解码出 unionId
  //             this.globalData.userInfo = res.userInfo

  //             // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //             // 所以此处加入 callback 以防止这种情况
  //             if (this.userInfoReadyCallback) {
  //               this.userInfoReadyCallback(res)
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  // globalData: {
  //   userInfo: null
  // },
  //以下为自己手写代码
  url: {
    url_api:'https://www.anlileo.com/eapi',//接口地址前缀
    url_img:'https://www.anlieleo.com/public/new_xcx',//图片地址前缀
  },
  alert: function (text) {
    wx: wx.showModal({
      title: '提示',
      content: text,
      showCancel: false,
      confirmColor: '#1ca6f8',
      mask: true,
    })
  },
  loading: function () {
    wx: wx.showLoading({
      title: '加载中',
      mask: true,
    })
  },
  Toast: function (text) {
    wx.showToast({
      title: text,
      icon: 'success',
      duration: 3000,
      mask: true,
    });
  },
  share: function () {
    return {
      title: '“宿洗”与您共进洗衣新时代！',
      path: '/pages/index/index',
      imageUrl:'../../img/share.jpg',
    }
  },
  fix_2:function(num){//保留两位有效数字
    return parseFloat(num).toFixed(2);

  },
  //----------------------------------------------授权登入-------------------------------------------- //
  login: function (eapi,that) { //用户登入
    if(wx.getStorageSync('uid') ==''){
      wx.login({
        success: function (res_1) { //用户登入成功
          wx.request({
            url: eapi + '/user/code',
            method: 'post',
            data: {
              code: res_1.code,
            },
            success: function (res_2) { //获取openid成功
              wx.getUserInfo({
                success: function (res_3) { //获取用户信息成功
                  wx.request({
                    url: eapi + '/user/index', //获取uid
                    data: {
                      name: res_3.userInfo.nickName,
                      gender: res_3.userInfo.gender,
                      avatarUrl: res_3.userInfo.avatarUrl,
                      openid: res_2.data.data.openid,
                    },
                    method: 'POST',
                    success: function (res_4) {
                      wx.setStorageSync('uid', res_4.data.data.uid); //缓存uid,同步缓存
                      wx.setStorageSync('oid', res_2.data.data.openid);//缓存openid
                      wx.hideLoading();
                      that.onLoad();                      
                    }
                  });
                },
                fail: function () {
                  wx.showModal({
                    content: "您好，如果需要使用此服务需要您对小程序进行授权。",
                    showCancel: false,
                    confirmText: "确定",
                    confirmColor: '#1ca6f8',
                    success: function () {
                      wx.openSetting({
                        success: function (res) {
                          that.onLoad();
                        }
                      })

                    }
                  });
                }
              })
            }
          })
        }
      })
    }
  },
  //----------------------------------------------授权登入-------------------------------------------- //


})
