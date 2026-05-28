using System;

namespace DefectMonitoringSystem.Models.DTOs
{
    // ---- Machine In (POST) ----
    public class MachineInDto
    {
        public string Model { get; set; }
        public string Month { get; set; }
        public string ARF_NUMBER { get; set; }
        public string DefectIllustrationBase64 { get; set; }  
        public string EndorsedBy { get; set; }
        public string Line { get; set; }
        public string Process { get; set; }
        public string MachineSerial { get; set; }
        // PITX_SERIAL and PITX_LINK are not in the database, ignore them
        public string Series { get; set; }
        public string ModelCode { get; set; }
        public string ModelName { get; set; }
        public string Phenomenon { get; set; }
        public DateTime? ProdDate { get; set; }
        public DateTime? DateTimeReceived { get; set; }
        public string ReceivedBy { get; set; }
    }

    // ---- Analysis Done (Machine Return) ----
    public class AnalysisDoneDto
    {
        public string AnalyzeBy { get; set; }
        public DateTime? FinishTimestamp { get; set; }
        public string Cause { get; set; }
        public bool? FieldElectrical { get; set; }
        public bool? FieldMechanical { get; set; }
        public string HaveLotSerial { get; set; }
        public string Category { get; set; }
        public string LotSerialNo { get; set; }
        public string PartCode { get; set; }
        public string SubCategory { get; set; }
        public string Findings { get; set; }
        public string AuditDate { get; set; }   // sent as string "yyyy-MM-dd"
        public string AuditTime { get; set; }   // e.g. "HH:mm"
        public string ReturnedBy { get; set; }
    }

    // ---- Sub‑Parts Ongoing (Machine Out) ----
    public class SubPartsOngoingDto
    {
        public string AnalysedBy { get; set; }
        public DateTime? ReceivedTime { get; set; }
        public string MachineSerial { get; set; }
        public string ModelCode { get; set; }
        public string ModelName { get; set; }
        public string Phenomenon { get; set; }
        public string Cause { get; set; }
        public string Field { get; set; }
        public string Category { get; set; }
        public string LotSerialNo { get; set; }
        public string MPCBLocation { get; set; }
        public string PartCode { get; set; }
        public string SubCategory { get; set; }
        public int? Qty { get; set; }            // optional, if you add a qty column later
        public string LinestopRelated { get; set; }
        public string Findings { get; set; }
        public string AuditDate { get; set; }
        public string AuditTime { get; set; }
        public string ReturnedBy { get; set; }
        public DateTime? ReturnedDateTime { get; set; }
        public DateTime? AnalysisTime { get; set; }
    }

    // ---- Sub‑Parts Completed ----
    public class SubPartsCompletedDto
    {
        public string AnalyzedBy { get; set; }
        public string SubUnitPartName { get; set; }
        public DateTime? FinishDateTime { get; set; }
        public string Cause { get; set; }
        public string DefectCategory { get; set; }
    }

    // ---- Return to Production ----
    public class ReturnToProdDto
    {
        public DateTime? ReturnDateTime { get; set; }
        public string Remarks { get; set; }
    }
}