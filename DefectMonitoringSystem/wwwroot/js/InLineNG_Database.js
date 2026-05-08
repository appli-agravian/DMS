//const API = "https://localhost:7291/api/InLineNgMachineApi";

    $(document).ready(function () {
        $('#userTable').DataTable({
            dom: '<"d-flex justify-content-between align-items-center mb-2"Bf>rtip',
            buttons: [
                {
                    extend: 'excel',
                    text: 'Export Excel',
                    className: 'btn btn-success btn-sm'
                },
                {
                    extend: 'print',
                    text: 'Print',
                    className: 'btn btn-secondary btn-sm'
                }
            ],
            scrollX: true,          // horizontal scroll
            scrollY: '60vh',        // vertical scroll — adjust height as needed
            scrollCollapse: true,   // shrinks if fewer rows
            fixedHeader: true,      // keeps header visible when scrolling down
            paging: true,
            pageLength: 25,
            lengthMenu: [10, 25, 50, 100],
            ordering: false,
            searching: true,
            autoWidth: false,
            language: {
                search: "Search:",
                lengthMenu: "Show _MENU_ entries",
                info: "Showing _START_ to _END_ of _TOTAL_ entries",
                paginate: {
                    first: "First",
                    last: "Last",
                    next: "Next",
                    previous: "Previous"
                },
                emptyTable: "No data available"
            }
        });
    });