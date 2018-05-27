// pages/date/date.js
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
    week_day: ['日', '一', '二', '三', '四', '五', '六'],
    swiper_index: 0,//时间段滑动位置
    left: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.index();
    getApp().login(eapi, that);//授权
  },
  onShareAppMessage: function () {
    return {
      title: share().title,
      path: share().path,
      imageUrl: share().imageUrl,
    }
  },
  index: function () {//初始化七天数据
    var that = this;
    var year = new Array();//未来七天所属年份数组
    var day = new Array();//未来七天日期数组
    var week = new Array();//未来七天星期几数组
    var house = moment().format('H'); 
    console.log(house);
    for (var i = 0; i < 7; i++) {
      year[i] = moment().add(i, 'days').format('YYYY年');
      week[i] = (moment().add(i, 'days').format('DDDD') - 1) % 7;
      day[i] = moment().add(i, 'days').format('MM月DD日');
      week[i] = '星期' + that.data.week_day[week[i]];
      if (i == 0) {
        week[i] = '今天';
      }
      if (i == 1) {
        week[i] = '明天';
      }
    }
    console.log(day, week);
    that.setData({
      year:year,
      day: day,
      week: week,
      select_day: day[0],
      house: house
    })
  },

  change_day: function (e) {//左右滑动改变日期
    var that = this;
    console.log(e.detail.current);
    that.setData({
      swiper_index: e.detail.current
    })
  },

  select_day: function (e) {//点击头部选择头部日期
    var that = this;
    var index = e.currentTarget.dataset.index;
    that.setData({
      swiper_index: index
    })
  },

  yd_top: function () {//头部日期选择根据日期选择居中显示
    var that = this;
    if (that.data.swiper_index > 3) {
      var px=(that.data.swiper_index-3)*100;//需要移动像素
      that.setData({
        left:px,
      })
    }
  },

  select_house:function(e){
    var that = this;
    // console.log(e.target.dataset.time, e.target.dataset.up_index, e.target.dataset.index);
    if (e.target.dataset.up_index == 0 && e.target.dataset.index-1 < that.data.house){
      alert('该时段不可预约');
      return false;
    }
    that.setData({
      ava_day: e.target.dataset.up_index,
      ava_house: e.target.dataset.index,
      time: e.target.dataset.time,
    })
    
  },
  back_time:function(){//确定按钮
    var that = this;
    if(that.data.time == undefined){
      alert('请选择预约时间段');
      return false;
    }
    wx.setStorageSync('time',that.data.time);
    wx.navigateBack();   //返回上一个页面
  }







})
