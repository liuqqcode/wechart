var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploaderList: [],
    uploaderNum: 0,
    showUpload: true,
    yellowStar:"/images/icon/yellowStar.png",
    noneStar:"/images/icon/noneYS.png",
    starNum: 4,
    details:'',
    ImgHead:'',
    pinglun:'',
    imagesList:[]
  },
  //点赞星星
  star:function(e){
    const that = this
    that.setData({ starNum: e.currentTarget.dataset.idx})
  },
  // 删除图片
  clearImg: function (e) {
    var nowList = [];//新数据
    var uploaderList = this.data.uploaderList;//原数据

    for (let i = 0; i < uploaderList.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        continue;
      } else {
        nowList.push(uploaderList[i])
      }
    }
    this.setData({
      uploaderNum: this.data.uploaderNum - 1,
      uploaderList: nowList,
      showUpload: true
    })
    that.uploadImg(that.data.uploaderList)

  },
  //展示图片
  showImg: function (e) {
    var that = this;
    wx.previewImage({
      urls: that.data.uploaderList,
      current: that.data.uploaderList[e.currentTarget.dataset.index]
    })
  },
  uploadImg:function(res){
    let that = this;
    this.data.uploaderList.forEach(function (path){
      wx.uploadFile({
        url: 'https://yikeyingshi.com/api/v1/images/uploads', 
        filePath: path,
        name: 'file',
        header: {
          'Authorization': wx.getStorageSync('jwtToken')
        },
        formData: {
          method: 'POST'
        },
        success(res){
          var data = JSON.parse(res.data)
          console.log(data.images[0])
          that.data.imagesList.push(data.images[0])
        }
      })
    })
    
  },

  //上传图片
  upload: function (e) {
    console.log(e)
    var that = this;
    
    wx.chooseImage({
      count: 3 - that.data.uploaderNum, // 默认3
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log(res)
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        let uploaderList = that.data.uploaderList.concat(tempFilePaths);
        if (uploaderList.length == 3) {
          that.setData({
            showUpload: false
          })
        }
        that.setData({
          uploaderList: uploaderList,
          uploaderNum: uploaderList.length,
        })
        that.uploadImg(that.data.uploaderList)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this;
    api._get("/api/v1/orders/" + options.id).then(data => {
      that.setData({ details: data.data, ImgHead: util.schoolPicture })

    })
  },
  //提交
  submitBtn:function(){
    let that = this;
    if (that.data.pinglun == ''){
      wx.showToast({
        title: '请输入评论',
        icon: 'none',
        duration: 1000,
        mask: true,
      })
    }else{
      let mun = 1;
      that.setData({
        starNum: parseInt(that.data.starNum)  + mun
      })
      api._post("/api/v1/comments",{
        merchant_id: that.data.details.merchant_id,
        school_id: that.data.details.school_id,
        product_type: that.data.details.product_type,
        product_id: that.data.details.product_id,
        rate: that.data.starNum,
        content: that.data.pinglun,
        images: that.data.imagesList,
        order_id: that.data.details.id
      }).then( res => {
        wx.navigateBack({
          delta: 1,
        })
      })
    }
  },
  //输入评论
  pinglun:function(e){
    let that = this;
    that.setData({
      pinglun:e.detail.value
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