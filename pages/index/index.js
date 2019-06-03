// pages/Order/Order.js
var bmap = require('../../libs/bmap-wx.min.js');
var baiduak = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:'成都',
    weatherDesc:'多云',
    dateC:'24',
    imgUrls:[
      '/images/image/banner.png',
      '/images/image/banner.png',
      '/images/image/banner.png'
    ],
    fuwuFenlei:[
      '语言培训',
      '音乐培训',
      '美术培训',
      '留学',
      '升学'
    ],
    backClass: ["/images/image/schoolban.png", "/images/image/schoolban.png", "/images/image/schoolban.png", "/images/image/schoolban.png"],
    currentItemId: 2
  },

  swiperChange: function (e) {
    var currentItemId = e.detail.currentItemId;
    this.setData({
      currentItemId: currentItemId
    })
  },
  clickChange: function (e) {
    var itemId = e.currentTarget.dataset.itemId;
    // console.log(itemId)
    this.setData({
      currentItemId: itemId
    })
  },
  //学校
  school:function(){
    wx.navigateTo({
      url: '../school/school',
    })
  },

  //搜索
  search:function(){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    var BMap = new bmap.BMapWX({
      ak: baiduak.ak
    });

    var success = function (data) {
      // console.log(data.currentWeather[0]);
      var weatherData = data.currentWeather[0];
      // weatherData = '城市：' + weatherData.currentCity + '\n' + 'PM2.5：' + weatherData.pm25 + '\n' + '日期：' + weatherData.date + '\n' + '温度：' + weatherData.temperature + '\n' + '天气：' + weatherData.weatherDesc + '\n' + '风力：' + weatherData.wind + '\n';
      var regex1 = /.*\([^\)\(\d]*(\d+)[^\)\(\d]*\).*/;
      that.setData({
        city: weatherData.currentCity,
        weatherDesc: weatherData.weatherDesc,
        dateC: weatherData.date.replace(regex1,"$1")
      });
    }
    var fail = function (data) {
      console.log('fail!!!!')
    };
    BMap.weather({
      fail: fail,
      success: success
    });
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

  }
})