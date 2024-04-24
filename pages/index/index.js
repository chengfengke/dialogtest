// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    paddingTop : wx.getSystemInfoSync().statusBarHeight+5,
  },
  navigateToStudent: function() {
    wx.navigateTo({
      url: '/pages/studentdialog/studentdialog',
    });
  },
  navigateToTeacher: function() {
    wx.navigateTo({
      url: '/pages/teacherdialog/teacherdialog',
    });
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
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl !== defaultAvatarUrl,
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
         // 调用登录成功的方法，以跳转到 dialog 页面
         wx.navigateTo({
          url: '/pages/dialog/dialog', // Ensure the path is correct
        });
      },
      fail: (err) => {
        // Handle the case where the user denies the request or other errors
        console.error("获取用户信息失败", err);
        // Optionally, navigate or alert the user based on your app's flow
      }
    })
  },

 
  onLoginSuccess() {
    // 跳转到 dialog 页面
    wx.navigateTo({
      url: '/pages/dialog/dialog', // dialog 页面的路径
    });
  },
})
