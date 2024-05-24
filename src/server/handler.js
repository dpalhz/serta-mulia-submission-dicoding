const predictClassification = require("../services/inferenceService");
const storeData = require("../services/storeData");
const getPredictionHistories = require("../services/getHistories");
const crypto = require("crypto");

async function postPredictHandler(request, h) {
  try {
    const { image } = request.payload;
    const { model } = request.server.app;
    const { confidenceScore, label, explanation, suggestion } =
      await predictClassification(model, image);

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id: id,
      result: label,
      suggestion: suggestion,
      createdAt: createdAt,
    };

    // Store prediction result
    await storeData(id, data);

    // Provide response
    const response = h.response({
      status: "success",
      message: "Model is predicted successfully",
      data,
    });
    response.code(201);
    return response;
  } catch (error) {
    return h
      .response({
        status: "fail",
        message: "Terjadi kesalahan dalam melakukan prediksi",
      })
      .code(400);
  }
}

async function getPredictionHistoriesHandler(request, h) {
  try {
    // Panggil fungsi untuk mengambil riwayat prediksi
    const histories = await getPredictionHistories();
    return h.response(histories).code(200);
  } catch (error) {
    // Tangani kesalahan
    return h.response({ status: "fail", message: error.message }).code(500);
  }
}

module.exports = { postPredictHandler, getPredictionHistoriesHandler };
