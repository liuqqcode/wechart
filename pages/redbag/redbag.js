var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['5公里', '同城', '全国'],
    objectArray: [
      {
        id: 1,
        name: '5公里'
      },
      {
        id: 2,
        name: '同城'
      },
      {
        id: 3,
        name: '全国'
      }
    ],
    index: 1,
    redbag:''
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  getredbag:function(e){
    let that = this
    that.setData({
      redbag: e.detail.value
    })
  },
  submit:function(){
    let that = this
    api._post("/api/v1/merchants/redpackets",{
      amount:Number(that.data.redbag),
      range:that.data.index
    }).then(res => {
      wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.nonceStr,
        package: res.data.package,
        signType: res.data.signType,
        paySign: res.data.paySign,
        trade_type:'NATIVE',
        success(data) {
          wx.navigateBack({
            delta: 1,
          })
        },
        fail(data){
          console.log(data)
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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