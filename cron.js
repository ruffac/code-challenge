import { getChallengeStatus } from "./commands/status.js";
import { cron } from "./constants.js";
import { ChallengeModel } from "./database/models/challengeModel.js";

export const setReminder = async (client) => {
  setInterval(async () => {
    try {
      if (new Date().getDay() === 2 || new Date().getDay() === 5) {
        const challenges = await ChallengeModel.find({
          isActive: true,
        });

        for (let challenge of challenges) {
          let channelId = challenge.channelId;
          client.channels.fetch(channelId).then(async (channel) => {
            await getChallengeStatus(challenge);
            channel.send(await getChallengeStatus(challenge));
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, cron);
};
