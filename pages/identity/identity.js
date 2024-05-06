// pages/identity/identity.js
Page({

  /**
   * Page initial data
   */
  data: {
    appName:"编辑资料",
    Avatar:"/images/student.png",
    nickname:"bot",
    gender:"男",
    birthday:" ",
    district: " ",
    info:" ",
  },
  navigateToProfile: function() {
    wx.navigateTo({
      url: '/pages/profile/profile',
    });
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})