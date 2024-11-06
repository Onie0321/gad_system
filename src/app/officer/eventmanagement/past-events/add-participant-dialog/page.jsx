import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  addParticipantToEvent,
  checkIfParticipantExists,
} from "../../../../../lib/appwrite";
import { getAcademicCategories } from "@/utils/categories";
import { toast } from "react-toastify"; // Import toast for showing messages

export default function AddParticipantDialog({
  open,
  onOpenChange,
  event, // Event object that contains event details, including name
  onAddParticipant,
}) {
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    sex: "",
    age: "",
    school: "",
    year: "",
    section: "",
    ethnicGroup: "",
    otherEthnicGroup: "",
  });

  const [errors, setErrors] = useState({});
  const [isAdded, setIsAdded] = useState(false); // Track if participant is added
  const [submissionError, setSubmissionError] = useState(null); // Track submission errors

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!newParticipant.name) newErrors.name = "Name is required";
    if (!newParticipant.sex) newErrors.sex = "Sex is required";
    if (!newParticipant.age || isNaN(parseInt(newParticipant.age)))
      newErrors.age = "Valid age is required";
    if (!newParticipant.school) newErrors.school = "School is required";
    if (!newParticipant.year) newErrors.year = "Year is required";
    if (!newParticipant.section) newErrors.section = "Section is required";
    if (!newParticipant.ethnicGroup)
      newErrors.ethnicGroup = "Ethnic group is required";
    if (
      newParticipant.ethnicGroup === "Other" &&
      !newParticipant.otherEthnicGroup
    )
      newErrors.otherEthnicGroup = "Please specify the ethnic group";

    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear submission error
    setSubmissionError(null);

    // Validate form inputs
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop submission if validation fails
    }

    try {
      // Check if the participant already exists
      const isParticipantExists = await checkIfParticipantExists(
        event.$id,
        newParticipant.name
      );

      if (isParticipantExists) {
        // Show a toast message that participant is already added
        toast.error("Participant with the same name is already added.");
        return;
      }

      // Use event.$id as the event ID
      await addParticipantToEvent(event.$id, newParticipant);
      onAddParticipant();

      // Show success toast notification
      toast.success("Participant added successfully!");

      setIsAdded(true); // Set the state to indicate participant was added

      // Reset the form for adding another participant
      setNewParticipant({
        name: "",
        sex: "",
        age: "",
        school: "",
        year: "",
        section: "",
        ethnicGroup: "",
        otherEthnicGroup: "",
      });
      setErrors({}); // Clear errors after successful submission
    } catch (error) {
      console.error("Error adding participant:", error);
      // Show error toast notification
      toast.error(
        "There was an error adding the participant. Please try again."
      );
    }
  };

  const handleAddAnother = () => {
    setIsAdded(false); // Reset the button and form for a new participant
    onOpenChange(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isAdded
              ? `Add Another Participant to ${event?.eventName || "Event"}`
              : `Add Participant to ${event?.eventName || "Event"}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <Input
              value={newParticipant.name}
              onChange={(e) =>
                setNewParticipant({ ...newParticipant, name: e.target.value })
              }
              placeholder="Name"
              className="mb-1"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="mb-2">
            <Select
              value={newParticipant.sex}
              onValueChange={(value) =>
                setNewParticipant({ ...newParticipant, sex: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
            {errors.sex && <p className="text-red-500 text-sm">{errors.sex}</p>}
          </div>
          <div className="mb-2">
            <Input
              type="number"
              value={newParticipant.age}
              onChange={(e) =>
                setNewParticipant({ ...newParticipant, age: e.target.value })
              }
              placeholder="Age"
              className="mb-1"
            />
            {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>
          <div className="mb-2">
            <Select
              value={newParticipant.school}
              onValueChange={(value) =>
                setNewParticipant({ ...newParticipant, school: value })
              }
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
            {errors.school && (
              <p className="text-red-500 text-sm">{errors.school}</p>
            )}
          </div>
          <div className="mb-2">
            <Select
              value={newParticipant.year}
              onValueChange={(value) =>
                setNewParticipant({ ...newParticipant, year: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
                <SelectItem value="5">5th Year</SelectItem>
              </SelectContent>
            </Select>
            {errors.year && (
              <p className="text-red-500 text-sm">{errors.year}</p>
            )}
          </div>
          <div className="mb-2">
            <Input
              value={newParticipant.section}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  section: e.target.value,
                })
              }
              placeholder="Section"
              className="mb-1"
            />
            {errors.section && (
              <p className="text-red-500 text-sm">{errors.section}</p>
            )}
          </div>
          <div className="mb-2">
            <Select
              value={newParticipant.ethnicGroup}
              onValueChange={(value) =>
                setNewParticipant({ ...newParticipant, ethnicGroup: value })
              }
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
            {errors.ethnicGroup && (
              <p className="text-red-500 text-sm">{errors.ethnicGroup}</p>
            )}
          </div>
          {newParticipant.ethnicGroup === "Other" && (
            <div className="mb-2">
              <Input
                value={newParticipant.otherEthnicGroup}
                onChange={(e) =>
                  setNewParticipant({
                    ...newParticipant,
                    otherEthnicGroup: e.target.value,
                  })
                }
                placeholder="Specify Ethnic Group"
                className="mb-1"
              />
              {errors.otherEthnicGroup && (
                <p className="text-red-500 text-sm">
                  {errors.otherEthnicGroup}
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            {isAdded ? (
              <Button type="button" onClick={handleAddAnother}>
                Add Another Participant
              </Button>
            ) : (
              <Button type="submit">Add Participant</Button>
            )}
          </DialogFooter>
          {submissionError && (
            <p className="text-red-500 mt-2">{submissionError}</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
