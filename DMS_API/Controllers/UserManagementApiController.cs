using DefectMonitoringSystem.Data;
using DefectMonitoringSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DefectMonitoringSystem.Dtos;
using Dapper;
using Microsoft.Data.SqlClient;

[Route("api/[controller]")]
[ApiController]
public class UserManagementApiController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    // FIXED: both are now properly injected and assigned
    public UserManagementApiController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpGet("modules")]
    public async Task<IActionResult> GetModules() =>
        Ok(await _context.Modules.OrderBy(m => m.Id).ToListAsync());

    [HttpGet("roles")]
    public async Task<IActionResult> GetRoles() =>
        Ok(await _context.Roles.OrderBy(r => r.Id).ToListAsync());

    [HttpGet("users")]
    public async Task<IActionResult> GetUsersWithPermissions()
    {
        // Step 1: fetch users from PostgreSQL (plain list, no dictionary in SQL)
        var users = await _context.Access
            .OrderBy(u => u.FullName)
            .Select(u => new
            {
                u.Id,
                Member = u.FullName,
                u.IdNumber,
                u.Adid,
                u.Email
            })
            .ToListAsync();

        // Step 2: fetch all permissions separately
        var permissions = await _context.UserModulePermissions
            .Select(p => new { p.UserId, p.ModuleId, p.RoleId })
            .ToListAsync();

        // Step 3: build the dictionary IN MEMORY (C#), not in SQL
        var result = users.Select(u => new
        {
            u.Id,
            u.Member,
            u.IdNumber,
            u.Adid,
            u.Email,
            Permissions = permissions
                .Where(p => p.UserId == u.Id)
                .ToDictionary(p => p.ModuleId, p => p.RoleId)
        });

        return Ok(new { data = result });
    }

    [HttpPost("update-permissions")]
    public async Task<IActionResult> UpdatePermissions([FromBody] UpdatePermissionsDto dto)
    {
        var currentUser = User.Identity?.Name ?? "system";

        foreach (var item in dto.Permissions)
        {
            var existing = await _context.UserModulePermissions
                .FirstOrDefaultAsync(p => p.UserId == item.UserId && p.ModuleId == item.ModuleId);

            if (existing == null)
            {
                _context.UserModulePermissions.Add(new UserModulePermission
                {
                    UserId = item.UserId,
                    ModuleId = item.ModuleId,
                    RoleId = item.RoleId,
                    GrantedBy = currentUser
                });
            }
            else if (existing.RoleId != item.RoleId)
            {
                existing.RoleId = item.RoleId;
                existing.GrantedBy = currentUser;
                existing.GrantedAt = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }

    // FIXED: _config is now properly assigned so this won't crash
    [HttpGet("lookup/{employeeNo}")]
    public async Task<IActionResult> LookupEmployee(string employeeNo)
    {
        // This uses MSSQL (SqlServerConnection) — correct, tbl_EMSVIEW lives there
        using var conn = new SqlConnection(_config.GetConnectionString("SqlServerConnection"));

        var result = await conn.QueryFirstOrDefaultAsync<EmployeeLookupResult>(
            @"SELECT EmpNo, Full_Name, ADID, Email, Section, Department
              FROM tbl_EMSVIEW
              WHERE EmpNo = @id",
            new { id = employeeNo });

        if (result == null)
            return NotFound(new { message = "Employee not found" });

        return Ok(result);
    }

    [HttpPost("add-user")]
    public async Task<IActionResult> AddUser([FromBody] AddUserDto dto)
    {
        var exists = await _context.Access.AnyAsync(a => a.IdNumber == dto.IdNumber);
        if (exists) return Conflict(new { message = "User already exists" });

        var user = new Access
        {
            FullName = dto.FullName,
            IdNumber = dto.IdNumber,
            Adid = dto.Adid,
            Email = dto.Email,
            CreatedAt = DateTime.UtcNow
        };

        _context.Access.Add(user);
        await _context.SaveChangesAsync();
        return Ok(new { success = true, id = user.Id });
    }

    [HttpDelete("delete-user/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Access.FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
            return NotFound(new { message = "User not found" });

        // Optional but smart: delete related permissions first
        var permissions = _context.UserModulePermissions
            .Where(p => p.UserId == id);

        _context.UserModulePermissions.RemoveRange(permissions);

        _context.Access.Remove(user);

        await _context.SaveChangesAsync();

        return Ok(new { success = true });
    }
}