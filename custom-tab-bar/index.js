// custom-tab-bar/index.js
Page({
  data: {
    chatActive:"chat",
    profileActive:"manager-o",
    activeTab: "chat"
  },
  onChange(event) {
    const name = event.detail;
    let newChatActive = name === 'chat' ? 'chat' : 'chat-o';
    let newProfileActive = name === 'chat' ? 'manager-o' : 'manager';
    
    // 一次性更新所有相关数据
    this.setData({
      activeTab: event.detail,
      chatActive: newChatActive,
      profileActive: newProfileActive
    }, () => {
      // 在setData更新完成后执行页面跳转
      if (name === 'chat') {
        wx.switchTab({
          url: '/pages/index/index',
        });
      } else {
        wx.switchTab({
          url: '/pages/profile/profile',
        });
      }
    });
  }
});
