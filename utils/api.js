const baseUrl = 'https://yikeyingshi.com';
let jwtToken = ''; 
let userType = ''

const http = ({ url = '', param = {}, ...other } = {}) => {
  // wx.showLoading({
  //   title: '请求中，请耐心等待..'
  // });

  let timeStart = Date.now();

  var value = wx.getStorageSync('jwtToken')

  return new Promise((resolve, reject) => {
    wx.request({
      url: getUrl(url),
      data: param,
      header: {
        'Authorization': value,
        'content-type': 'application/json', // 默认值 ,另一种是 "content-type": "application/x-www-form-urlencoded"
      },
      ...other,
      complete: (res) => {
        // wx.hideLoading();
        // console.log(`耗时${Date.now() - timeStart}`);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else if(res.statusCode == 401){
          wx.showModal({
            title: '登陆失效',
            content: '请到"我的"登陆',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '',
            confirmText: '确定',
            confirmColor: '',
            success: function(res) {
              if(res.confirm){
                wx.switchTab({
                  url: '/pages/My/My',
                  success: function(res) {},
                  fail: function(res) {},
                  complete: function(res) {},
                })
              }
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        }else{
          reject(res)
        }
      }
    })
  })
}

const getUrl = (url) => {
  if (url.indexOf('://') == -1) {
    url = baseUrl + url;
  }
  return url
}

// get方法
const _get = (url, param = {}) => {
  return http({
    url,
    param
  })
}

const _post = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'post'
  })
}

const _put = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'put'
  })
}

const _delete = (url, param = {}) => {
  return http({
    url,
    param,
    method: 'put'
  })
}
module.exports = {
  baseUrl,
  _get,
  _post,
  _put,
  _delete
}
