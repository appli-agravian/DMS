using Microsoft.AspNetCore.Mvc;

namespace DefectMonitoringSystem.Controllers
{
    public class InLineNgMachineController : Controller
    {
        public IActionResult Database()
        {
            return View();
        }
        public IActionResult Graph()
        {
            return View();

        }
        public IActionResult OverallGraph()
        {
            return View();
        }
    }
}
