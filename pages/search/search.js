// pages/search/search.js
var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInput:'',
    schoolList:[],
    group3:'none',
    schoolPicture:"",
    History:'History'
  },

  searchInput:function(e){
    this.setData({
      userInput: e.detail.value
    })
  },
  //提交搜索
   searchSubmit:function(){
     let that = this;
     api._get("/api/v1/search?key=" + that.data.userInput).then(res => {
       console.log(res.data)
       that.setData({ 
         schoolList: res.data, 
         schoolPicture: util.schoolPicture, 
         History:"none",
        })
     })
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var userType = wx.getStorageSync("userType")
    console.log(userType)
    //获取全局变量，如果是推客则显示客户录入按钮
    if (userType == 3) {
      that.setData({ group3: 'group3' })
    } else {
      that.setData({ group3: 'none' })
    }
  },
  //选择学校
  school: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../school/school?id=' + e.currentTarget.dataset.id.id,
      success(data) {
        api._post("/api/v1/views", {
          school: e.currentTarget.dataset.id.id,
          merchant: e.currentTarget.dataset.id.merchant_id,
          product_type: 3,
          product_id: e.currentTarget.dataset.id.id,
          product_name: e.currentTarget.dataset.id.name,
          product_desc: e.currentTarget.dataset.id.desc,
          product_image: e.currentTarget.dataset.id.cover
        }).then(res => {
          console.log(res)
        })
      }
    })
  },
  //取消输入
  no:function(e){
    let that = this;
    that.setData({
      History:'History',
      schoolList:[],
      userInput:''
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