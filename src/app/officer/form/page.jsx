import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Upload, FileUp, AlertCircle, Check, RefreshCw } from "lucide-react";

export default function GoogleFormsImport() {
  const [currentStep, setCurrentStep] = useState("upload");
  const [file, setFile] = useState(null);
  const [mappedFields, setMappedFields] = useState({});
  const [importSettings, setImportSettings] = useState({
    duplicateHandling: "skip",
    autoSync: false,
    importSchedule: "daily",
  });

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setCurrentStep("mapping");
    }
  };

  const handleFieldMapping = (googleFormField, systemField) => {
    setMappedFields((prev) => ({ ...prev, [googleFormField]: systemField }));
  };

  const handleImportSettingsChange = (setting, value) => {
    setImportSettings((prev) => ({ ...prev, [setting]: value }));
  };

  const mockGoogleFormFields = ["Name", "Email", "Age", "Favorite Color"];
  const mockSystemFields = ["Full Name", "Email Address", "Age", "Preferred Color"];

  return (
    <div className="container mx-auto p-6 space-y-8 bg-gray-800 border border-blue-500 min-h-screen text-white rounded-lg shadow-2xl">
      <h2 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500 animate-pulse">
        Import Google Forms Responses
      </h2>
      <Tabs
        value={currentStep}
        onValueChange={setCurrentStep}
        className="bg-black bg-opacity-30 p-6 rounded-xl backdrop-blur-md"
      >
        <TabsList    variant="outline" className="grid w-full grid-cols-5 gap-2 bg-cyan-700 border-cyan-500 text-white transition-all duration-300">
          {["upload", "mapping", "validation", "settings", "confirm"].map(
            (step) => (
              <TabsTrigger
                key={step}
                value={step}
                className="data-[state=active]:bg-white data-[state=active]:text-black transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-glow"
              >
                {step.charAt(0).toUpperCase() + step.slice(1)}
              </TabsTrigger>
            )
          )}
        </TabsList>
        <TabsContent value="upload" className="space-y-4 mt-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => document.getElementById("file-upload")?.click()}
              className="bg-gray-700 border-cyan-500 text-white hover:bg-cyan-600 transition-all duration-300 shadow-glow"
            >
              <Upload className="mr-2 h-4 w-4" /> Upload CSV
            </Button>
            <Button className="bg-gray-700 border-pink-500 text-white hover:bg-pink-600 transition-all duration-300 shadow-glow">
              <FileUp className="mr-2 h-4 w-4" /> Import via Google Forms API
            </Button>
          </div>
          <Input
            id="file-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
          {file && <p className="text-sm text-cyan-300">File uploaded: {file.name}</p>}
        </TabsContent>
        <TabsContent value="mapping" className="space-y-4 mt-4">
          <h3 className="text-2xl font-semibold mb-4 text-cyan-300">Map Fields</h3>
          <Table className="bg-black bg-opacity-50 rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="text-cyan-300">Google Form Field</TableHead>
                <TableHead className="text-cyan-300">System Field</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockGoogleFormFields.map((field) => (
                <TableRow key={field} className="border-b border-cyan-800">
                  <TableCell className="text-white">{field}</TableCell>
                  <TableCell>
                    <Select onValueChange={(value) => handleFieldMapping(field, value)}>
                      <SelectTrigger className="bg-transparent border-cyan-500 text-white">
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent className="bg-black text-white">
                        {mockSystemFields.map((systemField) => (
                          <SelectItem key={systemField} value={systemField}>
                            {systemField}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="validation" className="space-y-4 mt-4">
          <h3 className="text-2xl font-semibold mb-4 text-cyan-300">Data Validation</h3>
          <Table className="bg-black bg-opacity-50 rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="text-cyan-300">Field</TableHead>
                <TableHead className="text-cyan-300">Status</TableHead>
                <TableHead className="text-cyan-300">Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="border-b border-cyan-800">
                <TableCell className="text-white">Name</TableCell>
                <TableCell>
                  <Check className="text-green-500" />
                </TableCell>
                <TableCell className="text-green-500">Valid</TableCell>
              </TableRow>
              <TableRow className="border-b border-cyan-800">
                <TableCell className="text-white">Email</TableCell>
                <TableCell>
                  <AlertCircle className="text-yellow-500" />
                </TableCell>
                <TableCell className="text-yellow-500">2 duplicate entries found</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4 mt-4">
          <h3 className="text-2xl font-semibold mb-4 text-cyan-300">Import Settings</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="duplicate-handling" className="text-white">
                Handle Duplicate Records
              </Label>
              <Select onValueChange={(value) => handleImportSettingsChange("duplicateHandling", value)}>
                <SelectTrigger
                  id="duplicate-handling"
                  className="bg-transparent border-cyan-500 text-white"
                >
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent className="bg-black text-white">
                  <SelectItem value="skip">Skip</SelectItem>
                  <SelectItem value="update">Update Existing</SelectItem>
                  <SelectItem value="create">Create New</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-sync"
                onCheckedChange={(checked) => handleImportSettingsChange("autoSync", checked)}
                className="bg-cyan-500"
              />
              <Label htmlFor="auto-sync" className="text-white">
                Enable Real-time Sync
              </Label>
            </div>
            <div>
              <Label htmlFor="import-schedule" className="text-white">
                Automated Import Schedule
              </Label>
              <Select onValueChange={(value) => handleImportSettingsChange("importSchedule", value)}>
                <SelectTrigger
                  id="import-schedule"
                  className="bg-transparent border-cyan-500 text-white"
                >
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent className="bg-black text-white">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="confirm" className="space-y-4 mt-4">
          <h3 className="text-2xl font-semibold mb-4 text-cyan-300">Confirm Import</h3>
          <div className="space-y-2 text-white">
            <p>
              Records to be added: <span className="text-green-400">150</span>
            </p>
            <p>
              Records to be updated: <span className="text-yellow-400">20</span>
            </p>
            <p>
              Records to be skipped: <span className="text-red-400">5</span>
            </p>
          </div>
          <Button className="mt-4 bg-green-500 hover:bg-green-600 transition-all duration-300 shadow-glow">
            <RefreshCw className="mr-2 h-4 w-4" /> Start Import
          </Button>
          <div className="mt-8">
            <h4 className="text-xl font-semibold mb-2 text-cyan-300">Import History</h4>
            <Table className="bg-black bg-opacity-50 rounded-lg overflow-hidden">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-cyan-300">Date</TableHead>
                  <TableHead className="text-cyan-300">Records Imported</TableHead>
                  <TableHead className="text-cyan-300">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b border-cyan-800">
                  <TableCell className="text-white">2023-05-15 14:30</TableCell>
                  <TableCell className="text-white">175</TableCell>
                  <TableCell className="text-green-500">Completed</TableCell>
                </TableRow>
                <TableRow className="border-b border-cyan-800">
                  <TableCell className="text-white">2023-05-10 09:15</TableCell>
                  <TableCell className="text-white">120</TableCell>
                  <TableCell className="text-green-500">Completed</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="mt-4 bg-transparent border-cyan-500 text-white hover:bg-cyan-700 transition-all duration-300"
            >
              Need Help?
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-black text-white border-cyan-500">
            <p>Click for step-by-step guidance on importing Google Forms responses.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
