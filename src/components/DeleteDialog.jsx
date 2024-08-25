import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

export default function DeleteDialog({
  isOpen,
  onOpenChange,
  newAttendee = {
    name: "",
    age: 0,
    gender: "Male",
    address: "",
    specialInfo: "",
    date: new Date().toISOString().split("T")[0],
  },
  setNewAttendee,
  addOrUpdateAttendee,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Delete Attendee</DialogTitle>
          <DialogDescription>
            Confirm the deletion of the attendee.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={newAttendee.name}
              onChange={(e) =>
                setNewAttendee({ ...newAttendee, name: e.target.value })
              }
              className="col-span-3 bg-gray-700 border-gray-600"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="age" className="text-right">
              Age
            </Label>
            <Input
              id="age"
              type="number"
              min="0"
              max="999"
              value={newAttendee.age}
              onChange={(e) =>
                setNewAttendee({
                  ...newAttendee,
                  age: Math.min(999, parseInt(e.target.value) || 0),
                })
              }
              className="col-span-3 bg-gray-700 border-gray-600"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">
              Gender
            </Label>
            <Select
              value={newAttendee.gender}
              onValueChange={(value) =>
                setNewAttendee({ ...newAttendee, gender: value })
              }
            >
              <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input
              id="address"
              value={newAttendee.address}
              onChange={(e) =>
                setNewAttendee({ ...newAttendee, address: e.target.value })
              }
              className="col-span-3 bg-gray-700 border-gray-600"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="specialInfo" className="text-right">
              Special Info
            </Label>
            <Input
              id="specialInfo"
              value={newAttendee.specialInfo}
              onChange={(e) =>
                setNewAttendee({ ...newAttendee, specialInfo: e.target.value })
              }
              className="col-span-3 bg-gray-700 border-gray-600"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={newAttendee.date}
              onChange={(e) =>
                setNewAttendee({ ...newAttendee, date: e.target.value })
              }
              className="col-span-3 bg-gray-700 border-gray-600"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={addOrUpdateAttendee}>
            Confirm Deletion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
