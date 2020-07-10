//数据策划2020.6.8
const RewardFactor = 50; //当积累时间达到或超过总时间的RewardFactor%时，可以拿全额奖励
const Reward = [10, 20, 30]; //总奖励为多少esp和魂(根据总时长分为三个阶段)
const TimeStage = [7200, 18000, 28800] //总时间分段，目前为2h，5h，8h

Component({
  options: {
    addGlobalClass: true,
  },
  //基础数据
  ///////////////////////////////////////////////////////////////////////
  data: {
    AvatarUrl:'https://s1.ax1x.com/2020/06/11/t7cPot.png',
    //搜索输入值
    inputVal: "",
    //搜索框切换
    showchange: true,
    //弹窗管理
    modelname: '',
    //招募默认时间
    time: '01:30',
    //创建招募容器【缓存对象】
    contain: {
      id: '',
      name: "",
      describe: "",
      group: "",
      endTime: "",
    },
    //招募板基础信息【对象】
    commonlist: [{
      id: 1,
      name: "加载中...",
      describe: "加载中...",
      group: 1,
      endtime: "24:00"
    },],
    privatelist: [{
      id: 4,
      name: "加载中...",
      describe: "加载中...",
      group: 1,
      endtime: "24:00"
    },],
    activitylist: [{
      id: 6,
      name: "加载中...",
      describe: "加载中...",
      group: 1,
      endtime: "24:00"
    }, ],
    list: [{
      id: 'common',
      name: '公共招募',
      open: false,
    }, {
      id: 'private',
      name: '个人招募',
      open: false,
    }, {
      id: 'activity',
      name: '特别招募',
      open: false,
    }],
  },

  //加载页面检查招募是否结算
  attached() {
    this.noWarrant();
    //循环更新本地个人招募列表卡片
    setInterval(() => {
    let nowrecruitList=wx.getStorageSync('Recruit');
    let newrecruitList=new Array();
    for(let i=0;i<nowrecruitList.length;i++)
    {
      let newrecruit={
        id:nowrecruitList[i].makerid,
        name:nowrecruitList[i].title,
        describe:nowrecruitList[i].describe,
        group:1,
        endtime:nowrecruitList[i].endtime,
        url:nowrecruitList[i].url,
      }
      newrecruitList.push(newrecruit);
    }
      this.setData({
        privatelist:newrecruitList,
      })
    }, 2000);


    var recruitList = wx.getStorageSync('Recruit');
    console.log('结算前列表：',recruitList);
    //循环招募列表并结算更新缓存
    for (var i = 0; i < recruitList.length; i++) {
      //此招募已经到期
      if (getApp().judgeTime(recruitList[i].endtime)) {
        console.log('结算的招募：',recruitList[i]);
        //向服务器申请结算
        wx.request({
          url: 'https://www.doremy.work/api/complete_recruit', // 请求路径
          method: 'POST', //请求方式
          data: {
            openid: wx.getStorageSync('Openid'),
            makerid: recruitList[i].makerid,
            time: 0,
          },
          success: res => {
            console.log('申请结算',res);
            //根据用户累计时间计算奖励系数
            var score = res.data.player_score / res.data.all_score * RewardFactor;
            if (score > 1) score = 1; //防止溢出
            //根据奖励系数及房间总时间计算奖励
            for (let j = 2; j >= 0; j--) {
              if (res.data.all_score > TimeStage[j]) {
                //记录经验增长
                wx.getStorage({
                  key: 'Esp',
                  success: res => {
                    let allExp = res.data + parseInt(Reward[j] * score);
                    wx.setStorageSync('Esp', allExp);
                    console.log('exp+',parseInt(Reward[j] * score));
                  }
                })
                //记录灵气增长
                wx.getStorage({
                  key: 'Soul',
                  success: res => {
                    let allSoul = res.data + parseInt(Reward[j] * score);
                    wx.setStorageSync('Soul', allSoul);
                    console.log('soul+',parseInt(Reward[j] * score));
                  }
                })
                getApp().recoverRecruit();
                wx.showToast({
                  title: '收到了招募奖励！',
                  duration: 2000,
                })
                break;
              }
            }
          }
        })
        //清除一下服务器缓存防止重复申请
        wx.request({
          url: 'https://www.doremy.work/api/remove_recruit',
          method:'POST',
          data:{
            openid: wx.getStorageSync('Openid'),
            makerid: recruitList[i].makerid,
            time: 0,
          }
        })
      }
    }
    //setTimeout(() => {
      //MOLE 公共招募及特别招募的结算
    this.updateActive()
    //},2000)
  },

  methods: {
    //Logic关系
    ///////////////////////////////////////////////////////////////////////

//请求并更新显示活动列表
    updateActive(){
      //请求公共招募列表
      wx.request({
        url: 'https://www.doremy.work/api/init_recruit', // 请求路径
        method: 'POST', //请求方式
        data:{},
        success: res => {
          console.log('请求公共活动列表',res);


          //更新公共招募列表
          let newpublicList=new Array();
          let i=0;
          while(res.data.public.id[i]!="")
          {
            let pubrecruit={
              id:res.data.public.id[i],
              name: res.data.public.title[i],
              describe:res.data.public.describe[i],
              group:233,
              endtime: "24:00"
            }
            i++;
            newpublicList.push(pubrecruit);
          }
            //更新特别招募列表activitylist
            let newspecialList=new Array();
            i=0;
            while(res.data.special.id[i]!="")
            {
            let pubrecruit={
              id:res.data.special.id[i],
              name: res.data.special.title[i],
              describe:res.data.special.describe[i],
              group:13,
              endtime: "24:00"
            }
            i++;
            newspecialList.push(pubrecruit);
            }

            this.setData({
              commonlist:newpublicList,
              activitylist:newspecialList,
            })
        }
      })
    },


    //复制邀请码
    copyCode(e) {
      console.log(e);
      wx.setClipboardData({
        data: e.target.id,
      })
    },

    creatRoomButton() {
      //不能重复创建房间
      if(this.judegeId(wx.getStorageSync('Openid'))){
        wx.showToast({
          title: '有未完成的招募',
          duration: 2000,
        })
      }
      else{
      this.setData({
        modalName: 'creatRoom'
      })
    }
    },
    //创建房间
    creatRoom(e) {
      //用户填入了招募name
      if (this.data.contain.name){
        let timelength=getApp().timeswitch2(this.data.time+':00');//时间长度/s
       wx.request({
         url: 'https://www.doremy.work/api/new_room', // 请求路径
         method: 'POST', //请求方式
         data: {
           title:this.data.contain.name,
           describe:this.data.contain.describe,
           openid: wx.getStorageSync('Openid'),
           makerid: wx.getStorageSync('Openid'),
           time:timelength ,  
           url:wx.getStorageSync('AvatarUrl'),
         },
         success: res => {
           console.log('创建房间请求：',res);
           //房间创建成功
           if (res.data.openid == wx.getStorageSync('Openid')) {
             wx.showToast({
               title: '创建成功!',
               duration: 2000,
             })
             //更新缓存
             getApp().recoverRecruit();
            this.setData({
              contain: {},
              modalName: null,
              time:'01:30'
            })
           } else {
             wx.showToast({
               title: '创建失败！',
               duration: 2000,
             })
           }
         },
         fail: err => {
           console.info("get openid fail")
         } //失败
       });
      }
       else console.log('请输入番茄事件名称[弹窗]')
    },

    //加入房间按钮
    joinRoomButton() {
      this.setData({
        modalName: 'addOrder'
      })
    },

    //确认加入房间
    joinRoom() {
      this.setData({
        modalName: null
      })
      wx.request({
        url: 'https://www.doremy.work/api/add_into_recruit', // 请求路径
        method: 'POST', //请求方式
        data: {
          openid: wx.getStorageSync('Openid'),
          //openid: 'User2',
          makerid: this.data.inputVal,
        },
        success: res => {
          console.log('加入招募',res);
          if (res.data.message == 'Room is not exist.') {
            wx.showToast({
              title: '邀请码错误！',
              duration: 2000,
            })
          } else if (res.data.message == 'Add recruit failed') {
            wx.showToast({
              title: '加入失败！',
              duration: 2000,
            })
          }else if (res.data.openid == wx.getStorageSync('Openid')) {
            wx.showToast({
              title: '加入成功！',
              duration: 2000,
            })
            //从服务器更新缓存
            getApp().recoverRecruit()
          }
        },
        fail: err => {
          console.info("get openid fail")
        } //失败
      });
    },

    //判断此id是否存在recruit缓存中，存在返回true，不存在返回false
    judegeId(openid){
      var recruitlist=wx.getStorageSync('Recruit');
      for(let i=0;i<recruitlist.length;i++){
        if(recruitlist[i].makerid==openid)
          return true
      }
      return false
    },

    //判断授权，没授权就返回授权页面
    noWarrant(){
    //没授权的孩子
    if(wx.getStorageSync('warrant')==0)
    {
    //直接跳到授权页面
    wx.redirectTo({
      url: '/pages/index/index',
    })
    wx.showToast({
      title: '请授权使用',
      duration:2000,
    })
  }
    },

    //UI关系
    ///////////////////////////////////////////////////////////////////////
    /*
     * 收缩核心代码
     */
    kindToggle: function(e) {
      const id = e.currentTarget.id
      const list = this.data.list
      for (let i = 0, len = list.length; i < len; ++i) {
        if (list[i].id === id) {
          list[i].open = !list[i].open
        }
      }
      // key和value名称一样时，可以省略
      //
      // list:list=>list
      this.setData({
        list
      })
    },
    /*
     * 搜索框状态切换
     */
    showChange(e) {
      var change = false;
      this.setData({
        showchange: change
      })
      console.log(change)
    },
    /*
     *重置搜索框
     */
    searchreset() {
      var change = true;
      this.setData({
        inputVal: null,
        showchange: change
      })
    },
    /*
     *处理检索文字
     */
    inputChange(e) {

      var temp = e.detail.value
      this.setData({
        inputVal: temp
      })
    },
    resetModal() {
      var temp = null;
      var name = "contain.name";
      var describe = "contain.describe";
      var group = "contain.group";
      this.setData({
        [name]: temp,
        [describe]: temp,
        [group]: temp
      })
    },
    /*
    **设置时间
    */
    TimeChange(e) {
      this.setData({
        time: e.detail.value
      })
    },
    //------基础UI__弹窗
    inputName(e) {
      var temp = e.detail.value
      var name = "contain.name"
      this.setData({
        [name]: temp
      })
      //console.log(this.data.contain.name)
    },

    inputDes(e) {
      var temp = e.detail.value
      var describe = "contain.describe"
      //这里根据服务器要求不让描述出现空值
      if(e.detail.value=='')
        this.setData({
          [describe]:' '
        });
      else
        this.setData({
          [describe]: temp
        })
      //console.log(this.data.contain.name)
    },

    /*1.0.2
     **隐藏+弹窗
     */
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
  },
})