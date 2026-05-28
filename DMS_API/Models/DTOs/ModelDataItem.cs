using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace DMS_API.Models.DTOs
{
    public class ModelDataItem
    {
        public string Type { get; set; }
        public string Data { get; set; }
    }

    [Table("tbl_a3db")]
    public class A3Data
    {
        [Key] public long id { get; set; }
        public string type { get; set; }
        public string data { get; set; }
    }

    [Table("tbl_minidb")]
    public class MiniData
    {
        [Key] public long id { get; set; }
        public string type { get; set; }
        public string data { get; set; }
    }

    [Table("tbl_tonerdb")]
    public class TonerData
    {
        [Key] public long id { get; set; }
        public string type { get; set; }
        public string data { get; set; }
    }

    [Table("tbl_ptouchdb")]
    public class PTouchData
    {
        [Key] public long id { get; set; }
        public string type { get; set; }
        public string data { get; set; }
    }


}
