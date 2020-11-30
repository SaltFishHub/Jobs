const app = getApp();
var timeID;
var time = 0;
var timeout = "00:00:00";

//招募番茄钟数值
var TimetoSoul =360;  //  s/soul
var TimetoExp =36;   //  s/exp
var FailLife=5;      //失败扣除血量
const handbookThreshold=3600  //超过这个时间才会解锁图鉴
const timeThreshold=900  //超过这个时间才会结算

Page({
  //基础数据
  ///////////////////////////////////////////////////////////////////////
  data: {
    scroll: 0,
    color: 'red',
    time: time, //计时
    hideme: true, //隐藏暂停提示
    timeout: timeout, //转换后显示的时间
    id:"",//识别招募的id
    handbookNo:0,  //本次的图鉴编码
    doubleExp:0,  //双倍状态
    doubleSoul:0,
  },

  //Logic关系 
  ///////////////////////////////////////////////////////////////////////
  /*
   **时间转换显示
   */
  timeswitch: function() {
    var h, m, s, l1, l2;
    h = parseInt(time / 3600);
    l1 = h * 2;
    if (h < 10)
      h = "0" + h;
    m = parseInt(time / 60);
    if (m >= 60)
      m %= 60;
    l2 = m / 30;
    if (m < 10)
      m = "0" + m;
    s = time % 60;
    if (s < 10)
      s = "0" + s;
    this.setData({
      timeout: h + ":" + m + ":" + s,
      //////////////////////////////////////////////
      //UI修改---阶段增加
      scroll: this.data.scrpll == 4 ? 4 : (l1 + l2)
      //////////////////////////////////////////////
    });
  },
  /*
   **时间增加timer
   */
  timer: function() {
    this.setData({
      time: time++
    });
    this.timeswitch();
  },
  /*
   **时间增加timer
   */
  //开始计时
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
   **暂停时间
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
   **结束本次计时
   */
  endtime: function() {
    this.stoptime();
    if (time > timeThreshold) {
      //记录累计时间
      wx.getStorage({
        key: 'Times',
        success: res => {
          let alltime = res.data + time;
          wx.setStorageSync('Times', alltime);
        }
      })
      //记录经验增长
      wx.getStorage({
        key: 'Esp',
        success: res => {
          let allExp = res.data + parseInt(time / TimetoExp);
          wx.setStorageSync('Esp', allExp);
        }
      })
      //记录灵气增长
      wx.getStorage({
        key: 'Soul',
        success: res => {
          let allSoul = res.data + parseInt(time / TimetoSoul);
          wx.setStorageSync('Soul', allSoul);
        }
      })
      wx.showToast({
        title: '积累成功！',
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

      //今天的日期
      var week = getApp().timeConvert(Math.round(new Date() / 1000),0);
      var todayweek=getApp().todayWeek();
      var timelogs = wx.getStorageSync('weeklogs');
      //今天的数据，继续累计
      if(timelogs[todayweek-1].week==week)
        {
          timelogs[todayweek-1].time+=time;
          timelogs[todayweek - 1].soul += parseInt(time / TimetoSoul);
          wx.setStorageSync('weeklogs', timelogs);
        }
        //上周的数据 直接覆盖
      else
      {
          timelogs[todayweek-1].week=week;
          timelogs[todayweek-1].time=time;
          timelogs[todayweek - 1].soul = parseInt(time / TimetoSoul);
          wx.setStorageSync('weeklogs', timelogs);
      }

      //向服务器申请结算积累
      wx.request({
        url: 'https://www.doremy.work/api/accept_recruit', // 请求路径
        method: 'POST', //请求方式
        data: {
          openid: wx.getStorageSync('Openid'),
          makerid:this.data.id,
          time:time,
        },
        success: res => {
          console.log('申请积累',res);
        }
      })

    } else {
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
  },
  /*
   **测试用快进时间
   */
  addtime: function() {
    time += 600;
  },
  /*
   **按下结算按钮
   */
  buttonend: function() {
    wx.navigateBack({
      url: "/pages/daily/home/home"
    })
  },
  /*
   **监听页面加载
   */
  onLoad(options) {
    this.setData({
      id:options.makerid,
    })
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

    console.log('房间id',options)

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
    //开始计时
    time = 0;
    this.starttime();
    wx.hideLoading();
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

  /*
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    //直接结算
    this.endtime();
    //亮度恢复
    wx.setScreenBrightness({
      value: 0.5,
    });
    //屏幕常亮关闭
    wx.setKeepScreenOn({
      keepScreenOn: false,
    })
  },
})