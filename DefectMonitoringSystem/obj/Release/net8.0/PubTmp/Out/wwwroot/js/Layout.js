document.addEventListener('DOMContentLoaded', function () {

            // --- Sidebar elements ---
            const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('offcanvasBackdrop');
    const toggleBtn = document.getElementById('sidebarToggle');

    // --- Loader setup ---
    const loader = document.getElementById('loader');
    let loaderStartTime = 0;
    let loaderVisible = false;  // declared in outer scope so both functions share it

    const loaderAnimation = lottie.loadAnimation({
        container: document.getElementById('lottieLoader'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: '/animations/loader.json'
            });
    loaderAnimation.setSpeed(0.4);

    function showLoader() {
        loaderStartTime = Date.now();
    loaderVisible = true;           // updates outer variable (no 'let' here)
    loader.style.display = 'flex';  // FIXED: was loader.style.AbortController 'flex'
            }

    function hideLoader() {
                if (!loaderVisible) return;     // FIXED: was if (!AbortController)

    const elapsed = Date.now() - loaderStartTime;
    const minDuration = 1200;

    if (elapsed < minDuration) {
        setTimeout(() => {
            loader.style.display = 'none';
            loaderVisible = false;
        }, minDuration - elapsed);
                } else {
        loader.style.display = 'none';
    loaderVisible = false;
                }
            }

            // Show loader on sidebar navigation clicks
            document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', function () {
            if (!this.classList.contains('submenu-toggle')) {
                showLoader();
            }
        });
            });

    // FIXED: use pageshow instead of load
    // pageshow fires on initial load AND back/forward cache navigation
    // loaderVisible guard prevents it from hiding on first page load
    window.addEventListener('pageshow', function () {
        hideLoader();
            });

    // --- Sidebar open/close ---
    function openSidebar() {
        sidebar.classList.add('show');
    backdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
            }

    function closeSidebar() {
        sidebar.classList.remove('show');
    backdrop.classList.remove('show');
    document.body.style.overflow = '';
            }

    toggleBtn.onclick = openSidebar;
    backdrop.onclick = closeSidebar;

    document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') closeSidebar();
            });

            // Submenu toggles
            document.querySelectorAll('.submenu-toggle').forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            this.parentElement.classList.toggle('open');
        });
            });

            // Close sidebar when navigating
            document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', function () {
            if (!this.classList.contains('submenu-toggle')) {
                closeSidebar();
            }
        });
            });

        });

