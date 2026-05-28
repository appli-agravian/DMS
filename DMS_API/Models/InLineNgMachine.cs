using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

[Table("tbl_inlinengmachinedb")]
public class InLineNgMachine
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int id { get; set; }
    public int? entry_number { get; set; }
    public string? model { get; set; }
    public string? month { get; set; }
    public string? arf_number { get; set; }
    public byte[]? defect_illustration { get; set; }

    [NotMapped]
    public string? defect_illustration_base64 =>
    defect_illustration != null ? Convert.ToBase64String(defect_illustration) : null;

    public string? prt_pic { get; set; }
    public string? line { get; set; }
    public string? process { get; set; }
    public string? machine_serial { get; set; }
    public string? model_code { get; set; }
    public string? model_name { get; set; }
    public string? phenomenon { get; set; }
    public DateTime? production_date { get; set; }
    public DateTime? date_received { get; set; }
    public TimeSpan? time_received { get; set; }
    public int? days_delay { get; set; }
    public string? delay_priority { get; set; }
    public string? analyzed_by { get; set; }
    public DateTime? date_finish_analysis { get; set; }
    public TimeSpan? time_finish_analysis { get; set; }
    public string? cause { get; set; }
    public string? audit_findings { get; set; }
    public DateTime? finish_analysis_datetime { get; set; }
    public string? series { get; set; }
    public string? defect_field { get; set; }
    public string? defect_category { get; set; }
    public string? lot_serial_no { get; set; }
    public string? part_code { get; set; }
    public string? cavity_number { get; set; }
    public string? received_by { get; set; }
    public string? returned_by { get; set; }
    public string? board_type { get; set; }
    public string? pcb_defect_location { get; set; }
    public string? sub_category { get; set; }
    public DateTime? in_ts { get; set; }
    public string? alarm { get; set; }                  
    public string? linestop_related { get; set; }
    public string? analysis_time { get; set; }
    public string? analysis_time_category { get; set; }
    public string? remarks { get; set; }
    public string? analyzed_by_2 { get; set; }
    public string? sub_unit_assy_sub_part { get; set; }
    public DateTime? date_finish_analysis_2 { get; set; }
    public TimeSpan? time_finish_analysis_2 { get; set; }
    public string? cause_2 { get; set; }
    public DateTime? finish_analysis_datetime_2 { get; set; }
    public DateTime? machine_returned_to_prod_timestamp { get; set; }
    public string? remarks_2 { get; set; }
    public string? new_or_existing { get; set; }
    public string? ns_ds { get; set; }
    public string? call_out_phenomenon { get; set; }
    public string? component_parts { get; set; }
    public string? mechanism_group { get; set; }
    public string? mechanism { get; set; }
    public string? connectors { get; set; }
    public string? defect_category_final { get; set; }
    public int? quantity { get; set; }
    public string? have_lot_serial { get; set; }
}