"use client";

import React, { useState, useEffect } from "react";
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
import { databases, appwriteConfig } from "../../../../lib/appwrite"; 


const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
];

export default function DemographicAnalysis({ selectedEventId }) {
  const [eventData, setEventData] = useState(null);
  const [demographicData, setDemographicData] = useState({});
  const [ageData, setAgeData] = useState({});
  const [departmentData, setDepartmentData] = useState({});
  const [ethnicData, setEthnicData] = useState({});

  useEffect(() => {
    if (selectedEventId) {
      fetchEventData(selectedEventId);
    }
  }, [selectedEventId]);

  // Fetch event data from Appwrite
  const fetchEventData = async (eventId) => {
    try {
      // Fetch the event document from Appwrite
      const response = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.eventCollectionId,
        eventId
      );

      if (!response) throw new Error("Failed to fetch event data");
      setEventData(response); // Set event data
      processParticipantData(response.participants || []); // Process participants data
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  // Process participant data to gather demographic insights
  const processParticipantData = (participants) => {
    const sexCount = {};
    const ageGroups = {};
    const departmentCount = {};
    const ethnicCount = {};

    participants.forEach((participant) => {
      // Sex
      sexCount[participant.sex] = (sexCount[participant.sex] || 0) + 1;

      // Age
      const ageGroup = getAgeGroup(participant.age);
      ageGroups[ageGroup] = (ageGroups[ageGroup] || 0) + 1;

      // Department
      departmentCount[participant.department] =
        (departmentCount[participant.department] || 0) + 1;

      // Ethnic Group
      const ethnicGroup =
        participant.ethnicGroup === "Other"
          ? participant.otherEthnicGroup
          : participant.ethnicGroup;
      ethnicCount[ethnicGroup] = (ethnicCount[ethnicGroup] || 0) + 1;
    });

    // Set the aggregated data
    setDemographicData(sexCount);
    setAgeData(ageGroups);
    setDepartmentData(departmentCount);
    setEthnicData(ethnicCount);
  };

  // Helper function to categorize age groups
  const getAgeGroup = (age) => {
    if (age < 18) return "Under 18";
    if (age < 25) return "18-24";
    if (age < 35) return "25-34";
    if (age < 45) return "35-44";
    return "45+";
  };

  // Formatting data for chart visualization
  const formatChartData = (data) => {
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  };

  return (
    <Card className="col-span-1 bg-gray-800 border-2 border-green-500 rounded-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-green-400">
          <Users className="inline-block mr-2" />
          Demographic Analysis: {eventData?.eventName || "Select an Event"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-green-300">
              Sex Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={formatChartData(demographicData)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {formatChartData(demographicData).map((entry, index) => (
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
              <BarChart data={formatChartData(ageData)}>
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
          <div>
            <h3 className="text-xl font-semibold mb-2 text-green-300">
              Department Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={formatChartData(departmentData)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="name" stroke="#green" />
                <YAxis stroke="#green" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#333", border: "none" }}
                />
                <Legend />
                <Bar dataKey="value" fill="#fbbf24" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-green-300">
              Ethnic Group Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={formatChartData(ethnicData)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {formatChartData(ethnicData).map((entry, index) => (
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
        </div>
      </CardContent>
    </Card>
  );
}
