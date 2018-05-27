// pages/address/address.js
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
    am: false,//修改添加地址
  },
  onLoad: function (options) {
    var that = this;
    loading();
    getApp().login(eapi, that);//授权
    that.index();
    if (that.options.types == 1) {//页面参数type 1为预约页面跳转
      that.setData({
        types: 1,
      })
    }

  },
  onShareAppMessage: function () {
    return {
      title: share().title,
      path: share().path,
      imageUrl: share().imageUrl,
    }
  },
  am: function () {//添加地址按钮
    var that = this;
    if (that.data.adderss_list.length > 9){
      alert('最多保存10个地址，请先删除地址或修改现有地址');
      return false;
    }
    that.setData({
      am: true,
      address_id: '',
      address:'',
    })
  },
  map: function () {//打开微信地图选择地址
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        var address = {
          address_info: res.address,
          latitude: res.latitude,
          longitude: res.longitude,
        }
        that.setData({
          address: address
        })
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
                that.map();
              }
            })
          }
        });
      }
    })
  },
  formSubmit: function (e) {
    console.log(e);
  },
  index: function () {
    var that = this;
    wx.request({
      url: eapi + '/user/user_address',
      method: 'POST',
      data: {
        uid: wx.getStorageSync('uid')
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.code == 0) {
          that.setData({
            adderss_list: res.data.data,
          })
          wx.setStorageSync('address_list', res.data.data)//缓存地址列表
        } else {
          alert(res.data.msg);
        }
      }
    })
  },


  add_mod_address: function (e) {//添添加和修改地址
    loading();
    var that = this;
    var reg = /^1[3|4|5|7|8][0-9]{9}$/;//正则手机号码
    var username = /^[\u4E00-\u9FA5A-Za-z]+$/;//正则姓名
    if (e.detail.value.address_info == ''){
      alert('请选择地址');
      wx.hideLoading();
      return false;
    } else if (e.detail.value.address ==''){
      alert('请填写门牌号等详细地址');
      wx.hideLoading();
      return false;
    } else if (!username.test(e.detail.value.name)){
      alert('姓名为空或格式不正确');
      wx.hideLoading();
      return false;
    } else if (e.detail.value.sex ==''){
      alert('请选择性别');
      wx.hideLoading();
      return false;
    } else if (!reg.test(e.detail.value.phone)){
      alert('手机号码为空或格式不正确');
      wx.hideLoading();
      return false;
    }
    wx.request({
      url: eapi + '/user/up_address',
      method: 'post',
      data: {
        id: that.data.address_id,
        uid: wx.getStorageSync('uid'),
        name: e.detail.value.name,
        phone: e.detail.value.phone,
        address: e.detail.value.address,
        address_info: e.detail.value.address_info,
        sex: e.detail.value.sex,
        lo: that.data.address.longitude,
        la: that.data.address.latitude
      },
      success: function (res) {
        console.log(res, res.code);
        if (res.data.code == 0) {
          that.setData({
            am: false,
          })
          alert(res.data.msg);
        } else {
          alert(res.data.msg);
        }
        that.index();
        wx.hideLoading();
      }
    })
  },
  select_address: function (e) {//选择地址按钮
    var that = this;
    console.log(that.data.select, that.data.types);
    if (that.data.types != 1 || that.data.select != undefined){
      console.log('不是地址选择,或已选择');
      return false;
    }
    that.setData({
      select:1,
    })
    var id = e.currentTarget.dataset.id;
    wx.setStorageSync('select_address', that.get_address(id));//选中的地址信息
    wx.navigateBack();   //返回上一个页面
  },
  address_mod: function (e) {//修改地址按钮
    loading();
    var that = this;
    var id = e.currentTarget.dataset.id;
    var get_address = that.get_address(id);
    var address = {
      address_info: get_address.address_info,
      address: get_address.address,
      latitude: get_address.la,
      longitude: get_address.lo,
      u_name: get_address.u_name,
      u_phone: get_address.u_phone,
    }
    that.setData({
      am: true,
      address: address,
      address_id: get_address.id,
    })
    wx.hideLoading();
  },
  get_address: function (id) {//从地址列表中获取单条地址信息，id为地址id
    var that = this;
    var selcet_address;
    var address_list = wx.getStorageSync('address_list');
    for (var i = 0; i < address_list.length; i++) {
      if (address_list[i].id == id) {
        selcet_address = address_list[i];
      }
    }
    return selcet_address;
  },
  address_del: function () {//删除该地址
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除该地址',
      confirmColor: '#1ca6f8',
      success: function (res) {
        if (res.confirm) {
          del();
        } else if (res.cancel) {
          return false;
        }
      }
    })
    function del() {
      loading();
      wx.request({
        url: eapi + '/user/del_address',
        method: 'post',
        data: {
          address_id: that.data.address_id,
          uid: wx.getStorageSync('uid'),
        },
        success: function (res) {
          console.log(res);
          if (res.data.code == 0) {
            alert('地址删除成功');
            that.setData({
              am: false,
            })
            that.index();
            wx.hideLoading();
          } else {
            wx.hideLoading();
            alert(res.data.msg);
          }
        }
      })
    }
  }








})