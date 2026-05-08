using System.ComponentModel.DataAnnotations.Schema;

namespace DefectMonitoringSystem.Models
{
    [Table("roles")]
    public class Role
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("role_name")]
        public string RoleName { get; set; } = string.Empty;

        [Column("description")]
        public string? Description { get; set; }
    }
}
