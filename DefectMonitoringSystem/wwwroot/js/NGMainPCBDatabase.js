$(document).ready(function () {

    const $table = $(".table-wrapper");


    // ============================
    // UPDATE BUTTON
    // ============================
    $("#update_btn").click(function () {
        $table.show

        $("#upload_btn").addClass("hidden-btn");
        $("#export_btn").addClass("hidden-btn");
    });

    // ============================
    // UPLOAD BUTTON
    // ============================
    $("#upload_btn").click(function () {
        $table.show

        $("#update_btn").addClass("hidden-btn");
        $("#export_btn").addClass("hidden-btn");
    });

    // ============================
    // EXPORT BUTTON
    // ============================
    $("#export_btn").click(function () {
        $table.show

        $("#update_btn").addClass("hidden-btn");
        $("#upload_btn").addClass("hidden-btn");
    });

    // ============================
    // MODAL CLOSE → RESET
    // ============================
    $('.modal').on('hidden.bs.modal', function () {
        $(".action-btn").removeClass("hidden-btn");

        // optional:
        // $table.hide();
    });

    document.getElementById("fileInput").addEventListener("change", function () {
        document.getElementById("fileName").value = this.files[0]?.name || "No file selected";

    });
});