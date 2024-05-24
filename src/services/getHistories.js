const { Firestore } = require("@google-cloud/firestore");

async function getPredictionHistories() {
  try {
    const db = new Firestore();

    const predictCollection = db.collection("prediction");

    const snapshot = await predictCollection.get();

    const histories = [];

    snapshot.forEach((doc) => {
      const historyData = doc.data();
      // Tambahkan id dokumen ke dalam objek history
      historyData.id = doc.id;
      histories.push({ id: doc.id, history: historyData });
    });

    // Kembalikan data riwayat prediksi dalam bentuk yang diharapkan
    return { status: "success", data: histories };
  } catch (error) {
    // Tangani kesalahan
    throw new InputError(`Gagal mengambil riwayat prediksi: ${error.message}`);
  }
}

module.exports = getPredictionHistories;
