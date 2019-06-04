import { Config } from 'config.js';

class Token {
  constructor() {
    console.log(this)
    this.verifyUrl = Config.restUrl + '/api/auth/validation/token';
    this.tokenUrl = Config.restUrl + '/api/auth/login/';
  }

  verify() {
    var token = wx.getStorageSync('token');
    console.log(token)
    if (!token) {
      this.getTokenFromServer(token);
    } else {
      this._verifyFromServer(token);
    }
  }

  // 携带令牌去服务器校验令牌
  _verifyFromServer(token) {
    console.log(11212)
    var that = this;
    // const account = wx.getStorageSync("account")
    // console.log(token)
    // console.log(wx.getStorageSync("token"))
    // console.log(account)
    const tokenn = wx.getStorageSync("token")
    wx.request({
      url: that.verifyUrl,
      method: 'POST',
      header:{
        Authorization:token
      },
      // data: {
      //   token: tokenn,
      //   // account: account
      // },
      success: function (res) {
        console.log(res.data.status)
        return false
        var valid = res.data.status;

        if (valid != 1) {
          that.getTokenFromServer();
        }
      }
    })
  }


  // 从服务器获取token
  getTokenFromServer(callback) {
    var that = this;
    wx.login({
      success: function (data) {
        wx.getUserInfo({
          withCredentials: true,
          success(res){
            console.log(res)
            let userInfo = res.userInfo
            wx.request({
              url: that.tokenUrl,
              method: 'POST',
              data: {
                encryptedData: encodeURI(res.encryptedData),
                iv: encodeURI(res.iv),
                code: encodeURI(data.code),

                // code: code,
                // nickname: userInfo.nickName,
                // gender: userInfo.gender,
                // avatarUrl: userInfo.avatarUrl,
                // city: userInfo.city
              },
              header: {
                "content-type": "application/x-www-form-urlencoded",
                'content-type': 'application/json'
              },
              success: function (res) {
                wx.setStorageSync('token', res.data.token_type + ' ' + res.data.access_token);
                // wx.setStorageSync('account', res.data.data.account);
                // wx.setStorageSync('userid', res.data.data.user_id);
              }
            })
          }

        })

      }
    })
  }


}

export { Token };
