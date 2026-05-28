const API = "https://localhost:7291/api/InLineNgMachineApi";

// ── HELPERS ────────────────────────────────────────────────────────────────
const fmtDate = d => d ? d.split('T')[0] : '';
const fmtDT = d => d ? d.replace('T', ' ').slice(0, 16) : '';
const fmtTime = d => d ? String(d).slice(0, 8) : '';
const nowLocal = () =>
    new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString().slice(0, 16);

// ── GLOBAL FUNCTION to open image modal ────────────────────────────────────
function openImageModal(base64Data) {
    document.getElementById('modalImage').src = 'data:image/jpeg;base64,' + base64Data;
    new bootstrap.Modal(document.getElementById('imageModal')).show();
}

// ── DOCUMENT READY ─────────────────────────────────────────────────────────
$(document).ready(function () {

    // ── Model dropdown → load phenomenon ─────────────────────────────────
    $('#model').on('change', function () {

        const model = $(this).val();

        $('#line, #process, #series, #modelCode, #modelName, #phenomenon, #receivedBy').html('<option value="">-- Select --</option>');

        if (!model) return;

        $.ajax({
            url: `${API}/model-data/${model}`,
            type: 'GET',
            success: function (data) {
                // Map of field -> type value in the database
                const typeMap = {
                    '#line': 'line',
                    '#process': 'process',
                    '#series': 'series',
                    '#modelCode': 'model_code',
                    '#modelName': 'model_name',
                    '#phenomenon': 'phenomenon',
                    '#receivedBy': 'de_pic'
                };

                // For each dropdown, filter the data by the matching type and populate
                Object.keys(typeMap).forEach(selector => {
                    const fieldType = typeMap[selector];
                    const options = data.filter(item => item.type === fieldType);
                    const select = $(selector);
                    select.find('option:not(:first)').remove(); // keep first "Select" option
                    options.forEach(item => {
                        select.append(`<option value="${item.data}">${item.data}</option>`);
                    });
                });
            },
            error: function () {
                console.error('Failed to load model data');
            }
        });
    });

    // ── DataTable ────────────────────────────────────────────────────────
    var table = $('#userTable').DataTable({
        dom: '<"d-flex justify-content-between align-items-center mb-2"Bf>rtip',
        buttons: [
            { extend: 'excel', text: 'Export Excel', className: 'btn btn-success btn-sm' }
        ],
        scrollX: true,
        scrollY: '60vh',
        scrollCollapse: true,
        fixedHeader: true,
        paging: true,
        pageLength: 25,
        lengthMenu: [10, 25, 50, 100],
        ordering: true,
        searching: true,
        autoWidth: false,
        language: {
            search: "Search:",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            paginate: { first: "First", last: "Last", next: "Next", previous: "Previous" },
            emptyTable: "No data available"
        },
        columnDefs: [{ targets: '_all', defaultContent: '' }],
        columns: [
            { data: 'entry_number' },
            { data: 'model' },
            { data: 'arf_number' },
            { data: 'month' },
            {
                data: 'defect_illustration_base64',
                render: function (data, type, row) {
                    if (type === 'export' || type === 'print') {
                        return data ? 'Image Available' : 'No Image';
                    }
                    if (data) {
                        return `<a href="javascript:void(0)" 
                                    class="btn btn-link btn-sm p-0 image-link" 
                                    data-image="${data}">
                                    PICTURE
                                </a>`;
                    }
                    return 'No Image';
                }
            },
            { data: 'prt_pic' },
            { data: 'line' },
            { data: 'process' },
            { data: 'machine_serial' },
            { data: 'model_code' },
            { data: 'model_name' },
            { data: 'phenomenon' },
            { data: 'production_date', render: fmtDate },
            { data: 'date_received', render: fmtDate },
            { data: 'time_received', render: fmtTime },
            { data: 'days_delay' },
            { data: 'delay_priority' },
            { data: 'analyzed_by' },
            { data: 'date_finish_analysis', render: fmtDate },
            { data: 'time_finish_analysis', render: fmtTime },
            { data: 'cause' },
            { data: 'audit_findings' },
            { data: 'finish_analysis_datetime', render: fmtDT },
            { data: 'series' },
            { data: 'defect_field' },
            { data: 'defect_category' },
            { data: 'lot_serial_no' },
            { data: 'part_code' },
            { data: 'cavity_number' },
            { data: 'received_by' },
            { data: 'returned_by' },
            { data: 'board_type' },
            { data: 'pcb_defect_location' },
            { data: 'sub_category' },
            { data: 'in_ts', render: fmtDT },
            { data: 'alarm' },
            { data: 'linestop_related' },
            { data: 'analysis_time' },
            { data: 'analysis_time_category' },
            { data: 'remarks' },
            { data: 'analyzed_by_2' },
            { data: 'sub_unit_assy_sub_part' },
            { data: 'date_finish_analysis_2', render: fmtDate },
            { data: 'time_finish_analysis_2', render: fmtTime },
            { data: 'cause_2' },
            { data: 'finish_analysis_datetime_2', render: fmtDT },
            { data: 'machine_returned_to_prod_timestamp', render: fmtDT },
            { data: 'remarks_2' },
            { data: 'new_or_existing' },
            { data: 'ns_ds' },
            { data: 'call_out_phenomenon' },
            { data: 'component_parts' },
            { data: 'mechanism_group' },
            { data: 'mechanism' },
            { data: 'connectors' },
            { data: 'defect_category_final' },
            { data: 'quantity' }
        ],



        //initComplete: function () {
        //    var col = this.api().column(1); // model column (index 1)
        //    var sel = $('<select class="form-select form-select-sm ms-2" style="width:auto">' +
        //        '<option value="">All Models</option></select>')
        //        .appendTo('.dataTables_filter')
        //        .on('change', function () {
        //            var v = $.fn.dataTable.util.escapeRegex($(this).val());
        //            col.search(v ? '^' + v + '$' : '', true, false).draw();
        //        });
        //    col.data().unique().sort().each(function (d) {
        //        if (d) sel.append('<option value="' + d + '">' + d + '</option>');
        //    });
        //}


    });

    // ── Image link click handler (delegated) ────────────────────────────
    $('#userTable tbody').on('click', '.image-link', function (e) {
        e.stopPropagation(); // prevent row click
        var imageData = $(this).data('image');
        openImageModal(imageData);
    });



    // ── Load table data ─────────────────────────────────────────────────

    function refreshModelFilter() {
        var col = table.column(1);   // column index for "model"
        var sel = $('.dataTables_filter select'); // find the existing select

        // If the select doesn't exist yet (first run), create it
        if (sel.length === 0) {
            sel = $('<select class="form-select form-select-sm ms-2" style="width:auto">' +
                '<option value="">All Models</option></select>')
                .appendTo('.dataTables_filter')
                .on('change', function () {
                    var v = $.fn.dataTable.util.escapeRegex($(this).val());
                    col.search(v ? '^' + v + '$' : '', true, false).draw();
                });
        }

        // Clear old options (keep "All Models")
        sel.find('option:not(:first)').remove();

        // Re‑populate from the current data in the column
        col.data().unique().sort().each(function (d) {
            if (d) sel.append('<option value="' + d + '">' + d + '</option>');
        });
    }

    function loadTable() {
        $.ajax({
            url: API, type: 'GET', dataType: 'json',
            success: function (data) {
                table.clear().rows.add(data).draw();
                refreshModelFilter();   // <-- update the dropdown now
            },
            error: function () { console.error('Failed to load table data'); }
        });
    }
    loadTable();

    // ── Auto-generate ARF ───────────────────────────────────────────────
    function generateArf() {
        const model = $('#model').val();
        const month = $('#month').val();
        if (model && month) {
            $.ajax({
                url: `${API}/next-arf/${model}/${month}`,
                type: 'GET',
                success: function (arfNumber) {
                    $('#arfnumber').val(arfNumber);
                },
                error: function () {
                    console.error('Failed to generate ARF');
                }
            });
        }
    }

    $('#model, #month').on('change', generateArf);

    // ── MACHINE SERIAL – barcode scan + duplicate check ──────────────────
    //const $serialInput = $('#machineSerial');

    //// 1. Handle Enter key from barcode scanner (prevent form submission)
    //$serialInput.on('keydown', function (e) {
    //    if (e.key === 'Enter') {
    //        e.preventDefault();          // stop the form from submitting
    //        $(this).trigger('change');   // force validation
    //        $(this).blur();              // dismiss keyboard on mobile devices
    //    }
    //});

    //// 2. Check for duplicates when the value changes
    ////$serialInput.on('change', function () {
    ////    const serial = $(this).val().trim().toUpperCase();
    ////    if (!serial) {
    ////        // Clear error state if empty
    ////        $(this).removeClass('is-invalid');
    ////        return;
    ////    }

    //$serialInput.on('change', function () {
    //    const serial = $(this).val().trim();
    //    if (!serial) return;

    //    $.get(`${API}/check-serial/${encodeURIComponent(serial)}`, function (exists) {
    //        if (exists) {
    //            Swal.fire({ ...same error ... });
    //            $serialInput.addClass('is-invalid').val('').focus();
    //        } else {
    //            $serialInput.removeClass('is-invalid');
    //        }
    //    });
    //});

    //    // Search in the current table data for an active duplicate
    //    const allData = table.data().toArray();
    //    const duplicate = allData.find(row =>
    //        row.machine_serial &&
    //        row.machine_serial.toUpperCase() === serial &&
    //        !row.machine_returned_to_prod_timestamp   // only active machines
    //    );

    //    if (duplicate) {
    //        // Show SweetAlert error and mark field invalid
    //        Swal.fire({
    //            icon: 'error',
    //            title: 'Duplicate Machine Serial',
    //            text: `Machine Serial "${serial}" is already in the system and has not been returned.`,
    //            confirmButtonColor: '#d33'
    //        });
    //        $(this).addClass('is-invalid');
    //        $(this).val('');     // clear the invalid serial
    //        $(this).focus();
    //    } else {
    //        $(this).removeClass('is-invalid');
    //        // Optional: add a subtle success style if desired
    //        // $(this).addClass('is-valid');
    //    }
    //});

    //// 3. Clear duplicate error when user starts typing again
    //$serialInput.on('input', function () {
    //    $(this).removeClass('is-invalid');
    //});

    // ── MACHINE SERIAL – barcode scan + duplicate check ──────────────────
    const $serialInput = $('#machineSerial');

    // 1. Handle Enter key from barcode scanner (prevent form submission)
    $serialInput.on('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            $(this).trigger('change');
            $(this).blur();
        }
    });

    // 2. Check for duplicates via API (server‑side)
    $serialInput.on('change', function () {
        const serial = $(this).val().trim();
        if (!serial) {
            $(this).removeClass('is-invalid');
            return;
        }

        $.get(`${API}/check-serial/${encodeURIComponent(serial)}`, function (exists) {
            if (exists) {
                Swal.fire({
                    icon: 'error',
                    title: 'Duplicate Machine Serial',
                    text: `Machine Serial "${serial}" is already in the system and has not been returned.`,
                    confirmButtonColor: '#d33'
                });
                $serialInput.addClass('is-invalid').val('').focus();
            } else {
                $serialInput.removeClass('is-invalid');
            }
        });
    });

    // 3. Clear duplicate error when user starts typing again
    $serialInput.on('input', function () {
        $(this).removeClass('is-invalid');
    });

    // ══════════════════════════════════════════════════════════════════════
    // MACHINE IN
    // ══════════════════════════════════════════════════════════════════════
    $('#btnMachineIn').on('click', function () {
        // Reset the form completely
        const form = document.getElementById('machineInForm');
        form.reset();
        form.classList.remove('was-validated');
        // Re‑apply default dates
        $('#prodDate').val(new Date().toISOString().split('T')[0]);
        $('#dateTime').val(nowLocal());
        // Set current month
        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
        $('#month').val(currentMonth);
        // Clear the file preview (if any)
        $('#filePreview').html('');
        // Show the modal
        new bootstrap.Modal(document.getElementById('MachineIn')).show();
    });

    // Form submit – validates then saves
    $('#machineInForm').on('submit', function (e) {
        e.preventDefault();                     // Stop normal form submission
        const form = this;

        // Bootstrap validation styling
        form.classList.add('was-validated');

        // Check HTML5 validity (required fields, etc.)
        if (!form.checkValidity()) {
            Swal.fire({
                icon: 'warning',
                title: 'Incomplete Form',
                text: 'Please fill in all required fields.',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        // Additional file validation (in case browser misses it)
        const fileInput = document.getElementById('uploadedFile');
        if (fileInput.files.length === 0) {
            $('#uploadedFile').addClass('is-invalid');
            Swal.fire({
                icon: 'warning',
                title: 'Missing Illustration',
                text: 'Please upload the defect illustration.',
                confirmButtonColor: '#3085d6'
            });
            return;
        }
        $('#uploadedFile').removeClass('is-invalid');

        // Read the file and proceed with AJAX save
        const reader = new FileReader();
        reader.onload = function (ev) {
            doSaveMachineIn(ev.target.result);
        };
        reader.readAsDataURL(fileInput.files[0]);
    });

    function doSaveMachineIn(defectImageBase64) {
        const payload = {
            Model: $('#model').val(),
            Month: $('#month').val(),
            ARF_NUMBER: $('#arfnumber').val(),
            DefectIllustrationBase64: defectImageBase64,
            EndorsedBy: $('#endorsedBy').val(),
            Line: $('#line').val(),
            Process: $('#process').val(),
            MachineSerial: $('#machineSerial').val(),
            Series: $('#series').val(),
            ModelCode: $('#modelCode').val(),
            ModelName: $('#modelName').val(),
            Phenomenon: $('#phenomenon').val(),
            ProdDate: $('#prodDate').val() || null,
            DateTimeReceived: $('#dateTime').val() || null,
            ReceivedBy: $('#receivedBy').val()
        };

        $.ajax({
            url: API,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function () {
                // SweetAlert success popup
                Swal.fire({
                    icon: 'success',
                    title: 'Machine In Saved',
                    text: 'The record has been added successfully.',
                    timer: 2000,
                    showConfirmButton: false
                });
                bootstrap.Modal.getInstance(document.getElementById('MachineIn')).hide();
                // Reset form after successful save
                document.getElementById('machineInForm').reset();
                document.getElementById('machineInForm').classList.remove('was-validated');
                $('#filePreview').html('');
                loadTable();
            },
            error: function (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Save Failed',
                    text: err.responseText || 'An unexpected error occurred.',
                    confirmButtonColor: '#d33'
                });
            }
        });
    }

    // ══════════════════════════════════════════════════════════════════════
    // FINISH ANALYSIS — SELECTION PROMPT
    // ══════════════════════════════════════════════════════════════════════
    $('#btnFinishAnalysis').on('click', function () {
        $("input[name='analysisOption']").prop('checked', false);
        new bootstrap.Modal(document.getElementById('modalSelect')).show();
    });

    //$("input[name='analysisOption']").on('change', function () {
    //    const val = $(this).val();
    //    const el = document.getElementById('modalSelect');
    //    el.addEventListener('hidden.bs.modal', function handler() {
    //        el.removeEventListener('hidden.bs.modal', handler);
    //        if (val === 'done') {
    //            resetMachineReturnForm();
    //            new bootstrap.Modal(document.getElementById('modalMachineReturn')).show();
    //        } else if (val === 'subunit') {
    //            resetMachineOutForm();
    //            new bootstrap.Modal(document.getElementById('modalMachineOut')).show();
    //        }
    //    });
    //    bootstrap.Modal.getInstance(el).hide();
    //});

    //$("input[name='analysisOption']").on('change', function () {
    //    const val = $(this).val();
    //    const el = document.getElementById('modalSelect');
    //    el.addEventListener('hidden.bs.modal', function handler() {
    //        el.removeEventListener('hidden.bs.modal', handler);
    //        if (val === 'done') {
    //            new bootstrap.Modal(document.getElementById('modalMachineOut')).show();
    //        } else if (val === 'subunit') {
    //            new bootstrap.Modal(document.getElementById('modalMachineReturn')).show();
    //        }
    //    });
    //    bootstrap.Modal.getInstance(el).hide();
    //});

    $("input[name='analysisOption']").on('change', function () {
        const val = $(this).val();
        const el = document.getElementById('modalSelect');
        el.addEventListener('hidden.bs.modal', function handler() {
            el.removeEventListener('hidden.bs.modal', handler);
            if (val === 'done') {
                new bootstrap.Modal(document.getElementById('modalMachineOut')).show();
            } else if (val === 'subunit') {
                new bootstrap.Modal(document.getElementById('modalMachineReturn')).show();
            }
        });
        bootstrap.Modal.getInstance(el).hide();
    });

    //function resetMachineReturnForm() {
    //    $('#modalMachineReturn input, #modalMachineReturn select').val('');
    //    $("input[name='mr_haveLotSerial']").prop('checked', false);
    //    $('#mr_fieldElectrical, #mr_fieldMechanical').prop('checked', false);
    //    $('#mr_receivedTimestamp, #mr_finishTimestamp').val(nowLocal());
    //}

    //function resetMachineOutForm() {
    //    $('#modalMachineOut input, #modalMachineOut select').val('');
    //    $("input[name='mo_haveLotSerial'], input[name='mo_linestop'], input[name='mo_field']").prop('checked', false);
    //    $('#mo_receivedTime, #mo_returnedDateTime, #mo_analysisTime').val(nowLocal());
    //}

    //// ══════════════════════════════════════════════════════════════════════
    //// MACHINE RETURN (Done Analysis)
    //// ══════════════════════════════════════════════════════════════════════
    //$('#btnSaveMachineReturn').on('click', function () {
    //    const entryNumber = $('#mr_machineSerial').val().trim();
    //    if (!entryNumber) { alert('Please enter the Machine Serial / Entry Number.'); return; }

    //    const payload = {
    //        AnalyzeBy: $('#mr_analyzeBy').val(),
    //        FinishTimestamp: $('#mr_finishTimestamp').val() || null,
    //        Cause: $('#mr_cause').val(),
    //        FieldElectrical: $('#mr_fieldElectrical').is(':checked'),
    //        FieldMechanical: $('#mr_fieldMechanical').is(':checked'),
    //        Category: $('#mr_category').val(),
    //        LotSerialNo: $('#mr_lotSerialNumber').val(),
    //        PartCode: $('#mr_partCode').val(),
    //        SubCategory: $('#mr_subCategory').val(),
    //        Findings: $('#mr_findings').val(),
    //        AuditDate: $('#mr_auditDate').val(),
    //        AuditTime: $('#mr_auditTime').val(),
    //        ReturnedBy: $('#mr_returnedBy').val()
    //    };

    //    $.ajax({
    //        url: API + '/' + encodeURIComponent(entryNumber) + '/analysis-done',
    //        type: 'PUT', contentType: 'application/json',
    //        data: JSON.stringify(payload),
    //        success: function () {
    //            bootstrap.Modal.getInstance(document.getElementById('modalMachineReturn')).hide();
    //            loadTable();
    //        },
    //        error: function (err) { alert('Error saving analysis:\n' + err.responseText); }
    //    });
//});

    // ══════════════════════════════════════════════════════════════════════
    // MACHINE FOR RETURN (Done Analysis) – auto‑fill + save
    // ══════════════════════════════════════════════════════════════════════

    function loadReturnModelData(model) {
        if (!model) return;

        $.get(`${API}/model-data/${model}`)
            .done(function (data) {
                // Map selects to their type values
                const typeMap = {
                    '#mr_analyzeBy': 'de_pic',
                    '#mr_returnedBy': 'de_pic',
                    '#mr_category': 'category'   // make sure your DB has type 'category'
                };

                Object.keys(typeMap).forEach(selector => {
                    const fieldType = typeMap[selector];
                    const options = data.filter(item => item.type === fieldType);
                    const select = $(selector);
                    select.find('option:not(:first)').remove();
                    options.forEach(item => {
                        select.append(`<option value="${item.data}">${item.data}</option>`);
                    });
                });
            })
            .fail(function () {
                console.error('Failed to load model data for return modal');
            });
    }

    // Reset Machine Out modal on open
    $('#modalMachineOut').on('show.bs.modal', function () {
        $(this).find('input, select').val('');
        $(this).find('input[type="checkbox"]').prop('checked', false);
        $(this).find('input[type="radio"]').prop('checked', false);
        // Set default timestamps
        $('#mo_receivedTime, #mo_returnedDateTime, #mo_analysisTime').val(nowLocal());
    });

// When the modal opens, reset and set timestamps
    $('#modalMachineReturn').on('show.bs.modal', function () {
        // Clear all fields
        $(this).find('input, select').val('');
        $(this).find('input[type="checkbox"]').prop('checked', false);
        $(this).find('input[type="radio"]').prop('checked', false);
        // Set default timestamps
        $('#mr_receivedTimestamp, #mr_finishTimestamp').val(nowLocal());
    });

    // ── Auto‑fill when machine serial is entered/scanned ────────────────

    //$('#mr_machineSerial').on('change', function () {
    //    const serial = $(this).val().trim().toUpperCase();
    //    if (!serial) return;

    //    // Look for the record in the existing DataTable data
    //    const allData = table.data().toArray();
    //    const match = allData.find(r => r.machine_serial && r.machine_serial.toUpperCase() === serial);

    //    if (match) {
    //        // Fill the read‑only fields
    //        $('#mr_model').val(match.model || '');
    //        loadReturnModelData(match.model);
    //        $('#mr_phenomenon').val(match.phenomenon || '');
    //        $('#mr_receivedTimestamp').val(
    //            match.in_ts ? fmtDT(match.in_ts) : nowLocal()
    //        );
    //        $('#mr_line').val(match.line || '');
    //        $('#mr_process').val(match.process || '');
    //        $('#mr_modelCode').val(match.model_code || '');
    //        $('#mr_modelName').val(match.model_name || '');
    //        // (You could pre‑fill other fields if needed, but these are the core ones)

    //        // Store entry_number on the field so we can use it later
    //        $(this).data('entryNumber', match.entry_number);
    //        $(this).removeClass('is-invalid');
    //    } else {
    //        Swal.fire({
    //            icon: 'error',
    //            title: 'Not Found',
    //            text: `Machine Serial "${serial}" is not in the database.`,
    //            confirmButtonColor: '#d33'
    //        });
    //        $(this).addClass('is-invalid');
    //        $(this).val('');
    //        $(this).data('entryNumber', null);
    //        // Clear all auto‑filled fields
    //        $('#mr_phenomenon, #mr_receivedTimestamp, #mr_line, #mr_process, #mr_modelCode, #mr_modelName').val('');
    //    }
    //});

    //$('#machineSerial').on('input', function () {
    //    $(this).removeClass('is-invalid');
    //    if ($(this).val().trim().length === 14) {
    //        $(this).trigger('change'); // fire duplicate check immediately
    //    }
    //});

    // ── Machine Out: serial scan auto-fill ──────────────────────────────────
    $('#mo_machineSerial').on('change', function () {
        const serial = $(this).val().trim().toUpperCase();
        if (!serial) return;
        const match = table.data().toArray()
            .find(r => r.machine_serial && r.machine_serial.toUpperCase() === serial);
        if (match) {
            $('#mo_receivedTime').val(match.in_ts ? fmtDT(match.in_ts) : nowLocal());
            $('#mo_modelCode').val(match.model_code || '');
            $('#mo_modelName').val(match.model_name || '');
            $('#mo_phenomenon').val(match.phenomenon || '');
            $('#mo_analysedBy').val(match.analyzed_by || '');
            $('#mo_cause').val(match.cause || '');
            $('#mo_category').val(match.defect_category || '');
            // Field radios
            if (match.defect_field === 'Electrical') $('#mo_fieldElectrical').prop('checked', true);
            else if (match.defect_field === 'Mechanical') $('#mo_fieldMechanical').prop('checked', true);
            $(this).data('entryNumber', match.entry_number);
            $(this).removeClass('is-invalid');
        } else {
            Swal.fire({
                icon: 'error', title: 'Not Found',
                text: `Machine Serial "${serial}" is not in the database.`,
                confirmButtonColor: '#d33'
            });
            $(this).addClass('is-invalid').val('');
            $(this).data('entryNumber', null);
        }
    });
    $('#mo_machineSerial').on('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); $(this).trigger('change'); $(this).blur(); }
    });
    $('#mo_machineSerial').on('input', function () {
        $(this).removeClass('is-invalid');
        if ($(this).val().trim().length === 14) $(this).trigger('change');
    });

    // ── Save button: PUT to /api/.../{entryNumber}/analysis-done ────────
    $('#btnSaveMachineReturn').on('click', function () {
        const entryNumber = $('#mr_machineSerial').data('entryNumber');
        if (!entryNumber) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Data',
                text: 'Please scan/enter a valid Machine Serial first.',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        const payload = {
            AnalyzeBy: $('#mr_analyzeBy').val(),
            FinishTimestamp: $('#mr_finishTimestamp').val() || null,
            Cause: $('#mr_cause').val(),
            FieldElectrical: $('#mr_fieldElectrical').is(':checked'),
            FieldMechanical: $('#mr_fieldMechanical').is(':checked'),
            HaveLotSerial: $("input[name='mr_haveLotSerial']:checked").val() || null,
            Category: $('#mr_category').val(),
            LotSerialNo: $('#mr_lotSerialNumber').val(),
            PartCode: $('#mr_partCode').val(),
            SubCategory: $('#mr_subCategory').val(),
            Findings: $('#mr_findings').val(),
            AuditDate: $('#mr_auditDate').val(),
            AuditTime: $('#mr_auditTime').val(),
            ReturnedBy: $('#mr_returnedBy').val()
        };

        $.ajax({
            url: `${API}/${entryNumber}/analysis-done`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Analysis Saved',
                    timer: 1500,
                    showConfirmButton: false
                });
                bootstrap.Modal.getInstance(document.getElementById('modalMachineReturn')).hide();
                loadTable();
            },
            error: function (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Save Failed',
                    text: err.responseText || 'Unexpected error.',
                    confirmButtonColor: '#d33'
                });
            }
        });
    });

    // ══════════════════════════════════════════════════════════════════════
    // MACHINE OUT (Sub-Unit Assembly Ongoing)
    // ══════════════════════════════════════════════════════════════════════
    $('#btnSaveMachineOut').on('click', function () {
        const entryNumber = $('#mo_machineSerial').data('entryNumber');
        if (!entryNumber) {
            Swal.fire({
                icon: 'warning', title: 'Missing Data',
                text: 'Please scan or enter a valid Machine Serial first.',
                confirmButtonColor: '#3085d6'
            });
            return;
        }
        const cause = $('#mo_cause').val().trim();
        const analysedBy = $('#mo_analysedBy').val().trim();
        if (!cause || !analysedBy) {
            Swal.fire({
                icon: 'warning', title: 'Incomplete',
                text: 'Cause and Analysed By are required.',
                confirmButtonColor: '#3085d6'
            });
            return;
        }
        const payload = {
            AnalysedBy: analysedBy,
            ReceivedTime: $('#mo_receivedTime').val() || null,
            MachineSerial: $('#mo_machineSerial').val(),
            ModelCode: $('#mo_modelCode').val(),
            ModelName: $('#mo_modelName').val(),
            Phenomenon: $('#mo_phenomenon').val(),
            Cause: cause,
            Field: $("input[name='mo_field']:checked").val() || null,
            Category: $('#mo_category').val(),
            HaveLotSerial: $("input[name='mo_haveLotSerial']:checked").val() || null,
            MPCBLocation: $('#mo_mpcbLocation').val(),
            LotSerialNo: $('#mo_lotSerialNumber').val(),
            PartCode: $('#mo_partCode').val(),
            SubCategory: $('#mo_subCategory').val(),
            Qty: parseInt($('#mo_qty').val()) || null,
            InlineCheck: $('#mo_inlineCheck').val() || null,
            Process: $('#mo_process').val(),
            Findings: $('#mo_findings').val(),
            AuditDate: $('#mo_auditDate').val() || null,
            AuditTime: $('#mo_auditTime').val() || null,
            LinestopRelated: $("input[name='mo_linestop']:checked").val() || null,
            ReturnedBy: $('#mo_returnedBy').val(),
            ReturnedDateTime: $('#mo_returnedDateTime').val() || null,
            AnalysisTime: $('#mo_analysisTime').val() || null
        };
        $.ajax({
            url: `${API}/${entryNumber}/subparts-ongoing`,
            type: 'PUT', contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function () {
                Swal.fire({ icon: 'success', title: 'Saved', timer: 1500, showConfirmButton: false });
                bootstrap.Modal.getInstance(document.getElementById('modalMachineOut')).hide();
                loadTable();
            },
            error: function (err) {
                Swal.fire({
                    icon: 'error', title: 'Save Failed',
                    text: err.responseText || 'Unexpected error.', confirmButtonColor: '#d33'
                });
            }
        });
    });

    // ══════════════════════════════════════════════════════════════════════
    // RETURN TO PRODUCTION
    // ══════════════════════════════════════════════════════════════════════
    $('#returnMachineSerial').on('change', function () {
        const serial = $(this).val().trim().toUpperCase();
        if (!serial) return;
        const allData = table.data().toArray();
        const match = allData.find(r => r.machine_serial &&
            r.machine_serial.toUpperCase() === serial);
        if (match) {
            $('#returnPhenomenon').val(match.phenomenon || '');
            $('#returnModelCode').val(match.model_code || '');
            $('#returnModelName').val(match.model_name || '');
            $('#returnCause').val(match.cause || match.cause_2 || '');
            $('#returnField').val(match.defect_field || '');
            $('#returnCategory').val(match.defect_category || '');
            // Guard: already returned
            if (match.machine_returned_to_prod_timestamp) {
                Swal.fire({
                    icon: 'warning', title: 'Already Returned',
                    text: `Machine "${serial}" was already returned on ${fmtDT(match.machine_returned_to_prod_timestamp)}.`,
                    confirmButtonColor: '#3085d6'
                });
            }
            $(this).removeClass('is-invalid');
        } else {
            Swal.fire({
                icon: 'error', title: 'Not Found',
                text: `Machine Serial "${serial}" not found.`, confirmButtonColor: '#d33'
            });
            $(this).addClass('is-invalid').val('');
            $('#returnPhenomenon, #returnModelCode, #returnModelName, #returnCause, #returnField, #returnCategory').val('');
        }
    });
    $('#returnMachineSerial').on('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); $(this).trigger('change'); $(this).blur(); }
    });
    $('#returnMachineSerial').on('input', function () {
        $(this).removeClass('is-invalid');
        if ($(this).val().trim().length === 14) $(this).trigger('change');
    });

    //$('#btnUpdateReturn').on('click', function () {
    //    const serial = $('#returnMachineSerial').val().trim();
    //    if (!serial) { alert('Please scan or enter a Machine Serial.'); return; }

    //    const allData = table.data().toArray();
    //    const match = allData.find(r => r.machine_serial === serial);
    //    if (!match) { alert('Machine Serial not found.'); return; }

    //    const payload = {
    //        ReturnDateTime: $('#returnDateTime').val() || null,
    //        Remarks: 'Returned to Production'
    //    };

    //    // ── Already returned? ──
    //    if (match.machine_returned_to_prod_timestamp) {
    //        Swal.fire({
    //            icon: 'error',
    //            title: 'Already Returned',
    //            text: `Machine "${serial}" was returned on ${fmtDT(match.machine_returned_to_prod_timestamp)}.`,
    //            confirmButtonColor: '#d33'
    //        });
    //        return;
    //    }

    //    $.ajax({
    //        url: API + '/' + match.entry_number + '/return-to-prod',
    //        type: 'PUT', contentType: 'application/json',
    //        data: JSON.stringify(payload),
    //        success: function () {
    //            bootstrap.Modal.getInstance(document.getElementById('ReturnToProd')).hide();
    //            loadTable();
    //        },
    //        error: function (err) { alert('Error updating return:\n' + err.responseText); }
    //    });
    //});

    $('#btnUpdateReturn').on('click', function () {
        const serial = $('#returnMachineSerial').val().trim();
        if (!serial) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Data',
                text: 'Please scan or enter a Machine Serial.',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        const allData = table.data().toArray();
        const match = allData.find(r => r.machine_serial === serial);
        if (!match) {
            Swal.fire({
                icon: 'error',
                title: 'Not Found',
                text: 'Machine Serial not found in the database.',
                confirmButtonColor: '#d33'
            });
            return;
        }

        // ── Already returned? ──
        if (match.machine_returned_to_prod_timestamp) {
            Swal.fire({
                icon: 'error',
                title: 'Already Returned',
                text: `Machine "${serial}" was returned on ${fmtDT(match.machine_returned_to_prod_timestamp)}.`,
                confirmButtonColor: '#d33'
            });
            return;
        }

        const payload = {
            ReturnDateTime: $('#returnDateTime').val() || null,
            Remarks: 'Returned to Production'
        };

        $.ajax({
            url: API + '/' + match.entry_number + '/return-to-prod',
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function () {
                Swal.fire({
                    icon: 'success',
                    title: 'Returned to Production',
                    timer: 1500,
                    showConfirmButton: false
                });
                bootstrap.Modal.getInstance(document.getElementById('ReturnToProd')).hide();
                loadTable();
            },
            error: function (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: err.responseText || 'Unexpected error.',
                    confirmButtonColor: '#d33'
                });
            }
        });
    });

    // ══════════════════════════════════════════════════════════════════════
    // SUB PARTS ANALYSIS COMPLETED
    // ══════════════════════════════════════════════════════════════════════
    $('#btnSubParts').on('click', function () {
        $('#modalSubPartsCompleted input, #modalSubPartsCompleted select').val('');
        $("input[name='sp_linestop']").prop('checked', false);
        $('#sp_receivedTime, #sp_timeAnalysisEnd, #sp_analysisTime, #sp_finishAnalysisDateTime').val(nowLocal());
        new bootstrap.Modal(document.getElementById('modalSubPartsCompleted')).show();
    });

    // Serial scan auto-fill for sub-parts modal
    $('#sp_machineSerial').on('change', function () {
        const serial = $(this).val().trim().toUpperCase();
        if (!serial) return;
        const match = table.data().toArray()
            .find(r => r.machine_serial && r.machine_serial.toUpperCase() === serial);
        if (match) {
            $('#sp_phenomenon').val(match.phenomenon || '');
            $('#sp_receivedTime').val(match.in_ts ? fmtDT(match.in_ts) : nowLocal());
            $('#sp_line').val(match.line || '');
            $('#sp_process').val(match.process || '');
            $('#sp_initialCause').val(match.cause || '');
            $('#sp_category').val(match.defect_category || '');
            if (match.linestop_related === 'Yes') $('#sp_linestopYes').prop('checked', true);
            else $('#sp_linestopNo').prop('checked', true);
            $(this).data('entryNumber', match.entry_number);
            $(this).removeClass('is-invalid');
        } else {
            Swal.fire({
                icon: 'error', title: 'Not Found',
                text: `Machine Serial "${serial}" not found.`, confirmButtonColor: '#d33'
            });
            $(this).addClass('is-invalid').val('');
            $(this).data('entryNumber', null);
        }
    });
    $('#sp_machineSerial').on('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); $(this).trigger('change'); $(this).blur(); }
    });
    $('#sp_machineSerial').on('input', function () {
        $(this).removeClass('is-invalid');
        if ($(this).val().trim().length === 14) $(this).trigger('change');
    });

    $('#btnSaveSubParts').on('click', function () {
        const entryNumber = $('#sp_machineSerial').data('entryNumber');
        if (!entryNumber) {
            Swal.fire({
                icon: 'warning', title: 'Missing Data',
                text: 'Please scan or enter a valid Machine Serial first.',
                confirmButtonColor: '#3085d6'
            });
            return;
        }
        const payload = {
            AnalyzedBy: $('#sp_analyzeByDropdown1').val() || '',
            AnalyzedBy2: $('#sp_analyzeByDropdown2').val() || '',
            SubUnitPartName: $('#sp_subUnitPartName').val(),
            FinishDateTime: $('#sp_finishAnalysisDateTime').val() || null,
            Cause: $('#sp_cause').val(),
            DefectCategory: $('#sp_defectCategory').val()
        };
        if (!payload.Cause || !payload.SubUnitPartName) {
            Swal.fire({
                icon: 'warning', title: 'Incomplete',
                text: 'Sub Unit/Part Name and Cause are required.',
                confirmButtonColor: '#3085d6'
            });
            return;
        }
        $.ajax({
            url: `${API}/${entryNumber}/subparts-completed`,
            type: 'PUT', contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function () {
                Swal.fire({ icon: 'success', title: 'Sub-Parts Saved', timer: 1500, showConfirmButton: false });
                bootstrap.Modal.getInstance(document.getElementById('modalSubPartsCompleted')).hide();
                loadTable();
            },
            error: function (err) {
                Swal.fire({
                    icon: 'error', title: 'Save Failed',
                    text: err.responseText || 'Unexpected error.', confirmButtonColor: '#d33'
                });
            }
        });
    });

    // ══════════════════════════════════════════════════════════════════════
    // ROW CLICK → Edit (Return to Prod) — BUT ignore clicks on PICTURE link
    // ══════════════════════════════════════════════════════════════════════
    $('#userTable tbody').on('click', 'tr', function (e) {
        // If the click was on (or inside) the PICTURE link, do nothing
        if ($(e.target).closest('.image-link').length) {
            return;
        }

        const rowData = table.row(this).data();
        if (!rowData) return;

        $('#returnMachineSerial').val(rowData.machine_serial || '');
        $('#returnPhenomenon').val(rowData.phenomenon || '');
        $('#returnModelCode').val(rowData.model_code || '');
        $('#returnModelName').val(rowData.model_name || '');
        $('#returnCause').val(rowData.cause || rowData.cause_2 || '');
        $('#returnField').val(rowData.defect_field || '');
        $('#returnCategory').val(rowData.defect_category || '');
        $('#returnDateTime').val(
            rowData.machine_returned_to_prod_timestamp
                ? fmtDT(rowData.machine_returned_to_prod_timestamp)
                : nowLocal()
        );
        new bootstrap.Modal(document.getElementById('ReturnToProd')).show();
    });

    // ══════════════════════════════════════════════════════════════════════
    // 30-MINUTE POPUP REMINDER
    // ══════════════════════════════════════════════════════════════════════
    function checkReturnReminder() {
        const allData = table.data().toArray();
        const pending = allData.filter(r =>
            r.finish_analysis_datetime && !r.machine_returned_to_prod_timestamp
        );
        if (pending.length === 0) return; // No pop-up if nothing pending

        const listHtml = pending.slice(0, 5).map(r =>
            `<tr><td style="padding:4px 8px">${r.machine_serial || 'N/A'}</td>
             <td style="padding:4px 8px">${r.analyzed_by || 'N/A'}</td>
             <td style="padding:4px 8px">${r.phenomenon || ''}</td></tr>`
        ).join('');
        const moreText = pending.length > 5
            ? `<tr><td colspan="3" style="padding:4px 8px;color:#888">...and ${pending.length - 5} more</td></tr>` : '';

        Swal.fire({
            icon: 'warning',
            title: 'For Return to Production',
            html: `<p style="margin-bottom:8px">The following machines are pending return to production:</p>
               <table style="width:100%;border-collapse:collapse;font-size:13px">
                 <thead><tr style="background:#f5f5f5">
                   <th style="padding:4px 8px;text-align:left">Serial</th>
                   <th style="padding:4px 8px;text-align:left">Analyzed By</th>
                   <th style="padding:4px 8px;text-align:left">Phenomenon</th>
                 </tr></thead>
                 <tbody>${listHtml}${moreText}</tbody>
               </table>`,
            showCancelButton: true,
            confirmButtonText: 'OK — Open Return',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#6c757d'
        }).then(result => {
            if (result.isConfirmed) {
                // Clear and open Return to Prod modal
                $('#returnMachineSerial').val('');
                $('#returnPhenomenon, #returnModelCode, #returnModelName, #returnCause, #returnField, #returnCategory').val('');
                $('#returnDateTime').val(nowLocal());
                new bootstrap.Modal(document.getElementById('ReturnToProd')).show();
            }
            // Cancel just closes — no action needed
        });
    }

    // Fire after 3s on load, then every 30 minutes
    setTimeout(function () {
        checkReturnReminder();
        setInterval(checkReturnReminder, 30 * 60 * 1000);
    }, 3000);

});