import React, { useState } from "react";
import PreparednessChecklist from "../components/preparationchecklist";

const ChecklistPage = () => {
  const [hazard, setHazard] = useState("Flood");
  const [risk, setRisk] = useState("Low");

  return (
    <div className="p-4 flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold">Preparedness Checklist</h2>
      
      <div className="flex space-x-2">
        <select
          value={hazard}
          onChange={(e) => setHazard(e.target.value)}
          className="border p-2 rounded"
        >
          <option>Flood</option>
          <option>Fire</option>
          <option>Earthquake</option>
          <option>Storm</option>
        </select>

        <select
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
          className="border p-2 rounded"
        >
          <option>Low</option>
          <option>Moderate</option>
          <option>High</option>
          <option>Severe</option>
        </select>
      </div>

      <PreparednessChecklist hazard={hazard} risk={risk} />
    </div>
  );
};

export default ChecklistPage;
