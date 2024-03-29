var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    userCon:'',
    time:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var headerImg = wx.getStorageSync('avatarUrl')
    that.setData({ avatarUrl: headerImg })
    api._get("/api/v1/merchants/clients").then(res => {
      console.log(res)
      that.setData({userCon:res.data})
    })
  },
  yes:function(e){
    let that = this
    console.log(e.currentTarget.dataset.inx)
    api._post("/api/v1/merchants/clients/handle/" + e.currentTarget.dataset.inx,{
      confirmation:1
    }).then(res => {
      api._get("/api/v1/merchants/clients").then(res => {
        that.setData({ userCon: res.data ,time:false})
      })
    })
  },
  no:function(e){
    let that = this
    console.log(e.currentTarget.dataset.inx)
    api._post("/api/v1/merchants/clients/handle/" + e.currentTarget.dataset.inx, {
      confirmation: 0
    }).then(res => {
      api._get("/api/v1/merchants/clients").then(res => {
        that.setData({ userCon: res.data,time:false})
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