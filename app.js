import { Token } from 'utils/token-model.js';
var scence = 0;
App({
  onLaunch: function () {
    // var token = new Token();
    // token.verify();
  },




  onShow: function () {

  },
  onHide: function () {
    this.globalData.scence = 1
    wx.setStorageSync('scence', this.globalData.scence)
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
