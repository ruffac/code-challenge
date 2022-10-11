import { getChallengeStatus } from "./commands/status.js";
import { cron } from "./constants.js";
import { ChallengeModel } from "./database/models/challengeModel.js";

export const setReminder = async (client) => {
  setInterval(async () => {
    if (new Date().getDay() === 2 || new Date().getDay() === 5) {
      sendReminder(client);
    }
  }, cron);
};

export const sendReminder = async (client) => {
  const challenges = await ChallengeModel.find({
    isActive: true,
  });

  for (let challenge of challenges) {
    let channelId = challenge.channelId;
    try {
      client.channels.fetch(channelId).then(async (channel) => {
        console.log(`Sending reminder to ${channel}`);
        const status = await getChallengeStatus(challenge);
        status.forEach(async (status) => {
          await channel.send(status);
        });
      });
    } catch (error) {
      console.error(error);
    }
  }
};
