'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ImportData({ onImport }) {
  const [file, setFile] = useState(null);

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // Handle the import process
  const handleImport = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      // Send the imported data back to the parent component (pastEvents)
      onImport(json);

      // Reset the file input field after import
      setFile(null);
      document.getElementById("fileInput").value = ""; // Reset the file input field visually
    };

    reader.readAsArrayBuffer(file); // Read the file as an array buffer
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        id="fileInput" // Assign an ID to the file input for resetting later
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileChange}
        className="bg-gray-700 border-pink-500 text-white"
      />
      <Button onClick={handleImport} disabled={!file} className="bg-green-600 hover:bg-green-700">
        <Upload className="w-4 h-4 mr-2" />
        Import
      </Button>
    </div>
  );
}
