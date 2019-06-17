var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '',
    moneysource:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (options.type == 'History'){
      wx.setNavigationBarTitle({
        title: '历史佣金',
      })
      api._get("/api/v1/agents/history-commission").then(res => {
        that.setData({
          money: res.data.history_commission
        })
      })
    } else if (options.type == 'Month'){
      wx.setNavigationBarTitle({
        title: '本月佣金',
      })
      api._get("/api/v1/agents/month-commission").then(res => {
        that.setData({
          money: res.data.month_commission
        })
      })
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

  }
})