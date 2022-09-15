import { mongoose } from "mongoose";

const challengeSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  createdBy: String,
  channelId: String,
  challengers: Array,
  isActive: Boolean,
});

export const ChallengeModel = mongoose.model("Challenge", challengeSchema);
