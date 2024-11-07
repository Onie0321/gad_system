"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Users,
  UserCheck,
  UserPlus,
  Briefcase,
  GraduationCap,
  Baby,
  HelpCircle,
} from "lucide-react";
import { MaleIcon, FemaleIcon } from "@/components/icons/sex"; // We'll create these custom icons

const sexData = [
  { name: "Male", value: 600, color: "#3b82f6" },
  { name: "Female", value: 400, color: "#ec4899" },
];

const managementData = [
  { type: "Top Management", male: 30, female: 20 },
  { type: "Middle Management", male: 80, female: 70 },
  { type: "Technical", male: 180, female: 120 },
  { type: "Administrative", male: 100, female: 100 },
  { type: "Support", male: 150, female: 150 },
];

const specialGroupsData = [
  { group: "Differently-Abled", male: 20, female: 15 },
  { group: "IP Groups", male: 30, female: 25 },
  { group: "Solo Parents", male: 40, female: 60 },
];

const childrenData = [
  { category: "Below 7 Years", value: 400, color: "#ec4899" },
  { category: "7 Years and Above", value: 600, color: "#3b82f6" },
];

const disabledChildrenData = [
  { category: "With Differently-Abled Children", value: 400, color: "#ec4899" },
  {
    category: "Without Differently-Abled Children",
    value: 600,
    color: "#3b82f6",
  },
];

const employmentStatusData = [
  { status: "Permanent", male: 300, female: 250 },
  { status: "Contractual", male: 100, female: 80 },
  { status: "Temporary", male: 50, female: 40 },
  { status: "Job Order", male: 150, female: 130 },
  { status: "Part-Time", male: 140, female: 160 },
];

const civilStatusData = [
  { status: "Single", male: 200, female: 180 },
  { status: "Married", male: 350, female: 300 },
  { status: "Widowed", male: 30, female: 40 },
  { status: "Separated", male: 20, female: 30 },
  { status: "Other", male: 10, female: 50 },
];

const educationalAttainmentData = [
  { level: "Bachelor's Degree", teaching: 200, nonTeaching: 150 },
  { level: "Master's Degree", teaching: 150, nonTeaching: 50 },
  { level: "Doctorate Degree", teaching: 100, nonTeaching: 20 },
  { level: "Others", teaching: 50, nonTeaching: 80 },
];

function VisualGuide() {
  return (
    <Card className="bg-gray-800 border border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white flex items-center">
          <HelpCircle className="w-5 h-5 mr-2" />
          Visual Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-white">
          <div>
            <h3 className="font-semibold mb-2">Gender Colors</h3>
            <div className="flex items-center mb-1">
              <div className="w-4 h-4 bg-blue-500 mr-2"></div>
              <span>Male</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-pink-500 mr-2"></div>
              <span>Female</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Symbols</h3>
            <div className="flex items-center mb-1">
              <span className="text-2xl mr-2">♂</span>
              <span>Male</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">♀</span>
              <span>Female</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Special Groups</h3>
            <div className="flex items-center mb-1">
              <Users className="w-4 h-4 mr-2" />
              <span>IP Groups</span>
            </div>
            <div className="flex items-center">
              <UserCheck className="w-4 h-4 mr-2" />
              <span>Differently-Abled</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Other Icons</h3>
            <div className="flex items-center mb-1">
              <Briefcase className="w-4 h-4 mr-2" />
              <span>Employment Status</span>
            </div>
            <div className="flex items-center">
              <GraduationCap className="w-4 h-4 mr-2" />
              <span>Educational Attainment</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PersonnelStatistics() {
  const [showGuide, setShowGuide] = React.useState(false);

  return (
    <div className="space-y-4">
      <Card className="bg-gray-900 border border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-white">
            Personnel Statistics Dashboard
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGuide(!showGuide)}
            className="text-white border-white hover:bg-gray-700"
          >
            {showGuide ? "Hide Guide" : "Show Guide"}
          </Button>
        </CardHeader>
        <CardContent>
          {showGuide && <VisualGuide />}

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Number of Employees by Gender
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sexData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {sexData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Number of Employees per Management Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={managementData}>
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Bar dataKey="male" fill="#3b82f6" name="Male" />
                      <Bar dataKey="female" fill="#ec4899" name="Female" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            {specialGroupsData.map((group, index) => (
              <Card key={index} className="bg-gray-800 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-white">
                    {group.group}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-center flex flex-col items-center bg-blue-600 p-2 rounded-lg">
                      <MaleIcon className="w-6 h-6 text-white mb-2" />
                      <p className="text-xl font-bold text-white">
                        {group.male}
                      </p>
                      <p className="text-xs text-white">Male</p>
                    </div>
                    <div className="text-center flex flex-col items-center bg-pink-600 p-2 rounded-lg">
                      <FemaleIcon className="w-6 h-6 text-white mb-2" />
                      <p className="text-xl font-bold text-white">
                        {group.female}
                      </p>
                      <p className="text-xs text-white">Female</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Card className="bg-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-white">
                  Employees with Children Below 7 Years Old
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={childrenData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {childrenData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-white">
                  Employees with Differently-Abled Children
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={disabledChildrenData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {disabledChildrenData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4">
            <Card className="bg-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Number of Employees per Employment Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="text-white">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Male</TableHead>
                      <TableHead>Female</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employmentStatusData.map((status, index) => (
                      <TableRow key={index}>
                        <TableCell>{status.status}</TableCell>
                        <TableCell className="text-blue-500">
                          {status.male}
                        </TableCell>
                        <TableCell className="text-pink-500">
                          {status.female}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {status.male + status.female}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4">
            <Card className="bg-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Number of Teaching Employees per Civil Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="text-white">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Male</TableHead>
                      <TableHead>Female</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {civilStatusData.map((status, index) => (
                      <TableRow key={index}>
                        <TableCell>{status.status}</TableCell>
                        <TableCell className="text-blue-500">
                          {status.male}
                        </TableCell>
                        <TableCell className="text-pink-500">
                          {status.female}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {status.male + status.female}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4">
            <Card className="bg-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Number of Employees by Educational Attainment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table className="text-white">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Level</TableHead>
                      <TableHead>Teaching</TableHead>
                      <TableHead>Non-Teaching</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {educationalAttainmentData.map((level, index) => (
                      <TableRow key={index}>
                        <TableCell>{level.level}</TableCell>
                        <TableCell>{level.teaching}</TableCell>
                        <TableCell>{level.nonTeaching}</TableCell>
                        <TableCell>
                          {level.teaching + level.nonTeaching}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4">
            <Card className="bg-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">
                  Generate Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Select>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      <SelectItem value="solo-parents">Solo Parents</SelectItem>
                      <SelectItem value="management">
                        Management Type
                      </SelectItem>
                      <SelectItem value="differently-abled">
                        Differently-Abled Employees
                      </SelectItem>
                      <SelectItem value="teaching-non-teaching">
                        Teaching and Non-Teaching Staff
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
