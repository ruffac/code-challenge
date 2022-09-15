import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.js";
import { challengeIds } from "../constants.js";
import { ChallengeModel } from "../database/models/challengeModel.js";
import { getCompletedCodeKatas } from "../utils/codewars.js";

export const buildStatus = () => {
  return new SlashCommandBuilder()
    .setName(CommandNames.status)
    .setDescription("Status of the challenge");
};

export const status = async (interaction) => {
  const { channelId } = interaction;
  const challenge = await ChallengeModel.findOne({
    channelId: channelId,
    isActive: true,
  });
  if (!challenge) {
    await interaction.reply(
      "There is no active challenge on this channel yet. But you can start one!"
    );
    return;
  }

  await interaction.reply(await getChallengeStatus(challenge));
};

export const getChallengeStatus = async (challenge) => {
  const now = new Date();
  const daysLeft = Math.ceil((challenge.endDate - now) / (1000 * 3600 * 24));
  let responseBuilder = "";
  responseBuilder += `🚀 Challenge ${challenge.name} updates 🚀\n`;
  responseBuilder += `${challenge.challengers.length} joined.\n`;
  responseBuilder += await getChallengeProgress(challenge.challengers);
  responseBuilder += `${daysLeft} days left. Carry on!\n`;
  responseBuilder += `Challenge ends on ${challenge.endDate}`;
  return responseBuilder;
};

const getChallengeProgress = async (challengers) => {
  let progress = "";
  for (let challenger of challengers) {
    const allKatas = await getCompletedCodeKatas(challenger);
    const challenges = allKatas.filter((kata) => {
      return challengeIds.includes(kata.id);
    });
    progress += `${challenger} -> ${challenges.length} challenge completed. ${
      challenges.length / challengeIds.length
    }% completion.\n`;
  }
  return progress;
};
