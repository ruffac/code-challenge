import { CommandNames } from "../commands.js";
import { join } from "../commands/join.js";
import { start } from "../commands/start.js";
import { status } from "../commands/status.js";
import { stop } from "../commands/stop.js";

export const interactionCreateHandler = async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  try {
    switch (interaction.commandName) {
      case CommandNames.start:
        await start(interaction);
        break;
      case CommandNames.join:
        await join(interaction);
        break;
      case CommandNames.status:
        await status(interaction);
        break;
      case CommandNames.stop:
        await stop(interaction);
        break;
      default:
        await interaction.reply(
          "Hmmm, we seem to not know what to do with that. Please send a message to the admin."
        );
        break;
    }
  } catch (e) {
    console.error(e);
    await interaction.reply(
      "Ouch! An error has occurred. Please try again at a later time..."
    );
  }
};
