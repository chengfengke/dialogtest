// pages/identity/identity.js
import {
  areaList
} from "../../utils/area-data/dist/data";

Page({
  /**
   * Page initial data
   */
  data: {
    appName:"编辑资料",
    Avatar:"cloud://dialogtest-5g1chgyo87fcdefd.6469-dialogtest-5g1chgyo87fcdefd-1325881522/image/student.png",
    docid : "",
    nickName:"",
    gender:"",
    birthday:"",
    area: "",
    info:"",
    openid : "",
    areaList:areaList,
    GenderPopup: false,
    NamePopup:false,
    BirthPopop: false,
    AreaPopop: false,
    InfoPopop: false,
    genderOptions:['男','女','不愿透露'],
    MinDate: "1950-01-01"
  },
  onLoad: function(options) {
    // 使用 wx.cloud.callFunction 获取 openid
    wx.cloud.callFunction({
      name: 'getWXContext',
      data: {},
      success: res => {
        console.log('openid:', res.result.openid);
        const openid = res.result.openid;
  
        // 将 openid 设置到页面数据中
        this.setData({
          openid: openid
        });
  
        // 在获取到 openid 之后执行数据库查询
        this.fetchUserData(openid);
      },
      fail: err => {
        console.error('获取 openid 失败', err);
        wx.showToast({
          title: '获取 openid 失败',
          icon: 'none'
        });
      }
    });
  },
  

  fetchUserData: function(openid) {
    const db = getApp().globalData.db;
    const self = this;  // 保存 this 上下文
  
    // 确保存在 openid
    if (!openid) {
      wx.showToast({
        title: 'Openid 不存在，无法查询用户信息',
        icon: 'none',
      });
      return;
    }
  
    // 查询数据库中 openid 字段与当前 openid 相同的那条数据
    db.collection('users').where({
      openid: openid // 确保字段名正确
    }).get({
      success(res) {
        // 如果查询到用户信息
        if (res.data.length > 0) {
          const userData = res.data[0];
          console.log("userdata:", userData)
          self.setData({  // 使用 self 来调用 setData 方法
            nickName: userData.nickName,
            Avatar: userData.avatar,
            gender: userData.gender,
            birthday: userData.birthday,
            area: userData.area,
            info: userData.info
          });
        } else {
          console.log('没有找到用户信息，根据业务需求可以选择创建新用户');
        }
      },
      fail(err) {
        // 查询失败的处理
        console.error('查询失败：', err);
        wx.showToast({
          title: '查询失败',
          icon: 'none',
        });
      }
    });
  },
  
  /*关闭弹窗 */
  onClose(e){
    this.setData({
      GenderPopup: false,
      NamePopup: false,
      BirthPopup: false,
      AreaPopup: false,
      InfoPopup: false,
    });
    this.saveUserInfo();
  },
  saveUserInfo: function() {
    const self = this;
    const userInfo = {
      nickName: self.data.nickName,
      avatar: self.data.Avatar,
      gender: self.data.gender,
      birthday: self.data.birthday,
      area: self.data.area,
      info: self.data.info,
    };
    const db = getApp().globalData.db;
  
    // 确保存在 openid
    if (!this.data.openid) {
      wx.showToast({
        title: 'Openid 不存在，无法更新用户信息',
        icon: 'none',
      });
      return;
    }
  
    // 查询数据库中 openid 字段与 this.data.openid 相同的那条数据
    db.collection('users').where({
      openid: this.data.openid // 注意字段名应与数据库中的字段名一致
    }).get({
      success(res) {
        // 如果查询到用户信息
        if (res.data.length > 0) {
          const docId = res.data[0]._id; // 获取文档ID
          const userDocRef = db.collection('users').doc(docId); // 获取文档引用
  
          // 更新数据库中的用户信息
          userDocRef.update({
            data: userInfo,
            success(res) {
              console.log('用户信息更新成功', res);
              wx.showToast({
                title: '保存成功',
                icon: 'success',
              });
            },
            fail(err) {
              console.error('用户信息更新失败', err);
              wx.showToast({
                title: '保存失败',
                icon: 'none',
              });
            }
          });
        } else {
          console.log('没有找到用户信息，根据业务需求可以选择创建新用户');
        }
      },
      fail(err) {
        // 查询失败的处理
        console.error('查询失败：', err);
        wx.showToast({
          title: '查询失败',
          icon: 'none',
        });
      }
    });
  },
  /*昵称弹窗*/
  showNamePopop(){
    this.setData({
      NamePopup:true,
    })
  },
  onnicknameInput(e) {
    // console.log(e);
    this.setData({ nickName: e.detail });
  },
  
  /*性别弹窗 */
  showGenderPopup(e) {
    this.setData({ GenderPopup: true });
  },

  onGenderChange(e){ //切换选项
    console.log(e);
    this.setData({ gender: e.detail.value});

    setTimeout(()=>{ //选完关闭弹窗时有一个小延时
      this.setData({GenderPopup: false});
      this.onClose();
    }, 100);
  },

  /*生日弹窗 */
  showBirthPopup(e){
    this.setData({ BirthPopup: true})
  },
  onBirthdayConfirm(e){
    console.log(e.detail)
    // Convert the timestamp to a Date object
    const selectedDate = new Date(e.detail);
    console.log(selectedDate)
    // Extract year, month, and day from the Date object
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const day = selectedDate.getDate().toString().padStart(2, '0');

    // Format the date as YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`;
    console.log(formattedDate)
    // Update the data with the formatted date and close the popup
    this.setData({
      birthday: formattedDate,
      BirthPopup: false
    }, () => {
      this.onClose(); 
    });
},
  /*地区弹窗 */
  showAreaPopup(e) {
    this.setData({ AreaPopup: true });
  },
  onAreaConfirm(e){
    this.setData({
      AreaPopup: false
    })
    console.log("确定省市区：",e)
            var address=""
            e.detail.values.forEach(element => {
                address=address+element.name
            });
            this.setData({
                area: address,
                show: false,
            })
    console.log(this.data.area)
    this.onClose();
  },

  /*简介弹窗 */
  showInfoPopup(e) {
    this.setData({ InfoPopup: true });
  },
  onInfoInput(e){
    this.setData({ info: e.detail });
  },

  navigateToProfile: function() {
    wx.switchTab({
      url: '/pages/profile/profile',
    });
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})