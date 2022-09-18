import { SlashCommandBuilder } from "discord.js";
import { table } from "table";
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
  // let responseBuilder = "";
  let responseBuilder =
    `:rocket: ${challenge.name} challenge stats :rocket:\n` +
    `${challenge.challengers.length} joined. :drum:\n` +
    "```\n" +
    (await getChallengeProgress(challenge.challengers)) +
    "\n```" +
    `${daysLeft} days left. Carry on!\n` +
    `Challenge ends on ${challenge.endDate.toLocaleString("en-US", {
      timeZone: "Asia/Singapore",
    })}`;
  return responseBuilder;
};

const getChallengeProgress = async (challengers) => {
  let scores = [];
  for (let challenger of challengers) {
    const allKatas = await getCompletedCodeKatas(challenger);
    const challenges = allKatas.filter((kata) => {
      return challengeIds.includes(kata.id);
    });
    scores.push([challenger, (challenges.length / challengeIds.length) * 100]);
    scores.sort((a, b) => {
      if (a[1] === b[1]) return 0;
      else if (a[1] < b[1]) return 1;
      else return -1;
    });
  }
  scores.splice(0, 0, ["username", "completion rate"]);
  return table(scores);
};
