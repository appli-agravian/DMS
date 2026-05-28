using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DefectMonitoringSystem.Data;
using DefectMonitoringSystem.Models;
using DefectMonitoringSystem.Models;
using DefectMonitoringSystem.Models;
using DefectMonitoringSystem.Models.DTOs;
using System.Xml.Linq;
using DMS_API.Models.DTOs;

namespace DefectMonitoringSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InLineNgMachineApiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public InLineNgMachineApiController(AppDbContext context)
        {
            _context = context;
        }

        // ------------------------------------------------
        // 1. GET all records (for DataTable loading)
        // ------------------------------------------------
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InLineNgMachine>>> GetAll()
        {
            return await _context.InLineNgMachines
                                 .OrderByDescending(m => m.entry_number)
                                 .ToListAsync();
        }

        // ------------------------------------------------
        // 2. POST – Machine In (creates a new record)
        // ------------------------------------------------
        [HttpPost]
        public async Task<ActionResult<InLineNgMachine>> MachineIn([FromBody] MachineInDto dto)
        {
            // Auto‑generate entry_number
            int? maxEntry = await _context.InLineNgMachines
                                          .MaxAsync(m => (int?)m.entry_number);
            int newEntry = (maxEntry ?? 0) + 1;

            // Decode image if provided
            byte[]? imageBytes = null;
            if (!string.IsNullOrEmpty(dto.DefectIllustrationBase64))
            {
                var base64 = dto.DefectIllustrationBase64;
                if (base64.Contains(",")) base64 = base64.Split(',')[1]; // strip data:image/...;base64,
                imageBytes = Convert.FromBase64String(base64);
            }

            var machine = new InLineNgMachine
            {
                entry_number = newEntry,
                month = dto.Month,
                model = dto.Model,
                arf_number = dto.ARF_NUMBER,   // <-- now stored
                defect_illustration = imageBytes,  // <-- byte array
                prt_pic = dto.EndorsedBy,          // keep your mapping for now
                line = dto.Line,
                process = dto.Process,
                machine_serial = dto.MachineSerial,
                series = dto.Series,
                model_code = dto.ModelCode,
                model_name = dto.ModelName,
                phenomenon = dto.Phenomenon,
                production_date = dto.ProdDate?.Date,
                date_received = dto.DateTimeReceived?.Date,
                time_received = dto.DateTimeReceived?.TimeOfDay,
                received_by = dto.ReceivedBy,
                in_ts = dto.DateTimeReceived,
                new_or_existing = "New",
                ns_ds = "DS"
            };

            _context.InLineNgMachines.Add(machine);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = machine.id }, machine);
        }

        // ------------------------------------------------
        // 3. PUT – Machine Analysis Complete (Done Analysis)
        //    (triggered by the “Machine Return” modal)
        // ------------------------------------------------
        [HttpPut("{entryNumber}/analysis-done")]
        public async Task<IActionResult> AnalysisDone(int entryNumber, [FromBody] AnalysisDoneDto dto)
        {
            var machine = await _context.InLineNgMachines
                .FirstOrDefaultAsync(m => m.entry_number == entryNumber);

            if (machine == null) return NotFound();

            // Update analysis fields
            machine.analyzed_by = dto.AnalyzeBy;
            machine.date_finish_analysis = dto.FinishTimestamp?.Date;
            machine.time_finish_analysis = dto.FinishTimestamp?.TimeOfDay;
            machine.finish_analysis_datetime = dto.FinishTimestamp;
            machine.cause = dto.Cause;
            machine.defect_field = (dto.FieldElectrical == true ? "Electrical" : null) ??
                                   (dto.FieldMechanical == true ? "Mechanical" : null);
            machine.defect_category = dto.Category;
            machine.lot_serial_no = dto.LotSerialNo;
            machine.part_code = dto.PartCode;
            machine.sub_category = dto.SubCategory;
            machine.audit_findings = dto.Findings;
            // Audit date + time can be merged into remarks or a separate audit field – we store them in remarks for now
            machine.remarks = $"Audit Date: {dto.AuditDate:yyyy-MM-dd} Time: {dto.AuditTime}";
            machine.returned_by = dto.ReturnedBy;
            // For a fully completed analysis, you may set linestop_related, alarm, etc. later

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ------------------------------------------------
        // 4. PUT – Sub‑Unit Assembly Ongoing (Machine Out modal)
        // ------------------------------------------------

        [HttpPut("{entryNumber}/subparts-ongoing")]
        public async Task<IActionResult> SubPartsOngoing(int entryNumber, [FromBody] SubPartsOngoingDto dto)
        {
            var machine = await _context.InLineNgMachines
                .FirstOrDefaultAsync(m => m.entry_number == entryNumber);

            if (machine == null) return NotFound();

            machine.analyzed_by = dto.AnalysedBy;
            machine.date_finish_analysis = dto.ReturnedDateTime?.Date;
            machine.time_finish_analysis = dto.ReturnedDateTime?.TimeOfDay;
            machine.finish_analysis_datetime = dto.ReturnedDateTime; // preliminary finish is the return time
            machine.cause = dto.Cause;                              // ongoing cause
            machine.defect_field = dto.Field;
            machine.defect_category = dto.Category;
            machine.lot_serial_no = dto.LotSerialNo;
            machine.part_code = dto.PartCode;
            machine.sub_category = dto.SubCategory;
            machine.pcb_defect_location = dto.MPCBLocation;
            machine.quantity = dto.Qty ?? 0;
            machine.linestop_related = dto.LinestopRelated;
            machine.audit_findings = dto.Findings;
            machine.remarks = $"Audit Date: {dto.AuditDate:yyyy-MM-dd} Time: {dto.AuditTime}";
            machine.returned_by = dto.ReturnedBy;
            machine.analysis_time = dto.AnalysisTime?.ToString("yyyy-MM-dd HH:mm:ss");
            machine.remarks_2 = "Sub‑Unit Analysis Ongoing";

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ------------------------------------------------
        // 5. PUT – Sub‑Parts Analysis Completed
        // ------------------------------------------------
        [HttpPut("{entryNumber}/subparts-completed")]
        public async Task<IActionResult> SubPartsCompleted(int entryNumber, [FromBody] SubPartsCompletedDto dto)
        {
            var machine = await _context.InLineNgMachines
                .FirstOrDefaultAsync(m => m.entry_number == entryNumber);

            if (machine == null) return NotFound();

            machine.analyzed_by_2 = dto.AnalyzedBy;
            machine.sub_unit_assy_sub_part = dto.SubUnitPartName;
            machine.date_finish_analysis_2 = dto.FinishDateTime?.Date;
            machine.time_finish_analysis_2 = dto.FinishDateTime?.TimeOfDay;
            machine.finish_analysis_datetime_2 = dto.FinishDateTime;
            machine.cause_2 = dto.Cause;
            machine.defect_category_final = dto.DefectCategory;
            machine.remarks_2 = "Sub‑Parts Analysis Completed";

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ------------------------------------------------
        // 6. PUT – Return to Production
        // ------------------------------------------------
        [HttpPut("{entryNumber}/return-to-prod")]
        public async Task<IActionResult> ReturnToProd(int entryNumber, [FromBody] ReturnToProdDto dto)
        {
            var machine = await _context.InLineNgMachines
                .FirstOrDefaultAsync(m => m.entry_number == entryNumber);

            if (machine == null) return NotFound();

            machine.machine_returned_to_prod_timestamp = dto.ReturnDateTime;
            machine.remarks = dto.Remarks;   // or remarks_2 – adjust as needed

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("model-data/{model}")]
        public async Task<ActionResult<IEnumerable<ModelDataItem>>> GetModelData(string model)
        {
            List<ModelDataItem> items = model.ToLower() switch
            {
                "a3" => await _context.Set<A3Data>().Select(x => new ModelDataItem { Type = x.type, Data = x.data }).ToListAsync(),
                "mini" => await _context.Set<MiniData>().Select(x => new ModelDataItem { Type = x.type, Data = x.data }).ToListAsync(),
                "ptouch" => await _context.Set<PTouchData>().Select(x => new ModelDataItem { Type = x.type, Data = x.data }).ToListAsync(),
                "toner" => await _context.Set<TonerData>().Select(x => new ModelDataItem { Type = x.type, Data = x.data }).ToListAsync(),
                _ => new List<ModelDataItem>()
            };
            return Ok(items);
        }

        [HttpGet("next-arf/{model}/{month}")]
        public async Task<ActionResult<string>> GetNextArf(string model, string month)
        {
            string prefix = model.ToLower() switch
            {
                "a3" => "A3",
                "mini" => "MINI",
                "ptouch" => "PT",
                "toner" => "TONER",
                _ => throw new ArgumentException("Invalid model")
            };

            // Convert month name to MM
            int monthNumber = DateTime.ParseExact(month, "MMMM", System.Globalization.CultureInfo.InvariantCulture).Month;
            string yyMM = DateTime.Now.Year.ToString().Substring(2) + monthNumber.ToString("D2");

            // Find the highest existing ARF for this model and month
            string pattern = $"{prefix}-{yyMM}-";
            var existing = await _context.InLineNgMachines
                .Where(m => m.arf_number != null && m.arf_number.StartsWith(pattern))
                .Select(m => m.arf_number)
                .ToListAsync();

            int maxNum = 0;
            foreach (var arf in existing)
            {
                string numPart = arf.Substring(pattern.Length);
                if (int.TryParse(numPart, out int num) && num > maxNum)
                    maxNum = num;
            }

            string nextArf = $"{pattern}{(maxNum + 1):D4}";
            return Ok(nextArf);
        }

        [HttpGet("check-serial/{serial}")]
        public async Task<ActionResult<bool>> CheckSerial(string serial)
        {
            var exists = await _context.InLineNgMachines
                .AnyAsync(m => m.machine_serial == serial && m.machine_returned_to_prod_timestamp == null);
            return Ok(exists);
        }
    }
}