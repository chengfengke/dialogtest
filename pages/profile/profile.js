// pages/Profile/Profile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     username:"",
     coinamount:999,
     userID:"",
  },

  navigateToChat: function() {
    wx.navigateTo({
      url: '/pages/index/index',
    });
  },
  navigateToProfile: function() {
    wx.navigateTo({
      url: '/pages/profile/profile',
    });
  },
  navigateToIdentity:function(){
    wx.navigateTo({
      url: '/pages/identity/identity',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("hihihihihihi")
    wx.cloud.callFunction({
      name: 'getWXContext',
      success: res => {
        console.log('openid:', res.result.openid);
        this.setData({
          UserID: res.result.openid,
        })
      },
      fail: err => {
        console.error('获取openid失败', err);
      }
    });
    // 查询数据库获取用户信息
    const db = getApp().globalData.db;
    db.collection('users').where({
      openid: this.data.openid
    }).get({
      success: res => {
        console.log("resdata",res.data)
        if (res.data.length > 0) {
          this.setData({
            username: res.data[0].nickName, // 设置 username 为数据库中查询到的 
            userID: res.data[0].openid
          });
        }
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  onLogout() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  }
})