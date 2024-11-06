import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addParticipantToEvent } from "../../../../../lib/appwrite";

export default function EditParticipantDialog({ participant, onOpenChange, onUpdateParticipant }) {
  const [editingParticipant, setEditingParticipant] = React.useState(participant);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addParticipantToEvent(editingParticipant);
      onUpdateParticipant();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating participant:", error);
    }
  };

  if (!participant) return null;

  return (
    <Dialog open={!!participant} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Participant</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={editingParticipant.name}
            onChange={(e) => setEditingParticipant({ ...editingParticipant, name: e.target.value })}
            placeholder="Name"
            className="mb-2"
          />
          <Select
            value={editingParticipant.sex}
            onValueChange={(value) => setEditingParticipant({ ...editingParticipant, sex: value })}
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
            value={editingParticipant.age}
            onChange={(e) => setEditingParticipant({ ...editingParticipant, age: e.target.value })}
            placeholder="Age"
            className="mb-2"
          />
          <Input
            value={editingParticipant.department}
            onChange={(e) => setEditingParticipant({ ...editingParticipant, department: e.target.value })}
            placeholder="School"
            className="mb-2"
          />
          <Input
            value={editingParticipant.year}
            onChange={(e) => setEditingParticipant({ ...editingParticipant, year: e.target.value })}
            placeholder="Year"
            className="mb-2"
          />
          <Input
            value={editingParticipant.section}
            onChange={(e) => setEditingParticipant({ ...editingParticipant, section: e.target.value })}
            placeholder="Section"
            className="mb-2"
          />
          <Input
            value={editingParticipant.ethnicGroup}
            onChange={(e) => setEditingParticipant({ ...editingParticipant, ethnicGroup: e.target.value })}
            placeholder="Ethnic Group"
            className="mb-2"
          />
          <Button type="submit">Update Participant</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}