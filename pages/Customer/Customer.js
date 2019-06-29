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
    qkinput:'',
    qktext: [
      {
        id:0,
        text:'有意向学习',
        show:false
      }, 
      {
        id:1,
        text:'能去学校',
        show: false
      },
      {
        id:2,
        text: '能缴费',
        show: false
      } ,
      {
        id:3,
        text:'需要校方给他打电话',
        show: false
      }, 
      {
        id:4,
        text: '有疑虑',
        show: false
      } ,
      {
        id:5,
        text:'目前在学想换校',
        show: false
      }
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({ Biography:options})
    console.log(options.id)

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
  // moneyInput:function(e){
  //   this.setData({
  //     money: e.detail.value
  //   })
  // },
  qkInput:function(e){
    this.setData({
      qkinput: e.detail.value
    })
  },
  selText:function(e){
    let that = this
    console.log(e.currentTarget.dataset.inx)
    that.data.qktext.forEach(item =>{
      console.log(item.id)
      if (item.id == e.currentTarget.dataset.inx.id){
        if(item.show == false){
          item.show = true
        }else{
          item.show = false
        }
      }
    })
    console.log(that.data.qktext)
    that.setData({
      qktext: that.data.qktext
    })

  },
  //确定提交
  submit:function(){

    api._post("/api/v1/clients", {
      school_id: this.data.Biography.id,
      school_name: this.data.Biography.schoolName,
      merchant_id: this.data.Biography.merchant,
      phone: this.data.phone,
      name: this.data.name,
      // paid_amount:this.data.money,
      remark:this.data.qkInput
    }).then(res => {
      wx.showToast({
        title: '提交成功',
        icon: 'none',
        image: '',
        duration: 0,
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