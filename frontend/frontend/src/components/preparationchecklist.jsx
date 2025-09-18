import React from "react";

const PreparednessChecklist = ({ risk }) => {
  let checklistItems = [];

  switch (risk) {
    case "High":
      checklistItems = [
        "Store at least 3 days of food and water",
        "Keep a battery-powered radio",
        "Have a fully stocked first-aid kit",
        "Charge all devices and power banks",
        "Secure loose outdoor objects",
        "Know the nearest shelter location",
        "Keep important documents in a waterproof bag",
        "Plan an evacuation route with family",
        "Check on elderly or vulnerable neighbors"
      ];
      break;

    case "Medium":
      checklistItems = [
        "Keep a small emergency kit ready",
        "Check flashlight batteries",
        "Review family emergency contacts",
        "Know safe spots in your home",
        "Stock extra drinking water",
        "Stay updated via weather alerts"
      ];
      break;

    case "Low":
    default:
      checklistItems = [
        "Verify your emergency contact list",
        "Ensure smoke detectors are working",
        "Know your local emergency services numbers",
        "Keep a small flashlight in easy reach",
        "Have a few bottled waters on hand",
        "Stay aware of local weather reports"
      ];
      break;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full max-w-md">
      <h3 className="text-lg font-bold mb-2">Preparedness Checklist</h3>
      <ul className="list-disc pl-5 text-sm space-y-1">
        {checklistItems.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default PreparednessChecklist;
