using OrrangeTabby_0._7.item;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using System.Windows.Threading;

namespace OrrangeTabby_0._7
{
    /// <summary>
    /// Player.xaml 的交互逻辑
    /// </summary>
    public partial class Player : Window
    {//orant://RDlPiMaUU9XukjMqcklXVoKNMkKOs1H6NiK1vnMsHh8=
        /// <summary>
        /// Player
        /// 
        /// 
        /// CHAT
        /// MEDIA 
        /// ELEMENT
        /// WINDOW
        /// EVENT
        /// </summary>
        private bool runing = false;
        
        //private const bool ISTEST = false;
        //orant://rr/V6zIiSbGTgsjsLrC438oeWWjEA2OT0ek0/pZzERI=
        //private double PROCESSHEIGHT;
        public Player()
        {
            InitializeComponent();
            //if (ISTEST) App.VEDIOPATH = "resource/TESTVEDIO.mp4";
            //if (ISTEST) App.VEDIOPATH = "D:\\06-RE\\[夜桜字幕组]2020年8月3D作品合集[BIG5+GB]\\GB\\1241134qishi其实.mp4";



            //PROCESSHEIGHT = Grid_process.Height;
            Element_Initial();
            FeijuSocket.InitChat(App.PATH);
            Console.WriteLine("PATH:"+App.PATH);
            //Event_thread_chat();
        }
        //--------------------------------------------------------- 
        //CHAT
        #region 用于处理弹幕模块的聊天功能
        void chat_send(object sender, EventArgs e)
        {
            string message;
            message = Textbox_chat.Text;
            if (message.Equals("")) return;
            Textbox_chat.Text = "";
            screen.AddBullet(message);
            FeijuSocket.SendChat(message);
        }
        void chat_get(string mes) {
            screen.AddBullet(mes);
        }
        #endregion
        //--------------------------------------------------------- 
        //MEDIA
        #region 播放器功能编写
        //需要一秒静置
        void Media_Play(object sender, MouseButtonEventArgs args) 
        {
            if (!MouseHelper.CheckUsed())
            {
                if (runing)
                {
                    FeijuElement.Pause();
                    Stage_play.Source = new BitmapImage(new Uri("/resource/10_play.png", UriKind.Relative));
                    Stage_play_ex.Visibility = Visibility.Visible;
                }
                else
                {
                    FeijuElement.Play();
                    Stage_play.Source = new BitmapImage(new Uri("/resource/101_stop.png", UriKind.Relative));
                    Stage_play_ex.Visibility = Visibility.Hidden;
                    hiding.Visibility = Visibility.Hidden;
                }
                runing = !runing;
            }
            else Console.WriteLine("Feifa ...\n");

        }
        //--------------------------------------------------------- 
        //MEDIA
        //作为常规高响应播放
        void Media_Must_Play(object sender, MouseButtonEventArgs args)
        {
            if (runing)
            {
                FeijuElement.Pause();
                Stage_play.Source = new BitmapImage(new Uri("/resource/10_play.png", UriKind.Relative));
                Stage_play_ex.Visibility = Visibility.Visible;
            }
            else
            {
                FeijuElement.Play();
                Stage_play.Source = new BitmapImage(new Uri("/resource/101_stop.png", UriKind.Relative));
                Stage_play_ex.Visibility = Visibility.Hidden;
                hiding.Visibility = Visibility.Hidden;
            }
            runing = !runing;
        }
        private void Media_Volume(object sender, RoutedPropertyChangedEventArgs<double> args)
        {
            FeijuElement.Volume = (double)volumeSlider.Value;
        }
        private void Media_SpeedRatio(object sender, MouseButtonEventArgs args)
        {
            FeijuElement.Pause();
            //Console.WriteLine(FeijuElement.SpeedRatio);
            FeijuElement.SpeedRatio++;
            if (FeijuElement.SpeedRatio == 3) FeijuElement.SpeedRatio = 1;
            FeijuElement.Play();
        }
        private void Media_SeekToPosition(object sender, RoutedPropertyChangedEventArgs<double> args)
        {
            int SliderValue = (int)timelineSlider.Value;
            if (runing)
            {
                FeijuElement.Pause();
                TimeSpan ts = new TimeSpan(0, 0, 0, 0, SliderValue);
                FeijuElement.Position = ts;
                FeijuElement.Play();
            }
            else {
                FeijuElement.Play(); 
                TimeSpan ts = new TimeSpan(0, 0, 0, 0, SliderValue);
                FeijuElement.Position = ts;
                FeijuElement.Pause();
            }
        }

