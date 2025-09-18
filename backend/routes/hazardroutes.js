import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { createReport, getReports, verifyReport } from "../controllers/hazardcontroller.js";

export default function hazardReportsRoute(io) {
  const router = express.Router();

  // Citizen submits hazard report
  router.post("/", verifyToken, (req, res) => createReport(req, res, io));

  // Fetch all hazard reports
  router.get("/", getReports);

  // Official verifies/rejects a report
  router.put("/:id/verify", verifyToken, (req, res) => verifyReport(req, res, io));

  return router;
}
