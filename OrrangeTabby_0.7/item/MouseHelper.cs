using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Windows;

namespace OrrangeTabby_0._7.item
{
    class MouseHelper
    {
        public static Point Pos_mouse;
        public static int Check_count;

        public static bool CheckUsed()
        {
            Point point = GetMousePoint();
            if (point == Pos_mouse) return false;
            Pos_mouse = point;
            return true;

        }
        [StructLayout(LayoutKind.Sequential)]
        private struct Mpoint
        {
            public int X;
            public int Y;
            public Mpoint(int x, int y)
            {
                this.X = x;
                this.Y = y;
            }
        }

        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        private static extern bool GetCursorPos(out Mpoint mpt);
        public static Point GetMousePoint()
        {
            Mpoint mpt = new Mpoint();
            GetCursorPos(out mpt);
            Point p = new Point(mpt.X, mpt.Y);
            return p;
        }
    }
}
