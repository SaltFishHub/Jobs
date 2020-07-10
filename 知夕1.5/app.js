App({
  onLaunch: function () {
    // 判断是否是初次登录
    var logs = wx.getStorageSync('logs') || [];
    //用户是初次登录
    if (logs == "") {
      //加载提示
      wx.showLoading({
        title: '初始化加载中',
        mask: true,
      })
      console.log("初次登录！");
      wx.getSetting({
        success: res => {
          //已经授权
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo;
                //初始化用户基本信息
                //昵称
                wx.setStorage({
                  key: 'Nickname',
                  data: res.userInfo.nickName,
                })
                //头像路径
                wx.setStorage({
                  key: 'AvatarUrl',
                  data: res.userInfo.avatarUrl,
                })
                //登录获取openid
                wx.login({
                  success: res => {
                    //code值(5分钟失效)
                    //console.info(res.code);
                    wx.request({
                      url: 'https://www.doremy.work/api/openid', // 请求路径
                      method: 'POST', //请求方式
                      data: { code: res.code, },
                      success: result => {
                        //获取到了用户信息及openid
                        //console.info(result.data.openid);
                        //保存至本地
                        wx.setStorage({
                          key: 'Openid',
                          data: result.data.openid,
                        });
                        console.log("请求id成功");
                      },
                      fail: err => {
                        console.info("get openid fail")
                      } //失败
                    });
                  }
                });
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res);
                }
              }
            })
            //更新下招募缓存
            setTimeout(() => {
            this.recoverRecruit();
          }, 2000);
        }
          //没授权
          else{
            //初始化用户基本信息
            //昵称
            wx.setStorage({
              key: 'Nickname',
              data: '未授权用户',
            })
            //头像路径
            wx.setStorage({
              key: 'AvatarUrl',
              data: 'https://s1.ax1x.com/2020/05/05/YF6r9O.jpg',
            })
          }
          ///////其他的初始化工作///////
          wx.setStorage({
            //累计时长
            key: 'Times',
            data: 0,
          });
          wx.setStorage({
            //魂数量
            key: 'Soul',
            data: 0,
          });
          wx.setStorage({
            //生命值
            key: 'LifePoint',
            data: 100,
          });
          wx.setStorage({
            //累计经验值
            key: 'Esp',
            data: 0,
          });
          //碎片
          var piecearr=new Array();
          for(let i=0;i<10;i++)
            piecearr.push(0);
          wx.setStorage({
            key: 'Piece',
            data:piecearr,
          });
          //图鉴
          var monsterarr = new Array();
          for (let i = 0; i < 7; i++)
              monsterarr.push(0);
          wx.setStorage({
            
            key: 'Handbook',
            data:monsterarr,
          });
          //本地番茄钟
            wx.setStorage({
              key: 'PersonalTimer',
              data:[{
                creTime:'1590164005121',
                title: '简单一小时',
                describe: '给自己一场期待，放下手机',
                color: 'cyan',
                icon: 'newsfill',
                time: '01:00'
              },
              {
                creTime:'1590164005101',
                title: '半小时爱好',
                describe: '开始积累今天份的兴趣吧',
                color: 'red',
                icon: 'settings',
                time: '00:30'
              }
              ],
            }) 
          //番茄钟使用日志
          wx.setStorage({
            key: 'weeklogs',
            data: [{
              week:'',
              time:0,
              life:0,
              soul: 0
            },
            {
              week:'',
              time: 0,
              life: 0,
              soul: 0
            },
            {
              week:'',
              time: 0,
              life: 0,
              soul: 0
            },
            {
              week:'',
              time: 0,
              life: 0,
              soul: 0
            },
            {
              week:'',
              time: 0,
              life: 0,
              soul: 0
            },
            {
              week:'',
              time: 0,
              life: 0,
              soul: 0
            },
            {
              week:'',
              time: 0,
              life: 0,
              soul: 0
            },
            ],
          }) 
          //双倍buff状态
          wx.setStorage({
            key: 'SoulDouble',
            data: 'None',
          })
          wx.setStorage({
            key: 'ExpDouble',
            data: 'None',
          })
          //个人招募缓存
          var recruit =new Array();
          wx.setStorage({
            data: recruit,
            key: 'Recruit',
          })
        }
      }),

      //隐藏加载
      wx.hideLoading();
    }
    //用户已登录过
    else {
      console.log("这是第" + (wx.getStorageSync('logs').length + 1) + "次登录");
      //加载提示
      wx.showLoading({
        title: '初始化加载中',
        mask: true,
      })
      //如果用户授权使用过
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                //简单更新下用户昵称和头像
                //昵称
                wx.setStorage({
                  key: 'Nickname',
                  data: res.userInfo.nickName,
                })
                //头像路径
                wx.setStorage({
                  key: 'AvatarUrl',
                  data: res.userInfo.avatarUrl,
                })
                //结束初始化，隐藏加载图标
                wx.hideLoading();
              },
              fail: err => {
                console.log(err);
              }
            })
          }
          //隐藏加载
          wx.hideLoading();
        }
      })
      //更新下招募缓存
      this.recoverRecruit();
    }      


    // 记录登录信息
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    
    //获取系统信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();

        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    }); // 获取用户信息

    //如果用户授权使用过
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          //已授权
          wx.setStorageSync('warrant',1);
        }
        //未授权
        else
          wx.setStorageSync('warrant',0);
      }
    })
  },

  globalData: {
    userInfo: null,
    //统计的数据，在进入成就页面时根据日期进行动态排序
    weeklist:['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
    durationlist:[],
    soullist:[],
    lifelist:[],

  },
  //时间戳转换为时间 num:0 YYYY-MM-DD  num:1  YYYY-MM-DD hh:mm:ss
  timeConvert:function(timestamp, num) {
    timestamp = timestamp + '';
    timestamp = timestamp.length == 10 ? timestamp * 1000 : timestamp;
    var date = new Date(timestamp);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    if(num == 0) {
  return y + '-' + m + '-' + d;
} else {
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}
},

//计算今天是周几，返回值为数字1，2，3..
todayWeek: function () {
  var nowweek = Math.round(new Date() / 1000);
  var arys1 = new Array();
  arys1 = this.timeConvert(nowweek, 0).split('-');
  var ssdate = new Date(arys1[0], parseInt(arys1[1] - 1), arys1[2]);
  var theweek=ssdate.getDay();
  if(theweek==0)theweek=7;
  return theweek;
},

//根据当前星期来排序数据，实现动态排序数据统计
  updateData: function(datalist) {
  var todaydatalist = new Array();
  var week = this.todayWeek();
  for (var i = 0; i < 7; i++ , week++) {
    if (week == 7) week = 0;
    todaydatalist.push(datalist[week]);
  }
  return todaydatalist;
},

  //判断输入时间在现在时间之前还是之后，在之前返回1(过期），在之后返回0（没过期
  judgeTime(endtime){
    var nowtime=getApp().timeConvert(Math.round(new Date() / 1000),1);
    var nowday=nowtime.slice(0,4)+nowtime.slice(5,7)+nowtime.slice(8,10);
    var endday=endtime.slice(0,4)+endtime.slice(5,7)+endtime.slice(8,10);
    console.log(endtime,nowtime)
    if(parseInt(endday)>parseInt(nowday))
    {
      return false
    }
    else if(parseInt(endday)<parseInt(nowday))
    {
      return true
    }
    else{
      let nowclock='1'+nowtime.slice(11,13)+nowtime.slice(14,16)+nowtime.slice(17,19);
      let endclock='1'+endtime.slice(11,13)+endtime.slice(14,16)+endtime.slice(17,19);
      if(parseInt(endclock)<parseInt(nowclock)){
        return true
      }
      else
        return false
    }
  },
  /**
   * 时间转换显示 将xx：xx：xx转换为具体秒数
   */
  timeswitch2: function(strtime) {
    let timeo = 0; //输出多少秒
    let thetime = strtime.split(":"); //：分割
    //小时转换
    if (thetime[0].indexOf("0") == 0) {
      //处理0开头情况
      timeo += 3600 * parseInt(thetime[0].charAt(1));
    } else {
      //直接转换秒数
      timeo += 3600 * parseInt(thetime[0]);
    }
    //分钟转换
    if (thetime[1].indexOf("0") == 0) {
      //处理0开头情况
      timeo += 60 * parseInt(thetime[1].charAt(1));
    } else {
      //直接转换秒数
      timeo += 60 * parseInt(thetime[1]);
    }
    return timeo;
  },

      //恢复招募的缓存
    recoverRecruit(){
      wx.request({
        url: 'https://www.doremy.work/api/return_recruit', // 请求路径
        method: 'POST', //请求方式
        data: { 
          openid: wx.getStorageSync('Openid'),
          makerid: wx.getStorageSync('Openid'),
          time:0  
        },
        success: res => {
          console.log('更新个人招募缓存：',res);
          if(res.data.message=='Get failed:redigo: nil returned')
          {
            console.log('没有参加任何招募');
            let kong=new Array();
            wx.setStorage({
              data: kong,
              key: 'Recruit',
            })
          }
          else{
            var newrecruitList=new Array();
          for(let i=0;i<res.data.end_times.length;i++)
          {
            let endtime = res.data.end_times[i].slice(0, 10) + ' ' + res.data.end_times[i].slice(11, 19); 
            let newrecruit={
              title:res.data.titles[i],
              describe:res.data.describes[i],
              makerid:res.data.recruits.recruit[i],
              endtime:endtime,
              url:res.data.urls[i],
            }
            newrecruitList.push(newrecruit);
          }
          wx.setStorageSync('Recruit', newrecruitList);
        }
        }
      })
    },
})