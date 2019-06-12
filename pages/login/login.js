var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    Publishercustomer_id:'',
    schoolId:''
  },
  //点击授权登录按钮
  bindGetUserInfo(e) {
    let that = this
    this.loginWechat();
    // console.log(e.detail.userInfo)
    // this.setData({ userInfo: e.detail.userInfo, canIUse:false})
  },

  loginWechat: function () {
    var that = this
    wx.login({
      success(data) {
        wx.getUserInfo({
          withCredentials: true,
          success(res) {
            that.setData({ userInfo: res.userInfo, canIUse: false })
            console.log(that.data.userInfo)
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

                wx.setStorageSync("jwtToken", loginRes.data.token_type + " " + loginRes.data.access_token)
                wx.setStorageSync("userType", loginRes.data.customer_type)
                wx.setStorageSync("customer_id", loginRes.data.customer_id)

                //设置全局变量token
                app.globalData.token = loginRes.data.token_type + " " + loginRes.data.access_token;
                //设置全局变量用户类型[1:普通用户; 2:商户; 3:推客; 4:区域代理]
                app.globalData.UserType = loginRes.data.customer_type
                app.globalData.customer_id = loginRes.data.customer_id

                console.log(loginRes)
                // that.setData({ UserType: loginRes.data.customer_type})
                console.log(loginRes.data.customer_type)

              }
            })
          }
        })

      }
    })
  },
  index:function(){
    let that = this;
    wx.navigateBack({
      delta: 1,
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      Publishercustomer_id: options.customer_id,
      schoolId:options.id
    })
    this.loginWechat();
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称

        }
      }
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