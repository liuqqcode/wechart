var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lessons:'',
    ImageHead:'',
    CollectionImg: '/images/icon/star.png',
    CollectionImgNo: '/images/icon/star.png',
    CollectionImgYes: '/images/icon/yellowStar.png',
    school:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    api._get('/api/v1/packages/' + options.packagesId).then( data => {
      that.setData({ lessons: data.data, ImageHead: util.schoolPicture })
      
      console.log(data)

      api._post("/api/v1/collections/verify", {
        product_type: 2,
        product_id: this.data.lessons.id
      }).then(res => {
        if (res.data.is_collected == true) {
          that.setData({ CollectionImg: this.data.CollectionImgYes })
        } else {
          that.setData({ CollectionImg: this.data.CollectionImgNo })
        }
      })
    })

  },

  //拨打电话
  callPhone: function () {
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.lessons.school_telephone,
    })
  },
  //立即抢购
  qiangBtn: function () {

    let that = this
    api._post("/api/v1/orders", {
      school: that.data.lessons.school_id,
      merchant: that.data.lessons.merchant_id,
      product_type: 2,
      product_id: that.data.lessons.id,
    }).then(res => {
      console.log(res.payment)
      wx.requestPayment({
        timeStamp: res.payment.timeStamp,
        nonceStr: res.payment.nonceStr,
        package: res.payment.package,
        signType: res.payment.signType,
        paySign: res.payment.paySign,
        success(data) {
          wx.navigateBack({
            delta: 1,
          })
        }
      })
    })
  },

  //收藏
  Collection: function () {
    let that = this

    api._post("/api/v1/collections", {
      school: this.data.lessons.school_id,
      merchant: this.data.lessons.merchant_id,
      product_type: 2,
      product_id: this.data.lessons.id,
      product_name: this.data.lessons.name,
      product_desc: this.data.lessons.desc,
      product_image: this.data.lessons.cover
    }).then(res => {
      if (this.data.CollectionImg == this.data.CollectionImgNo) {
        that.setData({ CollectionImg: this.data.CollectionImgYes })
      } else {
        that.setData({ CollectionImg: this.data.CollectionImgNo })
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