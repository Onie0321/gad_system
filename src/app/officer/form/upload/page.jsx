import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileUp } from "lucide-react";
import { uploadDataToAppwrite } from "../../../../lib/appwrite"; // Import the function

export default function Uploads({ onFileUpload }) {
  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      // Use FileReader to read CSV file
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target.result;
        const csvData = parseCSV(fileContent); // Function to parse CSV
        await uploadDataToAppwrite(csvData); // Call function to upload to Appwrite
      };
      reader.readAsText(uploadedFile);
    }
  };

  const handleGoogleFormImport = async () => {
    const googleFormData = await fetchGoogleFormData(); // Fetch from Google Forms
    await uploadDataToAppwrite(googleFormData); // Upload to Appwrite
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Button
          onClick={() => document.getElementById("file-upload")?.click()}
          className="bg-gray-700 border-cyan-500 text-white hover:bg-cyan-600 transition-all duration-300 shadow-glow"
        >
          <Upload className="mr-2 h-4 w-4" /> Upload CSV
        </Button>
        <Button
          className="bg-gray-700 border-pink-500 text-white hover:bg-pink-600 transition-all duration-300 shadow-glow"
          onClick={handleGoogleFormImport} // Call this when Google Form button is clicked
        >
          <FileUp className="mr-2 h-4 w-4" /> Import via Google Forms API
        </Button>
      </div>
      <Input
        id="file-upload"
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileUpload} // Handles CSV upload
      />
    </div>
  );
}

// Function to parse CSV content
function parseCSV(csvContent) {
  const lines = csvContent.split("\n");
  const headers = lines[0].split(",");
  const row = {};
headers.forEach((header, index) => {
  // Ensure header and values[index] are defined before calling trim
  row[header?.trim() ?? header] = values[index]?.trim() ?? values[index];
});
return row;
}
