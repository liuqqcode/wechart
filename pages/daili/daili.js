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
    parent_id:'',
    cont:'none',
    content:'none'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (wx.getStorageSync('userType') == ''){
      that.setData({
        cont:'cont',
        content:'content'
      })
    }
    console.log(options)
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      let parent = decodeURIComponent(scene.replace('parent_id','')).replace('=','')
      that.setData({
        parent_id: parent
      })
    }else{
      that.setData({
        parent_id:options.parent_id
      })
    }
  },
  loginfun:function(){

    var that = this
console.log("a")
    wx.login({
      success(data) {
        console.log(data)
        wx.getUserInfo({
          success(res) {
            console.log(res)
            wx.setStorageSync("avatarUrl", res.userInfo.avatarUrl)
            wx.setStorageSync("canIUse", false)
            wx.setStorageSync('userInfo', res.userInfo)
            wx.setStorageSync('code', data.code)
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
                that.setData({
                  cont:'none',
                  content:'none'
                })
                wx.setStorageSync("encryptedData", res.encryptedData)
                wx.setStorageSync("iv", res.iv)
                wx.setStorageSync("code", data.code)
                console.log(loginRes.data.customer_openid)
                wx.setStorageSync('openid', loginRes.data.customer_openid)
                wx.setStorageSync("token", loginRes.data.access_token)
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
                switch (loginRes.data.customer_type) {
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
                    api._get("/api/v1/agents/schools").then(res => {
                      console.log(res.data.schools)
                      that.setData({
                        myschool: res.data.schools,
                        ImageHead: util.schoolPicture
                      })
                    })
                    break;
                }
              }
            })
          }
        })


      }
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
      wx.switchTab({
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