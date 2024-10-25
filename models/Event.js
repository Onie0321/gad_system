import mongoose from "mongoose";

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

export const Event =
  mongoose.models.Event || mongoose.model("Event", eventSchema);
