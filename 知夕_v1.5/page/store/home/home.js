const app = getApp();
var Soul;
var Soulflag;


//商店数值
const LifePrice =30;  //回血价格
const LifeEffect=10;  //回血效果
const ExpDouble =80;  //双倍经验
const SoulDouble=20;  //双倍魂
const PiecePrice=100;  //碎片价格

//判断魂是否足够并提示
function judgeSoul(price){
  if(Soul<price){
    wx.showToast({
      title: '魂不足，无法购买',
      duration: 2000,
    })
    return false
  }
  else{
    Soul-=price;
    wx.showToast({
      title: '购买成功',
      duration: 2000,
    })
    return true
  }
}

Component({
  options: {
    addGlobalClass: true,
  },

  lifetimes: {
    //页面加载
    attached: function () {
      //保存一下进入商店时的金币
      Soul = wx.getStorageSync('Soul');
      Soulflag=Soul;
     },


    //页面卸载
    detached: function () {
      //进行金币日志记录
      wx.setStorage({
        key: 'Soul',
        data: Soul,
      })
      //有消费 进行记录
      if(Soulflag!=Soul)
      {
      //修改logs
      var week = getApp().timeConvert(Math.round(new Date() / 1000), 0);
      var todayweek = getApp().todayWeek();
      var timelogs = wx.getStorageSync('weeklogs');
      //今天的数据，继续累计
      if (timelogs[todayweek - 1].week == week) {
        timelogs[todayweek - 1].soul -= (Soulflag-Soul);
        wx.setStorageSync('weeklogs', timelogs);
      }
      //上周的数据 直接覆盖
      else {
        timelogs[todayweek - 1].week = week;
        timelogs[todayweek - 1].soul = -(Soulflag - Soul);
        wx.setStorageSync('weeklogs', timelogs);
      }
      }
     },
  },




  //基础数据
  ///////////////////////////////////////////////////////////////////////
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    TabCur: 0,
    tabNav: ['魔法药水', '灵魂碎片', '扩展计划'],
    //首页商店物品
    //魔法药水
    medicinelist: [{
      name: '博学秘药',
      price: ExpDouble,
      desc: '知识的味道使 经验获取速度 提升 100%',
      url: '(https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg)',
      },
      {
        name: '丰收秘药',
        price: SoulDouble,
        desc: '丰收的喜悦使 灵力获取速度 提升 100%',
        url: '(https://ossweb-img.qq.com/images/lol/web201310/skin/big10002.jpg)',
      },
      {
        name: '复苏之泉' + LifeEffect,
        price: LifePrice,
        desc: '苟官方的善意使 生命回复 10',
        url: '(https://s1.ax1x.com/2020/05/09/YlHg0K.jpg)',
      }
    ],
    //商店碎片物品
    chiplist: [{
      id: 1,
      name: '轩辕剑',
      price: PiecePrice,
      number:wx.getStorageSync('Piece')[0],
      desc: '由众神采首山之铜为黄帝所铸，后传与夏禹。剑身一面刻日月星辰，一面刻山川草木。剑柄一面书农耕畜养之术，一面书四海一统之策.',
      url: 'http://qbyrsunkk.bkt.clouddn.com/chip_1.png',
    },
    {
      id: 2,
      name: '盘古斧',
      price: PiecePrice,
      number:wx.getStorageSync('Piece')[1],
      desc: '此斧拥有分天地、穿梭太虚之力，威力不下轩辕剑。传言掌控盘古斧者，可掌控力量法则。能力：穿梭太虚，开天辟地。',
      url: 'http://qbyrsunkk.bkt.clouddn.com/chip_2.png',
    },
    {
      id: 3,
      name: '昊天塔',
      price: PiecePrice,
      number:wx.getStorageSync('Piece')[2],
      desc: '传说昊天塔中蕴含“混沌之力”，凡炼化这，可以成为混沌之主。能力：降服妖魔，镇压万物。',
      url: 'http://qbyrsunkk.bkt.clouddn.com/chip_3.png',
    },
    {
      id: 4,
      name: '昆仑镜',
      price: PiecePrice,
      number:wx.getStorageSync('Piece')[3],
      desc: '仙人故乡昆仑山中的昆仑天宫中，传说有一面神镜，是拥有自由穿梭时空之力。但在一次仙人的盛会中，神镜被人所偷，至今一直下落不明。。',
      url: 'http://qbyrsunkk.bkt.clouddn.com/chip_4.png',
    },
    {
      id: 5,
      name: '东皇钟',
      price: PiecePrice,
      number:wx.getStorageSync('Piece')[4],
      desc: '传闻它是天界之门，但据天山石窟中的诸神时代残留的古老文明记载：东皇钟乃十大神器之首，足以毁天灭地，吞噬诸天。',
      url: 'http://qbyrsunkk.bkt.clouddn.com/chip_5.png',
    },
    {
      id: 6,
      name: '炼妖壶',
      price: PiecePrice,
      number:wx.getStorageSync('Piece')[5],
      desc: '古称九黎壶，乃上古异宝之一。拥有不可思议的力量，据说能造就一切万物，也有惊人的毁坏力量。',
      url: 'http://qbyrsunkk.bkt.clouddn.com/chip_6.png',
    },
    {
      id: 7,
      name: '神农鼎',
      price: PiecePrice,
      number:wx.getStorageSync('Piece')[6],
      desc: '神农昔日炼制百草之古鼎，正因积聚千年来无数灵药之气，据说能炼制出天界诸神都无法轻易炼制的旷世神药，并隐藏其他神秘力量。能力：炼化神药。',
      url: 'http://qbyrsunkk.bkt.clouddn.com/chip_7.png',
    },
    {
      id: 8,
      name: '崆峒印',
      price: PiecePrice,
      number:wx.getStorageSync('Piece')[7],
      desc: '崆峒海上不死龙族守护神器，其上刻塑五方天帝形貌，并有玉龙盘绕。自古相传得到它的人就能拥有天下；也有人传说它能使人不老不死。',
      url: 'http://qbyrsunkk.bkt.clouddn.com/chip_8.png',
    },
    {
      id: 9,
      name: '伏羲琴',
      price: PiecePrice,
      number:wx.getStorageSync('Piece')[8],
      desc: '伏羲以玉石加天丝所制造出的乐器，泛着温柔的白色光芒，其琴音能使人心感到宁静祥和，上古十大神器据说有能支配万物心灵的神秘力量。',
      url: 'http://qbyrsunkk.bkt.clouddn.com/chip_9.png',
    },
    {
      id: 10,
      name: '女娲石',
      price: PiecePrice,
      number:wx.getStorageSync('Piece')[9],
      desc: '相传女娲曾经为了救自己病故的爱女，将自己万年修为贯注于一颗当年补天所剩的五彩玉石上，自此该灵石就具有特别之力。',
      url: 'http://qbyrsunkk.bkt.clouddn.com/chip_10.png',
    },
    ],
  },
  methods: {
    //Logic关系
    ///////////////////////////////////////////////////////////////////////
    /*
     *加血
     */
    medicineuse2() {
      //判断钱够不够
      if(judgeSoul(LifePrice))
      {
      var nowlife=wx.getStorageSync('LifePoint');
      //满血回复
      if(nowlife==100){
        wx.showToast({
          title: '状态满无法购买',
          duration: 2000,
        })
        Soul+=LifePrice;//退钱
      }
      //溢出回复
      else if(100-nowlife<LifeEffect){
        wx.setStorage({
          key: 'LifePoint',
          data: 100,
        });
        wx.showToast({
          title: '已回复满',
          duration: 2000,
        })
      }
      //回复
      else
      {
        wx.setStorage({
          key: 'LifePoint',
          data: nowlife+LifeEffect,
        })
        wx.showToast({
          title: '已回复',
          duration: 2000,
        })
      }
      }
    },

/*
*双倍经验
*/
    medicineuse0(){
      if(judgeSoul(ExpDouble)){
        wx.setStorage({
          key: 'ExpDouble',
          data: app.timeConvert(Math.round(new Date() / 1000), 0),
        })
      }
    },

/*
*双倍魂
*/
    medicineuse1(){
      if(judgeSoul(SoulDouble)){
        wx.setStorage({
          key: 'SoulDouble',
          data: app.timeConvert(Math.round(new Date() / 1000), 0),
        })
      }
    },
/*
*购买碎片
*/
    buyPiece(e){
      if(judgeSoul(PiecePrice)){
        //更新显示数量
        var nowPieceNumber=this.data.chiplist;
        nowPieceNumber[e.currentTarget.id].number+=1;
        this.setData({
          chiplist:nowPieceNumber,
        })
        //更新缓存数量
        var nowpiece=wx.getStorageSync('Piece');
        nowpiece[e.currentTarget.id]+=1;
        wx.setStorage({
          key: 'Piece',
          data: nowpiece,
        })
      }
    },



    //UI关系
    ///////////////////////////////////////////////////////////////////////
    /*
     *商店板块切换
     */
    tabSelect(e) {
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id - 1) * 60
      })
    }
  }
});