using DefectMonitoringSystem.Models;
using DMS_API.Models;
using Microsoft.EntityFrameworkCore;

namespace DMS_API.Data
{
    public class SqlServerDbContext : DbContext
    {
        public SqlServerDbContext(DbContextOptions<SqlServerDbContext> options) : base(options)
        {

        }

        public DbSet<Employee> View_UserInfo { get; set; }
        //public DbSet<CasSystemApproverList> Tbl_System_Approver_list { get; set; }
        //public DbSet<LoginRequest> Tbl_LOGIN_Request { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Employee>().HasNoKey().ToView("View_UserInfo");
        }
    }
}
