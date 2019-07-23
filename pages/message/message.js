var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();
var socketOpen = false;
var frameBuffer_Data, session, SocketTask;
var url = 'wss://snap.yikeyingshi.com';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList:[],
    myuserid:''
  },
  webSocket: function () {
    // 创建Socket
    SocketTask = wx.connectSocket({
      url: url,
      data: 'data',
      header: {
        'Authorization': wx.getStorageSync('jwtToken'),
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        console.log('WebSocket连接创建', res)
      },
      fail: function (err) {
        wx.showToast({
          title: '网络异常！',
        })
        console.log(err)
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    api._get("/api/v1/platform/sessions").then(res => {
      console.log(res)
      for(var i = 0 ; i < res.data.length ; i++){
        wx.getStorageSync('newmessage').forEach(item1 => {
          console.log(item1)
          if (res.data[i].id == item1) {
            res.data[i].newmessage = '1'
          }else{
            res.data[i].newmessage = '2'
          }
          that.setData({
            userList: res.data
          })
        })
      }
      console.log(res.data)

      console.log(that.data.userList)
    })
    if (!socketOpen) {
      this.webSocket()
    }
    console.log(wx.getStorageSync('newmessage'))
  },
  messageCon:function(e){
    console.log(e.currentTarget.dataset.inx)
    wx.navigateTo({
      url: '/pages/messageCon/message?merchant_id=' + e.currentTarget.dataset.inx.target_customer_id + '&id=' + e.currentTarget.dataset.inx.id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    let newmessage = []
    SocketTask.onOpen(res => {
      socketOpen = true;
      console.log('监听 WebSocket 连接打开事件。', res)
      let msg = {
        action: "login",
        userid: wx.getStorageSync('customer_id')
      }
      sendSocketMessage(msg)
    })
    SocketTask.onClose(onClose => {
      console.log('监听 WebSocket 连接关闭事件。', onClose)
      socketOpen = false;
      this.webSocket()
    })
    SocketTask.onError(onError => {
      console.log('监听 WebSocket 错误。错误信息', onError)
      socketOpen = false
    })
    SocketTask.onMessage(onMessage => {
      console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', onMessage)
      var onMessage_data
      try {
        onMessage_data = JSON.parse(onMessage)
      } catch (err) {
        onMessage_data = onMessage
      }
      onMessage_data = JSON.parse(onMessage_data.data)
      console.log(onMessage_data.data.message.content)

    })
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    api._get("/api/v1/platform/sessions").then(res => {
      that.setData({
        userList: res.data
      })
    })
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
//通过 WebSocket 连接发送数据，需要先 wx.connectSocket，并在 wx.onSocketOpen 回调之后才能发送。
function sendSocketMessage(msg) {
  var that = this;
  console.log('通过 WebSocket 连接发送数据', msg)
  SocketTask.send({
    data: JSON.stringify(msg)
  }, function (res) {
    console.log('已发送', res)
  })
} 