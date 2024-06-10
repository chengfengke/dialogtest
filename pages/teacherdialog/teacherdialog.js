// dialog.js
const systemAvatarUrl = 'http://eb118-file.cdn.bcebos.com/upload/406469d6dc2b4d1184a63cd51779e68e_1522258076.png?'; 
Page({
  data: {
    appName: "清小深", // 小程序名称
    appDescription: "积极心理知识训练助手", // 小程序介绍
    appAvatar: "/images/avatar.png", // 小程序头像路径
    integral: 100, // 积分显示
    isVoiceInput: false, // 是否为语音输入模式
    messages: [{'role': 'assistant', 'content': '欢迎回来！有什么可以帮助您的吗？'}], // 存储对话消息
    inputText: '', // 用户输入的文本
    currentWord: 0, // 已经输入的字符长度
    systemMessageLength: 0, // 系统消息的字符长度
    userAvatar: '	cloud://dialogtest-5g1chgyo87fcdefd.6469-dialogtest-5g1chgyo87fcdefd-1325881522/image/student.png', // 从index页面获取的用户头像URL
    systemAvatar: 'cloud://dialogtest-5g1chgyo87fcdefd.6469-dialogtest-5g1chgyo87fcdefd-1325881522/image/teacher.png', // 系统固定的头像URL
    inputWidth: 100, 
    isInputActive: false,
    scrollTop: "",
  },
  
  replaceEscapeChars: function(text) {
    return text.replace(/\\n/g, '\n').replace(/\\\\n/g, '\\n');
  },

  onInput(event) {
    this.setData({
      inputText: event.detail.value, // 使用 event.detail.value 获取输入值
      isInputActive: event.detail.value.trim() !== '' // 使用 trim() 方法检查输入是否非空
    });
  },

  goBack: function() {
    this.saveConversation(() => {
      wx.switchTab({
        url: '/pages/index/index',
      });
    });
  },
  //用户点击发送按钮时触发
  sendMessage() {
    const { inputText, messages } = this.data;
    if (inputText.trim() === '') return; // 直接使用 inputText，因为它已经是文本
  
    messages.push({ role: 'user', content: inputText }); // 直接使用 inputText
    this.setData({
      messages,
      inputText: '',
      currentWord: inputText.length, // 直接使用 inputText 的长度
      isInputActive: false
    });
    const self = this;
    console.log(self.data.messages);
    wx.request({
      url: 'http://5.tcp.vip.cpolar.cn:13267/chat/knowledge_base_chat',
      method: 'POST',
      data: {
        query: inputText,
        knowledge_base_name: "samples",
        top_k: 3,
        score_threshold: 1,
        history: messages,
        stream: false,
        model_name: "chatglm3-6b",
        temperature: 0.7,
        max_tokens: 0,
        prompt_name: "default"
      },
      header: {
        'Accept': 'application/json', // 注意微信小程序中header的键是小写
        'Content-Type': 'application/json',
      },
      success: function(res) {
        console.log('调用成功', res.data);
        const answerRegex = /"answer":\s*"((?:\\.|[^"\\])*)"/;
        const systemReply = res.data.match(answerRegex);
        console.log(typeof systemReply)
        setTimeout(() => {
          self.typeMessage(systemReply[1], 0); // 调用逐字显示的函数
        }, 500);
        self.autoScroll();
      },
      fail: function(error) {
        console.error('调用失败', error);
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

    // 使用 replaceEscapeChars 函数处理转义字符
    const processedMessage = this.replaceEscapeChars(nextMessage);

    const updatedMessages = self.data.messages;
    if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].role === 'assistant') {
      updatedMessages[updatedMessages.length - 1].content = processedMessage;
    } else {
      updatedMessages.push({ role: 'assistant', content: processedMessage });
    }
    self.setData({ messages: updatedMessages });

    setTimeout(() => {
      self.typeMessage(message, nextIndex);
    }, 100);
  }
},

onLoad: function(options) {
  if (options.messages) {
    // 从URL参数中解析messages
    const messages = JSON.parse(decodeURIComponent(options.messages));
    this.setData({
      messages: messages
    });
  } else {
    // 没有接收到messages参数，可能是直接从其他页面进入的
    this.setData({
      messages: [] // 设置为默认空数组或根据需要进行其他初始化操作
    });
    // 可以在这里进行更多的逻辑处理，比如从本地存储加载数据等
    this.loadDefaultChatData(); // 假设这是一个加载默认聊天数据的函数
  }
},

saveConversation: function(callback) {
  const self = this;
  const messages = this.data.messages;
  const currentTime = new Date(); // 获取当前时间

  // 如果没有消息或只有初始消息，则不进行保存
  if (messages.length <= 1 && messages[0].content === '欢迎回来！有什么可以帮助您的吗？') {
    if (callback) callback();
    return;
  }

  wx.cloud.callFunction({
    name: 'getWXContext',
    success: res => {
      const openid = res.result.openid;

      const db = getApp().globalData.db;
      db.collection('teacher_history').add({
        data: {
          openid: openid,
          messages: messages,
          timestamp: currentTime
        },
        success: res => {
          console.log('对话已保存到数据库', res);
          // 重置消息列表
          self.setData({
            messages: [{ 'role': 'assistant', 'content': '欢迎回来！有什么可以帮助您的吗？'}]
          });
          if (callback) callback();
        },
        fail: err => {
          console.error('保存对话失败', err);
          if (callback) callback();
        }
      });
    },
    fail: err => {
      console.error('获取openid失败', err);
      if (callback) callback();
    }
  });
},

loadDefaultChatData: function() {
  this.setData({
    messages: [{'role': 'assistant', 'content': '欢迎回来！有什么可以帮助您的吗？'}]
  });
},

showHistory: function() {
  this.saveConversation(() => {
    wx.navigateTo({
      url: '/pages/teacherhistory/teacherhistory',
    });
  });
},

clearConversation() {
  wx.showToast({
    title: '欢迎和我倾诉你遇到的问题～',
    icon: 'none'
  });
  const initialMessage = [{ 'role': 'assistant', 'content': '欢迎回来！有什么可以帮助您的吗？'}];
  this.setData({
    messages: initialMessage
  });
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
      db.collection('teacher_history').add({
        data: {
          openid: openid,
          messages: messages,
          timestamp: currentTime
        },
        success: res => {
          console.log('新对话已保存到数据库', res);
          // Set the initial message after successfully storing the conversation
          const initialMessage = [{ 'role': 'assistant', 'content': '欢迎回来！有什么可以帮助您的吗？'}];
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
