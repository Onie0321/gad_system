import React, { useState, useEffect } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users, AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import {
  addParticipantToEvent,
  checkIfParticipantExists,
} from "@/lib/appwrite";

export default function Component({
  selectedEvent,
  setEvents,
  setSelectedEvent,
  setIsAddingParticipants,
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
  const [hasAddedFirstParticipant, setHasAddedFirstParticipant] =
    useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [maleCount, setMaleCount] = useState(0);   // Track male count
const [femaleCount, setFemaleCount] = useState(0); // Track female count
  const [selectedGenders, setSelectedGenders] = useState(new Set());
  const [isAddingParticipantsLocal, setIsAddingParticipantsLocal] =
    useState(false);
    const [showAlert, setShowAlert] = useState(false); // New state for alert

    

  useEffect(() => {
    if (selectedEvent) {
      setIsAddingParticipantsLocal(true);
      setParticipantCount(selectedEvent.participants?.length || 0);
    } else {
      setIsAddingParticipantsLocal(false);
    }
  }, [selectedEvent]);

  const resetForm = () => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentIdPattern = /^\d{2}-\d{2}-\d{4}$/;
    if (!studentIdPattern.test(newParticipant.studentId)) {
      toast.error("Student ID must follow the format XX-XX-XXXX");
      return;
    }
  

    if (!selectedEvent || !selectedEvent.$id) {
      toast.error(
        "No event found. Please add an event before adding participants."
      );
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
      // Check for duplicate Student ID
      const isStudentIdDuplicate = await checkIfParticipantExists(
        selectedEvent.$id,
        newParticipant.studentId,
        ""
      );
  
      if (isStudentIdDuplicate) {
        toast.error("A participant with this Student ID already exists in this event.");
        return;
      }
  
      // Check for duplicate Name
      const isNameDuplicate = await checkIfParticipantExists(
        selectedEvent.$id,
        "",
        newParticipant.name
      );
  
      if (isNameDuplicate) {
        toast.error("A participant with this Name already exists in this event.");
        return;
      }

      const updatedEvent = await addParticipantToEvent(
        selectedEvent.$id,
        newParticipant
      );

      if (setSelectedEvent) {
        setSelectedEvent(updatedEvent); // Ensure setSelectedEvent is a function before calling
      }

      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.$id === updatedEvent.$id ? updatedEvent : event
        )
      );

      

      resetForm(); // Reset input fields
      setHasAddedFirstParticipant(true); // Update button text
      setParticipantCount((prevCount) => prevCount + 1);

       // Increment male or female count based on selected gender
    if (newParticipant.sex === "Male") {
      setMaleCount((prevMaleCount) => prevMaleCount + 1);
    } else if (newParticipant.sex === "Female") {
      setFemaleCount((prevFemaleCount) => prevFemaleCount + 1);
    }

      toast.success("Participant added successfully!");
    } catch (error) {
      console.error("Error adding participant:", error);
      toast.error(
        error.message || "Failed to add participant. Please try again."
      );
    }
  };

  const finishAddingParticipants = () => {
    if (selectedEvent) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.$id === selectedEvent.$id ? selectedEvent : event
        )
      );

      setIsAddingParticipants(false);
      resetForm();
      setShowAlert(true); // Show alert when finishing
      setIsAddingParticipantsLocal(false); // Disable further additions
      toast.success("Adding Participants Done");
    } else {
      // Show warning if no event is selected
      toast.error("Please add a new event before adding participants.");
    }
  };
  const validateAge = (value) => {
    const parsedValue = Number(value);
    return !isNaN(parsedValue) &&
      parsedValue > 0 &&
      Number.isInteger(parsedValue)
      ? parsedValue
      : "";
  };

  const validateStudentId = (value) => {
    // Remove all non-digit characters
    const onlyNumbers = value.replace(/\D/g, "");
  
    // Format based on length
    if (onlyNumbers.length <= 2) {
      return onlyNumbers;
    } else if (onlyNumbers.length <= 4) {
      return `${onlyNumbers.slice(0, 2)}-${onlyNumbers.slice(2)}`;
    } else if (onlyNumbers.length <= 8) {
      return `${onlyNumbers.slice(0, 2)}-${onlyNumbers.slice(2, 4)}-${onlyNumbers.slice(4)}`;
    } else {
      return `${onlyNumbers.slice(0, 2)}-${onlyNumbers.slice(2, 4)}-${onlyNumbers.slice(4, 8)}`;
    }
  };

  return (
    <Card className="col-span-2 bg-gray-800 border-2 border-blue-500 rounded-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-400">
          <Users className="inline-block mr-2" />
          Add Participants
        </CardTitle>
        {selectedEvent && (
          <p className="text-blue-300 mt-2">
            Adding participants to: {selectedEvent.eventName}
          </p>
        )}
        {selectedEvent && (
         <p className="text-blue-300 mt-2">
         Total Participants: {participantCount} (Male: {maleCount}, Female: {femaleCount})
       </p>
        )}
       
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentId" className="text-blue-400">
              Student ID
            </Label>
            <Input
              id="studentId"
              value={newParticipant.studentId}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  studentId: validateStudentId(e.target.value),
                })
              }
              className="bg-gray-700 border-blue-500 text-white"
              disabled={!isAddingParticipantsLocal}
              placeholder="21-01-2098"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-blue-400">
              Name
            </Label>
            <Input
              id="name"
              value={newParticipant.name}
              onChange={(e) =>
                setNewParticipant({ ...newParticipant, name: e.target.value })
              }
              className="bg-gray-700 border-blue-500 text-white"
              disabled={!isAddingParticipantsLocal}
              placeholder="Enter your Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sex" className="text-blue-400">
              Sex
            </Label>
            <Select
              value={newParticipant.sex} // Bind select value to newParticipant state
              onValueChange={(value) =>
                setNewParticipant({ ...newParticipant, sex: value })
              }
              disabled={!isAddingParticipantsLocal}
            >
              <SelectTrigger
                id="sex"
                className="bg-gray-700 border-blue-500 text-white"
              >
                <SelectValue placeholder="Select Sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male" disabled={selectedGenders.has("Male")}>
                  Male
                </SelectItem>
                <SelectItem
                  value="Female"
                  disabled={selectedGenders.has("Female")}
                >
                  Female
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="age" className="text-blue-400">
              Age
            </Label>
            <Input
              id="age"
              type="number"
              value={newParticipant.age}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  age: validateAge(e.target.value),
                })
              }
              className="bg-gray-700 border-blue-500 text-white"
              disabled={!isAddingParticipantsLocal}
              placeholder="Enter your Age"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="school" className="text-blue-400">
              School
            </Label>
            <Select
            value={newParticipant.school}
              onValueChange={(value) =>
                setNewParticipant({ ...newParticipant, school: value })
              }
              disabled={!isAddingParticipantsLocal}
            >
              <SelectTrigger
                id="school"
                className="bg-gray-700 border-blue-500 text-white"
              >
                <SelectValue placeholder="Select School" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ABM">
                  School of Accountancy and Business Management
                </SelectItem>
                <SelectItem value="AS">
                  School of Agricultural Science
                </SelectItem>
                <SelectItem value="AAS">School of Arts and Sciences</SelectItem>
                <SelectItem value="ED">School of Education</SelectItem>
                <SelectItem value="ENG">School of Engineering</SelectItem>
                <SelectItem value="FOS">
                  School of Fisheries and Oceanic Science
                </SelectItem>
                <SelectItem value="FES">
                  School of Forestry and Environmental Sciences
                </SelectItem>
                <SelectItem value="IT">
                  School of Industrial Technology
                </SelectItem>
                <SelectItem value="IT2">
                  School of Information Technology
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="year" className="text-blue-400">
              Year
            </Label>
            <Select
            value={newParticipant.year}
              onValueChange={(value) =>
                setNewParticipant({ ...newParticipant, year: value })
              }
              disabled={!isAddingParticipantsLocal}
            >
              <SelectTrigger
                id="year"
                className="bg-gray-700 border-blue-500 text-white"
              >
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="First">First Year</SelectItem>
                <SelectItem value="Second">Second Year</SelectItem>
                <SelectItem value="Third">Third Year</SelectItem>
                <SelectItem value="Fourth">Fourth Year</SelectItem>
                <SelectItem value="Fifth">Fifth Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="section" className="text-blue-400">
              Section
            </Label>
            <Input
              id="section"
              value={newParticipant.section}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  section: e.target.value,
                })
              }
              className="bg-gray-700 border-blue-500 text-white"
              disabled={!isAddingParticipantsLocal}
              placeholder="Enter your Section"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ethnicGroup" className="text-blue-400">
              Ethnic Group
            </Label>
            <Select
            value={newParticipant.ethnicGroup}
              onValueChange={(value) =>
                setNewParticipant({
                  ...newParticipant,
                  ethnicGroup: value,
                  otherEthnicGroup: "",
                })
              }
              disabled={!isAddingParticipantsLocal}
            >
              <SelectTrigger
                id="ethnicGroup"
                className="bg-gray-700 border-blue-500 text-white"
              >
                <SelectValue placeholder="Select Ethnic Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Agta">Agta</SelectItem>
                <SelectItem value="Ilokano">Ilokano</SelectItem>
                <SelectItem value="Ibanag">Ibanag</SelectItem>
                <SelectItem value="Ifugao">Ifugao</SelectItem>
                <SelectItem value="Tagalog">Tagalog</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {newParticipant.ethnicGroup === "Other" && (
            <div className="space-y-2">
              <Label htmlFor="otherEthnicGroup" className="text-blue-400">
                Specify Other Ethnic Group
              </Label>
              <Input
                id="otherEthnicGroup"
                value={newParticipant.otherEthnicGroup}
                onChange={(e) =>
                  setNewParticipant({
                    ...newParticipant,
                    otherEthnicGroup: e.target.value,
                  })
                }
                className="bg-gray-700 border-blue-500 text-white"
                disabled={!isAddingParticipantsLocal}
                placeholder="Specify Other Ethnic Group"
              />
            </div>
          )}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!isAddingParticipantsLocal}
          >
            {hasAddedFirstParticipant
              ? "Add Another Participant"
              : "Add Participant"}
          </Button>
        </form>
        {isAddingParticipantsLocal && (
          <Button
            onClick={finishAddingParticipants}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white"
          >
            Finish Adding Participants
          </Button>
        )}
         {!isAddingParticipantsLocal && showAlert && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Please add a new event before adding participants.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
