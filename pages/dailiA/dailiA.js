var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();
import { base64src } from '../../utils/base64.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customer_id:'',
    parent_id:'',
    picture:"none",
    share:'share',
    imageUrl:'',
    url:''
  },
  quxiao:function(){
    wx.navigateBack({
      delta: 1,
    })
  },
  share:function(){
    let that = this;
    that.setData({
      share:"none",
      picture:"picture"
    })
  },
  saveImg() {
    let that = this;
    wx.getSetting({
      success: function (res) {
        //不存在相册授权
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function () {
              that.savePhoto();
              that.setData({
                isPic: false
              })
            },
            fail: function (err) {
              that.setData({
                isPic: true
              })
            }
          })
        } else {
          that.savePhoto();
        }
      }
    })


  },
  handleSetting(e) {
    var that = this;
    if (!e.detail.authSetting['scope.writePhotosAlbum']) {
      wx.showModal({
        title: '警告',
        content: '不授权无法保存',
        showCancel: false
      })
      that.setData({
        isPic: true
      })
    } else {
      wx.showToast({
        title: '保存成功'
      })
      that.setData({
        isPic: false
      })
    }
  },
  savePhoto() {
    var that = this;

    
    wx.downloadFile({
      url: that.data.url,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1500
            })

          }
        })
      }

    })
  },
  bindGetUserInfo(e) {
    if (!e.detail.userInfo) {
      console.log('用户点击了取消')
    } else {
      console.log(e.detail.userInfo)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      parent_id: wx.getStorageSync("customer_id")
    })

    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx6fbd07feae4aceb7&secret=addac835c7fbea00df7acb2ff94b62e9',
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res)
        wx.request({
          url: "https://api.weixin.qq.com/wxa/getwxacode?access_token=" + res.data.access_token,
          data: {
            'path':"pages/daili/daili?parent_id=" + that.data.parent_id,
            "width":430
          },
          method: 'POST',
          dataType: 'json',
          responseType: 'arraybuffer',
          success: function(data) {
            that.setData({
              imageUrl: wx.arrayBufferToBase64(data.data)
            })
            api._post("/api/v1/twitters/account/image",{
              image: that.data.imageUrl
            }).then(res => {
              console.log(res.path)
              that.setData({
                url:res.path
              })
            })
          },
          fail: function(res) {},
          complete: function(res) {},
        })
      },
      fail: function(res) {},
      complete: function(res) {},
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
    let that = this
    return{
      title: "发展代理",
      path: '/pages/daili/daili?parent_id=' + that.data.parent_id ,
    }
  }
})