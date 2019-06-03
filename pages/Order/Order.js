// pages/follow/follow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deskIndex: 0,
    currentIndex: 0,
    isShow: false,
    isFans: false,
    classIndex: 0
  },
  kechengContent: function () {
    wx.navigateTo({
      url: '../kecheng/kecheng',
    })
  },
  //评价
  evaluate:function(){
    wx.navigateTo({
      url: '../evaluate/evaluate',
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

  //切换关注
  changeTab: function (event) {
    let that = this;
    let { index } = event.currentTarget.dataset;
    that.setData({ deskIndex: index, currentIndex: index });
    console.log(index);
  },

  //swiper切换
  bindchange: function (event) {
    let that = this;
    let current = event.detail.current;
    that.setData({ deskIndex: current });
    console.log(current);
  },

  //取消关注
  care: function () {
    let that = this;
    that.setData({ isShow: true });
  },

  //关闭modal
  close: function () {
    let that = this;
    that.setData({ isShow: false, isFans: false });
  },

  //关注
  fans: function () {
    let that = this;
    that.setData({ isFans: true });
  },

  changeYue: function (event) {
    let that = this;
    let { index } = event.currentTarget.dataset;
    that.setData({ classIndex: index });
  },

  //我的约茶查看详情
  tomyTea: function () {
    let that = this;
    wx.navigateTo({
      url: `/pages/A-follow/myTea/myTea`,
    })
  },

  //我的邀约查看详情
  toMyInvite: function () {
    let that = this;
    wx.navigateTo({
      url: `/pages/A-follow/myInvite/myInvite`,
    })
  },

  //评价
  toEvaluate: function () {
    let that = this;
    wx.navigateTo({
      url: `/pages/A-follow/evaluate/evaluate`,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  // tab切换
  toTabPage: function (e) {
    toTabPage(e)
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