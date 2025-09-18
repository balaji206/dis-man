import express from "express";
import axios from "axios";

const router = express.Router();

// Haversine formula to calculate distance between two coordinates
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // distance in km
}

// GET /api/earthquakes?lat=..&lon=..
router.get("/", async (req, res) => {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: "Missing lat or lon" });

    try {
        // Fetch earthquakes in the past hour (USGS)
        const response = await axios.get(
            "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
        );

        const earthquakes = response.data.features;

        // Filter nearby earthquakes (e.g., within 100 km)
        const nearby = earthquakes
            .map(eq => {
                const [eqLon, eqLat] = eq.geometry.coordinates;
                const distance = getDistance(lat, lon, eqLat, eqLon);
                return {
                    id: eq.id,
                    place: eq.properties.place,
                    mag: eq.properties.mag,
                    time: eq.properties.time,
                    distance: distance.toFixed(2) // km
                };
            })
            .filter(eq => eq.distance <= 100 && eq.mag >= 4); // example threshold

        res.json({
            totalNearby: nearby.length,
            nearby
        });
    } catch (err) {
        console.error("Earthquake API error:", err);
        res.status(500).json({ error: "Failed to fetch earthquake data" });
    }
});

export default router;
