// custom-tab-bar/index.js
Page({
  data: {
    activeTab: getApp().globalData.activeTab
  },
  onLoad() {
    this.setData({
      activeTab: getApp().globalData.activeTab
    });
  },
  onShow() {
    this.setData({
      activeTab: getApp().globalData.activeTab
    });
  },
  onChange(event) {
    const name = event.detail;
    console.log("1",getApp().globalData.activeTab);
    this.setData({ activeTab: name });
  },
  navigateToChat() {
    wx.switchTab({
      url: '/pages/index/index',
      success: () => {
        getApp().globalData.activeTab = 'chat';
        console.log(getApp().globalData.activeTab)
      }
    });
  },
  navigateToProfile() {
    wx.switchTab({
      url: '/pages/profile/profile',
      success: () => {
        getApp().globalData.activeTab = 'profile';
        console.log(getApp().globalData.activeTab)
      }
    });
  }
});
