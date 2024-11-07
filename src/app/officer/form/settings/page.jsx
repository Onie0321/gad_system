import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function Settings({ onSettingsChange, importSettings }) {
  return (
    <div>
      <h3 className="text-2xl font-semibold mb-4 text-cyan-300">Import Settings</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="duplicate-handling" className="text-white">
            Handle Duplicate Records
          </Label>
          <Select onValueChange={(value) => onSettingsChange("duplicateHandling", value)}>
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
            onCheckedChange={(checked) => onSettingsChange("autoSync", checked)}
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
          <Select onValueChange={(value) => onSettingsChange("importSchedule", value)}>
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
    </div>
  );
}