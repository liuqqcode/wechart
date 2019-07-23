import { Token } from 'utils/token-model.js';
var scence = 0;
var socketOpen = false;
var frameBuffer_Data, session, SocketTask;
var url = 'wss://snap.yikeyingshi.com';

App({
  onLaunch: function () {
    // var token = new Token();
    // token.verify();
  },

  onShow: function () {
    let newmessage = []
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
    var that = this;
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
      console.log(onMessage_data)
      if (onMessage_data.code == 1001) {
        console.log(onMessage_data)
        if (onMessage_data.data.message.content != '') {
          newmessage.push(onMessage_data.data.session)
          let newmessage1 = new Set(newmessage)
          newmessage = Array.from(newmessage1)
          wx.setStorageSync('newmessage', newmessage)
        }
        wx.setTabBarBadge({
          index: 2,
          text: 'new',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
      }

    })


  },
  onLoad:function(){
    
  },
  onReady: function () {
  },
  onHide: function () {
    this.globalData.scence = 1
    wx.setStorageSync('scence', this.globalData.scence)
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

  globalData: {
    account: '',
    stroge: 0,
    openid: 0,
    userInfo: null,
    times: null,
    urls: 'https://wx.knowdao.com',
    urlst: 'http://test.knowdao.com',
    token: '',
    UserType: 1,
    customer_id:'',
    options:'',
    avatarUrl:'',
    search:[],
    images:''
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