// pages/school/school.js
var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    school:'',
    schoolId:'',
    //用户输入手机号
    mobile: '', 
    //商户ID
    merchant:'',

    shareBG:'',
    shareCon:'shareConHide',
    page:'',
    phoneUse:'phoneUseHide',
    canvasImg:'canvasImgHide',
    
    //评价全文
    pjqw:'pjqw',
    canvasImaSrc:'',
    hidden:true,
    greenStar:'/images/icon/stargreen.png',

    //学校首页图
    schoolBanner: '',
    //学校首页图片地址拼接
    schoolPictureAPI: '',
    //学校名字
    schoolName:'',
    //学校位置
    location:'',
    //学校电话
    telephone:'',
    //学校分数
    rate:'',


    //课程
    lessons:[],
    lessonsId:'',

    //团购
    packages:'',
    packagesId:'',
    //老师
    teachers:{},
    //老师数量
    teachNum:'',
    //视频
    videos:'',
    videosNum:'',

    //客户录入按钮
    kehuBtn:false,

    CollectionImg:'/images/icon/star.png',
    CollectionImgNo:'/images/icon/star.png',
    CollectionImgYes:'/images/icon/yellowStar.png',
    //是否收藏
    is_collected:false,
    //学校评论
    schoolping:[],
    schoolpingNum:'',
    //查看全部评价
    Reviews:true,
    Publishercustomer_id:'',
    isshare:'',
    webkit:'',
    comment:'',
    //手机为iphonex的加底部白边
    buttonBon:'',
    prurl:'',
    pjBot2:'',
    getPhoneNumberOK:false,
    userphone:'',
    canvasImgerweima:''

  },
  //打开客服
  handleContact(e) {
    wx.navigateTo({
      url: '/pages/messageCon/message',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //拨打电话
  callPhone:function(){
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.telephone,
    })
  },
  //分享的页面回到首页
  goHome:function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  //有电话缓存的拨打电话
  getPhoneNumberYES:function(){
    let that = this
    api._post("/api/v1/customer/phone-call", {
      school: that.data.schoolId,
      merchant: that.data.merchant,
      phone: wx.getStorageSync("userphone")
    }).then(data => {
      that.callPhone()
    })
  },
  getPhoneNumberYY:function(){
    let that = this
    wx.showLoading({
      title: '请稍等...',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    api._post("/api/v1/appointments", {
      school: that.data.schoolId,
      merchant: that.data.merchant,
      phone: wx.getStorageSync("userphone")
    }).then(data => {
      wx.hideLoading()
      wx.navigateTo({
        url: '../yuyueSuccess/yuyueSuccess?merchantid=' + that.data.merchant,
      })
    })
  },
  getPhoneNumber:function(e){
    var that = this
    if (e.detail.errMsg == 'getPhoneNumber:ok'){
      let userphone = wx.getStorageSync('userphone')
      if (e.target.dataset.yu == 1) {     //如果是点击预约试听的
        if (userphone) {
          api._post("/api/v1/appointments", {
            school: that.data.schoolId,
            merchant: that.data.merchant,
            phone: wx.getStorageSync("userphone")
          }).then(data => {
            wx.navigateTo({
              url: '../yuyueSuccess/yuyueSuccess?merchantid=' + that.data.merchant,
            })
          })
        } else {

          wx.login({
            success(data) {
              wx.getUserInfo({
                withCredentials: true,
                success(res) {
                  api._post("/api/v1/customer/phone-number", {
                    code: encodeURI(data.code),
                    encryptedData: encodeURIComponent(e.detail.encryptedData),
                    iv: encodeURI(e.detail.iv)
                  }).then(res => {
                    wx.setStorageSync('userphone', res.data.phoneNumber)
                    that.setData({
                      userphone:res.data.phoneNumber,
                      getPhoneNumberOK:true
                    })
                    api._post("/api/v1/appointments", {
                      school: that.data.schoolId,
                      merchant: that.data.merchant,
                      phone: res.data.phoneNumber
                    }).then(data => {
                      wx.navigateTo({
                        url: '../yuyueSuccess/yuyueSuccess?merchantid=' + that.data.merchant,
                      })
                    })
                  }).catch(err => {
                    wx.showToast({
                      title: '获取电话失败了...',
                      icon: 'none',
                      image: '',
                      duration: 2000,
                      mask: true,
                      success: function(res) {},
                      fail: function(res) {},
                      complete: function(res) {},
                    })
                  })
                }
              })
            }
          })
        }

      } else {      //点击拨打电话的
        if (userphone) {    //已经获取到电话的
          api._post("/api/v1/customer/phone-call", {
            school: that.data.schoolId,
            merchant: that.data.merchant,
            phone: wx.getStorageSync("userphone")
          }).then(data => {
            that.callPhone()
          })
        } else {
          wx.login({
            success(data) {
              wx.getUserInfo({
                withCredentials: true,
                success(res) {
                  api._post("/api/v1/customer/phone-number", {
                    code: encodeURI(data.code),
                    encryptedData: encodeURIComponent(e.detail.encryptedData),
                    iv: encodeURI(e.detail.iv)
                  }).then(res => {
                    wx.setStorageSync('userphone', res.data.phoneNumber)
                    that.setData({
                      userphone: res.data.phoneNumber,
                      getPhoneNumberOK: true
                    })
                    api._post("/api/v1/customer/phone-call", {
                      school: that.data.schoolId,
                      merchant: that.data.merchant,
                      phone: res.data.phoneNumber
                    }).then(data => {
                      that.callPhone()
                    })
                  }).catch(err => {
                    wx.showToast({
                      title: '获取电话号码失败了...',
                      icon: '',
                      image: '',
                      duration: 0,
                      mask: true,
                      success: function(res) {},
                      fail: function(res) {},
                      complete: function(res) {},
                    })
                  })
                }
              })
            }
          })
        }
      }
    }

  },

  //分享
  shareBtn:function(){
    let that = this
    this.setData({ shareBG: 'shareBG', shareCon: 'shareCon', page:'page'})

  },

  //隐藏
  quxiao:function(){
    this.setData({ shareBG: '', shareCon: 'shareConHide', page: '', canvasImg: 'canvasImgHide', hidden:true})
  },

  //预约试听
  phoneUseH:function(){
    this.setData({ phoneUse:'phoneUse'})
  },
  yuyueSuccess:function(){

    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (myreg.test(this.data.mobile)){
      api._post("/api/v1/appointments", {
        school: parseInt(this.data.schoolId),
        merchant: parseInt(this.data.merchant),
        phone: parseInt(this.data.mobile)
      }).then(res => {
        wx.navigateTo({
          url: '../yuyueSuccess/yuyueSuccess?merchantid=' + that.data.merchant,
        })
      })
    }else{
      wx.showToast({
        title: '请填写正确的电话号码',
        icon: 'none'
      })
    }

  },

  //输入的手机号
  mobileInput: function (e) {
    if (e.detail.value)
    this.setData({
      mobile: e.detail.value
    })
  },

  //隐藏预约试听
  PhoneHide:function(){
    this.setData({ phoneUse:'phoneUseHide'})
  },

  //跳转课程
  botiqueCon:function(e){
    let that = this;
    console.log(e)
    wx.navigateTo({
      url: '../kecen/kecen?lessonsId=' + e.currentTarget.dataset.id.id,
      success(){
        api._post("/api/v1/views", {
          school: e.currentTarget.dataset.id.id,
          merchant: that.data.merchant,
          product_type: 1,
          product_id: e.currentTarget.dataset.id.id,
          product_name: e.currentTarget.dataset.id.name,
          product_desc: e.currentTarget.dataset.id.desc,
          product_image: e.currentTarget.dataset.id.cover
        }).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err.statusCode)
          if (err.statusCode == 401){
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        })
      }
    })
  },
  //跳转团购
  tuanGou:function(e){
    let that = this;
    console.log(e)
    wx.navigateTo({
      url: '../tuanGou/tuanGou?packagesId=' + e.currentTarget.dataset.id.id,
      success() {
        api._post("/api/v1/views", {
          school: e.currentTarget.dataset.id.id,
          merchant: that.data.merchant,
          product_type: 2,
          product_id: e.currentTarget.dataset.id.id,
          product_name: e.currentTarget.dataset.id.name,
          product_desc: e.currentTarget.dataset.id.desc,
          product_image: e.currentTarget.dataset.id.cover
        }).then(res => {
          console.log(res)
        }).catch(err => {
          console.log(err.statusCode)
          if (err.statusCode == 401) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        })
      }
    })
  },
  //分享给好友
  onShareAppMessage:function(){
    let that = this;
    var customer_id = wx.getStorageSync('customer_id')
    var header = util.banner
    var image = wx.getStorageSync('images')
    console.log(header + image[Math.floor(Math.random() * image.length)])
    return {
      title: that.data.schoolName,
      path: 'pages/school/school?id=' + that.data.schoolId + "&customer_id=" + that.data.Publishercustomer_id,
      imageUrl: header + image[Math.floor(Math.random() * image.length)]
    }

  },
  //视频全屏播放
  videoshow:function(e){
    var videoContext = wx.createVideoContext(e.currentTarget.dataset.inx, this);
    videoContext.requestFullScreen({
      direction:0
    });
    
  },
  screenChange(e) {
    let fullScreen = e.detail.fullScreen //值true为进入全屏，false为退出全屏
    if (!fullScreen) { //退出全屏
      var videoContext = wx.createVideoContext(e.currentTarget.dataset.inx, this);
      videoContext.exitFullScreen()
      videoContext.stop()
    } else { //进入全屏
      // this.setData({
      //   controls: true
      // })
    }
  },

  //生存海报
  builder:function(){
    this.setData({ canvasImg: 'canvasImg'})
  },

  //收藏
  Collection:function(){
    let that = this
    
    api._post("/api/v1/collections", {
      school: this.data.schoolId,
      merchant: this.data.school.merchant.id,
      product_type: 3,
      product_id: this.data.schoolId,
      product_name: this.data.school.name,
      product_desc: this.data.school.desc,
      product_image: this.data.school.cover
    }).then(res => {
      console.log(res)
      if (this.data.CollectionImg == this.data.CollectionImgNo) {
        that.setData({ CollectionImg: this.data.CollectionImgYes })
      } else {
        that.setData({ CollectionImg: this.data.CollectionImgNo })
      }
    })
  },

  //客户录入
  kehuBtn:function(){
    wx.navigateTo({
      url: '../Customer/Customer?id=' + this.data.schoolId + '&schoolName=' + this.data.schoolName + '&merchant=' + this.data.merchant,
    })
  },

  //保存图片
  saveImg() {
    var that = this;
    
    that.setData({ shareBG: '', shareCon: 'shareConHide', page: '', canvasImg: 'canvasImgHide', hidden: true})    

    //生产环境时 记得这里要加入获取相册授权的代码
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              that.setData({
                hidden: true
              })
            }
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    
    //是否有电话号码缓存
    if(wx.getStorageSync("userphone")){
      that.setData({
        userphone: wx.getStorageSync("userphone"),
        getPhoneNumberOK: true
      })
    }
    //判断手机型号
    wx.getSystemInfo({
      success: function(res) {
        if (res.model == "iPhone X" || res.model == "iPhone Xr" || res.model == "iPhone Xs" || res.model == "iPhone Xs Max"){
          console.log(res)
          that.setData({
            buttonBon:true,
            pjBot2:true
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })


    //是否为分享进来的用户
    if (options.customer_id) {
      this.setData({
        isshare: true
      })
    }

    that.setData({
      Publishercustomer_id: options.customer_id
    })
    console.log(wx.getStorageSync("userType"))

    var userType = wx.getStorageSync("userType")
    if(userType == ''){
      wx.navigateTo({
        url: '/pages/login/login?id=' + options.id +'&customer_id=' + options.customer_id,
      })
    }
    
    //获取全局变量，如果是推客则显示客户录入按钮
    if (userType == 3){
      that.setData({ kehuBtn:true})
    }else{
      that.setData({ kehuBtn:false})
    }

    //获取学校id
    that.setData({ schoolId : options.id})

    //获取学校详情信息
    api._get('/api/v1/schools/' + options.id).then( data => {
      that.setData({ 
        school:data.data,
        merchant: data.data.merchant.id, 
        schoolPictureAPI: util.schoolPicture, 
        schoolBanner: data.data.cover, 
        schoolName: data.data.name, 
        location: data.data.location, 
        telephone: data.data.telephone,
        rate: data.data.rate, 
        lessons: data.data.lessons, 
        packages: data.data.packages,
        teachers: data.data.teachers, 
        videos: data.data.videos, 
      })
      
      console.log(data.data.name)
    if (data.data.teachers != null){
      that.setData({
        teachNum: data.data.teachers.length, 
      })
    }else
      if(data.data.teachers == null){
        that.setData({
          teachNum:0
        })
      }
    if (data.data.videos != null){
      that.setData({
        videosNum: data.data.videos.length
      })
    }else
      if(data.data.videos == null){
        that.setData({
          videosNum: 0
        })
      }
      
      //学校是否收藏,收藏为黄色星，未收藏为空星
      api._post("/api/v1/collections/verify",{
        product_type:3,
        product_id: this.data.schoolId
      }).then(res => {
        if (res.data.is_collected == true){
          that.setData({ CollectionImg: this.data.CollectionImgYes })
        }else{
          that.setData({ CollectionImg: this.data.CollectionImgNo })
        }
      })

      //保存分享海报
      wx.request({
        url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx6fbd07feae4aceb7&secret=addac835c7fbea00df7acb2ff94b62e9',
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          console.log(res)
          wx.request({
            url: "https://api.weixin.qq.com/wxa/getwxacode?access_token=" + res.data.access_token,
            data: {
              'path': "pages/school/school?id=" + that.data.schoolId + " & customer_id=" + that.data.Publishercustomer_id,
              "width": 430
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'arraybuffer',
            success: function (data) {

              api._post("/api/v1/twitters/account/school-image", {
                image: wx.arrayBufferToBase64(data.data),
                id: that.data.schoolId
              }).then(res => {

                wx.downloadFile({
                  url: res.path,
                  success: function (res2) {
                    console.log(res2.tempFilePath)
                    that.setData({
                      canvasImgerweima: res2.tempFilePath
                    })
                    wx.downloadFile({
                      url: that.data.schoolPictureAPI + that.data.schoolBanner,
                      success(res) {
                        console.log(res)
                        wx.playVoice({
                          filePath: res.tempFilePath,
                        })
                        let promise1 = new Promise(function (resolve, reject) {
                          wx.getImageInfo({
                            src: res.tempFilePath,
                            success: function (res) {
                              // console.log(res)
                              resolve(res);
                            }
                          })
                        });
                        let promise2 = new Promise(function (resolve, reject) {
                          wx.getImageInfo({
                            src: that.data.canvasImgerweima,
                            success: function (res) {
                              // console.log(res)
                              resolve(res);
                            }
                          })
                        });
                        Promise.all([
                          promise1, promise2
                        ]).then(res => {
                          // console.log(res)
                          const ctx = wx.createCanvasContext('shareImg')

                          ctx.setFillStyle("#fafafa");
                          ctx.fillRect(0, 0, 545, 771)

                          //主要就是计算好各个图文的位置
                          ctx.drawImage(res[0].path, 0, 0, 550, 550)
                          ctx.drawImage(res[1].path, 400, 600, 150, 150)


                          ctx.setTextAlign('left')
                          ctx.setFillStyle('#000')
                          ctx.setFontSize(30)
                          ctx.fillText(that.data.schoolName, 0, 640)

                          ctx.setFillStyle("#999")
                          ctx.setFontSize(20)
                          ctx.fillText(that.data.location, 0, 720)

                          ctx.stroke()
                          ctx.draw()
                        })
                      }
                    })
                  },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              })
            },
            fail: function (res) { },
            complete: function (res) { },
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })

    })

    //获取学校的评论
    api._get("/api/v1/comments/school/" + options.id).then(res => {
      res.data.forEach(item => {
        if (item.content.length > 75) {
          item.webkit = true
        } else {
          item.webkit = false
        }
      })
      that.data.schoolping.push(res.data[0])
      that.data.schoolping.push(res.data[1])
      that.setData({ 
        schoolping: that.data.schoolping,
        schoolpingNum:res.meta.total,
      })
      console.log(that.data.schoolping)
    })

    //提交推客信息
    api._post("/api/v1/twitters/fan/following", {
      twitter_id: options.customer_id,
      school_id:that.data.schoolId,
      latitude: wx.getStorageSync('Mylatitude'),
      longitude: wx.getStorageSync('Mylongitude')
    }).then(res => {

    })
    
    //获取分享图
    api._get("/api/v1/platform/share-image").then(res => {
      wx.setStorageSync('images', res.data.shares.images)
    })
  },
  //获取全部的学校评论
  LookAll:function(){
    let that = this;
    api._get("/api/v1/comments/school/" + that.data.schoolId).then(res => {
      res.data.forEach(item => {
        if(item.content.length > 75){
          item.webkit = true
        }else{
          item.webkit = false
        }
      })
      that.setData({
        schoolping: res.data,
        schoolpingNum: res.meta.total,
        Reviews:false
      })
      console.log(that.data.schoolping)
    })
  },
  share: function () {
    var that = this
    wx.showLoading({
      title: '努力生成中...'
    })
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 545,
      height: 771,
      destWidth: 545,
      destHeight: 771,
      canvasId: 'shareImg',
      success: function (res) {
        console.log(res.tempFilePath);
        that.setData({
          prurl: res.tempFilePath,
          hidden: false
        })
        wx.hideLoading()
      },
      fail: function (res) {
        console.log(res)
      }
    })

  },
  //查看评论详情
  Viewcomments:function(e){
    let that = this
    var num;
    for(var i = 0 ; i < that.data.schoolping.length ; i++){
      if (that.data.schoolping[i].id == e.currentTarget.dataset.inx.id){
        num = i
      }
    }
    if (e.currentTarget.dataset.inx.webkit == true){
      that.data.schoolping[num].webkit = false
      that.setData({
        schoolping:that.data.schoolping
      })
    }else{
      that.data.schoolping[num].webkit = true
      that.setData({
        schoolping:that.data.schoolping
      })
    }
    
  },
  getImg:function(){
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  postcustomer_id:function(){
    let that = this

    //提交推客信息
    api._post("/api/v1/twitters/fan/following", {
      twitter_id: that.data.Publishercustomer_id
    }).then(res => {

    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    that.postcustomer_id()
    var userType = wx.getStorageSync("userType")
    console.log(userType)
    //获取全局变量，如果是推客则显示客户录入按钮
    if (userType == 3) {
      that.setData({ kehuBtn: true })
    } else {
      that.setData({ kehuBtn: false })
    }
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
    let that = this;

    //获取学校详情信息
    api._get('/api/v1/schools/' + that.data.schoolId).then(data => {
      that.setData({
        school: data.data,
        merchant: data.data.merchant.id,
        schoolPictureAPI: util.schoolPicture,
        schoolBanner: data.data.cover,
        schoolName: data.data.name,
        location: data.data.location,
        telephone: data.data.telephone,
        rate: data.data.rate,
        lessons: data.data.lessons,
        packages: data.data.packages,
        teachers: data.data.teachers,
        videos: data.data.videos,
      })

      console.log(data.data.name)
      if (data.data.teachers != null) {
        that.setData({
          teachNum: data.data.teachers.length,
        })
      } else
        if (data.data.teachers == null) {
          that.setData({
            teachNum: 0
          })
        }
      if (data.data.videos != null) {
        that.setData({
          videosNum: data.data.videos.length
        })
      } else
        if (data.data.videos == null) {
          that.setData({
            videosNum: 0
          })
        }
      wx.stopPullDownRefresh();
    })

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
 

  },

  /**
   * 用户点击右上角分享
   */

})