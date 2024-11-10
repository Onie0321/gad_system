"use client";
import React, { useState, useEffect } from "react";
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
import { toast } from "react-toastify";
import {
  addParticipantToEvent,
  checkIfParticipantExists,
  getParticipantByStudentId,
} from "@/lib/appwrite";
import { getAcademicCategories } from "@/utils/categories";

export default function AddParticipantDialog({
  open,
  onOpenChange,
  event,
  onAddParticipant,
  onFinish,
}) {
  const [newParticipant, setNewParticipant] = useState({
    studentId: "",
    name: "",
    sex: "",
    age: "",
    school: "",
    year: "",
    section: "",
    ethnicGroup: "",
    otherEthnicGroup: "",
  });

  const [isAdded, setIsAdded] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [maleCount, setMaleCount] = useState(0);
  const [femaleCount, setFemaleCount] = useState(0);
  const [newlyAddedMale, setNewlyAddedMale] = useState(0);
  const [newlyAddedFemale, setNewlyAddedFemale] = useState(0);

  useEffect(() => {
    if (event) {
      setParticipantCount(event.participants?.length || 0);
      setMaleCount(event.participants?.filter((p) => p.sex === "Male").length || 0);
      setFemaleCount(event.participants?.filter((p) => p.sex === "Female").length || 0);
      setNewlyAddedMale(0); // Reset newly added counts
      setNewlyAddedFemale(0);
      setIsAdded(false); // Reset the "isAdded" state when a new event is selected
    }
  }, [event]);

  const handleStudentIdChange = async (value) => {
    const numericValue = value.replace(/\D/g, "");
    const formattedValue = numericValue
      .slice(0, 8)
      .replace(/(\d{2})(\d{2})(\d{4})?/, (match, p1, p2, p3) => {
        let formatted = `${p1}-${p2}`;
        if (p3) formatted += `-${p3}`;
        return formatted;
      });

    setNewParticipant((prev) => ({ ...prev, studentId: formattedValue }));

    if (formattedValue.length === 10) {
      try {
        const existingData = await getParticipantByStudentId(formattedValue);
        if (existingData) {
          setNewParticipant({
            studentId: formattedValue,
            name: existingData.name,
            sex: existingData.sex,
            age: existingData.age,
            school: existingData.school,
            year: existingData.year,
            section: existingData.section,
            ethnicGroup: existingData.ethnicGroup,
            otherEthnicGroup: existingData.otherEthnicGroup || "",
          });
          toast.info("Fields auto-filled with previous participant data.");
        }
      } catch (error) {
        console.error("Error fetching participant data:", error);
        toast.error("Error fetching participant data. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newParticipant.studentId.length !== 10) {
      toast.error("Student ID must be fully filled in the format 00-00-0000");
      return;
    }

    const requiredFields = [
      "studentId",
      "name",
      "sex",
      "age",
      "school",
      "year",
      "section",
      "ethnicGroup",
    ];
    const missingFields = requiredFields.filter(
      (field) => !newParticipant[field]
    );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    if (
      newParticipant.ethnicGroup === "Other" &&
      !newParticipant.otherEthnicGroup
    ) {
      toast.error("Please specify the other ethnic group");
      return;
    }

    try {
      const isDuplicateId = await checkIfParticipantExists(
        event.$id,
        newParticipant.studentId,
        ""
      );
      if (isDuplicateId) {
        toast.error(
          "A participant with this Student ID already exists in this event."
        );
        return;
      }

      const isDuplicateName = await checkIfParticipantExists(
        event.$id,
        "",
        newParticipant.name
      );
      if (isDuplicateName) {
        toast.error(
          "A participant with this Name already exists in this event."
        );
        return;
      }

      await addParticipantToEvent(event.$id, newParticipant);
      onAddParticipant();
      toast.success("Participant added successfully!");
      setIsAdded(true);

      setParticipantCount((prevCount) => prevCount + 1);
      if (newParticipant.sex === "Male") {
        setMaleCount((prev) => prev + 1);
        setNewlyAddedMale((prev) => prev + 1);
      } else if (newParticipant.sex === "Female") {
        setFemaleCount((prev) => prev + 1);
        setNewlyAddedFemale((prev) => prev + 1);
      }

      setNewParticipant({
        studentId: "",
        name: "",
        sex: "",
        age: "",
        school: "",
        year: "",
        section: "",
        ethnicGroup: "",
        otherEthnicGroup: "",
      });
    } catch (error) {
      console.error("Error adding participant:", error);
      toast.error(
        "There was an error adding the participant. Please try again."
      );
    }
  };

  const handleFinish = () => {
    onFinish();
    setNewlyAddedMale(0);
    setNewlyAddedFemale(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isAdded
              ? `Add Another Participant to ${event?.eventName || "Event"}`
              : `Add Participant to ${event?.eventName || "Event"}`}
          </DialogTitle>
          <div className="text-sm font-normal text-muted-foreground mt-2">
            {(newlyAddedMale > 0 || newlyAddedFemale > 0) && (
              <p className="text-green-600 font-semibold">
                Newly added: Male: {newlyAddedMale} | Female: {newlyAddedFemale}
              </p>
            )}
            <p>Total Participants: {participantCount}</p>
            <p>
              Male: {maleCount} | Female: {femaleCount}
            </p>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              value={newParticipant.studentId}
              onChange={(e) => handleStudentIdChange(e.target.value)}
              placeholder="Student ID (00-00-0000)"
            />
            <Input
              value={newParticipant.name}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  name: e.target.value,
                })
              }
              placeholder="Name"
            />
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
            <Input
              type="number"
              value={newParticipant.age}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  age: e.target.value,
                })
              }
              placeholder="Age"
            />
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
            <Input
              value={newParticipant.section}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  section: e.target.value,
                })
              }
              placeholder="Section"
            />
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
            {newParticipant.ethnicGroup === "Other" && (
              <Input
                value={newParticipant.otherEthnicGroup}
                onChange={(e) =>
                  setNewParticipant({
                    ...newParticipant,
                    otherEthnicGroup: e.target.value,
                  })
                }
                placeholder="Specify Ethnic Group"
              />
            )}
          </div>
          <DialogFooter className="mt-6 flex justify-between">
            <Button type="submit">
              {isAdded ? "Add Another Participant" : "Add Participant"}
            </Button>
            <Button type="button" onClick={handleFinish}>
              Finished Adding Participant
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
