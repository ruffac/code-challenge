import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import * as dotenv from "dotenv";
import { Commands } from "./commands.js";
import { setReminder } from "./cron.js";
import { connectDb } from "./database/connectDb.js";
import { interactionCreateHandler } from "./events/interactionCreateHandler.js";

dotenv.config();
export const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

client.login(process.env.TOKEN);
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on("interactionCreate", interactionCreateHandler);

rest
  .put(Routes.applicationCommands(process.env.CLIENT_ID), {
    body: Commands,
  })
  .then((data) =>
    console.log(`Successfully registered ${data.length} application commands.`)
  )
  .catch(console.error);

connectDb()
  .then(() =>
    console.log(
      `Successfully connected to ${process.env.DB_HOST} on database ${process.env.DB_NAME}!`
    )
  )
  .catch(console.error);

setReminder(client);
