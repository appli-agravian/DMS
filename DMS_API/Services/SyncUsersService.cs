using Microsoft.EntityFrameworkCore;
using System.Data.SqlClient;
using DefectMonitoringSystem.Data;          
using DefectMonitoringSystem.Models;         

namespace DefectMonitoringSystem.Services
{
    public class SyncUsersService
    {
        //private readonly AppDbContext _appDb;
        //private readonly string _emsConnectionString;

        //public SyncUsersService(AppDbContext appDb, IConfiguration config)
        //{
        //    _appDb = appDb;
        //    _emsConnectionString = config.GetConnectionString("EmsConnection");
        //}

        //public async Task SyncAsync()
        //{
        //    var emsUsers = new List<EmsEmployee>();

        //    // Fetch from EMS view
        //    using (var conn = new SqlConnection(_emsConnectionString))
        //    {
        //        await conn.OpenAsync();
        //        var cmd = new SqlCommand(
        //            "SELECT EmpNo, Full_Name, ADID, Email FROM APBIPHDB23.EMPLOYEE_DATA.dbo.tbl_EMSVIEW",
        //            conn);

        //        using (var reader = await cmd.ExecuteReaderAsync())
        //        {
        //            while (await reader.ReadAsync())
        //            {
        //                emsUsers.Add(new EmsEmployee
        //                {
        //                    EmpNo = reader["EmpNo"].ToString(),
        //                    Full_Name = reader["Full_Name"].ToString(),
        //                    ADID = reader["ADID"].ToString(),
        //                    Email = reader["Email"].ToString()
        //                });
        //            }
        //        }
        //    }

        //    // Upsert into local users table
        //    foreach (var emp in emsUsers)
        //    {
        //        var existing = await _appDb.Users
        //            .FirstOrDefaultAsync(u => u.IdNumber == emp.EmpNo);

        //        if (existing == null)
        //        {
        //            _appDb.Users.Add(new User
        //            {
        //                Members = emp.Full_Name,
        //                IdNumber = emp.EmpNo,
        //                Adid = emp.ADID,
        //                Email = emp.Email,
        //                CreatedAt = DateTime.UtcNow
        //            });
        //        }
        //        else
        //        {
        //            existing.Members = emp.Full_Name;
        //            existing.Adid = emp.ADID;
        //            existing.Email = emp.Email;
        //        }
        //    }

        //    await _appDb.SaveChangesAsync();
        //}
    }

    // Helper class for EMS data
    public class EmsEmployee
    {
        public string EmpNo { get; set; }
        public string Full_Name { get; set; }
        public string ADID { get; set; }
        public string Email { get; set; }
    }
}
