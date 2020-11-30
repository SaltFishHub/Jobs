// pages/about/dictionary/dictionary.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlmonster: [{
      url: 'http://qbyrsunkk.bkt.clouddn.com/monster001.png',
      burl: 'http://qbyrsunkk.bkt.clouddn.com/lock1.png',
      islock: wx.getStorageSync('Handbook')[0],
      name: '乘黄'
    }, {
      url: 'http://qbyrsunkk.bkt.clouddn.com/monster002.png',
        burl: 'http://qbyrsunkk.bkt.clouddn.com/lock2.png',
      islock: wx.getStorageSync('Handbook')[1],
        name: '九尾狐 '
    }, {
      url: 'http://qbyrsunkk.bkt.clouddn.com/monster003.png',
        burl: 'http://qbyrsunkk.bkt.clouddn.com/lock3.png',
      islock: wx.getStorageSync('Handbook')[2],
        name: '驺吾'
    }, {
      url: 'http://qbyrsunkk.bkt.clouddn.com/monster004.png',
        burl: 'http://qbyrsunkk.bkt.clouddn.com/lock4.png',
      islock: wx.getStorageSync('Handbook')[3],
        name: '  穷奇 '
    }, {
      url: 'http://qbyrsunkk.bkt.clouddn.com/monster005.png',
        burl: 'http://qbyrsunkk.bkt.clouddn.com/lock5.png',
      islock: wx.getStorageSync('Handbook')[4],
        name: ' 天吾 '
    }, {
      url: 'http://qbyrsunkk.bkt.clouddn.com/monster006.png',
        burl: 'http://qbyrsunkk.bkt.clouddn.com/lock6.png',
      islock: wx.getStorageSync('Handbook')[5],
        name: '帝江'
    }, {
      url: 'http://qbyrsunkk.bkt.clouddn.com/monster007.png',
        burl: 'http://qbyrsunkk.bkt.clouddn.com/lock7.png',
      islock: wx.getStorageSync('Handbook')[6],
        name: '     当康'
    }],
    urlchip: [{
      url: 'http://qbyrsunkk.bkt.clouddn.com/chip_1.png',
      name: '轩辕剑',
    }, {
        url: 'http://qbyrsunkk.bkt.clouddn.com/chip_2.png',
        name: '盘古斧',
    }, {
        url: 'http://qbyrsunkk.bkt.clouddn.com/chip_3.png',
        name: '昊天塔',
    }, {
        url: 'http://qbyrsunkk.bkt.clouddn.com/chip_4.png',
        name: '昆仑镜',
    }, {
        url: 'http://qbyrsunkk.bkt.clouddn.com/chip_5.png',
        name: '东皇钟',
    }, {
        url: 'http://qbyrsunkk.bkt.clouddn.com/chip_6.png',
        name: '炼妖壶',
    }, {
        url: 'http://qbyrsunkk.bkt.clouddn.com/chip_7.png',
        name: '神农鼎',
    }, {
        url: 'http://qbyrsunkk.bkt.clouddn.com/chip_8.png',
        name: '崆峒印',
    }, {
        url: 'http://qbyrsunkk.bkt.clouddn.com/chip_9.png',
        name: '伏羲琴',
    }, {
        url: 'http://qbyrsunkk.bkt.clouddn.com/chip_10.png',
        name: '女娲石',
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})