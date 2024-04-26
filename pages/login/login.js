Page({
  data: {
    avatarPath: '/images/avatar-XiaoXi.png', // 您会提供的头像路径
    checked: false,
  },

  onLogin: function() {
    // 登录逻辑处理
    if(this.data.checked) {
      wx.getUserProfile({
        desc: '用于完善会员资料', // 这里填写一些说明，告知用户为什么需要这些数据
        success: (res) => {
          console.log('用户信息', res.userInfo);
          // 你可以在这里将用户信息发送到后台服务器
        },
        fail: () => {
          // 处理用户拒绝授权的情况
        }
      });
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
    console.log("111")
    wx.redirectTo({
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
