import { SlashCommandBuilder } from "discord.js";
import { CommandNames } from "../commands.js";
import {
  challengeTypes,
  codeWarsCollectionsAPI,
  defaultChallengeDuration,
  defaultChallengeType,
} from "../constants.js";
import { ChallengeModel } from "../database/models/challengeModel.js";

export const buildStart = () => {
  return new SlashCommandBuilder()
    .setName(CommandNames.start)
    .setDescription("Starts a challenge")
    .addStringOption((opt) =>
      opt
        .setName("name")
        .setDescription("Your challenge's awesome name")
        .setRequired(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("type")
        .setDescription("Your challenge's type")
        .addChoices(
          {
            name: challengeTypes.upliftcodecamp,
            value: challengeTypes.upliftcodecamp,
          },
          {
            name: challengeTypes.javascriptbeginnerfriendly,
            value: challengeTypes.javascriptbeginnerfriendly,
          }
        )
        .setRequired(true)
    )
    .addIntegerOption((opt) =>
      opt
        .setName("duration")
        .setDescription("For how many days is this challenge?")
        .setRequired(true)
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
  const duration =
    interaction.options.getInteger("duration") || defaultChallengeDuration;
  const end = new Date(now.setDate(now.getDate() + duration));
  const challengeType =
    interaction.options.getString("type") || defaultChallengeType;

  challenge = new ChallengeModel({
    name: challengeName,
    startDate: new Date().toISOString(),
    endDate: end,
    createdBy: user.username,
    channelId: channelId,
    challengers: [],
    isActive: true,
    type: challengeType,
  });

  await challenge
    .save()
    .then(async () => {
      await interaction.reply(
        `${challengeName} challenge is started by ${
          user.username
        } 🚀\nHave fun!\nLink to the challenge: ${codeWarsCollectionsAPI}/${challengeType}\nChallenge will end in ${new Date(
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
