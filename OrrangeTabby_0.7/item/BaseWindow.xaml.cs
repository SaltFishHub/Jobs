﻿using System;
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
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace OrrangeTabby_0._7.item
{
    /// <summary>
    /// BaseWindow.xaml 的交互逻辑
    /// </summary>
    public partial class BaseWindow : Window
    {
        public BaseWindow()
        {
            InitializeComponent();
        }
        public void mousemove(object sender,MouseEventArgs args) {
            this.DragMove();
        }
    }
}
