import React, { useEffect, useState } from "react";
import guideData from "../data/survivalGuide.json";

export default function SurvivalGuide() {
  const [selected, setSelected] = useState("Flood");

  useEffect(() => {
    localStorage.setItem("survivalGuide", JSON.stringify(guideData));
  }, []);

  const guide = guideData[selected] || [];

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-semibold mb-3">Offline Survival Guide</h2>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="border p-2 rounded-lg mb-3"
      >
        {Object.keys(guideData).map((key) => (
          <option key={key}>{key}</option>
        ))}
      </select>
      <ul className="list-disc pl-5 space-y-1">
        {guide.map((tip, i) => (
          <li key={i}>{tip}</li>
        ))}
      </ul>
    </div>
  );
}
