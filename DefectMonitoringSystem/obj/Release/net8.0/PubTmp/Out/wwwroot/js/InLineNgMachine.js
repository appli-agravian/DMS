$(document).ready(function () {
    // Initial view
    $('.section-container').hide();
    $('#dbSection').show();
    $('#mini_btn').addClass('active');

    // Tab Navigation
    $('.tab').click(function () {
        $('.tab').removeClass('active');
        $(this).addClass('active');
        $('.section-container').hide();

        const id = $(this).attr('id');
        if (id === 'mini_btn') {
            $('#dbSection').show();
            $('.action-bar').show().css('display', 'flex');
        } else if (id === 'graph_btn') {
            $('.action-bar').hide();
            $('#graphSection').show();
            renderDefaultChart();
        } else if (id === 'overallgraph_btn') {
            $('.action-bar').hide();
            $('#overallSection').show();
            renderOverallChart();
        }
    });
});

// Modal Logic
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
}

// Logic for the Finish Analysis Path
function selectPath(path) {
    closeModal('modalSelect');

    // Clear the radio selection for next time
    document.getElementsByName('choice').forEach(el => el.checked = false);

    if (path === 'done') {
        // Open the "Machine Out" Green Modal
        openModal('modalMachineOut');
    } else if (path === 'ongoing') {
        // Open the "Sub Unit Ongoing" Green Modal
        openModal('modalSubUnitOngoing');
    }
}

// Close on outside click
window.onclick = function (event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.style.display = "none";
        event.target.classList.remove('active');
    }
};