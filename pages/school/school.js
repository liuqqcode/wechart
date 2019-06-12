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
    webkit:'webkit',
    
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
    Publishercustomer_id:''

  },
  //打开客服
  handleContact(e) {
    console.log(e.path)
    console.log(e.query)
  },

  //拨打电话
  callPhone:function(){
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.telephone,
    })
  },
  getPhoneNumber:function(e){
    var that = this
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
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
              console.log(res)
            })
          }
        })

      }
    })
  },

  //查看全文
  pjqw:function(){
    this.setData({ webkit: '', pjqw:'pjqwHide'})
  },

  //分享
  shareBtn:function(){
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
          url: '../yuyueSuccess/yuyueSuccess',
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
        })
      }
    })
  },
  //分享给好友
  onShareAppMessage:function(){
    var customer_id = wx.getStorageSync('customer_id')
    return{
      title: this.data.schoolName,
      path: 'pages/school/school?id=' + this.data.schoolId + "&customer_id=" + that.data.Publishercustomer_id
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

    that.setData({
      Publishercustomer_id: options.customer_id
    })
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
      
      console.log(data)
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
        videosNum: data.data.videos.length,
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
      wx.downloadFile({
        url: this.data.schoolPictureAPI + this.data.schoolBanner,
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
              src: '/images/image/header.png',
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
            ctx.drawImage('../../' + res[1].path, 400, 600, 150, 150)


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
    })

    //获取学校的评论
    api._get("/api/v1/comments/school/" + options.id).then(res => {
      that.data.schoolping.push(res.data[0])
      that.setData({ 
        schoolping: that.data.schoolping,
        schoolpingNum:res.meta.total,
      })
      console.log(res.data)
    })

    //提交推客信息
    api._post("/api/v1/twitters/fan/following", {
      twitter_id: options.customer_id
    }).then(res => {

    })

  },
  //获取全部的学校评论
  LookAll:function(){
    let that = this;
    api._get("/api/v1/comments/school/" + that.data.schoolId).then(res => {
      that.setData({
        schoolping: res.data,
        schoolpingNum: res.meta.total,
        Reviews:false
      })
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