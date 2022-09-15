import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.js";
import { ChallengeModel } from "../database/models/challengeModel.js";

export const buildStop = () => {
  return new SlashCommandBuilder()
    .setName(CommandNames.stop)
    .setDescription("Prematurely stops a challenge");
};
export const stop = async (interaction) => {
  const { channelId, user } = interaction;

  let challenge = await ChallengeModel.findOne({
    channelId: channelId,
    isActive: true,
  });
  if (!challenge) {
    await interaction.reply(
      "Nothing to stop. There is no active challenge on this channel yet."
    );
    return;
  }
  challenge.endDate = new Date().toISOString();
  challenge.isActive = false;
  await challenge
    .save()
    .then(await interaction.reply(`${challenge.name} challenge has been ended`))
    .catch(async (e) => {
      await interaction.reply(
        `The challenge does not want to be stopped at this time! Please check back later...`
      );
      console.error(e);
    });
  return;
};
