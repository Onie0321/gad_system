import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addParticipantToEvent } from "../../../../../lib/appwrite";
import { getAcademicCategories } from "@/utils/categories";

export default function AddParticipantDialog({ open, onOpenChange, event, onAddParticipant }) {
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    sex: "",
    age: "",
    department: "",
    year: "",
    section: "",
    ethnicGroup: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addParticipantToEvent(event.id, newParticipant);
      onAddParticipant();
      onOpenChange(false);
      setNewParticipant({
        name: "",
        sex: "",
        age: "",
        department: "",
        year: "",
        section: "",
        ethnicGroup: "",
      });
    } catch (error) {
      console.error("Error adding participant:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Participant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={newParticipant.name}
            onChange={(e) => setNewParticipant({ ...newParticipant, name: e.target.value })}
            placeholder="Name"
            className="mb-2"
          />
          <Select
            value={newParticipant.sex}
            onValueChange={(value) => setNewParticipant({ ...newParticipant, sex: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={newParticipant.age}
            onChange={(e) => setNewParticipant({ ...newParticipant, age: e.target.value })}
            placeholder="Age"
            className="mb-2"
          />
          <Select
            value={newParticipant.department}
            onValueChange={(value) => setNewParticipant({ ...newParticipant, department: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="School" />
            </SelectTrigger>
            <SelectContent>
              {getAcademicCategories().map((school) => (
                <SelectItem key={school} value={school}>
                  {school}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={newParticipant.year}
            onValueChange={(value) => setNewParticipant({ ...newParticipant, year: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1st Year</SelectItem>
              <SelectItem value="2">2nd Year</SelectItem>
              <SelectItem value="3">3rd Year</SelectItem>
              <SelectItem value="4">4th Year</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={newParticipant.section}
            onChange={(e) => setNewParticipant({ ...newParticipant, section: e.target.value })}
            placeholder="Section"
            className="mb-2"
          />
          <Select
            value={newParticipant.ethnicGroup}
            onValueChange={(value) => setNewParticipant({ ...newParticipant, ethnicGroup: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ethnic Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tagalog">Tagalog</SelectItem>
              <SelectItem value="Cebuano">Cebuano</SelectItem>
              <SelectItem value="Ilocano">Ilocano</SelectItem>
              <SelectItem value="Bicolano">Bicolano</SelectItem>
              <SelectItem value="Waray">Waray</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          
          </Select>
          {newParticipant.ethnicGroup === "Other" && (
            <Input
              value={newParticipant.otherEthnicGroup}
              onChange={(e) => setNewParticipant({ ...newParticipant, otherEthnicGroup: e.target.value })}
              placeholder="Specify Ethnic Group"
              className="mt-2 mb-2"
            />
          )}
          <DialogFooter>
            <Button type="submit">Add Participant</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}