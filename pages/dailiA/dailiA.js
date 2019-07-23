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
  bgcolor:function(){
    let that = this;
    that.setData({
      picture:'none',
      share:'share'
    })
  },
  share:function(){
    let that = this;
    wx.showLoading({
      title: '生成中，请稍后...',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    api._post("/api/v1/twitters/team/invitation-code", {
      page: 'pages/daili/daili?parent_id=' + that.data.parent_id
    }).then(res => {
      console.log(res.data.image)
      that.setData({
        share: "none",
        picture: "picture",
        imageUrl: res.data.image
      })
      wx.hideLoading()
    })

  },
  saveImg() {
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.downloadFile({
                url: that.data.imageUrl,
                success: function (res) {
                  console.log(res);
                  //图片保存到本地
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: function (data) {
                      wx.showToast({
                        title: '保存成功',
                        icon: 'success',
                        duration: 2000
                      })
                    },
                    fail: function (err) {
                      console.log(err);
                      if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                        console.log("当初用户拒绝，再次发起授权")
                        wx.openSetting({
                          success(settingdata) {
                            console.log(settingdata)
                            if (settingdata.authSetting['scope.writePhotosAlbum']) {
                              console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                            } else {
                              console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                            }
                          }
                        })
                      }
                    },
                    complete(res) {
                      console.log(res);
                    }
                  })
                }
              })
            }
          })
        }else{
          wx.downloadFile({
            url: that.data.imageUrl,
            success: function (res) {
              console.log(res);
              //图片保存到本地
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function (data) {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000
                  })
                },
                fail: function (err) {
                  console.log(err);
                  if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                    console.log("当初用户拒绝，再次发起授权")
                    wx.openSetting({
                      success(settingdata) {
                        console.log(settingdata)
                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                          console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                        } else {
                          console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                        }
                      }
                    })
                  }
                },
                complete(res) {
                  console.log(res);
                }
              })
            }
          })
        }
      }
    })

    // wx.getSetting({
    //   success: function (res) {
    //     //不存在相册授权
    //     if (!res.authSetting['scope.writePhotosAlbum']) {
    //       wx.authorize({
    //         scope: 'scope.writePhotosAlbum',
    //         success: function () {
    //           that.savePhoto();
    //           that.setData({
    //             isPic: false
    //           })
    //         },
    //         fail: function (err) {
    //           that.setData({
    //             isPic: true
    //           })
    //         }
    //       })
    //     } else {
    //       that.savePhoto();
    //     }
    //   }
    // })


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
        url: that.data.imageUrl,
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
        },fail(err){
          console.log(err)
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
    // api._post("/api/v1/twitters/team/invitation-code",{
    //   page: 'pages/daili/daili?parent_id=' + that.data.parent_id
    // }).then(res => {
    //   console.log(res.data.image)
    //   that.setData({
    //     imageUrl:res.data.image
    //   })
    // })

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
      title: "代理申请",
      path: '/pages/daili/daili?parent_id=' + that.data.parent_id ,
    }
  }
})