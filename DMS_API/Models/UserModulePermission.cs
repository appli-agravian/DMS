using System.ComponentModel.DataAnnotations.Schema;

namespace DefectMonitoringSystem.Models
{
    [Table("user_module_permissions")]
    public class UserModulePermission
    {
        [Column("id")]
        public long Id { get; set; }

        [Column("user_id")]
        public long UserId { get; set; }

        [Column("module_id")]
        public int ModuleId { get; set; }

        [Column("role_id")]
        public int RoleId { get; set; }

        [Column("granted_at")]
        public DateTime GrantedAt { get; set; } = DateTime.UtcNow;

        [Column("granted_by")]
        public string? GrantedBy { get; set; }

        // Navigation properties
        public Access User { get; set; } = null!;
        public Module Module { get; set; } = null!;
        public Role Role { get; set; } = null!;
    }
}
