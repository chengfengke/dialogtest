Page({
  data: {
    avatarPath: '/images/avatar-XiaoXi.png', // 您会提供的头像路径
    checked: false,
  },

  onLogin: function() {
    // 登录逻辑处理
    if(this.data.checked) {
    wx.login({
      success(res) {
        console.log(res)
        if (res.code) {
        } else {
          wx.showToast({
            title: '登录失败',
            icon: 'none'
          });
        }
      }
    });
    wx.navigateTo({
      url: '/pages/index/index',
    })
  }
  else {
    wx.showToast({
      title: '请先阅读并同意相关条款',
      icon: 'none'
    });
  }
  },
  onChange(event) {
    console.log(event.detail)
    // event.detail 的值为当前选中项绑定值
    this.setData({ checked: event.detail });
  }
});
