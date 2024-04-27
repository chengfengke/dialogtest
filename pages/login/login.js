Page({
  data: {
    avatarPath: '/images/avatar-XiaoXi.png', // 您会提供的头像路径
    checked: false,
    openid: "",
  },

  onLogin: function() {
    // 登录逻辑处理
    if (this.data.checked) {
      // 在小程序端调用云函数获取openid
      wx.cloud.callFunction({
        name: 'getWXContext',
        success: res => {
          console.log('openid:', res.result.openid);
          this.setData({
            openid: res.result.openid,
          });

          // 检查数据库中是否已存在相同openid的用户记录
          const db = getApp().globalData.db;
          db.collection('users').where({
            openid: this.data.openid
          }).get({
            success: res => {
              if (res.data.length > 0) {
                // 已存在相同openid的用户记录，直接进行登录
                console.log("用户已存在，直接登录");
                wx.switchTab({
                  url: '/pages/index/index',
                });
              } else {
                // 不存在相同openid的用户记录，获取用户信息并添加到数据库
                this.addUserToDatabase();
              }
            },
            fail: err => {
              console.error('[数据库] [查询记录] 失败：', err);
            }
          });
        },
        fail: err => {
          console.error('获取openid失败', err);
        }
      });
    } else {
      wx.showToast({
        title: '请先阅读并同意相关条款',
        icon: 'none'
      });
    }
  },

  addUserToDatabase: function() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 这里填写一些说明，告知用户为什么需要这些数据
      success: (res) => {
        console.log('用户信息', res.userInfo);
        const db = getApp().globalData.db;
        db.collection('users').add({
          data: {
            openid: this.data.openid,
            nickName: res.userInfo.nickName
          },
          success: function(res) {
            console.log(res);
          },
          fail: function(err) {
            console.error(err);
          }
        });
        // 你可以在这里将用户信息发送到后台服务器
      },
      fail: () => {
        // 处理用户拒绝授权的情况
      }
    });
    wx.switchTab({
      url: '/pages/index/index',
    });
  },

  onChange(event) {
    console.log(event.detail);
    // event.detail 的值为当前选中项绑定值
    this.setData({ checked: event.detail });
  }
});
