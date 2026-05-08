using Microsoft.AspNetCore.Mvc;

namespace DefectMonitoringSystem.Controllers
{
    public class EndorsementEmail : Controller
    {
        public IActionResult Email()
        {
            return View();
        }
    }
}
