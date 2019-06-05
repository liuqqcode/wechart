var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    collections:'',
    ImgHead:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    api._get('/api/v1/collections/customer').then(data => {
      console.log(data.data)
      that.setData({ collections: data.data, ImgHead: util.schoolPicture})
    })
  },


  CollectionList:function(e){
    console.log(e.currentTarget.dataset.inx)
    switch (e.currentTarget.dataset.inx.product_type){
      case 1:
        wx.navigateTo({
          url: '../kecen/kecen?lessonsId=' + e.currentTarget.dataset.inx.product_id,
        })
        break;
      case 2:
        break;
      case 3:
        wx.navigateTo({
          url: '../school/school?id=' + e.currentTarget.dataset.inx.school_id,
        });
        break;
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