        private void Media_share(object sender, MouseButtonEventArgs args) {
            Event_Loaded(2, 1, 1);
            Window player = new Homepage();
            player.Show();
            Window father = GetWindow(this);
            father.Close();
            //hiding.Visibility = Visibility.Hidden;
        }
        private void Media_fresh(object sender, MouseButtonEventArgs args) {
            TimeSpan ts = new TimeSpan(0, 0, 0, 0,0);
            FeijuElement.Position = ts;
            FeijuElement.Stop();
            hiding.Visibility = Visibility.Hidden;
            Event_Loaded(0, 2, 2);
            //Timer_mouse.Start();
        }
        #endregion
        //--------------------------------------------------------- 
        //ELEMENT
        #region 播放器的设置
        private void Element_Initial()
        {
            FeijuElement.Source = new Uri(App.VEDIOPATH);//, UriKind.Relative
            FeijuElement.Volume = (double)volumeSlider.Value;
            FeijuElement.Play();
        }
        private void Element_MediaOpened(object sender, EventArgs e)
        {
            timelineSlider.Maximum = FeijuElement.NaturalDuration.TimeSpan.TotalMilliseconds;
            double time = timelineSlider.Maximum;
            double time_sec, time_min;
            time_sec = (time % 60000) / 1000;
            time_min = time / 60000;
            Text_allTime.Text = time_min.ToString("00") + ":" + time_sec.ToString("00");
            FeijuElement.Pause();
            Event_Loaded(0, 0);
        }
        private void Element_MediaEnded(object sender, EventArgs e)
        {
            //视频播放完
            //0-暂停视频
            FeijuElement.Stop();
            //1-归为时间【显示/轴】
            timelineSlider.Value = 0;
            FeijuElement.Position = new TimeSpan(0, 0, 0, 0, 0);


            //时间轴
            //4组事件：鼠标检查 时间分秒 #弹幕运行 socket聊天服务【维持收 维持发】 
            //ref 为值引用
            //鼠标检查关闭-1
            //时间显示保留-2
            //聊天保留至页面结束-2
            Event_Loaded(1, 2,2);
            hiding.Visibility = Visibility.Visible;
            runing = false;
            Stage_play.Source = new BitmapImage(new Uri("/resource/10_play.png", UriKind.Relative));
            Console.WriteLine("file-Over");
        }
        #endregion

        //--------------------------------------------------------- 
        //WINDOW
        #region 窗口基本功能
        public void window_move(object sender, MouseEventArgs args)
        {
            if (args.LeftButton == MouseButtonState.Pressed)
            {
                this.DragMove();
            }
        }
        double normaltop;
        double normalleft;
        double normalwidth;
        double normalheight;
        void window_vary(object sender, EventArgs e)
        {
            if (this.WindowState == WindowState.Normal)
            {
                normaltop = this.Top;
                normalleft = this.Left;
                normalwidth = this.Width;
                normalheight = this.Height;

                double top = SystemParameters.WorkArea.Top;
                double left = SystemParameters.WorkArea.Left;
                double right = SystemParameters.PrimaryScreenWidth - SystemParameters.WorkArea.Right;
                double bottom = SystemParameters.PrimaryScreenHeight - SystemParameters.WorkArea.Bottom;
                Feiju.Margin = new Thickness(left, top, right, bottom);
                this.WindowState = WindowState.Maximized;
                windowvary.Source = new BitmapImage(new Uri("/resource/02_b_return.png", UriKind.Relative));
            }
            else
            {
                this.WindowState = WindowState.Normal;

                //必须先设置为0,在重新设值,若前后值一样,会失效 --拖动任务栏后,还原-始终显示在屏幕最左上方
                this.Top = 0;
                this.Left = 0;
                this.Width = 0;
                this.Height = 0;

                this.Top = normaltop;
                this.Left = normalleft;
                this.Width = normalwidth;
                this.Height = normalheight;
                Feiju.Margin = new Thickness(0);
                windowvary.Source = new BitmapImage(new Uri("/resource/02_a_exp.png", UriKind.Relative));
            }
        }
        void window_hide(object sender, EventArgs e)
        {
            this.WindowState = System.Windows.WindowState.Minimized;
        }
        void window_close(object sender, EventArgs e)
        {
            //var ret = System.Windows.MessageBox.Show("Are you sure to exit audit?", "Alert", MessageBoxButton.YesNo);
            //if (ret == MessageBoxResult.Yes)
            //{
            //    //DataProvider.Instance.LoginOut();
            //    //终止所有线程 
            //    Environment.Exit(Environment.ExitCode);
            //}
            Environment.Exit(Environment.ExitCode);
        }
        #endregion

