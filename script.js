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

// Efek muncul saat scroll
(function () {
    const targets = document.querySelectorAll(
        "main .intro-text, main .intro-box, main .section-title, main .section-heading, " +
        "main .statistik-heading, main .informasi-header, main .agenda-heading, " +
        "main .home-seminar-heading, main .program-card, main .statistik-card, " +
        "main .informasi-card, main .agenda-card, main .survival-content, main .home-cta-content"
    );

    if (!("IntersectionObserver" in window)) {
        return; // browser lama: biarkan tampil normal
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    targets.forEach((el) => {
        el.classList.add("reveal");

        // jeda bertahap untuk kartu bersaudara
        const index = Array.from(el.parentElement.children).indexOf(el);
        el.style.setProperty("--delay", (index % 4) * 0.1 + "s");

        observer.observe(el);
    });
})();
// ===== TENTANG: reveal, angka, tilt =====
(function () {
    if (!document.querySelector("main .about-hero")) return;

    // 1. Muncul saat scroll
    const targets = document.querySelectorAll(
        "main .identity-logo, main .identity-content, main .section-heading, " +
        "main .story-card, main .sejarah-premium-header, main .sejarah-premium-item, " +
        "main .sejarah-present-content, main .vm-header, main .vm-main, " +
        "main .misi-header, main .misi-item, main .value-item, main .cta-box"
    );

    if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add("in");
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.15 });

        targets.forEach((el) => {
            el.classList.add("rv");
            const i = Array.from(el.parentElement.children).indexOf(el);
            el.style.setProperty("--d", (i % 4) * 0.1 + "s");
            io.observe(el);
        });
    }

    /// 2. Angka menghitung naik (data-count atau data-since)
const angka = document.querySelectorAll("main .about-stat strong");

function nilaiAkhir(el) {
    return el.dataset.since
        ? new Date().getFullYear() - parseInt(el.dataset.since, 10)
        : parseInt(el.dataset.count, 10);
}

// Tampilkan angka final lebih dulu, supaya tidak pernah tersangkut di 0
angka.forEach((el) => {
    const t = nilaiAkhir(el);
    if (!isNaN(t)) el.textContent = t;
});

function hitung(el) {
    const target = nilaiAkhir(el);
    if (isNaN(target)) return;

    const mulai = performance.now();

    function step(now) {
        const p = Math.min((now - mulai) / 1200, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = target;
        }
    }

    el.textContent = 0;
    requestAnimationFrame(step);
}

if ("IntersectionObserver" in window && angka.length) {
    const co = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (!e.isIntersecting) return;
            co.unobserve(e.target);
            hitung(e.target);
        });
    }, { threshold: 0.2 });

    angka.forEach((el) => co.observe(el));
}

    // 3. Tilt mengikuti kursor (hanya perangkat dengan mouse)
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.querySelectorAll("main .story-card, main .value-item, main .identity-logo")
        .forEach((el) => {
            el.addEventListener("mousemove", (e) => {
                const r = el.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                el.style.transition = "transform .1s ease-out";
                el.style.transform =
                    "translateY(-6px) rotateX(" + (-y * 8) + "deg) rotateY(" + (x * 8) + "deg)";
            });
            el.addEventListener("mouseleave", () => {
                el.style.transition = "transform .5s ease";
                el.style.transform = "";
            });
        });
})();