// pages/school/school.js
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolId:'',
    shipin:[
      '/images/image/shipin.png',
      '/images/image/shipin.png',
      '/images/image/shipin.png',
      '/images/image/shipin.png',
      '/images/image/shipin.png'
    ],
    shareBG:'',
    shareCon:'shareConHide',
    page:'',
    phoneUse:'phoneUseHide',
    canvasImg:'canvasImgHide',
    img:'https://gzh.xnetyy.com/Public/Admin/images/login_logo.png',
    webkit:'webkit',
    pjqw:'pjqw',
    canvasImaSrc:'',
    hidden:true,

    schoolBanner: '',
    schoolPictureAPI: util.schoolPicture,
    schoolName:'',
    location:'',
    telephone:''
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
    wx.navigateTo({
      url: '../yuyueSuccess/yuyueSuccess',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //隐藏预约试听
  PhoneHide:function(){
    this.setData({ phoneUse:'phoneUseHide'})
  },
  //跳转课程
  botiqueCon:function(){
    wx.navigateTo({
      url: '../kecen/kecen',
    })
  },
  //分享给好友
  onShareAppMessage:function(){
    return{
      title: this.data.schoolName,
      path: 'pages/school/school?id=' + this.data.schoolId
    }
  },
  //生存海报
  builder:function(){
    this.setData({ canvasImg: 'canvasImg'})
  },
  //收藏
  Collection:function(){
    let that = this
    console.log(that.data.telephone)
  },
  //客户录入
  kehuBtn:function(){
    wx.navigateTo({
      url: '../Customer/Customer',
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

    //获取学校id
    that.setData({ schoolId : options.id})

    wx.request({
      url: 'https://yikeyingshi.com/api/v1/schools/' + options.id,
      success(data){
        that.setData({ schoolBanner: data.data.data.cover, schoolName: data.data.data.name, location: data.data.data.location, telephone: data.data.data.telephone})
      }
    })

    //需要注意的是：我们展示图片的域名需要在后台downfile进行配置，并且画到canvas里面前需要先下载存储到data里面
    //先下载下来，比如我们的logo
    wx.downloadFile({
      url: that.data.img,
      success: function (res) {
        // console.log(res);
        that.setData({
          img: res.tempFilePath
        });
      }
    })


    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: '/images/image/school.png',
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
      ctx.drawImage('../../' + res[0].path, 0, 0, 550, 550)
      ctx.drawImage('../../' + res[1].path, 400, 600, 150, 150 )


      ctx.setTextAlign('left')
      ctx.setFillStyle('#000')
      ctx.setFontSize(30)
      ctx.fillText('成都新东方烹饪培训学校', 0, 640)

      ctx.setFillStyle("#999")
      ctx.setFontSize(20)
      ctx.fillText('双流蛟龙工业港高新大道109号', 0, 720)

      ctx.stroke()
      ctx.draw()
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    // const that = this;
    // wx.downloadFile({
    //   url: that.data.mysrc,
    //   success: function (sres) {
    //     console.log(sres);
    //     that.data.mysrc = sres.tempFilePath
    //   }, fail: function (fres) {

    //   }
    // })
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