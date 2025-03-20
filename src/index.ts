import { generateOutput } from "./lib/util";

import * as dotenv from "dotenv";
import { useDiscord } from "./lib/discord";
import { server } from "./server";

dotenv.config();

async function main() {
  useDiscord();
  server();
}

main();
