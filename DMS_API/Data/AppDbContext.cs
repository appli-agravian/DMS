using Microsoft.EntityFrameworkCore;
using DefectMonitoringSystem.Models;

namespace DefectMonitoringSystem.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Access> Access { get; set; }
        public DbSet<Module> Modules { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserModulePermission> UserModulePermissions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure composite unique constraint
            modelBuilder.Entity<UserModulePermission>()
                .HasIndex(p => new { p.UserId, p.ModuleId })
                .IsUnique();

            // Configure relationships
            modelBuilder.Entity<UserModulePermission>()
                .HasOne(p => p.User)
                .WithMany(u => u.Permissions)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserModulePermission>()
                .HasOne(p => p.Module)
                .WithMany()
                .HasForeignKey(p => p.ModuleId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserModulePermission>()
                .HasOne(p => p.Role)
                .WithMany()
                .HasForeignKey(p => p.RoleId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}