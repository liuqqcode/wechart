// pages/My/My.js
var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();


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
    geren:true,
    quyu:false,
    // UserType:1,
    account:'',
    team:''
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
    let that = this;
    this.loginWechat();
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称

        }
      }
    })

  },

  loginWechat:function(){
    var that = this
    wx.login({
      success(data) {
        wx.getUserInfo({
          withCredentials: true,
          success(res) {
            wx.setStorageSync("avatarUrl", res.userInfo.avatarUrl)
            app.globalData.avatarUrl = res.userInfo.avatarUrl

            that.setData({ userInfo: res.userInfo, canIUse: false })
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
                wx.setStorageSync("encryptedData", res.encryptedData)
                wx.setStorageSync("iv", res.iv)
                wx.setStorageSync("code", data.code)
                console.log(data.code)
                wx.setStorageSync("jwtToken", loginRes.data.token_type + " " + loginRes.data.access_token)
                wx.setStorageSync("userType", loginRes.data.customer_type)
                wx.setStorageSync("customer_id", loginRes.data.customer_id)

                //设施全局变量token
                app.globalData.token = loginRes.data.token_type + " " + loginRes.data.access_token;
                //设置全局变量用户类型[1:普通用户; 2:商户; 3:推客; 4:区域代理]
                app.globalData.UserType = loginRes.data.customer_type
                app.globalData.customer_id = loginRes.data.customer_id
                
                // that.setData({ UserType: loginRes.data.customer_type})
                console.log(loginRes.data.customer_type)
                switch (loginRes.data.customer_type){
                  case 1:
                    that.setData({ geren: true, shangjia: false, daili: false, quyu: false });
                    break;
                  case 2:
                    that.setData({ geren: false, shangjia: true, daili: false, quyu: false });
                    break;
                  case 3:
                    api._get("/api/v1/twitters/account").then(res => {
                      that.setData({
                        account: res.data
                      })
                    })
                    api._get("/api/v1/twitters/team").then(res => {
                      that.setData({
                        team: res.data
                      })
                    })
                    that.setData({ geren: false, shangjia: false, daili: true, quyu: false });
                    break;
                  case 4:
                    that.setData({ geren: false, shangjia: false, daili: false, quyu: true });
                    break;
                }
              }
            })
          }
        })

      }
    })
  },

  //点击授权登录按钮
  bindGetUserInfo(e) {
    this.loginWechat();

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