document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ANIMASI SAAT SCROLL
    ===================================================== */

    const animatedElements = document.querySelectorAll(
    ".academic-program-card, " +
    ".academic-intro-grid > div, " +
    ".academic-cta-box, " +
    ".stat, " +
    ".statistik-card"
);

    const observer = new IntersectionObserver(
        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.15
        }
    );


    animatedElements.forEach(function (element, index) {

        element.classList.add("scroll-animation");

        element.style.transitionDelay =
            (index * 0.08) + "s";

        observer.observe(element);

    });



    /* =====================================================
       ANIMASI HERO
    ===================================================== */

    const heroText =
        document.querySelector(".academic-hero-text");

    const heroNumber =
        document.querySelector(".academic-hero-number");


    if (heroText) {

        setTimeout(function () {

            heroText.classList.add("hero-show");

        }, 150);

    }


    if (heroNumber) {

        setTimeout(function () {

            heroNumber.classList.add("hero-number-show");

        }, 400);

    }



    /* =====================================================
       EFEK ACADEMIC SURVIVAL WEB
    ===================================================== */

    const survivalCard =
        document.querySelector(".academic-featured");


    if (survivalCard) {

        survivalCard.addEventListener(
            "mousemove",
            function (event) {

                const rect =
                    survivalCard.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateX =
                    ((y - centerY) / centerY) * -2;

                const rotateY =
                    ((x - centerX) / centerX) * 2;


                survivalCard.style.transform =
                    `perspective(800px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     translateY(-6px)`;

            }
        );


        survivalCard.addEventListener(
            "mouseleave",
            function () {

                survivalCard.style.transform =
                    "perspective(800px) rotateX(0) rotateY(0) translateY(0)";

            }
        );

    }



    /* =====================================================
       SMOOTH SCROLL
    ===================================================== */

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                const target =
                    document.querySelector(
                        this.getAttribute("href")
                    );

                if (target) {

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    });
/* =====================================================
   DARK MODE
===================================================== */

const darkModeToggle =
    document.querySelector("#darkModeToggle");

if (darkModeToggle) {

    darkModeToggle.addEventListener(
        "click",
        function () {

            document.body.classList.toggle("dark-mode");

        }
    );

}
});

/* =====================================
   MOBILE NAVIGATION
===================================== */


    // HAMBURGER MENU HIMAPTIKA
document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const siteHeader = document.querySelector(".site-header");

    if (!menuToggle || !mainNav) return;

    // Menutup menu
    function closeMenu() {
        mainNav.classList.remove("active");
        menuToggle.classList.remove("active");
        document.body.classList.remove("menu-open");
        menuToggle.setAttribute("aria-expanded", "false");
    }

    // Membuka dan menutup hamburger
    menuToggle.addEventListener("click", function (event) {
        event.stopPropagation();

        const isOpen = mainNav.classList.toggle("active");

        menuToggle.classList.toggle("active", isOpen);
        document.body.classList.toggle("menu-open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Menutup menu setelah memilih halaman
    mainNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    // Menutup menu jika klik di luar sidebar
    document.addEventListener("click", function (event) {
        if (
            document.body.classList.contains("menu-open") &&
            !mainNav.contains(event.target) &&
            !menuToggle.contains(event.target)
        ) {
            closeMenu();
        }
    });

    // Menutup menu dengan tombol Escape
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    // NAVBAR MUNCUL KEMBALI
    if (siteHeader) {

        let lastScrollY = window.scrollY;

        function showNavbar() {
            siteHeader.classList.remove("navbar-hidden");
        }

        // Muncul saat scroll ke atas
        window.addEventListener("scroll", function () {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY || currentScrollY < 80) {
                showNavbar();
            } else if (!document.body.classList.contains("menu-open")) {
                siteHeader.classList.add("navbar-hidden");
            }

            lastScrollY = currentScrollY;
        }, { passive: true });

        // Muncul saat layar disentuh
        document.addEventListener("touchstart", showNavbar, { passive: true });

        // Muncul saat layar diklik
        document.addEventListener("click", showNavbar);

        // Muncul saat mouse digerakkan
        document.addEventListener("mousemove", showNavbar);
    }

});