// pages/daili/daili.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    tel:'',
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  content:function(e){
    this.setData({
      content: e.detail.value
    })
  },
  submit:function(e){
    let that = this
    api._post("/api/v1/twitters/accept-invitation",{
      parent_id:1,
      name:that.data.name,
      phone:that.dat.tel,
      content:that.data.content
    }).then(res => {
      wx.navigateTo({
        url: '/page/index/index',
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