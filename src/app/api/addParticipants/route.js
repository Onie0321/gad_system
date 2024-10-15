import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

const mongoURI = process.env.MONGODB_URI;

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sex: { type: String, required: true },
  age: { type: Number, required: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  section: { type: String, required: true },
  ethnicGroup: { type: String, required: true },
  otherEthnicGroup: { type: String },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
});

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true, unique: true },
  eventDate: { type: Date, required: true },
  eventTime: { type: String, required: true },
  eventVenue: { type: String, required: true },
  eventType: { type: String, required: true },
  eventCategory: { type: String, required: true },
  numberOfHours: { type: Number, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Participant" }],
});

let Event;
let Participant;

async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) {
    console.log("Using existing database connection");
    return;
  }

  console.log("Creating new database connection");
  await mongoose.connect(mongoURI);
  console.log("Database connected successfully");
}

function getModels() {
  if (!Event) {
    console.log("Initializing Event model");
    Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
  }
  if (!Participant) {
    console.log("Initializing Participant model");
    Participant =
      mongoose.models.Participant ||
      mongoose.model("Participant", participantSchema);
  }
  return { Event, Participant };
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { Event, Participant } = getModels();

    const {
      name,
      sex,
      age,
      department,
      year,
      section,
      ethnicGroup,
      otherEthnicGroup,
      eventId,
    } = await req.json();

    console.log("Received eventId:", eventId);

    const missingFields = [];

    if (!name) missingFields.push("Name");
    if (!sex) missingFields.push("Sex");
    if (!age) missingFields.push("Age");
    if (!department) missingFields.push("Department");
    if (!year) missingFields.push("Year");
    if (!section) missingFields.push("Section");
    if (!ethnicGroup) missingFields.push("Ethnic Group");
    if (!eventId) missingFields.push("Event ID");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          message: `All fields are required and must be valid: ${missingFields.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    if (isNaN(parseInt(age)) || parseInt(age) <= 0) {
      return NextResponse.json(
        { message: "Age must be a valid positive number" },
        { status: 400 }
      );
    }

    let validEventId;
    try {
      validEventId = new mongoose.Types.ObjectId(eventId);
    } catch (error) {
      console.error("Invalid event ID:", eventId);
      return NextResponse.json(
        { message: "Invalid event ID" },
        { status: 400 }
      );
    }

    const event = await Event.findById(validEventId);
    if (!event) {
      console.error("Event not found for ID:", validEventId);
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const newParticipant = new Participant({
      name,
      sex,
      age: parseInt(age),
      department,
      year,
      section,
      ethnicGroup,
      otherEthnicGroup,
      eventId: validEventId,
    });

    const savedParticipant = await newParticipant.save();

    event.participants.push(savedParticipant._id);
    await event.save();

    return NextResponse.json(
      {
        message: "Participant added successfully",
        participant: savedParticipant,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding participant:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const { Participant } = getModels();

    const { id, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Participant ID is required" },
        { status: 400 }
      );
    }

    // Validate update data
    const allowedFields = [
      "name",
      "sex",
      "age",
      "department",
      "year",
      "section",
      "ethnicGroup",
      "otherEthnicGroup",
    ];
    const invalidFields = Object.keys(updateData).filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return NextResponse.json(
        { message: `Invalid fields: ${invalidFields.join(", ")}` },
        { status: 400 }
      );
    }

    if (
      updateData.age &&
      (isNaN(parseInt(updateData.age)) || parseInt(updateData.age) <= 0)
    ) {
      return NextResponse.json(
        { message: "Age must be a valid positive number" },
        { status: 400 }
      );
    }

    const updatedParticipant = await Participant.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedParticipant) {
      return NextResponse.json(
        { message: "Participant not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Participant updated successfully",
        participant: updatedParticipant,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating participant:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { Event, Participant } = getModels();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Participant ID is required" },
        { status: 400 }
      );
    }

    const deletedParticipant = await Participant.findByIdAndDelete(id).lean();

    if (!deletedParticipant) {
      return NextResponse.json(
        { message: "Participant not found" },
        { status: 404 }
      );
    }

    // Remove participant from the associated event
    await Event.updateOne(
      { _id: deletedParticipant.eventId },
      { $pull: { participants: deletedParticipant._id } }
    );

    return NextResponse.json(
      {
        message: "Participant deleted successfully",
        participantId: deletedParticipant._id.toString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting participant:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
