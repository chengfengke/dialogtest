// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    PageName: "清小深",
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    paddingTop : wx.getSystemInfoSync().statusBarHeight+5,

  
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500
  },
  onShow() {
  },
  changeIndicatorDots() {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },

  changeAutoplay() {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },

  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },

  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },


  navigateTOLogin: function(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
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

  navigateToChat() {
    wx.navigateTo({
      url: '/pages/index/index',
      success: () => {
        getApp().globalData.activeTab = 'chat';
      }
    });
  },
  navigateToProfile() {
    wx.navigateTo({
      url: '/pages/profile/profile',
      success: () => {
        getApp().globalData.activeTab = 'profile';
      }
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
    wx.getUserProfile({
      desc: '展示用户信息',
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
