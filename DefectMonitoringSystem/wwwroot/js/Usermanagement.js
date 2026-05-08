function setActive(btn) {
    document.querySelectorAll('.tab-btn')
        .forEach(b => b.classList.remove('active'));

    btn.classList.add('active');
}

function setHeader(btn) {

    document.querySelectorAll('.header-btn')
        .forEach(b => b.classList.remove('active-header'));

    btn.classList.add('active-header');

    const target = btn.getAttribute("data-target");

    const inline = document.getElementById("table-inline");
    const pcb = document.getElementById("table-pcb");

    if (!inline || !pcb) return;

    if (target === "inline") {
        inline.style.display = "block";
        pcb.style.display = "none";
    } else {
        inline.style.display = "none";
        pcb.style.display = "block";
    }
}