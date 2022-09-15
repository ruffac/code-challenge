import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.js";
import {
  defaultChallengeDuration,
  defaultCodewarsChallenge,
} from "../constants.js";
import { ChallengeModel } from "../database/models/challengeModel.js";

export const buildStart = () => {
  return new SlashCommandBuilder()
    .setName(CommandNames.start)
    .setDescription("Starts a challenge")
    .addStringOption((opt) =>
      opt.setName("name").setDescription("The challenge's name")
    );
};
export const start = async (interaction) => {
  const { channelId, user } = interaction;

  let challenge = await ChallengeModel.findOne({
    channelId: channelId,
    isActive: true,
  });
  if (challenge) {
    await interaction.reply(
      "An active challenge already exists for this channel. Do join that challenge!"
    );
    return;
  }

  const challengeName =
    interaction.options.getString("name") ?? `${user.username}'s`;
  const now = new Date();
  const end = new Date(now.setDate(now.getDate() + defaultChallengeDuration));

  challenge = new ChallengeModel({
    name: challengeName,
    startDate: new Date().toISOString(),
    endDate: end,
    createdBy: user.username,
    channelId: channelId,
    challengers: [],
    isActive: true,
  });

  await challenge
    .save()
    .then(async () => {
      await interaction.reply(
        `${challengeName} challenge is started by ${
          user.username
        } 🚀\nHave fun!\nLink to the challenge: ${defaultCodewarsChallenge}\nChallenge will end in ${new Date(
          end
        ).toISOString()}.`
      );
    })
    .catch(async (e) => {
      await interaction.reply(
        `Sorry, it's a bummer that we cannot start the challenge at this time! Please check back later...`
      );
      console.error(e);
    });

  return;
};
