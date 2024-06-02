// dialog.js
const systemAvatarUrl = 'http://eb118-file.cdn.bcebos.com/upload/406469d6dc2b4d1184a63cd51779e68e_1522258076.png?'; 
Page({
  data: {
    appName: "清小深", // 小程序名称
    appDescription: "积极心理知识训练助手", // 小程序介绍
    appAvatar: "/images/avatar.png", // 小程序头像路径
    integral: 100, // 积分显示
    isVoiceInput: false, // 是否为语音输入模式
    messages: [], // 存储对话消息
    inputText: '', // 用户输入的文本
    currentWord: 0, // 已经输入的字符长度
    systemMessageLength: 0, // 系统消息的字符长度
    userAvatar: 'cloud://dialogtest-5g1chgyo87fcdefd.6469-dialogtest-5g1chgyo87fcdefd-1325881522/image/student.png', // 从index页面获取的用户头像URL
    systemAvatar: 'cloud://dialogtest-5g1chgyo87fcdefd.6469-dialogtest-5g1chgyo87fcdefd-1325881522/image/teacher.png', // 系统固定的头像URL
    inputWidth: 100, 
    isInputActive: false,
    scrollTop: "",
  },
  goBack: function() {
    wx.navigateBack({
      delta: 1,
    });
    wx.request({
      url: 'http://localhost:6006/dialogue', // 您的服务器API地址
      method: 'POST',
      data: {
        'message' : "清空历史数据",
      },
      header: {
        'Content-Type': 'application/json',
      },

      success: function(res) {
        console.log('调用成功', res.data);
      },
        
      fail: function(err) {
        console.error('调用失败', err);
      }
    })
  },
  // 用户输入文本时触发
  onInput(e) {
    this.setData({ inputText: e.detail.value,isInputActive: e.detail.value.trim() !== ''});
  },

  //用户点击发送按钮时触发
  sendMessage() {
    const { inputText, messages } = this.data;
    if (inputText.trim() === '') return;


    messages.push({ type: 'user', content: inputText});

    this.setData({ 
      messages, 
      inputText: '',
      currentWord: inputText.length,
      isInputActive: false,
    });
    const self = this;

    const messagesObject = [];
    messages.forEach((message, index) => {
      messagesObject.push({"role":message["type"],"content":message["content"]});
    });
    
    console.log(messagesObject);
    

    wx.request({
      url: 'http://127.0.0.1:7861/chat/knowledge_base_chat',
      method: 'POST',
      data: {
        query: inputText,
        knowledge_base_name: "samples",
        top_k: 3,
        score_threshold: 1,
        history: messagesObject,
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
        const answerRegex = /"answer":\s*"(.*?)",?\s*"docs":\s*\[/;
          const systemReply = res.data.match(answerRegex);
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
      const updatedMessages = self.data.messages;
      // 如果当前正在逐字显示的是最后一条消息，则更新内容
      if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].type === 'assistant') {
        updatedMessages[updatedMessages.length - 1].content = nextMessage;
      } else {
        // 否则，将新消息推入消息数组
        updatedMessages.push({ type: "assistant", content: nextMessage });
      }
      self.setData({ messages: updatedMessages });
      // 设置下一次更新的定时器
      setTimeout(() => {
        self.typeMessage(message, nextIndex);
      }, 100);
    }
  },
  /*
  onLoad(options){
    wx.request({
      url: 'http://localhost:6006/dialogue', // 您的服务器API地址
      method: 'POST',
      data: {
        message: 'Hello, I am so exhausted'
      },
      header: {
        'Content-Type': 'application/json', // 设置请求的 header
      },
      success: function(res) {
        console.log('调用成功', res.data);
      },
      fail: function(err) {
        console.error('调用失败', err);
      }
    });
    
  },
  */
  
});