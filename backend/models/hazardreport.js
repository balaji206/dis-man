import mongoose from "mongoose";

const hazardReportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["Flood", "Fire", "Earthquake", "Storm", "Landslide", "Road Block", "Other"],
    },
    description: { type: String, required: true, trim: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      city: { type: String, required: true, trim: true },
      address: { type: String, trim: true },
    },
    media: [
      {
        url: String,        // (optional) future-proofing if you add uploads
        type: String,       // "image" | "video"
      },
    ],
    reporter: {
      name: { type: String, trim: true },
      contact: { type: String, trim: true }, // phone/email (optional)
    },
    status: {
      type: String,
      enum: ["reported", "verified", "resolved"],
      default: "reported",
    },
  },
  { timestamps: true }
);

export default mongoose.model("HazardReport", hazardReportSchema);
