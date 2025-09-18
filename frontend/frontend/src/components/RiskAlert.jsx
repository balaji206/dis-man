import React, { useEffect, useState } from "react";
import axios from "axios";

const RiskBanner = ({ weather }) => {
  const [risk, setRisk] = useState(null);

  useEffect(() => {
    if (weather) {
      const fetchRisk = async () => {
        const response = await axios.get(
          `http://localhost:5000/api/risk?temp=${weather.temp}&humidity=${weather.humidity}&condition=${weather.condition}`
        );
        setRisk(response.data.riskScore);
      };
      fetchRisk();
    }
  }, [weather]);

  if (!risk) return null;

  return (
    risk === "High" && (
      <div style={{ backgroundColor: "red", color: "white", padding: "10px" }}>
        ⚠️ High Risk! Stay Alert.
      </div>
    )
  );
};

export default RiskBanner;
