using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace OrrangeTabby_0._7
{///orant://G983smS1qYPRGVm+Gkg649pKinRKST6NQx77YKMHKes=
 /// <summary>
 /// MainWindow.xaml 的交互逻辑
 /// </summary>
    public partial class Homepage : Window{
        /// <summary>
        /// Himepage
        /// 
        /// FILE
        /// LINK
        /// MOD
        /// PAGE
        /// SECERT
        /// WINDOW
        /// </summary>
        const string DEFAULTROUTE =
    "http://localhost:23344/api/upload;http://localhost:23344/api/download;http://localhost:23344/api/check";
        private static readonly string[] URL = DEFAULTROUTE.Split(';');
        public Homepage()
        {
            InitializeComponent();
        }

        //--------------------------------------------------------- 
        //FILE
        //download进度条 
        #region 文件上传下载函数  
        private int file_stage;
        private int file_size;//下载显示进度条使用
        //文件读取与加载
        //打开文件管理器（if）
        //记录文件相关信息并进行上传（file_update）
        private void file_open(object sender, EventArgs e)
        {
            Microsoft.Win32.OpenFileDialog dialog = new Microsoft.Win32.OpenFileDialog();
            dialog.Filter = "Video File(*.avi;*.mp4;*.mkv;*.wav;*.rmvb)|*.avi;*.mp4;*.mkv;*.wav;*.rmvb|All File(*.*)|*.*";
            string fileNamePath;
            string saveName;
            if (dialog.ShowDialog().GetValueOrDefault()) {
                fileNamePath = dialog.FileName;
                saveName = dialog.FileName.Substring(dialog.FileName.LastIndexOf('\\') + 1);
                App.VEDIOPATH = fileNamePath;
                if (saveName.Length + fileNamePath.Length != 0)
                    file_update(URL[0], fileNamePath, saveName, process_update);
            }

        }
        private int file_update(string address, string fileNamePath, string saveName, System.Windows.Controls.ProgressBar progressBar)
        {
            int returnValue = 0;
            FileStream fs = new FileStream(fileNamePath, FileMode.Open, FileAccess.Read);   // 要上传的文件   
            //在上一步open已经加以文件限制
            //string extension = System.IO.Path.GetExtension(fileNamePath);//扩展名 “.aspx”
            //char trimChar = '.';
            //extension.Trim(trimChar);

            BinaryReader r = new BinaryReader(fs);
            string strBoundary = "----------" + DateTime.Now.Ticks.ToString("x");    //时间戳   
            byte[] boundaryBytes = Encoding.ASCII.GetBytes("\r\n--" + strBoundary + "\r\n");     //请求头部信息   
            StringBuilder sb = new StringBuilder();
            //-----------
            //System.Windows.Forms.MessageBox.Show(saveName);
            sb.Append("--");
            sb.Append(strBoundary);
            sb.Append("\r\n");
            sb.Append("Content-Disposition: form-data; name=\"");
            sb.Append("file");
            sb.Append("\"; filename=\"");
            sb.Append(saveName);
            sb.Append("\";");
            sb.Append("\r\n");
            sb.Append("Content-Type: ");
            sb.Append("application/octet-stream");
            sb.Append("\r\n");
            sb.Append("\r\n");
            string strPostHeader = sb.ToString();
            byte[] postHeaderBytes = Encoding.UTF8.GetBytes(strPostHeader);     // 根据uri创建HttpWebRequest对象   
            HttpWebRequest httpReq = (HttpWebRequest)WebRequest.Create(new Uri(address));
            httpReq.Method = "POST";     //对发送的数据不使用缓存   
            httpReq.AllowWriteStreamBuffering = false;     //设置获得响应的超时时间（300秒）   
            httpReq.Timeout = 60000;//（修改：60s？）
            httpReq.ContentType = "multipart/form-data; boundary=" + strBoundary;
            long length = fs.Length + postHeaderBytes.Length + boundaryBytes.Length;
            long fileLength = fs.Length;
            httpReq.ContentLength = length;
            textbox_download.Text = "加载正在进行...";
            try
            {
                progressBar.Maximum = int.MaxValue;
                progressBar.Minimum = 0;
                progressBar.Value = 0;
                //每次上传4k  
                int bufferLength = 4096;
                byte[] buffer = new byte[bufferLength]; //已上传的字节数   
                long offset = 0;         //开始上传时间   
                DateTime startTime = DateTime.Now;
                int size = r.Read(buffer, 0, bufferLength);
                Stream postStream = httpReq.GetRequestStream();         //发送请求头部消息   
                postStream.Write(postHeaderBytes, 0, postHeaderBytes.Length);
                while (size > 0)
                {
                    postStream.Write(buffer, 0, size);
                    offset += size;
                    progressBar.Value = (int)(offset * (int.MaxValue / length));
                    TimeSpan span = DateTime.Now - startTime;
                    double second = span.TotalSeconds;
                    textbox_download.Text = "正在加载您的视频\t用时：" + second.ToString("F2") + "秒";
                    if (second > 0.001)
                    {
                        text_speed.Text = "平均速度：" + (offset / 1024 / second).ToString("0.00") + "KB/秒";
                    }
                    else
                    {
                        text_speed.Text = " 正在连接…";
                    }
                    System.Windows.Forms.Application.DoEvents();
                    size = r.Read(buffer, 0, bufferLength);
                }

                //添加尾部的时间戳   
                postStream.Write(boundaryBytes, 0, boundaryBytes.Length);
                postStream.Close();         
                //获取服务器端的响应   
                WebResponse webRespon = httpReq.GetResponse();
                Stream s = webRespon.GetResponseStream();
                //读取服务器端返回的消息  
                StreamReader sr = new StreamReader(s);
                String sReturnString = sr.ReadLine();
                s.Close();
                sr.Close();
                if (sReturnString == "Success")
                {
                    System.Windows.Forms.MessageBox.Show("上传成功！");
                    returnValue = 1;
                }
                else if (sReturnString == "Error")
                {
                    returnValue = 0;
                }
                //sReturnString
                //{ "name":"1606100638656907500o.mp4","unix":1606100638656907500}
                string[] divide = sReturnString.Split('"');
                link = divide[3];
                link = Encrypt(link, secret_md5);
                textbox_download.Text = "orant://" + link;
            }
            //异常跳出
            catch
            {
                System.Windows.Forms.MessageBox.Show("下载被中断");
                returnValue = 0;
            }
            finally
            {
                fs.Close();
                r.Close();
                file_stage = 1;
            }
            return returnValue;
        }
        private bool file_download(string link, int size, string path, System.Windows.Controls.ProgressBar progressBar)
        {
            
            int num = link.IndexOf('.');
            string name = link.Substring(0, num);
            string unix = link.Substring(0, num - 2);
            string mod = link.Substring(num + 1);
            progressBar.Maximum = int.MaxValue;
            progressBar.Minimum = 0;
            progressBar.Value = 0;
            try
            {
                HttpWebRequest Myrq = (System.Net.HttpWebRequest)System.Net.HttpWebRequest.Create(URL[1]);
                //发送请求并获取相应回应数据
                Myrq.Method = "POST";
                Myrq.ContentType = "application/json;charset=UTF-8";
                string jsonParam = "{\"name\":\"" + link + "\",\"unix\":" + unix + "}";
                Console.WriteLine("{0}\n", jsonParam);
                var byteData = Encoding.UTF8.GetBytes(jsonParam);
                var length = byteData.Length;
                Myrq.ContentLength = length;
                var writer = Myrq.GetRequestStream();
                writer.Write(byteData, 0, length);
                writer.Close();

                HttpWebResponse myrp = (System.Net.HttpWebResponse)Myrq.GetResponse();
                Stream st = myrp.GetResponseStream();
                Stream so = new System.IO.FileStream(path, System.IO.FileMode.Create);
                byte[] by = new byte[4096];
                int osize = st.Read(by, 0, (int)by.Length);
                long offset = 0;
                while (osize > 0)
                {
                    offset += osize;
                    so.Write(by, 0, osize);
                    osize = st.Read(by, 0, (int)by.Length);
                    progressBar.Value = (int)(offset * (int.MaxValue / size));
                }
                so.Close();
                st.Close();
                Console.WriteLine("offset:{0}-size:{1}:", offset, size);
                myrp.Close();
                Myrq.Abort();
                return true;
            }
            catch (System.Exception e)
            {
                Console.WriteLine(e);

                Console.WriteLine("Downoad OVER-----------");
                return false;
            }
        }
        #endregion 
        //--------------------------------------------------------- 
        //LINK 分享功能待完善加入qq外接好友啥的
        #region 链接生产与分析以及复制 
        public static string link = "";
        private string link_check(string adress)
        {
            string result = "";
            try
            {
                HttpWebRequest Myrq = (System.Net.HttpWebRequest)System.Net.HttpWebRequest.Create(URL[2]);
                Myrq.Method = "POST";
                Myrq.ContentType = "application/json;charset=UTF-8";
                int num = link.IndexOf('.');
                string unix = link.Substring(0, num - 2);
                string jsonParam = "{\"name\":\"" + link + "\",\"unix\":" + unix + "}";
                var byteData = Encoding.UTF8.GetBytes(jsonParam);
                var length = byteData.Length;
                Myrq.ContentLength = length;
                var writer = Myrq.GetRequestStream();
                writer.Write(byteData, 0, length);
                writer.Close();

                HttpWebResponse myrp = (System.Net.HttpWebResponse)Myrq.GetResponse();
                Stream cont = myrp.GetResponseStream();
                StreamReader sred = new StreamReader(cont, Encoding.UTF8);
                result = sred.ReadToEnd();
            }
            catch { }
            finally { Console.WriteLine(result); }
            return result;
        }
        //在“通过链接进入播放器”进入播放器时
        //读取剪切板
        int link_analysis()
        {
            System.Windows.IDataObject iData = System.Windows.Clipboard.GetDataObject();
            if (iData.GetDataPresent(System.Windows.DataFormats.Text))
            {
                link = (String)iData.GetData(System.Windows.DataFormats.Text);
            }
            if (!link.StartsWith("orant://")) return 0;
            int temp = link.LastIndexOf("orant://");
            link = link.Substring(temp + 8);
            link = Decrypt(link, secret_md5);
            string check_size = link_check(link);
            switch (check_size)
            {
                case ("Not Exist"): { return 0; }
                default: { file_size = int.Parse(check_size); break; }
            }

            int num = link.IndexOf('.');
            if (num > 0 && link.Length > 0) return 1; 
            return 0;
        }
        void link_copy(object sender, EventArgs e)
        {
            if (file_stage == 0) System.Windows.Forms.MessageBox.Show("现在可还没有链接哟");
            else
            {
                if (Math.Abs(process_update.Value - int.MaxValue) < 21000000)
                {
                    file_stage = 2;
                    //string[] temp = textbox_download.Text.Split('"');
                    //link = temp[3];
                    //link = Encrypt(link, secret_md5); 
                    System.Windows.Clipboard.SetText(textbox_download.Text);
                    System.Windows.Forms.MessageBox.Show("已复制链接到剪切板");
                }
                System.Windows.Forms.MessageBox.Show("链接正在生成");
            }
        }
        #endregion 
        //--------------------------------------------------------- 
        //MOD
        #region 模式的简单切换
        bool mod_run = false;
        void mod_monster(object sender, EventArgs e)
        {
            if (!mod_run) mod_run = !mod_run;
        }
        void mod_normal(object sender, EventArgs e)
        {
            if (mod_run) mod_run = !mod_run;
        }
        #endregion 
        //---------------------------------------------------------  
        //PAGE
        #region 页面的转换
        void page_enter(object sender, EventArgs e)
        {
            if (file_stage > 0)
            {
                if (Math.Abs(process_update.Value - int.MaxValue) < 21000000)
                {
                    file_stage = 2;
                    System.Windows.Forms.MessageBox.Show("(⊙o⊙)！");
                    page_toplay();
                }
                else
                {
                    System.Windows.Forms.MessageBox.Show("正在上传视频，请稍等"); return;
                }
            }
            else if (link_analysis() > 0)
            {
                System.Windows.Forms.MessageBox.Show("通过链接方式进入直播间");
                int size = Convert.ToInt32(file_size);

                int num = link.IndexOf('.');
                string name = link.Substring(0, num);
                string unix = link.Substring(0, num - 2);
                string mod = link.Substring(num + 1);
                string path = System.IO.Path.GetTempPath() + name + "." + mod;
                Console.WriteLine(path);
                if (File.Exists(path))
                {
                    Console.WriteLine("文件已存在");
                }
                else file_download(link, size, path, process_update);

                App.VEDIOPATH = System.IO.Path.GetTempPath() + link;
                page_toplay();
            }
            else System.Windows.Forms.MessageBox.Show("请上传视频或者复制有效链接");
           
        }
        void page_about(object sender, EventArgs e)
        {
            Console.WriteLine("To be continued ...\n");
        }
        void page_toplay() {
            App.PATH = link.Substring(3, 5);
            Window player = new Player();
            player.Show();
            Window father = GetWindow(this);
            father.Close();
        }
        #endregion
        //---------------------------------------------------------  
        //SECERT
        #region 链接的加解密
        private const string secret_md5 = "fdp3fds1sk7huger";
        private const string Iv = "abcdefghijklmnop";

        void en_aes(object sender, EventArgs e)
        {
            if (CheckKey(secret_md5)) Console.WriteLine("Key-Sucess");
            else Console.WriteLine("Key-Fail");
            if (CheckIv(Iv)) Console.WriteLine("Iv-Sucess");
            else Console.WriteLine("Iv-Fail");
        }
        void de_aes(object sender, EventArgs e)
        {
            //string con = cont.Content.ToString();
            //m_md5.Content = Decrypt(ex.Content.ToString(), secret_md5);
        }
        private static bool CheckKey(string key)
        {
            if (string.IsNullOrWhiteSpace(key))
                return false;
            if (16.Equals(key.Length) || 24.Equals(key.Length) || 32.Equals(key.Length))
                return true;
            else
                return false;
        }
        private static bool CheckIv(string iv)
        {
            if (string.IsNullOrWhiteSpace(iv))
                return false;
            if (16.Equals(iv.Length))
                return true;
            else
                return false;
        }
        public static string Encrypt(string str, string key)
        {
            Byte[] keyArray = System.Text.Encoding.UTF8.GetBytes(key);
            Byte[] toEncryptArray = System.Text.Encoding.UTF8.GetBytes(str);
            var rijndael = new System.Security.Cryptography.RijndaelManaged();
            rijndael.Key = keyArray;
            rijndael.Mode = System.Security.Cryptography.CipherMode.ECB;
            rijndael.Padding = System.Security.Cryptography.PaddingMode.PKCS7;
            rijndael.IV = System.Text.Encoding.UTF8.GetBytes(Iv);
            System.Security.Cryptography.ICryptoTransform cTransform = rijndael.CreateEncryptor();
            Byte[] resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);
            return Convert.ToBase64String(resultArray, 0, resultArray.Length);
        }
        public static string Decrypt(string str, string key)
        {
            Byte[] keyArray = System.Text.Encoding.UTF8.GetBytes(key);
            Byte[] toEncryptArray = Convert.FromBase64String(str);
            var rijndael = new System.Security.Cryptography.RijndaelManaged();
            rijndael.Key = keyArray;
            rijndael.Mode = System.Security.Cryptography.CipherMode.ECB;
            rijndael.Padding = System.Security.Cryptography.PaddingMode.PKCS7;
            rijndael.IV = System.Text.Encoding.UTF8.GetBytes(Iv);
            System.Security.Cryptography.ICryptoTransform cTransform = rijndael.CreateDecryptor();
            Byte[] resultArray = cTransform.TransformFinalBlock(toEncryptArray, 0, toEncryptArray.Length);
            return System.Text.Encoding.UTF8.GetString(resultArray);
        }
        #endregion
        //--------------------------------------------------------- 
        //WINDOW
        #region 窗口的基本功能
        public void window_move(object sender, MouseEventArgs args){
            if (args.LeftButton == MouseButtonState.Pressed) {
                this.DragMove();
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
    }
}
