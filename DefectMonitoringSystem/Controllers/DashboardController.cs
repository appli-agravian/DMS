using Microsoft.AspNetCore.Mvc;

namespace DefectMonitoringSystem.Controllers
{
    public class DashboardController : Controller
    {
        // Static list to store records (in production, use a database)
        private static List<RecordModel> _records = new List<RecordModel>();

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult SaveRecord(RecordModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    model.Id = _records.Count + 1;
                    model.CreatedAt = DateTime.Now;
                    _records.Add(model);

                    return Json(new { success = true, message = "Record saved successfully" });
                }

                return Json(new { success = false, message = "Invalid data" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public IActionResult GetRecords()
        {
            try
            {
                var recentRecords = _records
                    .OrderByDescending(r => r.CreatedAt)
                    .Take(10)
                    .ToList();

                return Json(new { success = true, data = recentRecords });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpPost]
        public IActionResult GenerateGraph(GraphRequestModel model)
        {
            try
            {
                // Generate sample graph data
                var graphData = GenerateSampleGraphData(model);

                return Json(new { success = true, data = graphData });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        private object GenerateSampleGraphData(GraphRequestModel model)
        {
            var random = new Random();
            var labels = new List<string>();
            var data = new List<int>();

            // Generate sample data based on x-axis selection
            if (model.XAxis == "date")
            {
                labels = Enumerable.Range(1, 7).Select(d =>
                    DateTime.Now.AddDays(-d).ToString("MM/dd")).Reverse().ToList();
            }
            else if (model.XAxis == "category")
            {
                labels = new List<string> { "Category A", "Category B", "Category C", "Category D", "Category E" };
            }
            else
            {
                labels = new List<string> { "Product 1", "Product 2", "Product 3", "Product 4", "Product 5" };
            }

            data = labels.Select(l => random.Next(10, 100)).ToList();

            var datasets = new List<object>
            {
                new
                {
                    label = $"{model.YAxis} Data",
                    data = data,
                    backgroundColor = GetColorScheme(model.ColorScheme, data.Count),
                    borderColor = GetBorderColor(model.ColorScheme),
                    borderWidth = 1
                }
            };

            return new
            {
                type = model.GraphType,
                labels = labels,
                datasets = datasets,
                showLegend = model.ShowLegend,
                statistics = new
                {
                    total = data.Sum(),
                    average = data.Average().ToString("F2"),
                    max = data.Max()
                }
            };
        }

        private string[] GetColorScheme(string scheme, int count)
        {
            var colors = new Dictionary<string, string[]>
            {
                ["default"] = new[] { "rgba(54, 162, 235, 0.5)" },
                ["blue"] = new[] { "rgba(0, 123, 255, 0.5)" },
                ["green"] = new[] { "rgba(40, 167, 69, 0.5)" },
                ["red"] = new[] { "rgba(220, 53, 69, 0.5)" }
            };

            return colors.ContainsKey(scheme) ? colors[scheme] : colors["default"];
        }

        private string GetBorderColor(string scheme)
        {
            var colors = new Dictionary<string, string>
            {
                ["default"] = "rgba(54, 162, 235, 1)",
                ["blue"] = "rgba(0, 123, 255, 1)",
                ["green"] = "rgba(40, 167, 69, 1)",
                ["red"] = "rgba(220, 53, 69, 1)"
            };

            return colors.ContainsKey(scheme) ? colors[scheme] : colors["default"];
        }
    }

    // Models
    public class RecordModel
    {
        public int Id { get; set; }
        public string RecordName { get; set; }
        public string RecordType { get; set; }
        public decimal? RecordValue { get; set; }
        public DateTime? RecordDate { get; set; }
        public string RecordDescription { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class GraphRequestModel
    {
        public string GraphType { get; set; }
        public string XAxis { get; set; }
        public string YAxis { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string ColorScheme { get; set; }
        public bool ShowLegend { get; set; }
    }
}
