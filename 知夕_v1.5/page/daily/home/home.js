Component({
  options: {
    addGlobalClass: true,
  },

  lifetimes: {
    created: function() {
      //每秒更新首页数据
        setInterval(() => {
          this.setData({
            LifePoint: wx.getStorageSync('LifePoint'),
            Soul: wx.getStorageSync('Soul'),
            Level: (parseInt(wx.getStorageSync('Esp') / 100)) + 1,
            Esp: wx.getStorageSync('Esp') % 100,
            AvatarUrl: wx.getStorageSync('AvatarUrl'),
            Nickname: wx.getStorageSync('Nickname'),
            elements: wx.getStorageSync('PersonalTimer'),
          })
        }, 1000);
        
        //判断buff状态
      setTimeout(()=>{
        if (getApp().timeConvert(Math.round(new Date() / 1000), 0) == wx.getStorageSync('SoulDouble'))
        {
          this.setData({
            doubleSoul:1,
          })
          console.log("※※※魂量双倍中※※※doubleSoul=",this.data.doubleSoul);
        }
        if (getApp().timeConvert(Math.round(new Date() / 1000), 0) == wx.getStorageSync('ExpDouble'))
        {
          this.setData({
            doubleExp:1,
          })
          console.log("※※※经验双倍中※※※doubleExp=",this.data.doubleExp);
        }
    },1000);
      
    },
    // 生命周期函数
    attached: function() {
      //更新页面数据
      this.setData({
        LifePoint: wx.getStorageSync('LifePoint'),
        Soul: wx.getStorageSync('Soul'),
        Level: (parseInt(wx.getStorageSync('Esp') / 100)) + 1,
        Esp: wx.getStorageSync('Esp') % 100,
        AvatarUrl: wx.getStorageSync('AvatarUrl'),
        Nickname: wx.getStorageSync('Nickname'),
        elements: wx.getStorageSync('PersonalTimer'),
      })
    },
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    //页面显示
    show: function() {
      
    },
    //页面隐藏
    hide: function() {},
  },

  //基础数据
  ///////////////////////////////////////////////////////////////////////
  data: {
    //时间
    time: '00:45',
    //UI---颜色需求
    checkbox: 'green',
    //UI---弹窗需求
    modalName: '',
    doubleExp:0,  //双倍状态
    doubleSoul:0,
    //UI+Logic---卡片内容元素 【缓存对象】
    contain: {
      creTime: '',
      title: '',
      describe: '',
      color: '',
      icon: '',
      time: ''
    },
    //UI---卡片内容元素 【实际队列对象】
    elements: [{
      creTime: '',
      title: '基础示例',
      describe: 'example',
      color: 'cyan',
      icon: 'newsfill',
      time: '00:15'
    }],
    //UI---表单颜色选择
    Color_Chose: [{
        title: '嫣红',
        name: 'red',
        checked: false,
        color: '#e54d42'
      }, {
        title: '桔橙',
        name: 'orange',
        checked: false,
        color: '#f37b1d'
      },
      {
        title: '明黄',
        name: 'yellow',
        checked: false,
        color: '#fbbd08'
      },
      {
        title: '橄榄',
        name: 'olive',
        checked: false,
        color: '#8dc63f'
      },
      {
        title: '森绿',
        name: 'green',
        checked: false,
        color: '#39b54a'
      },
    ],
    //Logic---番茄钟列表
    Nickname: wx.getStorageSync('Nickname'),
    Soul: wx.getStorageSync('Soul'),
    AvatarUrl: wx.getStorageSync('AvatarUrl'),
    LifePoint: wx.getStorageSync('LifePoint'),
    Level: (parseInt(wx.getStorageSync('Esp') / 100)) + 1,
    Esp: wx.getStorageSync('Esp') % 100,
  },



  methods: {
    //Logic关系 
    ///////////////////////////////////////////////////////////////////////
    /*
     **[倒计时]番茄钟【创建】
     */
    modalConfirm: function(data) {
      var list = this.data.elements;
      var cretime=Date.now();
      if (this.data.contain.title)
        list.push({
          creTime:cretime.toString(),
          title: this.data.contain.title,
          describe: this.data.contain.describe,
          color: this.data.checkbox,
          icon: 'colorlens',
          time: this.data.time
        });
      else console.log('请输入番茄事件名称[弹窗]')
      this.setData({
        elements: list,
        contain: {},
        modalName: null
      })
      //本地番茄钟存入缓存
      wx.setStorage({
        key: 'PersonalTimer',
        data: this.data.elements,
      })
    },
    /*1.0.3
     **[倒计时]番茄钟【删除】
     */
    modalCandel: function(ev) {
      // do something
      var n = ev.target.dataset.index;
      console.log(n);
      var list = this.data.elements;
      list.splice(n, 1);
      this.setData({
        elements: list,
        contain: {},
        modalName: null
      })
      //本地番茄钟改动存入缓存 
      wx.setStorage({
        key: 'PersonalTimer',
        data: this.data.elements,
      }) 
    },
    /*
     **获取番茄钟创建表单的信息
     */
    setInputValue: function(e) {
      //--表格信息   console.log(e.detail.value  .message);
      //--数据缓存信息   console.log(this.data.contain.title);
      var title = "contain.title";
      var describe = "contain.describe";
      var color = "contain.color";
      this.setData({
        [title]: e.detail.value.title,
        [describe]: e.detail.value.describe,
        [color]: e.detail.value.color
      })
    },




    //UI关系 
    ///////////////////////////////////////////////////////////////////////
    /*1.0.1
     **显示+弹窗
     */
    showModal(e) {
      this.setData({
        modalName: 'creatClock'
      })
    },
    /*1.0.2
     **隐藏+弹窗
     */
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },

    /*1.0.6
     **设置时间
     */
    TimeChange(e) {
      this.setData({
        time: e.detail.value
      })
    },
    //UI
    /*1.0.7
     **设置颜色
     */
    ColorCheckbox(e) {
      let items = this.data.Color_Chose;
      let values = e.currentTarget.dataset.value;
      for (let i = 0, lenI = items.length; i < lenI; ++i) {
        if (items[i].name == values) {
          items[i].checked = true;
        } else items[i].checked = false;
      }
      this.setData({
        Color_Chose: items,
        checkbox: values
      })
    }
  }
})