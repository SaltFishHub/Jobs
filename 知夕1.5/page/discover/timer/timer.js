const app = getApp();
var timeID;
var time = 20;
var timeout = "00:00:00";
var salttimeout = 1;


//倒计时番茄钟数值
var TimetoSoul = 360;  //  s/soul
var TimetoExp = 36;   //  s/exp
var FailLife = 5;      //失败扣除血量
const handbookThreshold=3600  //超过这个时间才会解锁图鉴

Page({

  //基础数据
  ///////////////////////////////////////////////////////////////////////
  data: {
    ColorList: app.globalData.ColorList,
    color: 'red',
    //计时
    time: time,
    //使用的番茄钟创建时间数值
    cretime: '',
    //隐藏暂停提示
    hideme: true,
    //转换后显示的时间
    timeout: timeout,
    //番茄钟的总时长
    alltime: 0,
    handbookNo:0,  //本次的图鉴编码
    doubleExp:0,  //双倍状态
    doubleSoul:0,
  },



  /**
   * 时间转换显示（秒转显示
   */
  timeswitch: function() {
    var h, m, s;
    h = parseInt(time / 3600);
    if (h < 10)
      h = "0" + h;
    m = parseInt(time / 60);
    if (m >= 60)
      m %= 60;
    if (m < 10)
      m = "0" + m;
    s = time % 60;
    if (s < 10)
      s = "0" + s
    this.setData({
      timeout: h + ":" + m + ":" + s
    });
  },

  /**
   * 时间减少timer
   */
  timer: function() {
    this.setData({
      time: time--
    });
    this.timeswitch();
    //动态更改时间进度条
    this.salttimeswitch();
    if (time <= 0) {
      this.endtime();
      this.stoptime();
    }
  },


  /*
   * 开始计时
   */
  starttime: function() {
    this.setData({
      hideme: true
    });
    //循环计时
    timeID = setInterval(() => {
      this.timer()
    }, 1000);

    setTimeout(function() {
      if (time > 2)
        //2s后进行亮度调整
        wx.setScreenBrightness({
          value: 0,
        })
    }, 3000);

    //屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true,
    })

  },


  /*
   * 暂停时间
   */
  stoptime: function() {
    clearTimeout(timeID);
    this.setData({
      hideme: false
    });
    //调整屏幕亮度
    wx.setScreenBrightness({
      value: 0.5,
    });
  },


  /*
   * 完成本次计时
   */
  endtime: function() {
    //记录累计时间
    wx.getStorage({
      key: 'Times',
      success: res => {
        let alltime = res.data + this.data.alltime;
        wx.setStorageSync('Times', alltime);
      }
    })
    //记录经验增长
    wx.getStorage({
      key: 'Esp',
      success: res => {
        let allExp = res.data + parseInt(this.data.alltime / TimetoExp);
        wx.setStorageSync('Esp', allExp);
      }
    })
    //记录灵气增长
    wx.getStorage({
      key: 'Soul',
      success: res => {
        let allSoul = res.data + parseInt(this.data.alltime / TimetoSoul);
        wx.setStorageSync('Soul', allSoul);
      }
    })
    //删除本地的番茄钟
    let el = wx.getStorageSync('PersonalTimer');
    let cretimetemp = this.data.cretime;
    var nowtimer = [];
    for (let i = 0; i < el.length; i++) {
      if (el[i].creTime.match(cretimetemp)) continue;
      nowtimer.push(el[i]);
    }
    wx.setStorageSync('PersonalTimer', nowtimer);


    wx.showToast({
      title: '结算成功！',
      duration: 2000,
    })

//解锁图鉴
if(time>handbookThreshold){
  let nowhandbook=wx.getStorageSync('Handbook');
  nowhandbook[this.data.handbookNo]=1;
  wx.setStorageSync('Handbook', nowhandbook);
  setTimeout(()=>{
    wx.showToast({
      title: '解锁了新的图鉴！',
      duration: 2000,
    })
  },2000)
}

    //一星期的番茄钟使用logs更新
    let t = this.data.alltime;
    //今天的日期
    var week = getApp().timeConvert(Math.round(new Date() / 1000), 0);
    var todayweek = getApp().todayWeek();
    var timelogs = wx.getStorageSync('weeklogs');
    //今天的数据，继续累计
    if (timelogs[todayweek - 1].week == week) {
      timelogs[todayweek - 1].time += t;
      timelogs[todayweek - 1].soul += parseInt(t / TimetoSoul);
      wx.setStorageSync('weeklogs', timelogs);
    }
    //上周的数据 直接覆盖
    else {
      timelogs[todayweek - 1].week = week;
      timelogs[todayweek - 1].time = t;
      timelogs[todayweek - 1].soul = parseInt(t / TimetoSoul);
      wx.setStorageSync('weeklogs', timelogs);
    }



    setTimeout(function() {
      wx.navigateBack({
        url: "/pages/daily/home/home"
      })
    }, 2000);

  },

  /*
   * 时间跳过 测试用函数
   */
  skiptime: function() {
    time = 3;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    //判断buff状态
    if (getApp().timeConvert(Math.round(new Date() / 1000), 0) == wx.getStorageSync('SoulDouble'))
    {
      console.log("※※※魂量双倍中※※※doubleSoul=1");
      this.setData({
        doubleSoul:1,
      })
      TimetoSoul/=2;
    }
    if (getApp().timeConvert(Math.round(new Date() / 1000), 0) == wx.getStorageSync('ExpDouble'))
    {
      console.log("※※※经验双倍中※※※doubleExp=1");
      this.setData({
        doubleExp:1,
      })
      TimetoExp/=2;
    }

    //判断本次开启的图鉴
    let handbook=parseInt(Math.random()*7);
    console.log('本次图鉴编号handbookNo',handbook);
    this.setData({
      handbookNo:handbook,
    })

    console.log('倒计时番茄钟开始：',options);
    time = app.timeswitch2(options.time);
    //储存一下总时长
    this.setData({
      alltime: time,
    });
    this.setData({
      cretime: options.creTime
    });


    wx.showLoading({
      title: '开始计时',
      mask: true,
    })
    let that = this;
    setTimeout(function() {
      that.setData({
        loading: true
      })
    }, 500);
    this.starttime();
    wx.hideLoading();
  },

  /*
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /*
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /*
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    wx.setScreenBrightness({
      value: 0.5,
    });
    this.stoptime();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    //停止计时
    clearTimeout(timeID);
    if (time > 0) {
      //扣除血量
      wx.getStorage({
        key: 'LifePoint',
        success: res => {
          let nowLife = res.data - FailLife;
          wx.setStorageSync('LifePoint', nowLife);
        }
      }) 
      //今天的日期
      var week = getApp().timeConvert(Math.round(new Date() / 1000), 0);
      var todayweek = getApp().todayWeek();
      var timelogs = wx.getStorageSync('weeklogs');
      //今天的数据，继续累计
      if (timelogs[todayweek - 1].week == week) {
        timelogs[todayweek - 1].life -= FailLife;
        wx.setStorageSync('weeklogs', timelogs);
      }
      //上周的数据 直接覆盖
      else {
        timelogs[todayweek - 1].week = week;
        timelogs[todayweek - 1].life = -FailLife;
        wx.setStorageSync('weeklogs', timelogs);
      }
      wx.showToast({
        title: '任务失败！',
        duration: 2000,
      })
    }

    //亮度恢复
    wx.setScreenBrightness({
      value: 0.5,
    });
    //屏幕常亮关闭
    wx.setKeepScreenOn({
      keepScreenOn: false,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  //进度条转换显示
  salttimeswitch: function() {
    this.setData({
      salttimeout: 100 - parseInt((time/this.data.alltime)*100)
    });
  },
})