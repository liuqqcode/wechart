var util = require('../../utils/util.js')
const api = require('../../utils/api.js')
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Biography:'',
    phone:'',
    name:'',
    // money:'',
    qkInput:'',
    qktext: [],
    arr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({ Biography:options})
    // console.log(options.id)
    api._get("/api/v1/clients-reasons").then(res => {
      that.setData({
        qktext:res.data
      })
    })

  },
  //获取手机号
  mobileInput: function (e) {
      this.setData({
        phone: e.detail.value
      })
  },
  nameInput:function(e){
      this.setData({
        name: e.detail.value
      })
  },

  selText:function(e){
    let that = this
    that.data.qktext.forEach(item =>{
      if (item.id == e.currentTarget.dataset.inx.id){
        if(item.show == false){
          item.show = true
          that.data.arr.push(item.text)
        }else{
          item.show = false
          for(var i = 0 ; i < that.data.arr.length ; i++){
            if(that.data.arr[i] == item.text){
              that.data.arr.splice(i,1)
            }
          }
        }
      }
    })
    that.setData({
      qktext: that.data.qktext,
      qkInput:that.data.arr
    })

  },
  //确定提交
  submit:function(){
    let that = this
    let arr2 = ""
    that.data.arr.forEach(item => {
      arr2 = arr2 + " " + item
    })
    api._post("/api/v1/clients", {
      school_id: this.data.Biography.id,
      school_name: this.data.Biography.schoolName,
      merchant_id: this.data.Biography.merchant,
      phone: this.data.phone,
      name: this.data.name,
      // paid_amount:this.data.money,
      remark:arr2
    }).then(res => {
      wx.showToast({
        title: '提交成功',
        icon: 'none',
        image: '',
        duration: 3000,
        mask: true,
        success: function(res) {
          wx.navigateBack({
            delta: 1,
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
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