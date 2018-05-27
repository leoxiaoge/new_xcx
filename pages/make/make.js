// pages/make/make.js
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
    address: '',//地址
    time: ''//时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    getApp().login(eapi, that);//授权
    var bk = wx.getStorageSync('bk');
    that.setData({
      serever: bk.taglist,
    })
    that.bk_split(bk);
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
    var select_address = wx.getStorageSync('select_address');//地址页面返回的地址
    wx.removeStorageSync('select_address');//清除地址页面返回的地址缓存
    if (select_address != '') {
      console.log(select_address);
      that.setData({
        address: select_address,
      })
    }
    var time = wx.getStorageSync('time');
    wx.removeStorageSync('time');//清除地址页面返回的时间缓存
    if (time != '') {
      console.log(time);
      that.setData({
        time: time,
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
  serever: function (e) {//选择所需要的服务
    var that = this;
    var serever = that.data.serever;
    var ind = e.currentTarget.dataset.index;
    console.log(serever, ind);
    if (serever[ind].ava == 0) {
      serever[ind].ava = 1;
    } else {
      serever[ind].ava = 0;
    }
    that.setData({
      serever: serever
    })
  },
  sub_order: function (e) {//立即预约
    var that = this;
    if (that.data.sub) {//防止短时间内多次点击
      return false;
    } else {
      that.setData({
        sub: true
      })
    }
    var uid = wx.getStorageSync('uid');//uid
    if (uid == '') {//uid为空回首页重新授权
      that.tip_to_index();
      return false;
    }
    if (that.data.address == '') {
      alert('请选择地址');
      that.setData({
        sub: false,
      })
      return false;
    }
    if (that.data.time == '') {
      alert('请选择取件时间');
      that.setData({
        sub: false,
      })
      return false;
    }
    var goodstags = that.goodstags();
    var time=that.data.time;//取件时间
    time = time.split('');
    time[4]='-';
    time[7] = '-';
    time[10]=' ';
    var times='';
    for(var i=0;i<time.length;i++){
      var times = times+time[i];
    }
    wx.request({
      url: eapi + '/order/bespeak',
      method: 'post',
      data: {
        goodstags: goodstags + '',
        goodnums: that.data.goodnums,
        goodids: that.data.goodids,
        uid: uid,
        remarks: e.detail.value.remarks,
        uname: that.data.address.u_name,
        phone: that.data.address.u_phone,
        address: that.data.address.address_info + that.data.address.address,
        take_time: times,//取件时间
        give_time: ' ',
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {//预约成功
          Toast('预约成功');
          var bk = wx.getStorageSync('bk');
          for (var i = 0; i < bk.goods.length; i++) {
            bk.goods[i].num = 0;
          }
          wx.setStorageSync('bk', bk);//预约成功后清除商品选中缓存
          setTimeout(function () {
            wx.redirectTo({ url: '/pages/order_info/order_infor?id=' + res.data.data.orderid })
          }, 1000);
        } else {
          alert(res.data.msg);
        }
        that.setData({
          sub: false,
        })
      }
    })

  },
  tip_to_index: function () {//弹框提示并回首页授权
    wx.showModal({
      title: '提示',
      content: '未获取到您的授权信息，暂时无法预约！',
      confirmText: '立即授权',
      confirmColor: '#1ca6f8',
      showCancel: false,
      success: function () {
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }
    })
  },
  bk_split: function (bk) {//对数据进行拆分
    var that = this;
    console.log(bk);
    var goodids = new Array(); //商品id
    var goodnames = new Array();//商品名字
    var goodprice = new Array();//商品价格
    var goodnums = new Array();//商品数量
    var goodcatid = new Array();//商品二级类目
    var goodtagid = new Array();//商品一级类目
    var goods = bk.goods;
    var index = 0;
    for (var i = 0; i < goods.length; i++) {
      if (goods[i].num > 0) {
        goodids[index] = goods[i].id;
        goodnames[index] = goods[i].name;
        goodprice[index] = goods[i].price;
        goodnums[index] = goods[i].num;
        goodcatid[index] = goods[i].catid;
        goodtagid[index] = goods[i].tagid;
        index++;
      }
    }
    that.setData({
      goodids: goodids,
      goodnames: goodnames,
      goodprice: goodprice,
      goodnums: goodnums,
    })
    var serever = that.removal(goodtagid)//一级类目去重后
    that.ava(serever);
  },
  removal: function (array) {//数组去重，array要去重的数组
    var res = [];
    var json = {};
    for (var i = 0; i < array.length; i++) {
      if (!json[array[i]]) {
        res.push(array[i]);
        json[array[i]] = 1;
      }
    }
    return res;
  },
  ava: function (array) {//匹配一级类目选中状态，array一级类目已选中数组
    var that = this;
    var tag = wx.getStorageSync('bk').taglist;//获取缓存中的一级类目
    var array = array + '';//数组转字符串
    // console.log(typeof (array),array);
    for (var i = 0; i < tag.length; i++) {
      var index = array.match(tag[i].id);
      if (index == null) {
        tag[i].ava = '0';
      } else {
        tag[i].ava = '1';
      }
    }
    console.log(tag);
    that.setData({
      serever: tag
    })
  },
  goodstags: function () {
    var that = this;
    var goodstags = new Array();
    var serever = that.data.serever;
    var index = 0;
    for (var i = 0; i < serever.length; i++) {
      if (serever[i].ava == 1) {
        goodstags[index] = serever[i].id;
        index++;
      }
    }
    console.log(goodstags);
    return goodstags;
  }
})