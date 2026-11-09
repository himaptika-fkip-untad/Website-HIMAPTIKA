
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
            "Maaf, HIMAPTIKA AI belum dapat terhubung. Silakan coba beberapa saat lagi.",
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
