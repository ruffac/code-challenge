import { mongoose } from "mongoose";

const challengeSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  createdBy: String,
  channelId: String,
  challengers: Array,
  isActive: Boolean,
  type: String, // should be one of the constant.js/challenges
});

export const ChallengeModel = mongoose.model("Challenge", challengeSchema);
