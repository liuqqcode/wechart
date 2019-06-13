var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    api._get("/api/v1/twitters/account/balance").then(res => {
      console.log(res.data)
      that.setData({
        money: res.data.balance
      })
    })

  },
  tijianBtn:function(){
    let that = this
    if(that.data.money <= 0){
      wx.showToast({
        title: '你没钱啦',
        icon: 'none',
        image: '',
        duration: 1000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      return;
    }
    api._post("/api/v1/twitters/account/takeout").then(res => {
      that.setData({
        money:'0.00'
      })
      console.log(res)
      wx.showToast({
        title: res.data.message,
        icon: '',
        image: '',
        duration: 3000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }).catch(err => {
      console.log(err.data.errors.message)
      wx.showToast({
        title: err.data.errors.message,
        icon: 'none',
        image: '',
        duration: 3000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    })
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