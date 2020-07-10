const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  /*
   **
   */
  attached() {
    this.setData({
      warrant: wx.getStorageSync('warrant'),
    })

    var handbook=0;//图鉴率
    var nowhandbook=wx.getStorageSync('Handbook');
    for(let i=0;i<nowhandbook.length;i++){
      if(nowhandbook[i]==1)
        handbook++;
    }
    handbook=parseInt((handbook/nowhandbook.length)*100);

    var active=0;  //活跃度
    //更新一下logs，剔除过期7天以上的数据
    var weeklogs=wx.getStorageSync('weeklogs');
    for(let i=0;i<7;i++)
    {
      if(this.judgeTimeSeven(weeklogs[i].week))
      {
        console.log('复位的logs',weeklogs[i]);
        weeklogs[i]={
          week:'',
          time:0,
          life:0,
          soul:0,
        }
      }
      if(weeklogs[i].week!=''){
        active++;
      }
    }
    wx.setStorageSync('weeklogs', weeklogs);

    let that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    let i = 0;
    numDH();

    function numDH() {
      if (i < 20) {
        setTimeout(function() {
          that.setData({
            starCount: i,
            forksCount: i,
            visitTotal: i
          })
          i++
          numDH();
        }, 20)
      } else {
        that.setData({
          starCount: that.coutNum(parseInt(wx.getStorageSync('Esp')/1000)+1),
          forksCount: that.coutNum(handbook),
          visitTotal: that.coutNum(parseInt((active/7)*100))
        })
      }
    }





    //将数据重新排序实现动态更新

    var durationlist=new Array();
    var soullist = new Array();
    var lifelist = new Array();
    //数据取出
    for(let i=0;i<7;i++)
    {
      durationlist.push(parseInt(weeklogs[i].time/60));
      soullist.push(weeklogs[i].soul);
      lifelist.push(weeklogs[i].life);
    }
    //数据排序
    app.globalData.weeklist = app.updateData(['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']);
    app.globalData.durationlist = app.updateData(durationlist);
    app.globalData.soullist = app.updateData(soullist);
    app.globalData.lifelist = app.updateData(lifelist);


    wx.hideLoading()
  },



  //基础数据
  ///////////////////////////////////////////////////////////////////////
  data: {
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    //授权参数
    warrant: wx.getStorageSync('warrant'),
  },



  methods: {
    //Logic关系 
    ///////////////////////////////////////////////////////////////////////
    /*
     **？？？？？？？？
     */
    coutNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(1) + 'k'
      }
      if (e > 10000) {
        e = (e / 10000).toFixed(1) + 'W'
      }
      return e
    },
    /*
     **上传用户信息
     */
    upload_user() {
      wx.showToast({
        title: '上传中',
        duration: 1000,
        mask:true,
      })
      wx.request({
        url: 'https://www.doremy.work/api/updateuserdata',
        data: {
          "openid": wx.getStorageSync('Openid'),
          "nickname": wx.getStorageSync('Nickname'),
          "avatarurl": wx.getStorageSync('AvatarUrl'),
          "time": wx.getStorageSync('Times'),
          "soul": wx.getStorageSync('Soul'),
          "lifepoint": wx.getStorageSync('LifePoint'),
          "experience": wx.getStorageSync('Esp'),
        },
        method: 'POST',
        success: res => {
          console.log('上传用户基本信息',res);
          wx.showToast({
            title: '上传成功！',
            duration: 2000,
            mask:true,
          })
        },
        fail: err => {
          wx.showToast({
            title: '请检查网络状态',
            duration: 1000,
          })
        },
      })
      //上传用户碎片信息
      wx.request({
        url: 'https://www.doremy.work/api/updateuserpiece',
        data: {
          openid: wx.getStorageSync('Openid'),
          xuanyuanjian: wx.getStorageSync('Piece')[0],
          donghuangzhong: wx.getStorageSync('Piece')[1],
          pangufu: wx.getStorageSync('Piece')[2],
          lianyaohu: wx.getStorageSync('Piece')[3],
          haotianta: wx.getStorageSync('Piece')[4],
          fuxiqin: wx.getStorageSync('Piece')[5],
          shennongding: wx.getStorageSync('Piece')[6],
          kongtongyin: wx.getStorageSync('Piece')[7],
          kunlunjing: wx.getStorageSync('Piece')[8],
          nvwashi: wx.getStorageSync('Piece')[9],
        },
        method: 'POST',
        success: res => {
          console.log('上传用户碎片信息',res);
        },
        fail:err=>{
          cosole.log('cuole');
        }
      }),
        //上传用户图鉴信息
        wx.request({
        url: 'https://www.doremy.work/api/updatehandbook',
          data: {
            openid: wx.getStorageSync('Openid'),
            monster1: wx.getStorageSync('Handbook')[0],
            monster2: wx.getStorageSync('Handbook')[1],
            monster3: wx.getStorageSync('Handbook')[2],
            monster4: wx.getStorageSync('Handbook')[3],
            monster5: wx.getStorageSync('Handbook')[4],
            monster6: wx.getStorageSync('Handbook')[5],
            monster7: wx.getStorageSync('Handbook')[6],
          },
          method: 'POST',
          success: res => {
            console.log('上传用户图鉴信息',res);
          },
        })
    },
    /*
     **导入用户信息
     */
    download_user() {
      wx.showToast({
        title: '导入中',
        duration: 1000,
      })
      wx.request({
        url: 'https://www.doremy.work/api/querybyopenid',
        data: {
          "openid": wx.getStorageSync('Openid'),
        },
        method: 'POST',
        success: res => {
          console.log('导入基础数据',res);
          wx.setStorage({
            //累计时长
            key: 'Times',
            data: res.data.time,
          });
          wx.setStorage({
            //魂数量
            key: 'Soul',
            data: res.data.soul,
          });
          wx.setStorage({
            //生命值
            key: 'LifePoint',
            data: res.data.lifepoint,
          });
          wx.setStorage({
            //累计经验值
            key: 'Esp',
            data: res.data.experience,
          });
          wx.showToast({
            title: '导入成功！',
            duration: 1000,
          })

        },
        fail: err => {
          wx.showToast({
            title: '导入失败！请检查网络状态',
            duration: 1000,
          })
        },
      })
      wx.request({
        url: 'https://www.doremy.work/api/piecebyopenid',
        data: {
          "openid": wx.getStorageSync('Openid'),
        },
        method: 'POST',
        success: res => {
          console.log('导入碎片',res);
          let piecelist=new Array();
          /*
          piecelist[0]=res.data.donghuangzhong;
          piecelist[1]=res.data.fuxiqin;
          piecelist[2]=res.data.haotianta;
          piecelist[3]=res.data.kongtongyin;
          piecelist[4]=res.data.kunlunjing;
          piecelist[5]=res.data.lianyaohu;
          piecelist[6]=res.data.nvwashi;
          piecelist[7]=res.data.pangufu;
          piecelist[8]=res.shennongding;
          piecelist[9]=res.data.xuanyuanjian;
          wx.setStorage({
            key:'Piece',
            data:piecelist
          })
          */
        }
      })
      wx.request({
        url: 'https://www.doremy.work/api/handbookbyopenid',
        data: {
          "openid": wx.getStorageSync('Openid'),
        },
        method: 'POST',
        success: res => {
          console.log('导入图鉴',res);
          let handbooklist=new Array();
          handbooklist[0]=res.data.monster1;
          handbooklist[1]=res.data.monster2;
          handbooklist[2]=res.data.monster3;
          handbooklist[3]=res.data.monster4;
          handbooklist[4]=res.data.monster5;
          handbooklist[5]=res.data.monster6;
          handbooklist[6]=res.data.monster7;
          wx.setStorage({
            key:'Handbook',
            data:handbooklist
          })
        }
      })
    },
    /*
     **测试 清理缓存
     */
    testclear() {
      wx.clearStorage();
      wx.showToast({
        title: '清理完毕',
        duration: 1000,
      })
    },

    //授权相关
    /////////////////////////////////
    /*
     **授权点击取消按钮
     */
    hideModal() {
      //直接跳回主页面
      wx.redirectTo({
        url: '/pages/index/index',
      })
      wx.showToast({
        title: '未授权',
        duration: 2000,
      })
    },
    /*
     **授权点击授权按钮
     */
    userinfo() {
      this.setData({
        warrant: 1,
      })
      wx.setStorageSync('warrant', 1);
      wx.showToast({
        title: '授权成功！',
        duration: 2000,
      })
      wx.getUserInfo({
        success: res => {
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
          wx.login({
            success: res => {
              //code值(5分钟失效)
              //console.info(res.code);
              wx.request({
                url: 'https://www.doremy.work/api/openid', // 请求路径
                method: 'POST', //请求方式
                data: {
                  code: res.code,
                },
                success: result => {
                  //获取到了用户信息及openid
                  //保存至本地
                  wx.setStorage({
                    key: 'Openid',
                    data: result.data.openid,
                  });
                  console.log('获取用户openid',result);
                  getApp().recoverRecruit();
                },
                fail: err => {
                  console.info("连接失败")
                } //失败
              });
            }
          });
          //需要等待一下数据存入缓存
          setTimeout(function() {
            //console.log(wx.getStorageSync('Openid'));
            //上传注册新用户基本信息
            wx.request({
                url: 'https://www.doremy.work/api/insertuserdata',
                data: {
                  "openid": wx.getStorageSync('Openid'),
                  "nickname": wx.getStorageSync('Nickname'),
                  "avatarurl": wx.getStorageSync('AvatarUrl'),
                  "time": 0,
                  "soul": 0,
                  "lifepoint": 100,
                  "experience": 0
                },
                method: 'POST',
                success: res => {
                  console.log('新建用户基本信息',res);
                },
                fail: err => {
                  console.log("服务器连接失败！");
                  //清除缓存
                  wx.clearStorage();
                },
              }),
              //新用户碎片信息
              wx.request({
                url: 'https://www.doremy.work/api/insertuserpiece',
                data: {
                  openid: wx.getStorageSync('Openid'),
                  xuanyuanjian: wx.getStorageSync('Piece')[0],
                  donghuangzhong: wx.getStorageSync('Piece')[1],
                  pangufu: wx.getStorageSync('Piece')[2],
                  lianyaohu: wx.getStorageSync('Piece')[3],
                  haotianta: wx.getStorageSync('Piece')[4],
                  fuxiqin: wx.getStorageSync('Piece')[5],
                  shennongding: wx.getStorageSync('Piece')[6],
                  kongtongyin: wx.getStorageSync('Piece')[7],
                  kunlunjing: wx.getStorageSync('Piece')[8],
                  nvwashi: wx.getStorageSync('Piece')[9],
                },
                method: 'POST',
                success: res => {
                  console.log('新建用户碎片信息',res);
                },
              }),
              //新用户图鉴信息
              wx.request({
                url: 'https://www.doremy.work/api/inserthandbook',
                data: {
                  openid: wx.getStorageSync('Openid'),
                  monster1: wx.getStorageSync('Handbook')[0],
                  monster2: wx.getStorageSync('Handbook')[1],
                  monster3: wx.getStorageSync('Handbook')[2],
                  monster4: wx.getStorageSync('Handbook')[3],
                  monster5: wx.getStorageSync('Handbook')[4],
                  monster6: wx.getStorageSync('Handbook')[5],
                  monster7: wx.getStorageSync('Handbook')[6],
                },
                method: 'POST',
                success: res => {
                  console.log('新建用户图鉴信息',res);
                },
              })
          }, 4000);
        }
      })

    },




    //UI关系 
    ///////////////////////////////////////////////////////////////////////
    /*5.0.5
     **弹窗赞助二维码显示
     */
    showQrcode() {
      wx.previewImage({
        urls: ['http://qbyrsunkk.bkt.clouddn.com/pay.png'],
        current: 'http://qbyrsunkk.bkt.clouddn.com/pay.png' // 当前显示图片的http链接      
      })
    },
    /*5.0.7
     **转到历史界面
     */
    tohistory: function() {
      wx.navigateTo({
        url: '/pages/about/history/history',
      })
    },
    /*5.0.8
     **转到关于界面
     */
    toabout: function() {
      wx.navigateTo({
        url: '/pages/about/about/about',
      })
    },
    //判断输入时间是否为7天之前，是返回true，不是返回false
    judgeTimeSeven(thetime){
      if(thetime=='')
        return false
      else{
        var nowTime =Math.round(new Date() / 1000);
        var SevenDayAgo = nowTime - 86400 * 7;
        var sevenago=app.timeConvert(SevenDayAgo,0);
        if(this.judgeTime(thetime,sevenago))
          return true
        else
          return false
      }
    },
    //判断endtime在nowtime之前还是之后，在之前返回1，在之后返回0
    judgeTime(endtime,nowtime){
    var nowday=nowtime.slice(0,4)+nowtime.slice(5,7)+nowtime.slice(8,10);
    var endday=endtime.slice(0,4)+endtime.slice(5,7)+endtime.slice(8,10);
    if(parseInt(endday)<parseInt(nowday))
      return true
    else
      return false
  },

  }
})