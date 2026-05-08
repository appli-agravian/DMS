using Microsoft.AspNetCore.Mvc;

namespace DefectMonitoringSystem.Controllers
{
    public class UserManagementController : Controller
    {
        private readonly HttpClient _http;
        private readonly IConfiguration _config;

        public UserManagementController(IHttpClientFactory factory, IConfiguration config)
        {
            _http = factory.CreateClient("DmsApi");
            _config = config;
        }

        public IActionResult Access() => View();
        public IActionResult Reference() => View();
    }
}
