var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    borwseList: [],
    ImgHead: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    api._get("/api/v1/views?product_types=3").then(res => {
      console.log(res.data)
      that.setData({ borwseList: res.data, ImgHead: util.schoolPicture })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  school: function (e) {
    wx.navigateTo({
      url: '../school/school?id=' + e.currentTarget.dataset.id.school_id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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