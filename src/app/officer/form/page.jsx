'use client'

import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Upload from "./upload/page";
import Mapping from "./mapping/page";
import Validation from "./validation/page";
import Settings from "./settings/page";
import Confirm from "./confirm/page";

export default function GoogleFormsImport() {
  const [currentStep, setCurrentStep] = useState("upload");
  const [file, setFile] = useState(null);
  const [mappedFields, setMappedFields] = useState({});
  const [importSettings, setImportSettings] = useState({
    duplicateHandling: "skip",
    autoSync: false,
    importSchedule: "daily",
  });

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
    setCurrentStep("mapping");
  };

  const handleFieldMapping = (googleFormField, systemField) => {
    setMappedFields((prev) => ({ ...prev, [googleFormField]: systemField }));
  };

  const handleImportSettingsChange = (setting, value) => {
    setImportSettings((prev) => ({ ...prev, [setting]: value }));
  };

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
        <TabsList variant="outline" className="grid w-full grid-cols-5 gap-2 bg-cyan-700 border-cyan-500 text-white transition-all duration-300">
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
          <Upload onFileUpload={handleFileUpload} />
        </TabsContent>
        <TabsContent value="mapping" className="space-y-4 mt-4">
          <Mapping onFieldMapping={handleFieldMapping} />
        </TabsContent>
        <TabsContent value="validation" className="space-y-4 mt-4">
          <Validation />
        </TabsContent>
        <TabsContent value="settings" className="space-y-4 mt-4">
          <Settings onSettingsChange={handleImportSettingsChange} importSettings={importSettings} />
        </TabsContent>
        <TabsContent value="confirm" className="space-y-4 mt-4">
          <Confirm />
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