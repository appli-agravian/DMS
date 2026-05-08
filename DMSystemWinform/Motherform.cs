using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq;
using System.Net.Sockets;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace DMSystemWinform
{
    public partial class Motherform : Form
    {
        // =========================
        // DATABASE CONNECTION
        // =========================
        private static readonly string centralizedLoginConnString =
            "Data Source=APBIPHBPSDB02;" +
            "Initial Catalog=Centralized_LOGIN_DB;" +
            "Persist Security Info=True;" +
            "User ID=CAS_access;" +
            "Password=@BIPH2024";

        // =========================
        // STORED VALUES
        // =========================
        public static string LocalIP { get; private set; } = "";
        public static string UserIdNumber { get; private set; } = "";

        // =========================
        // INITIALIZE SESSION
        // =========================
        public static void Initialize()
        {
            LocalIP = GetLocalIPAddress();
            UserIdNumber = GetUserFromCentralizedLogin(LocalIP);
        }

        // =========================
        // GET LOCAL IP
        // =========================
        public static string GetLocalIPAddress()
        {
            foreach (var ip in Dns.GetHostEntry(Dns.GetHostName()).AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    return ip.ToString();
                }
            }

            throw new Exception("No IPv4 address found.");
        }

        // =========================
        // GET USER FROM CENTRALIZED LOGIN
        // =========================
        public static string GetUserFromCentralizedLogin(string ipAddress)
        {
            using (SqlConnection conn = new SqlConnection(centralizedLoginConnString))
            {
                conn.Open();

                using (SqlCommand cmd = new SqlCommand("SP_SelectLoginRequestFromCentralizedLogin", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@IPAddress", ipAddress);
                    cmd.Parameters.AddWithValue("@SystemID", "73");

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return reader["USERNAME"].ToString();
                        }
                    }
                }
            }

            return "";
        }
    }
}
