// pages/search/search.js
var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInput:'',
    schoolList:[],
    group3:'none',
    schoolPicture:"",
    History:'History',
    search:[],
    sercherStorage:[],
    Mylatitude:'',
    Mylongitude:''
  },

  searchInput:function(e){
    this.setData({
      userInput: e.detail.value
    })
  },
  //提交搜索
   searchSubmit:function(){
     let that = this;
     api._get("/api/v1/search?key=" + that.data.userInput).then(res => {
       that.setData({ 
         schoolList: res.data, 
         schoolPicture: util.schoolPicture, 
         History:"none",
        })

       var array = []
       if (wx.getStorageSync('search') != ''){
         array = wx.getStorageSync('search')
         array.push(that.data.userInput)
       }else{
         array.push(that.data.userInput)
       }

       wx.setStorageSync('search', array);
       that.getLishi();
       //计算距离我与学校的
       that.data.schoolList.forEach(function (item, index) {
         console.log(that.getDistance(item.latitude, item.longitude, that.data.Mylatitude, that.data.Mylongitude))
         item.distance = that.getDistance(item.latitude, item.longitude, that.data.Mylatitude, that.data.Mylongitude)
         console.log(that.data.schoolList)

       })
       that.setData({
         schoolList: that.data.schoolList
       })
     })

   },
   //获取缓存
  getLishi: function () {
    var that = this;
    that.setData({
      search: wx.getStorageSync('search').reverse()
    })
  },
  //删除全部搜索记录
  del:function(){
    let that = this
    wx.setStorageSync('search', '')
    that.setData({
      search: wx.getStorageSync('search')
    })
  },
  //计算距离的方法
  getDistance: function (lat1, lng1, lat2, lng2) {
    lat1 = lat1 || 0;
    lng1 = lng1 || 0;
    lat2 = lat2 || 0;
    lng2 = lng2 || 0;
    var rad1 = lat1 * Math.PI / 180.0;
    var rad2 = lat2 * Math.PI / 180.0;
    var a = rad1 - rad2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var r = 6378137;
    return parseInt((r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0) / 100) / 10
  },
  //点击历史搜索记录
  searchItem:function(e){

    let that = this;
    api._get("/api/v1/search?key=" + e.currentTarget.dataset.inx).then(res => {
      that.setData({
        schoolList: res.data,
        schoolPicture: util.schoolPicture,
        History: "none",
      })
      var array = []
      if (wx.getStorageSync('search') != '') {
        array = wx.getStorageSync('search')
        array.push(e.currentTarget.dataset.inx)
      } else {
        array.push(e.currentTarget.dataset.inx)
      }
      console.log(array)

      wx.setStorageSync('search', array);
      that.getLishi();
      //计算距离我与学校的
      that.data.schoolList.forEach(function (item, index) {
        console.log(that.getDistance(item.latitude, item.longitude, that.data.Mylatitude, that.data.Mylongitude))
        item.distance = that.getDistance(item.latitude, item.longitude, that.data.Mylatitude, that.data.Mylongitude)
        console.log(that.data.schoolList)

      })
      that.setData({
        schoolList: that.data.schoolList
      })
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.getLishi();
    var userType = wx.getStorageSync("userType")
    console.log(userType)
    //获取全局变量，如果是推客则显示客户录入按钮
    if (userType == 3) {
      that.setData({ group3: 'group3' })
    } else {
      that.setData({ group3: 'none' })
    }

    that.setData({
      Mylatitude: wx.getStorageSync('Mylatitude'),
      Mylongitude: wx.getStorageSync('Mylongitude')
    })
    console.log(that.data.Mylatitude)
  },
  //选择学校
  school: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../school/school?id=' + e.currentTarget.dataset.id.id,
      success(data) {
        api._post("/api/v1/views", {
          school: e.currentTarget.dataset.id.id,
          merchant: e.currentTarget.dataset.id.merchant_id,
          product_type: 3,
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
  //取消输入
  no:function(e){
    let that = this;
    that.setData({
      History:'History',
      schoolList:[],
      userInput:''
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  
  onReady: function () {
    let that = this

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