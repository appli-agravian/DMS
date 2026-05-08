using System.ComponentModel.DataAnnotations.Schema;

namespace DefectMonitoringSystem.Models
{
    [Table("access")]
    public class Access
    {
        [Column("id")]
        public long Id { get; set; }

        [Column("full_name")]
        public string? FullName { get; set; }

        [Column("id_number")]
        public string? IdNumber { get; set; }

        [Column("adid")]
        public string? Adid { get; set; }

        [Column("email")]
        public string? Email { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        // Navigation property
        public ICollection<UserModulePermission> Permissions { get; set; } = new List<UserModulePermission>();
    }
}