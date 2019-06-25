var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    merchant_name:'',
    contact:'',
    name:'',
    merchantData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    api._get("api/v1/merchants/passports").then(data => {
      that.setData({
        merchantData: data.data
      })
    })
  },

  merchant_name:function(e){
    let that = this;
    that.setData({
      merchant_name: e.detail.value
    })
  },
  contact: function (e) {
    let that = this;
    that.setData({
      contact: e.detail.value
    })
  },
  name: function (e) {
    let that = this;
    that.setData({
      name: e.detail.value
    })
  },

  //提交
  submit:function(){
    let that = this;
    if (that.data.name == '' || that.data.contact == '' || that.data.merchant_name == ''){
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
    }else{
      api._post('/api/v1/merchant-propose/application',{
        merchant_name: that.data.merchant_name,
        name:that.data.name,
        contact: that.data.contact
      }).then(res => {
        api._get("api/v1/merchants/passports").then( data => {
          that.setData({
            merchantData:data.data
          })
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