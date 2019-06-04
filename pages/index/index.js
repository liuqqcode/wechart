// pages/Order/Order.js
var bmap = require('../../libs/bmap-wx.min.js');
var baiduak = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:'成都',
    weatherDesc:'多云',
    dateC:'24',
    schoolList:[],
    schoolPicture: baiduak.schoolPicture,
    schoolListApi: baiduak.schoolListApi,
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
  school:function(e){
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../school/school?id=' + e.currentTarget.dataset.id,
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
    
    //获取天气以及位置信息
    var BMap = new bmap.BMapWX({
      ak: baiduak.ak
    });
    var success = function (data) {
      var weatherData = data.currentWeather[0];
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
    //获取学校列表
    var that = this;
    api._get('/api/v1/schools').then(data => {
      that.setData({ schoolList: data.data})
      // console.log(data.data)
    }).catch(e => {
      console.log(e)
    })
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