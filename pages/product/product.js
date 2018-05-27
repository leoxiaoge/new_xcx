// pages/product/product.js
var eapi = getApp().url.url_api;
var alert = getApp().alert;
var loading = getApp().loading;
var Toast = getApp().Toast;
var share = getApp().share;
var md = require('../../utils/md.js');
// var moment = require('../../utils/moment.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    xy: 0,//洗衣篮默认隐藏 0=隐藏，1=显示。
    tip_table: ['备注说明', '两室一厅的窗帘约为20㎡。', '用于别墅、会议室等场所大的窗帘，另行计算。', '不含上门拆卸、安装服务。'],
    guar: [
      { 'title': '高效服务', 'img': 'guar-1' },
      { 'title': '每单投保', 'img': 'guar-2' },
      { 'title': '上门取件', 'img': 'guar-3' },
    ]
  },
  onLoad: function (options) {
    loading();
    var that = this;
    getApp().login(eapi, that);//授权
    var id = options.id;//获取页面参数id
    that.setData({
      id:options.id
    })
    that.bj();//布局
    wx.request({
      url: eapi + '/index/rCacheTime',
      data: {
        name: 'goods_cat_tag'
      },
      method: 'POST',
      success: function (res) {
        var goods_timestamp = wx.getStorageSync('goods_timestamp');//获取商品缓存时间戳
        var bk = wx.getStorageSync('bk');//获取商品缓存数据
        console.log(res.data, goods_timestamp);
        console.log(bk);
        if (bk == '') {
          that.index(parseInt(id));//加载产品数据
          return false;
        }
        if (goods_timestamp == res.data) {
          that.setData({
            bk: bk
          })
          that.first(parseInt(id));
          that.footer_num(bk.goods);
        } else {
          that.index(parseInt(that.data.id));//加载产品数据
          wx.setStorageSync('goods_timestamp', res.data);
        }
      }
    })
    that.work();//洗护工序页面渲染
  },
  onShow: function () {
    var that = this;
    if (wx.getStorageSync('back_product') == 1) {
      var bk = wx.getStorageSync('bk');
      that.setData({
        bk: bk
      })
      that.footer_num(bk.goods);
    }

  },
  onHide: function () {//页面切换时留住操作数据
    var that = this;
    wx.setStorageSync('bk', that.data.bk);
    wx.setStorageSync('back_product', 1);
  },
  onShareAppMessage: function () {
    return {
      title: share().title,
      path: share().path,
      imageUrl: share().imageUrl,
    }
  },
  bj: function () {//页面布局用于控制宽高
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var px = res.windowWidth / 750;
        console.log(px);
        that.setData({
          scrollheight: res.windowHeight + ((res.windowWidth / 750) * 300),//scroll高度=视窗高度+top高度
          winheight: res.windowHeight,//可用视窗高度px
          winwidth: res.windowWidth,//可用视窗宽度px
          rpx: res.windowWidth / 750,//该设备中1rpx等于多少像素
          //main_height: res.windowHeight-(300 * (res.windowWidth / 750))//main高度
        })
      }
    })
  },
  to_search: function () { //搜索框聚焦时跳转到搜索页面
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },
  menu_top: function (e) {//点击头部菜单
    loading();
    var that = this;
    var id = e.currentTarget.dataset.id;
    that.first(id);
    that.setData({
      menu_top_num: id,
    })
  },
  menu_left: function (e) {//点击左边菜单
    var that = this;
    console.log(e.currentTarget.dataset.id);
    that.setData({
      menu_left_num: e.currentTarget.dataset.id,
    })
  },
  xy: function () {//洗衣篮的商品显示与隐藏
    var that = this;
    // if (that.data.total_num == 0) {
    //   return false;
    // }
    console.log(that.data.xy);
    if (that.data.xy == 0) {
      that.setData({
        xy: 1,
      })
      return false;
    } else {
      that.setData({
        xy: 0,
      })
    }
  },
  index: function (id) {//加载产品
    var that = this;
    wx.request({
      url: eapi + '/goods/goods_cat_tag',
      method: 'POST',
      success: function (res) {
        if (res.data.code == 0) {
          wx.setStorageSync('bk', res.data.data);//设置产品数据缓存
          that.setData({
            bk: res.data.data
          })
        } else {
          alert(res.data.msg);
        }
        if (typeof (id) == typeof (1)) {
          that.first(id);
        }
        wx.hideLoading();
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh();
      }
    })
  },
  first: function (id) {//点击一级类目默认选中二级类目第一个
    var that = this;
    var cat = that.data.bk.cat;
    for (var i = 0; i < cat.length; i++) {
      if (id == cat[i].tagid) {
        that.setData({
          menu_left_num: cat[i].id,
          menu_top_num: id,
        })
        wx.hideLoading();
        return false;
      }
    }
  },
  num: function (e) {//洗衣篮计算
    var that = this;
    var bk = that.data.bk;
    var goods = bk.goods;
    var ind = e.currentTarget.dataset.ind;
    if (e.currentTarget.dataset.type == 1) {//增加
      goods[ind].num = goods[ind].num + 1;
    } else {
      goods[ind].num = goods[ind].num - 1;
    }
    bk.goods = goods;
    that.footer_num(goods);
    that.setData({
      bk: bk
    })
  },
  footer_num: function (goods) {//goods商品数据
    var that = this;
    var num = new Array();
    var total_num = 0;//合计件数
    var total_price = 0;//合计价钱
    for (var i = 0; i < goods.length; i++) {
      if (goods[i].num > 0) {
        num[i] = goods[i];
        var total_num = total_num + goods[i].num;
        var total_price = total_price + (goods[i].num * goods[i].price);
      }
    }
    that.setData({
      total_num: total_num,
      total_price: total_price,
    })
  },
  sub_order: function () {//预约取件
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
    var goods = that.data.bk.goods;
    var id = new Array();//选中商品id数组
    var num = new Array();//选中商品对应id的数目
    var index = 0;//id ,num数组对应的下标
    for (var i = 0; i < goods.length; i++) {
      if (goods[i].num > 0) {
        id[index] = goods[i].id;
        num[index] = goods[i].num;
        index++;
      }
    }
    wx.request({
      url: eapi + '/goods/pay_order',
      method: 'post',
      data: {
        id: id,
        num: num,
        uid: uid
      },
      success: function (res) {
        console.log(res);
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
  work: function () {//洗护工序页面渲染
    console.log('23333');
    var that = this;
    var work = md.works();
    console.log(work);
    that.setData({
      work: work
    })
  },
  remove_ball: function () {//清空洗衣篮
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定清空洗衣篮',
      confirmColor: '#1ca6f8',
      success: function (res) {
        console.log(res);
        if (res.confirm == true) {
          console.log('6666')
          var bk = wx.getStorageSync('bk');
          for (var i = 0; i < bk.goods.length; i++) {
            bk.goods[i].num = 0;
          }
          that.setData({
            bk:bk
          })
          wx.setStorageSync('bk', bk);
          that.footer_num(bk.goods);
        }
      }
    })
  }
})