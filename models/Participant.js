import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sex: { type: String, required: true },
  age: { type: Number, required: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  section: { type: String, required: true },
  ethnicGroup: { type: String, required: true },
  otherEthnicGroup: { type: String },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
});

export const Participant =
  mongoose.models.Participant ||
  mongoose.model("Participant", participantSchema);
