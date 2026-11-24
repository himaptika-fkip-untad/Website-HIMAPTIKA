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

/* =====================================
   HIMAPTIKA AI
   CHAT INTERACTION + CLOUDFLARE API
===================================== */

// Alamat backend Cloudflare Worker
const AI_API_URL =
    "https://himaptika-ai-api.arilthandyangka45.workers.dev";

const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const imageInput = document.getElementById("imageInput");
const chatArea = document.querySelector(".chat-area");
const newChatButton = document.querySelector(".new-chat");

let selectedImage = null;
let isSending = false;

// Simpan tampilan awal
const welcomeContent = chatArea.innerHTML;


/* =====================================
   MEMBUAT AREA PERCAKAPAN
===================================== */

function showChatArea() {
    let conversation = document.getElementById("conversation");

    if (!conversation) {
        chatArea.innerHTML = "";

        conversation = document.createElement("div");
        conversation.id = "conversation";
        conversation.className = "conversation";

        chatArea.appendChild(conversation);
    }

    return conversation;
}


/* =====================================
   MENAMPILKAN PESAN
===================================== */

function addMessage(text, sender, image = null) {
    const conversation = showChatArea();

    const message = document.createElement("div");
    message.className = `message ${sender}`;

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";

    if (text && text.trim()) {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        bubble.appendChild(paragraph);
    }

    if (image) {
        const preview = document.createElement("img");
        preview.src = image;
        preview.alt = "Foto soal matematika";
        preview.className = "message-image";

        bubble.appendChild(preview);
    }

    message.appendChild(bubble);
    conversation.appendChild(message);

    chatArea.scrollTop = chatArea.scrollHeight;

    return message;
}


/* =====================================
   INDIKATOR AI SEDANG MENJAWAB
===================================== */

function showTypingIndicator() {
    const conversation = showChatArea();

    const typing = document.createElement("div");
    typing.className = "message assistant";
    typing.id = "typingIndicator";

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = "HIMAPTIKA AI sedang berpikir...";

    typing.appendChild(bubble);
    conversation.appendChild(typing);

    chatArea.scrollTop = chatArea.scrollHeight;
}

function removeTypingIndicator() {
    const typing = document.getElementById("typingIndicator");

    if (typing) {
        typing.remove();
    }
}


/* =====================================
   PREVIEW FOTO
===================================== */

function showImagePreview(file) {
    const oldPreview = document.getElementById("imagePreview");

    if (oldPreview) {
        oldPreview.remove();
    }

    const previewBox = document.createElement("div");
    previewBox.id = "imagePreview";
    previewBox.className = "image-preview";

    const image = document.createElement("img");
    image.src = URL.createObjectURL(file);
    image.alt = "Pratinjau soal";

    const info = document.createElement("span");
    info.textContent = file.name;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "×";
    removeButton.setAttribute("aria-label", "Hapus foto");

    removeButton.addEventListener("click", () => {
        previewBox.remove();
        imageInput.value = "";
        selectedImage = null;
        URL.revokeObjectURL(image.src);
    });

    previewBox.append(image, info, removeButton);

    document.querySelector(".chat-footer")
        .insertBefore(
            previewBox,
            document.querySelector(".input-box")
        );
}


/* =====================================
   PILIH FOTO
===================================== */

imageInput.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Silakan pilih file gambar.");
        this.value = "";
        return;
    }

    if (file.size > 8 * 1024 * 1024) {
        alert("Ukuran foto maksimal 8 MB.");
        this.value = "";
        return;
    }

    selectedImage = file;

    showImagePreview(file);
});


/* =====================================
   KIRIM PERTANYAAN KE CLOUDFLARE
===================================== */

async function sendMessage() {
    const text = messageInput.value.trim();

    if (isSending) return;

    if (!text && !selectedImage) {
        return;
    }

    // Fitur analisis gambar belum diaktifkan
    if (selectedImage) {
        addMessage(
            "Fitur membaca dan menyelesaikan soal dari foto sedang dalam tahap pengembangan. Untuk sementara, silakan ketik soal matematika secara langsung.",
            "assistant"
        );
        return;
    }

    // Tampilkan pertanyaan pengguna
    addMessage(text, "user");

    messageInput.value = "";
    isSending = true;
    sendButton.disabled = true;

    showTypingIndicator();

    try {
        const response = await fetch(AI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: text
            })
        });

        const data = await response.json();

        removeTypingIndicator();

        if (!response.ok || !data.success) {
            throw new Error(
                data.error || "HIMAPTIKA AI gagal memberikan jawaban."
            );
        }

        addMessage(data.answer, "assistant");

    } catch (error) {
    console.error("HIMAPTIKA AI Error:", error);

    removeTypingIndicator();

    addMessage(
        "Koneksi HIMAPTIKA AI gagal: " + error.message,
        "assistant"
    );

} finally {
    isSending = false;
    sendButton.disabled = false;
    messageInput.focus();
}
}


/* =====================================
   TOMBOL KIRIM
===================================== */

sendButton.addEventListener("click", sendMessage);


/* =====================================
   ENTER UNTUK MENGIRIM
===================================== */

messageInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});


/* =====================================
   KARTU PERTANYAAN
===================================== */

// Menggunakan event delegation agar tetap aktif
// meskipun pengguna menekan tombol Percakapan Baru.

chatArea.addEventListener("click", function (event) {
    const card = event.target.closest(".suggestion-card");

    if (!card) return;

    const titleElement = card.querySelector("strong");

    if (!titleElement) return;

    const title = titleElement.textContent.trim();

    const prompts = {
        "Penyelesaian Matematika":
            "Bantu saya menyelesaikan soal matematika berikut secara bertahap: ",

        "Penjelasan Materi":
            "Jelaskan materi matematika berikut secara lengkap: ",

        "Unggah Foto Soal":
            "Saya ingin membahas soal matematika melalui foto.",

        "Informasi HIMAPTIKA":
            "Saya ingin bertanya tentang HIMAPTIKA: "
    };

    if (title === "Unggah Foto Soal") {
        imageInput.click();
        return;
    }

    messageInput.value = prompts[title] || "";
    messageInput.focus();
});


/* =====================================
   PERCAKAPAN BARU
===================================== */

newChatButton.addEventListener("click", function () {
    chatArea.innerHTML = welcomeContent;

    messageInput.value = "";
    imageInput.value = "";
    selectedImage = null;

    isSending = false;
    sendButton.disabled = false;

    const preview = document.getElementById("imagePreview");

    if (preview) {
        preview.remove();
    }
});


console.log("HIMAPTIKA AI berhasil terhubung dengan frontend.");
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

    // 2. Angka menghitung naik (data-count atau data-since)
    const angka = document.querySelectorAll("main .about-stat strong");
    if ("IntersectionObserver" in window && angka.length) {
        const co = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                const el = e.target;
                co.unobserve(el);

                const target = el.dataset.since
                    ? new Date().getFullYear() - parseInt(el.dataset.since, 10)
                    : parseInt(el.dataset.count, 10);
                if (isNaN(target)) return;

                const mulai = performance.now();
                (function step(now) {
                    const p = Math.min((now - mulai) / 1200, 1);
                    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
                    if (p < 1) requestAnimationFrame(step);
                })(mulai);
            });
        }, { threshold: 0.5 });
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