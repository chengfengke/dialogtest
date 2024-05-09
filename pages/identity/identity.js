// pages/identity/identity.js
Page({

  /**
   * Page initial data
   */
  data: {
    appName:"编辑资料",
    Avatar:"/images/student.png",
    nickname:"bot",
    gender:" ",
    birthday:" ",
    area: " ",
    info:"...",
    
    GenderPopup: false,
    NamePopup:false,
    BirthPopop: false,
    AreaPopop: false,
    InfoPopop: false,
    genderOptions:['男','女','不愿透露'],

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
  },

  /*昵称弹窗*/
  showNamePopop(){
    this.setData({
      NamePopup:true,
    })
  },
  onNicknameInput(e) {
    // console.log(e);
    this.setData({ nickname: e.detail });
  },
  
  /*性别弹窗 */
  showGenderPopup(e) {
    this.setData({ GenderPopup: true });
  },

  onGenderChange(e){ //切换选项
    console.log(e);
    // const { value } = e.detail;
    this.setData({ gender: e.detail.value});

    setTimeout(()=>{ //选完关闭弹窗时有一个小延时
      this.setData({GenderPopup: false});
    }, 100);
  },

  showBirthPopup(e){
    this.setData({ BirthPopup: true})
  },

  showAreaPopup(e) {
    this.setData({ AreaPopup: true });
  },

  showInfoPopup(e) {
    this.setData({ InfoPopup: true });
  },
  onInfoInput(e){
    this.setData({ info: e.detail });
  },

  navigateToProfile: function() {
    wx.navigateTo({
      url: '/pages/profile/profile',
    });
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {

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