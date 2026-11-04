
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

const db = getFirestore();

setGlobalOptions({ maxInstances: 5 });

// Memastikan pengguna yang memanggil fungsi adalah admin resmi.
async function requireAdmin(request) {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Silakan login terlebih dahulu."
    );
  }

  const user = await getAuth().getUser(request.auth.uid);

  if (user.disabled || user.customClaims?.admin !== true) {
    throw new HttpsError(
      "permission-denied",
      "Akses khusus admin HIMAPTIKA diperlukan."
    );
  }

  return user;
}

// Fungsi awal untuk memeriksa akses admin.
exports.periksaAksesAdmin = onCall(async (request) => {
  const admin = await requireAdmin(request);

  return {
    berhasil: true,
    pesan: "Akses admin terverifikasi.",
    uid: admin.uid,
  };
});

// Daftar pendaftar hanya dapat dilihat oleh admin resmi.
exports.daftarPendaftar = onCall(async (request) => {
  await requireAdmin(request);

  const snapshot = await db.collection("pendaftaran").get();

  return {
    pendaftar: snapshot.docs.map((doc) => ({
      id: doc.id,
      nim: doc.get("nim") || "",
      nama: doc.get("nama") || "",
      email: doc.get("email") || "",
      statusVerifikasi: doc.get("statusVerifikasi") || "menunggu",
      statusPersetujuan: doc.get("statusPersetujuan") || "menunggu",
    })),
  };
});

// Menyetujui atau menolak pendaftaran setelah memeriksa hak admin.
exports.prosesPendaftaran = onCall(async (request) => {
  await requireAdmin(request);

  const { uid, keputusan } = request.data || {};

  if (
    typeof uid !== "string" ||
    !uid ||
    !["disetujui", "ditolak"].includes(keputusan)
  ) {
    throw new HttpsError(
      "invalid-argument",
      "Data pendaftar atau keputusan tidak valid."
    );
  }

  const docRef = db.collection("pendaftaran").doc(uid);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new HttpsError(
      "not-found",
      "Data pendaftaran tidak ditemukan."
    );
  }

  const data = doc.data();
  const user = await getAuth().getUser(uid);

  if (keputusan === "disetujui" && !user.emailVerified) {
    throw new HttpsError(
      "failed-precondition",
      "Email mahasiswa belum terverifikasi."
    );
  }

  await docRef.update({
    statusPersetujuan: keputusan,
    diperiksaPada: new Date().toISOString(),
  });

  if (keputusan === "ditolak") {
    // Akun tidak dihapus otomatis; admin dapat meninjau tindak lanjutnya.
    return { berhasil: true, keputusan };
  }

  return { berhasil: true, keputusan, nama: data.nama || "" };
});
