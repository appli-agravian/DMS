namespace DefectMonitoringSystem.Models
{
    public class LoginRequest
    {
        public int Id { get; set; }
        public string? EmpNo { get; set; }
        public string? Hostname { get; set; }
        public string? Adid { get; set; }
        public int SystemId { get; set; }
        public int SystemName { get; set; }
        public string? Status { get; set; }
    }
}
