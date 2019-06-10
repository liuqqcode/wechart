// pages/follow/follow.js
var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deskIndex: 0,
    currentIndex: 0,
    isShow: false,
    isFans: false,
    classIndex: 0,
    orders: '',
    //待支付
    wait: '',
    //已支付
    Payment: '',
    ImageHead: '',
    footprint: ''

  },
  //跳转订单详情
  kechengContent: function (e) {
    wx.navigateTo({
      url: '../kecheng/kecheng?id=' + e.currentTarget.dataset.inx,
    })
  },
  //足迹跳转课程详情
  kechengCon: function (e) {
    console.log(e.currentTarget.dataset.inx.product_id)
    wx.navigateTo({
      url: '../kecen/kecen?lessonsId=' + e.currentTarget.dataset.inx.product_id,
    })

  },
  //评价
  evaluate: function (e) {
    console.log(e.currentTarget.dataset.inx)
    wx.navigateTo({
      url: '../evaluate/evaluate?id=' + e.currentTarget.dataset.inx,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    api._get("/api/v1/orders").then(data => {
      that.setData({ orders: data.data, ImageHead: util.schoolPicture })

    })
    api._get("/api/v1/views?product_types=1,2").then(data => {
      console.log(data.data)
      that.setData({ footprint: data.data })
    })
    wx.getSystemInfo({
      success: function (res) {
        let clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        console.log(calc)
        that.setData({
          windowHeight: calc
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //切换关注
  changeTab: function (event) {
    let that = this;
    let { index } = event.currentTarget.dataset;
    that.setData({ deskIndex: index, currentIndex: index });
    // console.log(index);
  },

  //swiper切换
  bindchange: function (event) {
    let that = this;
    let current = event.detail.current;
    that.setData({ deskIndex: current });
    // console.log(current);
  },



  //关闭modal
  close: function () {
    let that = this;
    that.setData({ isShow: false, isFans: false });
  },


  changeYue: function (event) {
    let that = this;
    let { index } = event.currentTarget.dataset;
    that.setData({ classIndex: index });
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    api._get("/api/v1/orders").then(data => {
      that.setData({ orders: data.data, ImageHead: util.schoolPicture })
    })
    api._get("/api/v1/views?product_types=1,2").then(data => {
      console.log(data.data)
      that.setData({ footprint: data.data })
    })
  },

  // tab切换
  toTabPage: function (e) {
    toTabPage(e)
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