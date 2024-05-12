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
    Avatar:"/images/student.png",
    nickname:"bot",
    gender:" ",
    birthday:" ",
    area: " ",
    info:" ",
    areaList:areaList,
    GenderPopup: false,
    NamePopup:false,
    BirthPopop: false,
    AreaPopop: false,
    InfoPopop: false,
    genderOptions:['男','女','不愿透露'],
    MinDate: "1950-01-01"
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

  /*生日弹窗 */
  showBirthPopup(e){
    this.setData({ BirthPopup: true})
  },
  onBirthdayConfirm(e){
    // console.log(e); //detail: 1425052800000，好像是时间戳
    const selectedDate = new Date(e.detail);
    // 获取年、月、日
    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0'); // 月份从 0 开始，需要加 1
    const day = selectedDate.getDate().toString().padStart(2, '0');

    // 拼接成 YYYY-MM-DD 格式
    const formattedDate = `${year}-${month}-${day}`;

    // console.log(formattedDate); // 输出：2015-01-01
    this.setData({
      birthday: formattedDate,
      BirthPopup: false
    })
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