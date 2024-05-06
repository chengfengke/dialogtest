Page({
  data: {
    avatarPath: '/images/avatar-XiaoXi.png', // Path to the avatar image
    checked: false,
    openid: "",
    inviteCode: "",
  },

  onInputCode: function(event) {
    this.setData({
      inviteCode: event.detail.value,
    });
  },

  onLogin: function() {
    wx.cloud.callFunction({
      name: 'getWXContext',
      success: res => {
        console.log('openid:', res.result.openid);
        this.setData({
          openid: res.result.openid,
        });
      },
      fail: err => {
        console.error('获取openid失败', err);
      }
    });
    if (this.data.checked) {
        const self = this;
        wx.getUserProfile({
          desc: '用于完善会员资料',
          success: (profileRes) => {
            console.log('用户信息:', profileRes.userInfo);
            self.checkUserExists(profileRes.userInfo);
          },
          fail: () => {
            console.error('用户拒绝授权获取信息');
            wx.showToast({
              title: '需要授权以继续!',
              icon: 'none'
            });
          }
        });
    } else {
      wx.showToast({
        title: '请先阅读并同意相关条款',
        icon: 'none'
      });
    }
  },

  validateInviteCode: function(userInfo) {
    const self = this;
    const db = getApp().globalData.db;
    if (!this.data.inviteCode) {
      wx.showToast({
        title: '请输入邀请码',
        icon: 'none'
      });
      return;
    }
    db.collection('invitecode').where({
      InviteCode: this.data.inviteCode
    }).get({
      success: res => {
        if(res.data.length === 0) {
          wx.showToast({
            title: '无效的邀请码',
            icon: 'none'
          });
        }
        const inviteCodeId = res.data[0]._id;
        if (res.data.length > 0 && res.data[0].flag === null) {
          db.collection('invitecode').doc(inviteCodeId).update({
            data: {
              flag: this.data.openid
            },
            success: () => {
              self.addUserToDatabase(userInfo);
            },
            fail: err => {
              console.error('Failed to activate invite code:', err);
              wx.showToast({
                title: '激活邀请码失败',
                icon: 'none'
              });
            }
          });
        } else if (res.data.length > 0 && res.data[0].ActiveNumber !== null) {
          console.log("res.data.length > 0 && res.data[0].flag !== null")
          wx.showToast({
            title: '这个邀请码已经被使用了',
            icon: 'none'
          });
        } else {
          wx.showToast({
            title: '无效的邀请码',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('Failed to query invite code:', err);
        wx.showToast({
          title: '查询邀请码失败，请检查网络状态',
          icon: 'none'
        });
      }
    });
  },

  checkUserExists: function(userInfo) {
    const db = getApp().globalData.db;
    db.collection('users').where({
      openid: this.data.openid
    }).get({
      success: res => {
        if (res.data.length > 0) {
          console.log("用户已存在，直接登录");
          wx.switchTab({
            url: '/pages/index/index',
          });
        } else {
          console.log("注册新用户");
          this.validateInviteCode(userInfo);
        }
      },
      fail: err => {
        console.error('[数据库] [查询记录] 失败：', err);
      }
    });
  },

  addUserToDatabase: function(userInfo) {
    const db = getApp().globalData.db;
    db.collection('users').add({
      data: {
        openid: this.data.openid,
        nickName: userInfo.nickName
      },
      success: function(res) {
        console.log("用户已添加到数据库:", res);
        wx.switchTab({
          url: '/pages/index/index',
        });
      },
      fail: function(err) {
        console.error('添加用户到数据库失败:', err);
      }
    });
  },

  onChange(event) {
    this.setData({ checked: event.detail });
  }
});
