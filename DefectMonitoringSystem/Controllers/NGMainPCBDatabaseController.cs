using Microsoft.AspNetCore.Mvc;

namespace DefectMonitoringSystem.Controllers
{
    public class NGMainPCBDatabaseController : Controller
    {
        public IActionResult NGMain()
        {
            return View();
        }
        public IActionResult NGGraph()
        {
            return View();
        }
        public IActionResult NGProd()
        {
            return View();
        }
    }
}
