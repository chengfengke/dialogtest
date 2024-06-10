Page({
  data: {
    history: [],
    openid: ""
  },

  navigateToChat: function(event) {
    const self = this;
    const recordId = event.currentTarget.dataset.id; // 获取记录的_id
    const messages = event.currentTarget.dataset.messages;
  
    // 直接执行删除操作
    const db = getApp().globalData.db;
    db.collection('teacher_history').doc(recordId).remove({
      success: function() {
        wx.showToast({
          title: '记录已删除',
          icon: 'success',
          duration: 2000
        });
        // 从历史记录数组中移除已删除的记录
        const updatedHistory = self.data.history.filter(item => item._id !== recordId);
        self.setData({
          history: updatedHistory
        });
        // 删除后立即跳转到聊天页面，携带消息数组
        wx.navigateTo({
          url: `/pages/teacherdialog/teacherdialog?messages=${encodeURIComponent(JSON.stringify(messages))}`
        });
      },
      fail: function(err) {
        wx.showToast({
          title: '删除失败',
          icon: 'none',
          duration: 2000
        });
        console.error('删除记录失败：', err);
      }
    });
  },  

  onLoad: function() {
    wx.cloud.callFunction({
      name: 'getWXContext',
      success: res => {
        console.log(res.result.openid)
        this.setData({
          openid:res.result.openid
        })
        this.loadHistory();
      }
    })
  },

  deleteRecord: function(event) {
    const self = this; // 保存当前上下文的引用，以便在回调函数中使用
    const recordId = event.currentTarget.dataset.id; // 获取记录的_id
  
    // 弹窗确认是否删除
    wx.showModal({
      title: '确认删除',
      content: '您确定要删除这条记录吗？',
      success(res) {
        if (res.confirm) {
          // 用户点击了确定
          const db = getApp().globalData.db;
          db.collection('teacher_history').doc(recordId).remove({
            success: function() {
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              });
              // 从界面上移除已删除的记录
              const updatedHistory = self.data.history.filter(item => item._id !== recordId);
              self.setData({
                history: updatedHistory
              });
            },
            fail: function(err) {
              wx.showToast({
                title: '删除失败',
                icon: 'none',
                duration: 2000
              });
              console.error('删除记录失败：', err);
            }
          });
        } else if (res.cancel) {
          // 用户点击了取消
          wx.showToast({
            title: '取消删除',
            icon: 'none',
            duration: 2000
          });
        }
      }
    });
  },  


  formatDate: function(date) {
    const newDate = new Date(date);
    return `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`;
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1
    });
  },
  loadHistory: function() {
    const db = getApp().globalData.db;
    db.collection('teacher_history')
      .where({
        openid: this.data.openid // 筛选与当前用户openid相同的记录
      })
      .orderBy('timestamp', 'desc') // 从新到老排序
      .get({
        success: res => {
          const formattedHistory = res.data.map(item => ({
            ...item,
            timestamp: this.formatDate(item.timestamp)
          }));
          console.log(formattedHistory); // 查看格式化后的数据
          this.setData({
            history: formattedHistory
          });
        },
        fail: err => {
          console.log('获取历史记录失败', err);
        }
      });
  }
});
