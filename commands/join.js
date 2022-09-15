import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.js";
import { ChallengeModel } from "../database/models/challengeModel.js";
import { getUser } from "../utils/codewars.js";

export const buildJoin = () => {
  return new SlashCommandBuilder()
    .setName(CommandNames.join)
    .setDescription("Joins a challenge")
    .addStringOption((opt) =>
      opt.setName("codewarsname").setDescription("Your codewars username")
    );
};

export const join = async (interaction) => {
  const { channelId } = interaction;
  const codewarsName = interaction.options.getString("codewarsname");
  const challenge = await ChallengeModel.findOne({
    channelId: channelId,
    isActive: true,
  });

  const err = await getErrorMessage(interaction, challenge);
  if (err) {
    await interaction.reply(err);
    return;
  }
  challenge.challengers.push(codewarsName);
  await challenge
    .save()
    .then(
      await interaction.reply(`${codewarsName} has joined the challenge 💪🏼.`)
    )
    .catch(async (e) => {
      await interaction.reply(
        `Sorry, it's a bummer that we cannot add you to the challenge at this time! Please check back later...`
      );
      console.error(e);
    });
  return;
};

const getErrorMessage = async (interaction, challenge) => {
  const codewarsName = interaction.options.getString("codewarsname");
  if (!codewarsName) return "Hep! Codewars username required.";
  if (!challenge)
    return "There is no active challenge on this channel yet. But you can start one!";
  const user = await getUser(codewarsName);
  if (user === 404)
    return `Erm, Codewars username ${codewarsName} not found...`;
  if (challenge.challengers.includes(codewarsName))
    return `${codewarsName} is already part of the challenge :)`;
  return null;
};
