import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  const { temp, humidity, condition } = req.query;

  let risk = "Low";

  if (condition === "Rain" && humidity > 80) {
    risk = "High";
  } else if (temp > 35 || humidity > 70) {
    risk = "Moderate";
  }

  res.json({ riskScore: risk });
});

export default router;
