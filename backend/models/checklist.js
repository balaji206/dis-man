import express from "express";

const CHECKLIST = {
  Flood: {
    Low: [
      "Check local weather updates twice a day",
      "Move valuables to higher shelves",
      "Keep a small go-bag ready",
    ],
    Moderate: [
      "Charge phones and power banks",
      "Fill water bottles; stock dry food for 24–48h",
      "Identify nearest shelters and evacuation routes",
    ],
    High: [
      "Move vehicles to higher ground",
      "Turn off main electricity if water enters home",
      "Evacuate if authorities advise; carry ID and meds",
    ],
    Severe: [
      "Evacuate immediately if in low-lying areas",
      "Do not walk/drive through floodwaters",
      "Inform family of your location and route",
    ],
  },
  Fire: {
    Low: [
      "Test smoke detectors",
      "Keep fire extinguishers accessible",
      "Avoid open flames during high wind",
    ],
    Moderate: [
      "Clear flammables from balconies/around house",
      "Prepare masks; keep windows closed",
      "Identify safe indoor room with minimal vents",
    ],
    High: [
      "Pack essentials and documents",
      "Prepare to evacuate; set a meetup point",
      "Keep vehicle fueled and ready",
    ],
    Severe: [
      "Evacuate as instructed by authorities",
      "Wear masks; cover skin to avoid embers",
      "Call emergency services if trapped",
    ],
  },
  Earthquake: {
    Low: [
      "Secure heavy furniture to walls",
      "Know ‘Drop, Cover, Hold On’",
      "Prepare emergency kit with whistle",
    ],
    Moderate: [
      "Identify safe spots under sturdy furniture",
      "Practice family emergency plan",
      "Store 3 days of water & food",
    ],
    High: [
      "Keep shoes and flashlight beside bed",
      "Review gas/electricity shutoff valves",
      "Charge phones; keep radio ready",
    ],
    Severe: [
      "Drop, Cover, Hold On immediately during shaking",
      "After shaking, evacuate unsafe buildings",
      "Expect aftershocks; avoid damaged structures",
    ],
  },
  Storm: {
    Low: [
      "Trim loose branches nearby",
      "Secure outdoor items",
      "Check flashlight batteries",
    ],
    Moderate: [
      "Close and latch all windows/doors",
      "Charge devices and power banks",
      "Park car away from trees and power lines",
    ],
    High: [
      "Stay indoors; keep emergency kit nearby",
      "Avoid travel; monitor official alerts",
      "Prepare for power outages (water, food, cash)",
    ],
    Severe: [
      "Shelter in interior room away from windows",
      "Turn off non-essential power",
      "Evacuate if advised by authorities",
    ],
  },
};

const VALID_HAZARDS = Object.keys(CHECKLIST);
const VALID_LEVELS = ["Low", "Moderate", "High", "Severe"];

const router = express.Router();

/**
 * GET /api/checklist?hazard=Flood&risk=High
 * Returns array of steps for matching hazard+risk.
 */
router.get("/", (req, res) => {
  try {
    const hazard = req.query.hazard || "Flood";
    const risk = req.query.risk || "Low";

    if (!VALID_HAZARDS.includes(hazard)) {
      return res.status(400).json({ error: `Invalid hazard. Use one of: ${VALID_HAZARDS.join(", ")}` });
    }
    if (!VALID_LEVELS.includes(risk)) {
      return res.status(400).json({ error: `Invalid risk. Use one of: ${VALID_LEVELS.join(", ")}` });
    }

    res.json({
      hazard,
      risk,
      items: CHECKLIST[hazard][risk],
      lastUpdated: new Date().toISOString(),
    });
  } catch (err) {
    console.error("GET /checklist error:", err);
    res.status(500).json({ error: "Failed to fetch checklist" });
  }
});

export default router;
