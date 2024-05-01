Page({
  data: {
    history: [],
    openid: ""
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
    db.collection('dialog_history')
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
