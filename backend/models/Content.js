const mongoose = require("mongoose");
const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  status: {
    type: String,
    enum: ["DRAFT", "PENDING", "PUBLISHED", "REJECTED"],
    default: "PENDING",
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});
module.exports = mongoose.model("Content", contentSchema);
