using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace OrrangeTabby_0._7.item
{
    public class Bullet
    {
        #region 委托事件
        public delegate bool RecycleYHandler(TextBlock barrage, double Y_Position);
        public event RecycleYHandler OnRecycleYhandler;
        public delegate bool RecycleBarrageHandler(TextBlock barrage);
        public event RecycleBarrageHandler OnRecycleBarrage;
        public delegate void BarrageClickHandler(TextBlock barrage);
        public event BarrageClickHandler OnBarrageClick;
        #endregion

        public TextBlock Barrage;

        public bool IsUesd { get; set; } = false;

        public double Y_Position { get; set; }

        DoubleAnimation animation;

        public Bullet(int speed)
        {
            Barrage = new TextBlock();
            Barrage.Loaded += Shoot;
            Barrage.PreviewMouseLeftButtonDown += BarrageClicked;
            animation = new DoubleAnimation(0, new TimeSpan(0, 0, 0, 0, speed));
            animation.Completed += RecycleBarrage;
            animation.CurrentTimeInvalidated += RecycleY_Position;
        }

        /// <summary>
        /// 弹幕点击事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void BarrageClicked(object sender, MouseButtonEventArgs e)
        {
            OnBarrageClick(Barrage);
        }

        /// <summary>
        /// 当弹幕加载完成后自行击发
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="args"></param>
        private void Shoot(object sender, EventArgs args)
        {
            animation.To = -Barrage.ActualWidth;
            Barrage.BeginAnimation(Canvas.LeftProperty, animation);
        }

        /// <summary>
        /// 弹幕加载完成后Y坐标回收
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void RecycleY_Position(object sender, EventArgs e)
        {
            if (OnRecycleYhandler(Barrage, Y_Position))
                animation.CurrentTimeInvalidated -= RecycleY_Position;
        }

        /// <summary>
        /// 弹幕回收
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void RecycleBarrage(object sender, EventArgs e)
        {
            Barrage.BeginAnimation(Canvas.LeftProperty, null);
            IsUesd = false;
            if (OnRecycleBarrage(Barrage))
                animation.CurrentTimeInvalidated += RecycleY_Position;
        }
    }

    /// <summary>
    /// BulletControl.xaml 的交互逻辑
    /// </summary>
    public partial class BulletControl : UserControl
    {
        public List<Bullet> bullets;
        public Dictionary<double, bool> YPositions;


        Queue<string> messlist = new Queue<string>();
        System.Windows.Forms.Timer timer;
        double screenWidth;

        public BulletControl()
        {
            InitializeComponent();
            bullets = new List<Bullet>();
            YPositions = new Dictionary<double, bool>();
            timer = new System.Windows.Forms.Timer();
            timer.Interval = Interval;
        }

        #region 私有事件
        /// <summary>
        ///此处预先加载主要是为了通过TestBullet获取字体高度
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void InitBlock_Loaded(object sender, RoutedEventArgs e)
        {
            TextBlock testBlock = sender as TextBlock;
            screenWidth = screen.ActualWidth;
            CutYPositions(screen.ActualHeight, testBlock.ActualHeight);
            timer.Tick += ReciveMess;
            timer.Start();
        }
        /// <summary>
        /// 将screenY轴根据字体高度进行区域分割
        /// </summary>
        /// <param name="screenHeight"></param>
        /// <param name="fontHeight"></param>
        private void CutYPositions(double screenHeight, double fontHeight)
        {
            for (double i = 0; i < screenHeight;)
            {
                YPositions[i] = false;
                i += fontHeight;
            }
        }

        /// <summary>
        /// 接收消息
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void ReciveMess(object sender, EventArgs e)
        {
            //timer.Stop();
            for (int i = 0; i < MaxNum; i++)
            {
                if (messlist.Count != 0)
                {
                    ReadyShoot(messlist.Dequeue());
                }
                else
                {
                    break;
                }
            }
        }

        /// <summary>
        /// 发送弹幕准备工作
        /// </summary>
        /// <param name="mess"></param>
        private void ReadyShoot(string mess)
        {
            //GetBullet
            Bullet bullet = bullets.FirstOrDefault(x => x.IsUesd == false);
            if (bullet == null)
            {
                bullet = new Bullet(Speed);
                bullets.Add(bullet);
                //RecycleBind;
                bullet.OnRecycleYhandler += RecycleYPosition;
                bullet.OnRecycleBarrage += RecycleBarrage;
                bullet.OnBarrageClick += BarrageClick;

            }
            //GetPosition
            bullet.Y_Position = YPositions.FirstOrDefault(x => x.Value == false).Key;
            YPositions[bullet.Y_Position] = true;


            //MachineBullet
            bullet.IsUesd = true;
            bullet.Barrage.Text = mess;
            screen.Children.Add(bullet.Barrage);
            bullet.Barrage.SetValue(Canvas.LeftProperty, screenWidth);
            bullet.Barrage.SetValue(Canvas.TopProperty, bullet.Y_Position);
        }
        #endregion  

        #region  绑定事件
        /// <summary>
        /// 弹幕点击事件
        /// </summary>
        /// <param name="barrage"></param>
        private void BarrageClick(TextBlock barrage)
        {

        }
        /// <summary>
        /// 弹幕已完全在屏幕中加载出来，回收当前所在行
        /// </summary>
        /// <param name="barrage"></param>
        /// <param name="YPosition"></param>
        private bool RecycleYPosition(TextBlock barrage, double YPosition)
        {
            double v = (double)barrage.GetValue(Canvas.LeftProperty);
            if (v < screenWidth - barrage.ActualWidth)
            {
                YPositions[YPosition] = false;
                return true;
            }
            return false;
        }

        /// <summary>
        ///将屏幕上的弹幕进行回收
        /// </summary>
        /// <param name="barrage"></param>
        /// <returns></returns>
        private bool RecycleBarrage(TextBlock barrage)
        {
            screen.Children.Remove(barrage);
            return true;
        }
        #endregion

        #region 属性

        #region [属性]弹幕方向
        /// <summary>
        ///弹幕方向
        /// </summary>
        public static readonly DependencyProperty DirectProperty = DependencyProperty.Register("Direct", typeof(Direct), typeof(BulletControl), new PropertyMetadata(Direct.RightTpLeft));
        public Direct Direct
        {
            get { return (Direct)GetValue(DirectProperty); }
            set { SetValue(DirectProperty, value); }
        }
        #endregion

        #region [属性]发射时间间隔
        /// <summary>
        /// 发射时间间隔
        /// </summary>
        public static readonly DependencyProperty IntervalProperty = DependencyProperty.Register("Interval", typeof(int), typeof(BulletControl), new PropertyMetadata(1000,
            (d, e) =>
            {
                BulletControl control = d as BulletControl;
                control.timer.Stop();
                control.timer.Interval = control.Interval;
                control.timer.Start();
            },
            //Internal传入单位应为毫秒级，如果传入的值小于100，则当做秒去处理成毫秒
            (d, e) =>
            {
                if ((int)e < 100)
                    return (int)e * 1000;
                else
                    return e;
            }));
        /// <summary>
        /// 发射时间间隔，传入单位应为毫秒级，如果传入的值小于100，则当做秒去处理成毫秒
        /// </summary>
        public int Interval
        {
            get { return (int)GetValue(IntervalProperty); }
            set { SetValue(IntervalProperty, value); }
        }
        #endregion

        #region [属性]每次发射最大数目
        /// <summary>
        /// 每次发射最大数目 
        /// </summary>
        public static readonly DependencyProperty MaxNumProperty = DependencyProperty.Register("MaxNum", typeof(int), typeof(BulletControl), new PropertyMetadata(3));
        public int MaxNum
        {
            get { return (int)GetValue(MaxNumProperty); }
            set { SetValue(MaxNumProperty, value); }
        }
        #endregion

        #region [属性]弹幕速度
        /// <summary>
        /// 弹幕速度
        /// </summary>
        public static readonly DependencyProperty SpeedProperty = DependencyProperty.Register("Speed", typeof(int), typeof(BulletControl), new PropertyMetadata(5000, null,
            (d, e) =>
            {
                if ((int)e < 100)
                    return (int)e * 1000;
                else
                    return e;
            }));
        /// <summary>
        /// 弹幕速度，传入单位应为毫秒级，如果传入的值小于100，则当做秒去处理成毫秒
        /// </summary>
        public int Speed
        {
            get { return (int)GetValue(SpeedProperty); }
            set { SetValue(SpeedProperty, value); }
        }
        #endregion

        #endregion

        #region 该组件唯一的公共事件,添加弹幕消息的方法
        /// <summary>
        /// 该组件唯一的公共事件,添加弹幕消息的方法
        /// </summary>
        /// <param name="mess"></param>
        public void AddBullet(string mess)
        {
            messlist.Enqueue(mess);
        }
        #endregion
    }
}
