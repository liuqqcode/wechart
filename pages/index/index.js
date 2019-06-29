// pages/Order/Order.js
var bmap = require('../../libs/bmap-wx.min.js');
var baiduak = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['学校排序', '红包排序', '距离排序', '好评排序'],
    objectArray: [
      {
        id: 0,
        name: '学校排序'
      },
      {
        id: 1,
        name: '红包排序'
      },
      {
        id: 2,
        name: '距离排序'
      },
      {
        id: 3,
        name: '好评排序'
      }
    ],
    index: 0,

    city:'成都',
    weatherDesc:'多云',
    dateC:'24',
    schoolList:[],
    schoolPicture: baiduak.schoolPicture,
    schoolListApi: baiduak.schoolListApi,
    banner:'',
    fuwuFenlei:[],
    backClass: '',
    currentItemId: 1,

    //红包
    group3: "none",
    //更多学校
    next:'',
    page:'',
    noMore:'none',
    //位置
    Mylatitude:'',
    Mylongitude:'',
    schoolFenlei:'',
    avatarUrl: '/images/image/header.png',
    swiperSchool:''

  },
  //学校排列方式
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    switch (e.detail.value){
      case 0 :
        
    }
  },

  swiperChange: function (e) {
    var currentItemId = e.detail.currentItemId;
    this.setData({
      currentItemId: currentItemId
    })
  },
  clickChange: function (e) {
    var itemId = e.currentTarget.dataset.itemId;
    this.setData({
      currentItemId: itemId
    })
    wx.navigateTo({
      url: '/pages/banner/banner?id=' + e.currentTarget.dataset.itemId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //点击学校分类
  changeSchool:function(e){
    let that = this

    if (that.data.swiperSchool == e.currentTarget.dataset.inx.id){
      wx.showLoading({
        title: '请求中，请稍后...',
      })
      that.getSchoolList();
      that.setData({
        swiperSchool:''
      })
      wx.hideLoading()
    }else{
      wx.showLoading({
        title: '请求中，请稍后...',
      })
      api._get("/api/v1/schools?type_ids=" + e.currentTarget.dataset.inx.id).then(data => {

        that.setData({
          schoolList: data.data,
          next: data.links.next,
          swiperSchool: e.currentTarget.dataset.inx.id
        })
        if (data.links.next == null) {
          that.setData({ noMore: "noMore" })
        }
        //计算距离我与学校的
        that.data.schoolList.forEach(function (item, index) {
          item.distance = that.getDistance(item.latitude, item.longitude, that.data.Mylatitude, that.data.Mylongitude)
          item.lowest_lesson_price = parseInt(item.lowest_lesson_price)
          item.lowest_lesson_price_tag = parseInt(item.lowest_lesson_price_tag)

        })
        that.setData({
          schoolList: that.data.schoolList
        })
        wx.hideLoading()
      })
    }
  },
  //学校详情
  school:function(e){
    let that = this;
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../school/school?id=' + e.currentTarget.dataset.id.id,
      success(data){
        api._post("/api/v1/views",{
          school: e.currentTarget.dataset.id.id,
          merchant: e.currentTarget.dataset.id.merchant_id,
          product_type:3,
          product_id: e.currentTarget.dataset.id.id,
          product_name: e.currentTarget.dataset.id.name,
          product_desc: e.currentTarget.dataset.id.desc,
          product_image: e.currentTarget.dataset.id.cover
        }).then( res => {
          console.log(res)
        }).catch(err => {
          console.log(err.statusCode)
          if (err.statusCode == 401) {
            // wx.showModal({
            //   title: '错误',
            //   content: '登录失效，请去登录',
            //   showCancel: true,
            //   cancelText: '取消',
            //   cancelColor: '',
            //   confirmText: '确认',
            //   confirmColor: '',
            //   success: function(res) {
            //     if(res.confirm){
            //       wx.navigateTo({
            //         url: '/pages/login/login?id=' + e.currentTarget.dataset.id.id
            //       })
            //     }
            //   },
            //   fail: function(res) {},
            //   complete: function(res) {},
            // })

          }
        })
      }
    })
  },

  //搜索
  search:function(){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    
    //获取分享图
    api._get("/api/v1/platform/share-image").then(res => {
      wx.setStorageSync('images', res.data.shares.images)
    })


    //首页头像
    if (wx.getStorageSync('avatarUrl') != ''){
      var headerImg = wx.getStorageSync('avatarUrl')
      that.setData({ avatarUrl: headerImg })
    }


    //获取首页轮播图
    api._get("/api/v1/platform/activities").then(res => {
      console.log(res)
      that.setData({ 
        banner:baiduak.banner,
        bannerCon:res.data,
        backClass:res.data
      })
    })


    //获取首页学校分类banner下方的分类
    api._get("/api/v1/school-types").then(res => {
      console.log(res.data)
      that.setData({ fuwuFenlei:res.data})
      if(res.data.length <= 4){
        that.setData({ schoolFenlei:res.data.length})
      }else{
        that.setData({ schoolFenlei:4})
      }
    })

  //获取学校列表
    api._get('/api/v1/schools').then(data => {
      console.log(data.data)
      that.setData({
        schoolList: data.data,
        next: data.links.next
      })
      if (data.links.next == null) {
        that.setData({ noMore: "noMore" })
      }
      //获取位置信息坐标
      wx.getLocation({
        type: 'wgs84',
        success: function (res) {
          that.setData({ Mylatitude: res.latitude, Mylongitude: res.longitude })
          that.getBaiduLocation();
          wx.setStorageSync('Mylatitude', res.latitude);
          wx.setStorageSync('Mylongitude', res.longitude)

          //计算距离我与学校的
          that.data.schoolList.forEach(function (item, index) {
            item.distance = that.getDistance(item.latitude, item.longitude, that.data.Mylatitude, that.data.Mylongitude)
            item.lowest_lesson_price = parseInt(item.lowest_lesson_price)
            item.lowest_lesson_price_tag = parseInt(item.lowest_lesson_price_tag)
          })
          that.setData({
            schoolList: that.data.schoolList
          })
        },
      })

    }).catch(e => {
      console.log(e)
    })
    this.getSchoolList();
  },

  //获取天气以及位置信息
  getBaiduLocation(){
    let that = this
    var BMap = new bmap.BMapWX({
      ak: baiduak.ak
    });
    var success = function (data) {
      var weatherData = data.currentWeather[0];
      var regex1 = /.*\([^\)\(\d]*(\d+)[^\)\(\d]*\).*/;
      that.setData({
        city: weatherData.currentCity,
        weatherDesc: weatherData.weatherDesc,
        dateC: weatherData.date.replace(regex1, "$1")
      });
    }
    var fail = function (data) {
      console.log('fail!!!!')
    };
    BMap.weather({
      fail: fail,
      success: success
    });
  },
  //获取学校列表
  getSchoolList:function(){
    let that = this
    api._get('/api/v1/schools').then(data => {
      console.log(data.data)
      that.setData({
        schoolList: data.data,
        next: data.links.next 
      })
      if (data.links.next == null) {
        that.setData({ noMore: "noMore" })
      }
      //计算距离我与学校的
      that.data.schoolList.forEach(function (item, index) {
        item.distance = that.getDistance(item.latitude, item.longitude, that.data.Mylatitude, that.data.Mylongitude)
        item.lowest_lesson_price = parseInt(item.lowest_lesson_price)
        item.lowest_lesson_price_tag = parseInt(item.lowest_lesson_price_tag)
      })
      that.setData({
        schoolList: that.data.schoolList
      })
    }).catch(e => {
      console.log(e)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;

  },

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
    return parseInt((r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)))).toFixed(0)/100)/10
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    this.getBaiduLocation();
    // that.setData({ swiperSchool:100})
    //获取位置信息坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({ Mylatitude: res.latitude, Mylongitude: res.longitude })
        that.getBaiduLocation();
        wx.setStorageSync('Mylatitude', res.latitude);
        wx.setStorageSync('Mylongitude', res.longitude)
      },
    })
    //计算距离我与学校的
    that.data.schoolList.forEach(function (item, index) {
      item.distance = that.getDistance(item.latitude, item.longitude, that.data.Mylatitude, that.data.Mylongitude)
      item.lowest_lesson_price = parseInt(item.lowest_lesson_price)
      item.lowest_lesson_price_tag = parseInt(item.lowest_lesson_price_tag)
    })
    that.setData({
      schoolList: that.data.schoolList
    })
    var userType = wx.getStorageSync("userType")
    console.log(userType)
    //获取全局变量，如果是推客则显示客户录入按钮
    if (userType == 3) {
      that.setData({ group3: 'group3' })
    } else {
      that.setData({ group3: 'none' })
    }
    //首页头像
    if (wx.getStorageSync('avatarUrl') != '') {
      var headerImg = wx.getStorageSync('avatarUrl')
      that.setData({ avatarUrl: headerImg })
    }

    //更新token
    if (wx.getStorageSync('jwtToken') != ""){
      api._post("/api/auth/refresh").then(res => {
        wx.setStorageSync('jwtToken', res.token_type + ' ' + res.access_token)
      })
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


    var that = this;
    //首页头像
    if (wx.getStorageSync('avatarUrl') != '') {
      var headerImg = wx.getStorageSync('avatarUrl')
      that.setData({ avatarUrl: headerImg })
    }


    //获取位置信息坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({ Mylatitude: res.latitude, Mylongitude: res.longitude })
        that.getBaiduLocation();
        wx.setStorageSync('Mylatitude', res.latitude);
        wx.setStorageSync('Mylongitude', res.longitude)
      },
    })

    //获取首页轮播图
    api._get("/api/v1/platform/activities").then(res => {
      console.log(res)
      that.setData({
        banner: baiduak.banner,
        bannerCon: res.data,
        backClass: res.data
      })
    })


    //获取首页学校分类banner下方的分类
    api._get("/api/v1/school-types").then(res => {
      console.log(res.data)
      that.setData({ fuwuFenlei: res.data })
      if (res.data.length <= 4) {
        that.setData({ schoolFenlei: res.data.length })
      } else {
        that.setData({ schoolFenlei: 4.5 })
      }
    })
    if (that.data.swiperSchool == ''){
      this.getSchoolList();
    }else{
      let that = this
      api._get("/api/v1/schools?type_ids=" + that.data.swiperSchool).then(data => {

        that.setData({
          schoolList: data.data,
          next: data.links.next
        })
        if (data.links.next == null) {
          that.setData({ noMore: "noMore" })
        }
        //计算距离我与学校的
        that.data.schoolList.forEach(function (item, index) {
          item.distance = that.getDistance(item.latitude, item.longitude, that.data.Mylatitude, that.data.Mylongitude)
          item.lowest_lesson_price = parseInt(item.lowest_lesson_price)
          item.lowest_lesson_price_tag = parseInt(item.lowest_lesson_price_tag)

        })
        that.setData({
          schoolList: that.data.schoolList
        })
      })
    }
    wx.stopPullDownRefresh();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if(that.data.next != null){
      // 显示加载图标
      wx.showLoading({
        title: '玩命加载中',
      })
      wx.request({
        url: that.data.next,
        success(data){
          
          that.setData({ next: data.data.links.next, schoolList: that.data.schoolList.concat(data.data.data)})
          if (data.data.links.next == null) {
            that.setData({ noMore: "noMore"})
          }
          wx.hideLoading()

        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})