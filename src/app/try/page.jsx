import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function DemographicAnalysis({ demographicData, ageData }) {
  // Convert demographicData object to an array of objects
  const genderData = Object.entries(demographicData || {}).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // Convert ageData object to an array of objects
  const ageChartData = Object.entries(ageData || {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <Card className="col-span-1 bg-gray-800 border-2 border-green-500 rounded-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-400">
          <Users className="inline-block mr-2" />
          Demographic Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-green-300">
              Gender Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-green-300">
              Age Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ageChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#green" />
                <YAxis stroke="#green" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#333", border: "none" }}
                />
                <Legend />
                <Bar dataKey="value" fill="#4ade80" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
