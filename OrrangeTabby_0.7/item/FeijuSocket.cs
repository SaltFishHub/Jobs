using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Media.Media3D;

namespace OrrangeTabby_0._7.item
{
    class FeijuSocket
    {
        private static string URL_SOCKET = "ws://localhost:23344/ws/";
        private static ClientWebSocket socket;
        private static CancellationToken token;
        public static Queue mespool = new Queue();
        public static bool InitChat(string path)
        {
            socket = new ClientWebSocket();
            token = new CancellationToken();
            try
            {
                socket.ConnectAsync(new Uri(URL_SOCKET + path), new CancellationToken()).Wait();
            }
            catch
            {
                Console.WriteLine("Connect failed");
                return false;
            }
            return true;
        }
        private int CloseChat()
        {
            try
            {
                socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "肥橘再见", token);
            }
            catch { return 0; }
            return 1;
        }
        public static void SendChat(string message)
        {
            if (message.Equals("")) return;
            var bsend = new byte[4096];
            bsend = Encoding.UTF8.GetBytes(message);
            try
            {
                socket.SendAsync(new ArraySegment<byte>(bsend), System.Net.WebSockets.WebSocketMessageType.Text, true, new CancellationToken()).Wait(); //发送数据 
            }
            catch { Console.WriteLine("Error:send bug"); }
            Console.WriteLine("It's over.");
        }
        public static void KeepReceive(object sender, DoWorkEventArgs e)
        {
            var bytedata = new byte[2048];
            while (true)
            {
                try
                {
                    socket.ReceiveAsync(new ArraySegment<byte>(bytedata), new CancellationToken()).Wait();
                    string message = Encoding.UTF8.GetString(bytedata);
                    mespool.Enqueue(message);
                    bytedata = new byte[2048];
                }
                catch  { Console.WriteLine("Error: Receive break."); break; }
            }
        }
        //单条信息接收
        private void receive_onenote()
        {
            byte[] data = new byte[4096];
            socket.ReceiveAsync(new ArraySegment<byte>(data), new CancellationToken()).Wait();
            string stringData = Encoding.UTF8.GetString(data);
            if (!string.IsNullOrWhiteSpace(stringData))
            {
                Console.Write(stringData);
            }
        }
    }
}
