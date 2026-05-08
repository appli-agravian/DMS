using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace DMSystemWinform.Forms
{
    public partial class LoginReminder : Form
    {
        public LoginReminder()
        {
            InitializeComponent();
        }

        private void LoginReminder_Load(object sender, EventArgs e)
        {
           
        }

        private void OpenPortalBtn_Click(object sender, EventArgs e)
        {
            Process.Start(@"\\apbiphsh07\D0_ShareBrotherGroup\19_BPS\Installer\BPS Centralized Login\setup.exe");
        }

        private void LoginReminder_FormClosed(object sender, FormClosedEventArgs e)
        {
            Application.Exit();
        }
    }
}
