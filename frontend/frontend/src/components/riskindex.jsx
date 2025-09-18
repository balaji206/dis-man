import React, { useEffect, useState } from "react";
import axios from "axios";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

const getRiskLevelColor = (risk) => {
  if (typeof risk === "string") return "text-gray-500";
  if (risk >= 7) return "text-red-600 font-bold";
  if (risk >= 4) return "text-yellow-600 font-semibold";
  return "text-green-600 font-semibold";
};

const getRiskLevelLabel = (risk) => {
  if (typeof risk === "string") return "Not Available";
  if (risk >= 7) return "High";
  if (risk >= 4) return "Medium";
  return "Low";
};

const normalizeName = (name) =>
  name.toLowerCase().replace(/republic of|the|,|\./g, "").trim();

const RiskIndex = ({ lat, lon }) => {
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiskIndex = async () => {
      try {
        setLoading(true);

        // Reverse geocode
        const geoRes = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=3&addressdetails=1`
        );
        const countryName = geoRes.data.address.country;
        const iso2 = geoRes.data.address.country_code.toUpperCase();
        const iso3 = countries.alpha2ToAlpha3(iso2);

        console.log("OSM Country:", countryName, "ISO2:", iso2, "ISO3:", iso3);

        // Fetch INFORM dataset
        const informRes = await axios.get(
          "https://raw.githubusercontent.com/OCHA-DAP/hdx-scraper-inform-risk-index/main/data/inform_risk_index.json",
          { headers: { Accept: "application/json" } }
        );

        const dataset =
          informRes.data.countries || informRes.data || []; // ✅ Handle nested
        console.log("INFORM sample:", dataset[0]);

        if (!Array.isArray(dataset)) {
          console.error("Invalid dataset format");
          setRiskData(null);
          return;
        }

        // Normalize names
        const normOSMName = normalizeName(countryName);

        // Match
        const countryRisk = dataset.find(
  (c) =>
    c.ISO3 === iso3 ||
    normalizeName(c.Country) === normOSMName ||
    normalizeName(c.Country).includes(normOSMName) ||
    normOSMName.includes(normalizeName(c.Country))
);

if (countryRisk) {
  setRiskData({
    country: countryRisk.Country,
    risk: parseFloat(countryRisk.Risk) || "Not Available",
    hazard: countryRisk["Hazard & Exposure"] || "-",
    vulnerability: countryRisk.Vulnerability || "-",
    coping: countryRisk["Lack of Coping Capacity"] || "-",
  });
}


        console.log("Matched Risk Data:", countryRisk);

        if (countryRisk) {
          setRiskData({
            country: countryRisk.country_name,
            risk: countryRisk.risk,
            hazard: countryRisk.hazard_exposure,
            vulnerability: countryRisk.vulnerability,
            coping: countryRisk.lack_of_coping_capacity,
          });
        } else {
          setRiskData({
            country: countryName,
            risk: "Not Available",
            hazard: "-",
            vulnerability: "-",
            coping: "-",
          });
        }
      } catch (error) {
        console.error("Error fetching risk index:", error);
        setRiskData(null);
      } finally {
        setLoading(false);
      }
      console.log("INFORM API raw response:", informRes.data);

    };

    fetchRiskIndex();
  }, [lat, lon]);

  if (loading) return <p className="text-sm text-gray-500">Loading risk index...</p>;
  if (!riskData) return <p className="text-sm text-red-600">No risk data available.</p>;

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Disaster Risk Index</h3>
      <p><strong>Country:</strong> {riskData.country}</p>
      <p className={getRiskLevelColor(riskData.risk)}>
        <strong>Risk Score:</strong> {riskData.risk} ({getRiskLevelLabel(riskData.risk)})
      </p>
      <p><strong>Hazard Exposure:</strong> {riskData.hazard}</p>
      <p><strong>Vulnerability:</strong> {riskData.vulnerability}</p>
      <p><strong>Lack of Coping Capacity:</strong> {riskData.coping}</p>
    </div>
  );
};

export default RiskIndex;
