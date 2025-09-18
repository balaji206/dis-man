import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hazardType: {
    type: String,
    enum: ["tsunami", "surge", "high_wave", "cyclone", "other"],
    required: true,
  },
  description: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  mediaUrl: { type: String }, // photo/video upload
  status: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Report", reportSchema);
