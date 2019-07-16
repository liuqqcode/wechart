// pages/daili/daili.js
var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    tel:'',
    content:'',
    parent_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      parent_id: options.parent_id
    })
  },
  name:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  tel:function(e){
    this.setData({
      tel: e.detail.value
    })
  },
  conent:function(e){
    this.setData({
      content: e.detail.value
    })
  },
  submit:function(e){
    let that = this
    wx.showLoading({
      title: '正在提交',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    api._post("/api/v1/twitters/accept-invitation",{
      parent_id: that.data.parent_id,
      name:that.data.name,
      phone:that.data.tel,
      content:that.data.content
    }).then(res => {
      wx.hideLoading()
      wx.navigateTo({
        url: '/pages/index/index',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    }).catch(err => {
      wx.hideLoading()
      wx.showModal({
        title: err.data.errors.message,
        content: '',
        showCancel: true,
        cancelText: '确定',
        cancelColor: '',
        confirmText: '取消',
        confirmColor: '',
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