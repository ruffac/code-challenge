import { buildJoin } from "./commands/join.js";
import { buildStart } from "./commands/start.js";
import { buildStatus } from "./commands/status.js";
import { buildStop } from "./commands/stop.js";
export const CommandNames = {
  start: "start",
  join: "join",
  status: "status",
  stop: "stop",
};
export const Commands = [
  buildStart(),
  buildJoin(),
  buildStatus(),
  buildStop(),
].map((command) => command.toJSON());
