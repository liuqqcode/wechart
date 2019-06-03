// pages/My/My.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo:{},
    headerImg:'',
    daili:false,
    shangjia:false,
    geren:false,
    quyu:true
  },
  //收藏
  Collection:function(){
    wx.navigateTo({
      url: '../Collection/Collection',
    })
  },
  //评论
  comment:function(){
    wx.navigateTo({
      url: '../comment/comment',
    })
  },
  //浏览
  browse:function(){
    wx.navigateTo({
      url: '../browse/browse',
    })
  },
  //发展代理
  daili:function(){
    wx.navigateTo({
      url: '../daili/daili',
    })
  },
  //客户管理
  khgl:function(){
    wx.navigateTo({
      url: '../khgl/khgl',
    })
  },
  //客户跟踪
  khgz:function(){
    wx.navigateTo({
      url: '../khgz/khgz',
    })
  },
  //查看用户
  shangjia:function(){
    wx.navigateTo({
      url: '../userCon/userCon',
    })
  },
  //我要合作
  geren:function(){
    wx.navigateTo({
      url: '../cooperation/cooperation',
    })
  },
  Todetails:function(){
    wx.navigateTo({
      url: '../details/details',
    })
  },
  //提现
  tixian:function(){
    wx.navigateTo({
      url: '../tixian/tixian',
    })
  },
  //区域代理余额
  yue:function(){
    wx.navigateTo({
      url: '../tixian/tixian',
    })
  },
  //区域代理历史佣金
  History:function(){
    wx.navigateTo({
      url: '../HistoryMoney/HistoryMoney',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称

          wx.login({
            success(data) {
              if (data.code) {
                wx.getUserInfo({
                  withCredentials: true,
                  success(res) {
                    that.setData({ userInfo: res.userInfo, canIUse: false })
                    console.log(res)
                    console.log(data)
                    wx.request({
                      url: 'https://yikeyingshi.com/api/auth/login/',
                      method: 'POST',
                      header: { 'content-type': 'application/json' },
                      data: {
                        encryptedData: encodeURI(res.encryptedData),
                        iv: encodeURI(res.iv),
                        code: encodeURI(data.code)
                      },
                      success(loginRes) {
                        console.log(loginRes.data.token_type + " " + loginRes.data.access_token)
                        wx.setStorageSync("jwtToken", loginRes.data.token_type + " " + loginRes.data.access_token)
                      }
                    })
                  }
                })
              } else {
                console.log('登录失败！' + res.errMsg)  
              }
            }
          })
        }
      }
    })

  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
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