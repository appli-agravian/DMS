using System.ComponentModel.DataAnnotations.Schema;

namespace DefectMonitoringSystem.Models
{
    [Table("modules")]
    public class Module
    {
        [Column("id")]
        public int Id { get; set; }

        [Column("module_name")]
        public string ModuleName { get; set; } = string.Empty;
    }
}
