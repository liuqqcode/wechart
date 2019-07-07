Page({

  /**
   * 页面的初始数据
   */
  data: {
    userList:[
      {
        userheader:'https://tuanxue-merchant-1256699616.cos.ap-beijing.myqcloud.com/images/979.jpg',
        username:'李白'
      },
      {
        userheader: 'https://tuanxue-merchant-1256699616.cos.ap-beijing.myqcloud.com/images/979.jpg',
        username: '李白'
      },
      {
        userheader: 'https://tuanxue-merchant-1256699616.cos.ap-beijing.myqcloud.com/images/979.jpg',
        username: '李白'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  messageCon:function(e){
    console.log(e.currentTarget.dataset.inx)
    wx.navigateTo({
      url: '/pages/messageCon/message',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
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