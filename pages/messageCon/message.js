var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();
var socketOpen = false;
var frameBuffer_Data, session, SocketTask;
var url = 'wss://yikeyingshi.com:1096';
Page({
  data: {
    user_input_text: '',//用户输入文字
    text:'',
    inputValue: '',
    returnValue: '',
    addImg: false,
    //格式示例数据，可为空
    allContentList: [],
    num: 0,
    myheader:'',
    yourImg:'',
    yourOpenid:'',
    userid:''
  },
  // 页面加载
  onLoad: function (options) {
    let  that = this
    console.log(options)
    that.setData({
      userid: options.merchant_id
    })
    api._get("/api/v1/platform/session/messages/" + options.id).then(res => {
      console.log(res)
      res.data.forEach(item => {
        if (item.from_customer_id == that.data.userid){
          that.data.allContentList.push({
             is_ai: true, text: item.content, 
             myheader: item.from_customer_avatar, 
             yourImg: item.to_customer_avatar
          })
        }else{
          that.data.allContentList.push({
             is_my: { text: item.content } ,
            myheader: item.to_customer_avatar,
            yourImg: item.from_customer_avatar
          })
        }
      })
      that.setData({
        allContentList: that.data.allContentList
      })
      console.log(that.data.allContentList)
      that.bottom()
    })
    if (options.type == 'merchant'){
      api._post("/api/v1/platform/sessions", {
        user_id: options.merchant_id,
        type: "merchant"
      }).then(res => {
        console.log(res)
        that.setData({
          yourImg: res.data.target_customer_avatar,
          yourOpenid: res.data.id
        })
      })
    }else{
      api._post("/api/v1/platform/sessions", {
        user_id: options.merchant_id,
        type: "customer"
      }).then(res => {
        console.log(res)
        that.setData({
          yourImg: res.data.target_customer_avatar,
          yourOpenid: res.data.id
        })
      })
    }

    this.bottom();
    var headerImg = wx.getStorageSync('avatarUrl')
    that.setData({
      myheader:headerImg
    })    
    console.log(wx.getStorageSync('customer_id'))
  },
  onShow: function (e) {
    if (!socketOpen) {
      this.webSocket()
    }
  },
  // 页面加载完成
  onReady: function () {
    var that = this;
    SocketTask.onOpen(res => {
      socketOpen = true;
      console.log('监听 WebSocket 连接打开事件。', res)
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
      try{
        onMessage_data = JSON.parse(onMessage)
      }catch(err){
        onMessage_data = onMessage
      }
      onMessage_data = JSON.parse(onMessage_data.data)
      console.log(onMessage_data)
      if (onMessage_data.data.receiver == that.data.userid){
        that.setData({
          yourImg: onMessage_data.data.message.sender_avatar,
          yourOpenid: onMessage_data.data.sender
        })
        if (onMessage_data.code == 1001) {
          that.setData({
            link_list: onMessage_data.data.message.content
          })
          // 是否为数组
          // if (text instanceof Array) {
          //   for (var i = 0; i < text.length; i++) {
          //     text[i]
          //   }
          // } else {

          // }
          that.data.allContentList.push({ is_ai: true, text: onMessage_data.data.message.content });
          that.setData({
            allContentList: that.data.allContentList
          })
          console.log(that.data.allContentList)
          that.bottom()
        }
      }

    })
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

  // 提交文字
  submitTo: function (e) {
    let that = this;
    var data = {
      userid: that.data.userid,
      action:'message',
      to: that.data.yourOpenid,
      message:{
        type:'text',
        content: that.data.inputValue
      },
    }

    if (socketOpen) {
      // 如果打开了socket就发送数据给服务器
      sendSocketMessage(data)
      this.data.allContentList.push({ is_my: { text: this.data.inputValue } });
      this.setData({
        allContentList: this.data.allContentList,
        inputValue: ''
      })
      console.log(this.data.allContentList)
      that.bottom()
    }
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  onHide: function () {
    SocketTask.close(function (close) {
      console.log('关闭 WebSocket 连接。', close)
    })
  },

  // 获取hei的id节点然后屏幕焦点调转到这个节点  
  bottom: function () {
    var that = this;
    this.setData({
      scrollTop: 1000000
    })
  },
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