import { generateOutput } from "./util";

import * as dotenv from "dotenv";
import { useDiscord } from "./lib/discord";

dotenv.config();

async function main() {
  useDiscord();
  console.log(await generateOutput());
}

main();
