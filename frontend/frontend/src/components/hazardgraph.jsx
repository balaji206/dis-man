import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const HazardGraph = ({ hazards }) => {
  return (
    <div>
      <h4 className="text-md font-bold mb-4 text-gray-800">
        Hazard Severity Comparison
      </h4>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={hazards}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="title" hide />
          <YAxis />
          <Tooltip />
          <Bar dataKey="severity" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HazardGraph;
