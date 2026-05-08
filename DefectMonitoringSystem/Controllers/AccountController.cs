using Dapper;
using DefectMonitoringSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

public class AccountController : Controller
{
    private readonly IConfiguration _config;
    private const int DMS_SYSTEM_ID = 89; // confirm your DMS system ID

    public AccountController(IConfiguration config)
    {
        _config = config;
    }

    public async Task<IActionResult> AutoLogin()
    {
        // Get the computer name of the machine making the request
        // In a web app we use the server variable or DNS lookup
        string hostname = Environment.MachineName; // gets the SERVER name when testing locally

        // For production: get the client's hostname from the request
        // iPortal stores HOSTNAME (computer name), not IP
        string clientHostname = HttpContext.Request.Headers["X-Forwarded-Host"].FirstOrDefault()
                                ?? Environment.MachineName;

        using var conn = new SqlConnection(_config.GetConnectionString("SqlServerConnection"));

        // Match by HOSTNAME + SYSTEM ID
        // Note: column name has a space → use brackets [SYSTEM ID]
        var loginRequest = await conn.QueryFirstOrDefaultAsync<LoginRequest>(
            @"SELECT TOP 1
                ID              AS Id,
                USERNAME        AS EmpNo,
                HOSTNAME        AS Hostname,
                ADID            AS Adid,
                [SYSTEM ID]     AS SystemId,
                [SYSTEM NAME]   AS SystemName,
                STATUS          AS Status
              FROM Tbl_lOGIN_Request
              WHERE HOSTNAME = @hostname
                AND [SYSTEM ID] = @sysId
              ORDER BY ID DESC",
            new { hostname = clientHostname, sysId = DMS_SYSTEM_ID });

        if (loginRequest == null || string.IsNullOrEmpty(loginRequest.EmpNo))
            return View("NotAuthorized");

        // Fetch full employee details from tbl_EMSVIEW using EmpNo (USERNAME)
        var employee = await conn.QueryFirstOrDefaultAsync<EmsEmployee>(
            @"SELECT
                EmpNo      AS EmpNo,
                Full_Name  AS FullName,
                ADID       AS Adid,
                Email      AS Email,
                Section    AS Section,
                Department AS Department,
                Position   AS Position
              FROM tbl_EMSVIEW
              WHERE EmpNo = @empNo",
            new { empNo = loginRequest.EmpNo });

        if (employee == null)
            return View("NotAuthorized");

        HttpContext.Session.SetString("EmpNo", employee.EmpNo ?? "");
        HttpContext.Session.SetString("FullName", employee.FullName ?? "");
        HttpContext.Session.SetString("Adid", employee.Adid ?? "");
        HttpContext.Session.SetString("Email", employee.Email ?? "");
        HttpContext.Session.SetString("Section", employee.Section ?? "");
        HttpContext.Session.SetString("Department", employee.Department ?? "");
        HttpContext.Session.SetString("Position", employee.Position ?? "");

        return RedirectToAction("Dashboard", "Home");
    }

    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return RedirectToAction("AutoLogin");
    }

    public IActionResult NotAuthorized() => View();
}