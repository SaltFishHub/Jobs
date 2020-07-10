//页面逻辑处理
//页面底部导航栏
const app = getApp()

Page({
  data: {
    PageCur: 'daily'
  },


  creclock() {
    wx.navigateTo({
      url: '/pages/discover/home/home',
    })
  },
  //UI
  /*0.1页面转换
  **页面标识参数：PageCur 【改变】
  */
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  //UI
  /*0.2分享按钮设计
  **页面标识参数：PageCur 【改变】
  */
  onShareAppMessage() {
    return {
      title: 'ColorUI-敲黑板你看到了么',
      imageUrl: '/images/share6-29.jpg',
      path: '/pages/index/index'
    }
  },
})
