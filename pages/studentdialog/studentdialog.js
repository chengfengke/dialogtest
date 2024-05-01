// dialog.js
const systemAvatarUrl = 'http://eb118-file.cdn.bcebos.com/upload/406469d6dc2b4d1184a63cd51779e68e_1522258076.png?'; 
Page({
  data: {
    appName: "小希", // 小程序名称
    appDescription: "心理智能对话助手", // 小程序介绍
    appAvatar: "/images/avatar.png", // 小程序头像路径
    integral: 100, // 积分显示
    isVoiceInput: false, // 是否为语音输入模式
    messages: [{'type': 'bot', 'content': '你好，很高兴能为你提供帮助。请问你有什么问题或者困扰呢？'}], // 存储对话消息
    inputText: '', // 用户输入的文本
    currentWord: 0, // 已经输入的字符长度
    systemMessageLength: 0, // 系统消息的字符长度
    userAvatar: '/images/student.png', // 从index页面获取的用户头像URL
    systemAvatar: '/images/teacher.png', // 系统固定的头像URL
    inputWidth: 100, 
    isInputActive: false,
    scrollTop: "",
  },
  onInput(event) {
    this.setData({ inputText: event.detail,isInputActive: event.detail.trim() !== ''});
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1,
    });
  },
  //用户点击发送按钮时触发
  sendMessage() {
    const { inputText, messages } = this.data;
    if (inputText.trim() === '') return;

    messages.push({ type: 'user', content: inputText });
    this.setData({
      messages, 
      inputText: '',
      currentWord: inputText.length,
      isInputActive: false,
    });
    const self = this;
    console.log(self.data.messages);
    wx.request({
      url: 'http://localhost:6006/dialogue', // 您的服务器API地址
      method: 'POST',
      data: {
        message: inputText,
        messages: messages.slice(1,-1), // 添加messages数组到请求数据中
      },
      header: {
        'Content-Type': 'application/json',
      },

      success: function(res) {
        console.log('调用成功', res.data);
        const systemReply = res.data.response;
        setTimeout(() => {
          self.typeMessage(systemReply, 0); // 调用逐字显示的函数
        }, 500);
        self.autoScroll();
      },
      
      fail: function(err) {
        console.error('调用失败', err);
      }
    });
  },
  autoScroll(res) {
    var that = this
    let query = wx.createSelectorQuery()
    query.select('.display').boundingClientRect(res => {
        that.setData({
            scrollTop: 100000
        })
    })
    query.exec(res => {})

},

typeMessage(message, index) {
  const self = this;
  if (index < message.length) {
    const nextIndex = index + 1;
    const nextMessage = message.substring(0, nextIndex);
    const updatedMessages = self.data.messages;
    // 如果当前正在逐字显示的是最后一条消息，则更新内容
    if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].type === 'bot') {
      updatedMessages[updatedMessages.length - 1].content = nextMessage;
    } else {
      // 否则，将新消息推入消息数组
      updatedMessages.push({ type: 'bot', content: nextMessage });
    }
    self.setData({ messages: updatedMessages });
    // 设置下一次更新的定时器
    setTimeout(() => {
      self.typeMessage(message, nextIndex);
    }, 100); // 逐字更新的速度，可以根据需要调整
  }
},

onLoad(options){
},

showHistory() {
  wx.navigateTo({
    url: '/pages/history/history',
  })
},
createNewConversation() {
  wx.showToast({
    title: '欢迎和我倾诉你遇到的问题～',
    icon: 'none'
  });

  // Retrieve the openid and store the conversation
  wx.cloud.callFunction({
    name: 'getWXContext',
    success: res => {
      const openid = res.result.openid;
      const messages = this.data.messages;
      const currentTime = new Date();

      console.log('Current messages:', messages);

      // Store the new conversation in the database
      const db = getApp().globalData.db;
      db.collection('dialog_history').add({
        data: {
          openid: openid,
          messages: messages,
          timestamp: currentTime
        },
        success: res => {
          console.log('新对话已保存到数据库', res);
          // Set the initial message after successfully storing the conversation
          const initialMessage = [{ 'type': 'bot', 'content': '你好，很高兴能为你提供帮助。请问你有什么问题或者困扰呢？'}];
          this.setData({
            messages: initialMessage
          });
        },
        fail: err => {
          console.error('保存对话失败', err);
        }
      });
    },
    fail: err => {
      console.error('获取openid失败', err);
    }
  });
}
});
