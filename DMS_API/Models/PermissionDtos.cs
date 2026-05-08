namespace DefectMonitoringSystem.Dtos
{
    public class UpdatePermissionsDto
    {
        public List<PermissionItem> Permissions { get; set; } = new();
    }

    public class PermissionItem
    {
        public int UserId { get; set; }
        public int ModuleId { get; set; }
        public int RoleId { get; set; }
    }
    public class AddUserDto
    {
        public string? FullName { get; set; }
        public string? IdNumber { get; set; }
        public string? Adid { get; set; }
        public string? Email { get; set; }
    }

    public class EmployeeLookupResult
    {
        public string? EmpNo { get; set; }
        public string? Full_Name { get; set; }
        public string? ADID { get; set; }
        public string? Email { get; set; }
        public string? Section { get; set; }
        public string? Department { get; set; }
    }

}