        //--------------------------------------------------------- 
        //EVENT
        #region 并行异步事务
        private DispatcherTimer Timer_time = null; //用于刷新进度条
        private DispatcherTimer Timer_mouse = null;//用于鼠标
        //private DispatcherTimer Timer_socket = null;//用于
        /// <summary>
        /// 维持端口while开放
        /// static 数组信息
        /// 维持读写发送出去
        /// </summary>
        //Thread thread_chat = new Thread(FeijuSocket.KeepReceive);
        //private void Event_thread_chat(bool active=true) {
        //    if (active)
        //    {

        //        Thread thread_get = new Thread(Event_thread_getchat); 
        //        thread_chat.Start();

        //    }
        //    //暂时不在这里处理结束了

        //}
        BackgroundWorker worker = new BackgroundWorker();
        BackgroundWorker worker2 = new BackgroundWorker();
        private void Event_thread_getchat(object sender, DoWorkEventArgs e)
        {
            while (true) {
                if (FeijuSocket.mespool.Count > 0)
                {
                    chat_get((string)FeijuSocket.mespool.Dequeue());
                }
            }
        }
        private void Event_Loaded(int MOUSE=2, int TIME=2,int SOCKET=2)
        {
            Event_make(MOUSE,ref Timer_mouse,TimerMouseMoveTick,new TimeSpan(0,0,1));
            Event_make(TIME,ref Timer_time, TimerTimeProcess, new TimeSpan(0, 0, 1));
            if (SOCKET == 0)
            {
                worker.DoWork += Event_thread_getchat;
                worker2.DoWork += FeijuSocket.KeepReceive;
                worker.WorkerSupportsCancellation = true;
                worker2.WorkerSupportsCancellation = true;
                worker.RunWorkerAsync();
                worker2.RunWorkerAsync();
            }
            else if(SOCKET == 1){
                worker.CancelAsync();
                worker2.CancelAsync();
            }
        }
        private void Event_make(int Mod,ref DispatcherTimer timer,EventHandler myevent, TimeSpan timespan)
        {
            if (timer == null) {
                timer = new DispatcherTimer();
                timer.Tick += new EventHandler(myevent);
                timer.IsEnabled =false;
                timer.Interval = timespan;
            }
            if (Mod == 0)
            {
                if (timer.IsEnabled == false) {
                    timer.IsEnabled = true;
                    timer.Start();
                }
            }
            else if (Mod == 1)
            {
                timer.IsEnabled = false;
                timer.Stop();
            }
        }
        private void TimerMouseMoveTick(object o, EventArgs e)
        {
            try
            {

                if (!MouseHelper.CheckUsed())
                {
                    if(runing)MouseHelper.Check_count++;
                    if (MouseHelper.Check_count == 2)
                    {
                        MouseHelper.Check_count = 0;
                        Mouse.OverrideCursor = Cursors.None;
                        //Grid_process.Height  = PROCESSHEIGHT;
                        Grid_Operation.Visibility = Visibility.Hidden;
                        Grid_Window.Visibility = Visibility.Hidden;
                    }
                }
                else
                {
                    MouseHelper.Check_count = 0;
                    Mouse.OverrideCursor = Cursors.Arrow;
                    //Grid_process.Height = 2* PROCESSHEIGHT; 
                    Grid_Operation.Visibility = Visibility.Visible;
                    Grid_Window.Visibility = Visibility.Visible;
                }

            }
            catch
            {
                throw new NotImplementedException();
            }
        }
        private void TimerTimeProcess(object o, EventArgs e)
        {
            double time = FeijuElement.Position.TotalSeconds;
            double time_sec, time_min;
            time_sec = (time % 60);
            time_min = time / 60;
            Text_Time.Text = time_min.ToString("00") + ":" + time_sec.ToString("00");
        }
        #endregion
    }
}
