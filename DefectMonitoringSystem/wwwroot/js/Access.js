//const API = "http://apbiphbpsts01:2091/api/UserManagementApi";

const API = "https://localhost:7291/api/UserManagementApi";

    let modules = [], roles = [], table;

$(document).ready(async function () {

    [modules, roles] = await Promise.all([
        fetch(`${API}/modules`).then(r => r.json()),
        fetch(`${API}/roles`).then(r => r.json())
    ]);

    const res = await fetch(`${API}/users`);
    const json = await res.json();

    table = $('#userTable').DataTable({
        data: json.data,
        dom: '<"d-flex justify-content-between align-items-center mb-2"Bf>rtip',
        buttons: [
            {
                //extend: 'excel',
                text: 'Export',
                className: 'btn btn-success btn-excel'
            },
            {
                text: 'Add',
                className: 'btn btn-primary btn-add',
                action: () => {
                    const modal = new bootstrap.Modal(document.getElementById('addUserModal'));
                    modal.show();
                }
            }
        ],
        columns: [
            { data: null, render: (d) => `<input type="checkbox" value="${d.id}">` },
            { data: 'member' },
            { data: 'idNumber' },
            { data: 'adid' },
            { data: 'email' },

            ...modules.map(m => ({
                data: null,
                render: (d) => buildDropdown(d.id, m.id, d.permissions?.[m.id])
            })),

            {
                data: null,
                orderable: false,
                searchable: false,
                render: (d) => `
                    <button class="btn btn-danger btn-sm btn-delete" data-id="${d.id}">
                        Delete
                    </button>
                `
            }
        ]
    });


    $('#userTable').on('change', 'select.perm-select', async function () {
        const userId = $(this).data('user');
        const moduleId = $(this).data('module');
        const roleId = parseInt($(this).val());

        await fetch(`${API}/update-permissions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                permissions: [{ userId, moduleId, roleId }]
            })
        });
    });

    s
    $('#userTable').on('click', '.btn-delete', async function () {
        const userId = $(this).data('id');

        const result = await Swal.fire({
            title: 'Are you sure you want to Delete this User?',
            text: "This action cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (!result.isConfirmed) return;

        const res = await fetch(`${API}/delete-user/${userId}`, {
            method: 'DELETE'
        });

        if (res.ok) {

            table.row($(this).closest('tr')).remove().draw();

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'User has been deleted.',
                timer: 1500,
                showConfirmButton: false
            });

        } else {

            Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text: 'Something went wrong.'
            });

        }
    });

    $('#empNumber').on('keydown', async function (e) {
        if (e.key !== 'Enter') return;

        e.preventDefault();
        const empNo = $(this).val().trim();
        if (!empNo) return;

        const res = await fetch(`${API}/lookup/${empNo}`);
        if (!res.ok) { alert('Employee not found'); return; }

        const data = await res.json();

        $('#fullName').val(data.full_Name);
        $('#adid').val(data.adid);
        $('#email').val(data.email);
    });

    $('#saveUser').on('click', async function () {

        const body = {
            idNumber: $('#empNumber').val(),
            fullName: $('#fullName').val(),
            adid: $('#adid').val(),
            email: $('#email').val()
        };

        const res = await fetch(`${API}/add-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
            modal.hide();
            location.reload();
        } else {
            const err = await res.json();
            alert(err.message);
        }
    });

});

        function buildDropdown(userId, moduleId, currentRoleId) {
            const opts = roles.map(r =>
        `<option value="${r.id}" ${r.id === currentRoleId ? 'selected' : ''}>${r.roleName}</option>`
        ).join('');
        return `<select class="form-select form-select-sm perm-select"
            data-user="${userId}" data-module="${moduleId}">
            <option value="">- None -</option>${opts}
        </select>`;
        }

        // Lookup on Enter key in Employee Number field
        $('#empNumber').on('keydown', async function (e) {
            if (e.key !== 'Enter') return;
        e.preventDefault();
        const empNo = $(this).val().trim();
        if (!empNo) return;

        const res = await fetch(`${API}/lookup/${empNo}`);
        if (!res.ok) {alert('Employee not found'); return; }

        const data = await res.json();

        // Match exact property names returned by EmployeeLookupResult
        $('#fullName').val(data.full_Name);   // C# serializes to camelCase by default
        $('#adid').val(data.adid);
        $('#email').val(data.email);
        });

        // Save new user
        $('#saveUser').on('click', async function () {
            const body = {
            idNumber: $('#empNumber').val(),
        fullName: $('#fullName').val(),
        adid: $('#adid').val(),
        email: $('#email').val()
            };

        const res = await fetch(`${API}/add-user`, {
            method: 'POST',
        headers: {'Content-Type': 'application/json' },
        body: JSON.stringify(body)
            });

        if (res.ok) {
                        const modal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
        modal.hide();
        location.reload(); // or re-fetch and update DataTable
            } else {
                const err = await res.json();
        alert(err.message);
            }
        });