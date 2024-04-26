// custom-tab-bar/index.js
Page({
  data: {
    chatActive:"chat",
    profileActive:"manager-o",
    activeTab: 'chat'
  },
  onLoad() {
  },
  onShow() {
  },
  onChange(event) {
    const name = event.detail;
    this.setData({ activeTab: name });
    console.log(this.data.activeTab);
    wx.nextTick(() => {
      if (name === 'chat') {
        this.setData({
          chatActive: "chat",
          profileActive: "manager-o"
        });
        wx.switchTab({
          url: '/pages/index/index',
        });
      } else {
        this.setData({
          chatActive: "chat-o",
          profileActive: "manager"
        });
        wx.switchTab({
          url: '/pages/profile/profile',
        });
      }
    });
  }   
});
