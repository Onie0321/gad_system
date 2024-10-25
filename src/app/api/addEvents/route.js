import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "../../../../models/Event";

const mongoURI = process.env.MONGODB_URI;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 60000, // 60 seconds
  connectTimeoutMS: 60000, // 60 seconds
};

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
    const { Event } = getModels();

    const body = await req.json();
    const {
      eventName,
      eventDate,
      eventTime,
      eventVenue,
      eventType,
      eventCategory,
      numberOfHours,
    } = body;

    // Validate input
    const requiredFields = [
      "eventName",
      "eventDate",
      "eventTime",
      "eventVenue",
      "eventType",
      "eventCategory",
      "numberOfHours",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    if (typeof numberOfHours !== "number") {
      return NextResponse.json(
        { message: "numberOfHours must be a number" },
        { status: 400 }
      );
    }

    const existingEvent = await Event.findOne({
      eventName: new RegExp(`^${eventName}$`, "i"),
    });

    if (existingEvent) {
      return NextResponse.json(
        { message: "An event with this name already exists." },
        { status: 400 }
      );
    }

    const newEvent = new Event({
      eventName,
      eventDate,
      eventTime,
      eventVenue,
      eventType,
      eventCategory,
      numberOfHours,
    });

    const savedEvent = await newEvent.save();

    return NextResponse.json(
      {
        message: "Event created successfully",
        event: {
          _id: savedEvent._id,
          eventName: savedEvent.eventName,
          eventDate: savedEvent.eventDate,
          eventTime: savedEvent.eventTime,
          eventVenue: savedEvent.eventVenue,
          eventType: savedEvent.eventType,
          eventCategory: savedEvent.eventCategory,
          numberOfHours: savedEvent.numberOfHours,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    const { Event } = getModels();

    console.log("Fetching events");
    const events = await Event.find().populate("participants").lean();
    console.log(`Found ${events.length} events`);

    const formattedEvents = events.map((event) => ({
      id: event._id.toString(),
      eventName: event.eventName,
      eventDate: event.eventDate.toISOString(),
      eventTime: event.eventTime,
      eventVenue: event.eventVenue,
      eventType: event.eventType,
      eventCategory: event.eventCategory,
      numberOfHours: event.numberOfHours,
      participants: event.participants.map((participant) => ({
        id: participant._id.toString(),
        name: participant.name,
        sex: participant.sex,
        age: participant.age,
        department: participant.department,
        year: participant.year,
        section: participant.section,
        ethnicGroup: participant.ethnicGroup,
        otherEthnicGroup: participant.otherEthnicGroup,
      })),
    }));

    return NextResponse.json(formattedEvents, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const { Event } = getModels();

    const { id, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Event ID is required" },
        { status: 400 }
      );
    }

    // Validate update data
    const allowedFields = [
      "eventName",
      "eventDate",
      "eventTime",
      "eventVenue",
      "eventType",
      "eventCategory",
      "numberOfHours",
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
      updateData.numberOfHours &&
      typeof updateData.numberOfHours !== "number"
    ) {
      return NextResponse.json(
        { message: "numberOfHours must be a number" },
        { status: 400 }
      );
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();

    if (!updatedEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Event updated successfully",
        event: {
          id: updatedEvent._id.toString(),
          eventName: updatedEvent.eventName,
          eventDate: updatedEvent.eventDate.toISOString(),
          eventTime: updatedEvent.eventTime,
          eventVenue: updatedEvent.eventVenue,
          eventType: updatedEvent.eventType,
          eventCategory: updatedEvent.eventCategory,
          numberOfHours: updatedEvent.numberOfHours,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating event:", error);
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
        { message: "Event ID is required" },
        { status: 400 }
      );
    }

    const deletedEvent = await Event.findByIdAndDelete(id).lean();

    if (!deletedEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Delete associated participants
    await Participant.deleteMany({ eventId: id });

    return NextResponse.json(
      {
        message: "Event and associated participants deleted successfully",
        eventId: deletedEvent._id.toString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
