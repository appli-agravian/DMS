using DefectMonitoringSystem.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

public class BaseController : Controller
{
    public LoggedInUser? CurrentUser { get; private set; }

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        var session = context.HttpContext.Session;
        var empNo = session.GetString("EmpNo");

        if (string.IsNullOrEmpty(empNo))
        {
            context.Result = RedirectToAction("AutoLogin", "Account");
            return;
        }

        CurrentUser = new LoggedInUser
        {
            EmpNo = empNo,
            FullName = session.GetString("FullName"),
            Adid = session.GetString("Adid"),
            Email = session.GetString("Email"),
            Section = session.GetString("Section"),
            Department = session.GetString("Department"),
            Position = session.GetString("Position")
        };

        ViewBag.CurrentUser = CurrentUser;
        base.OnActionExecuting(context);
    }
}