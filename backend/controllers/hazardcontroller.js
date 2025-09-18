import Report from "../models/reports.js";

// ✅ Create new hazard report
export const createReport = async (req, res, io) => {
  try {
    const { hazardType, description, lat, lng, mediaUrl } = req.body;

    const newReport = new Report({
      user: req.user.id,
      hazardType,
      description,
      location: { lat, lng },
      mediaUrl,
    });

    await newReport.save();

    // Notify all connected clients
    io.emit("new-report", newReport);

    res.status(201).json(newReport);
  } catch (err) {
    console.error("Error creating report:", err);
    res.status(500).json({ error: "Failed to submit report" });
  }
};

// ✅ Get all hazard reports
export const getReports = async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = {};
    if (type) filter.hazardType = type;
    if (status) filter.status = status;

    const reports = await Report.find(filter).populate("user", "name email");
    res.json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

// ✅ Verify or reject report
export const verifyReport = async (req, res, io) => {
  try {
    if (req.user.role !== "official") {
      return res.status(403).json({ error: "Access denied" });
    }

    const { status } = req.body; // "verified" or "rejected"
    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Notify all clients
    io.emit("report-status-update", updatedReport);

    res.json(updatedReport);
  } catch (err) {
    console.error("Error updating report:", err);
    res.status(500).json({ error: "Failed to update report status" });
  }
};
