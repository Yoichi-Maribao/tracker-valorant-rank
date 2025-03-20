import * as puppeteer from "puppeteer";
import * as cheerio from "cheerio";

import { generateOutput, getRank } from "./util";

import * as dotenv from "dotenv";
import { userRepository } from "./repository/user";
import { useDiscord } from "./lib/discord";

dotenv.config();

async function main() {
  // const { data: users } = await userRepository().getUserList();
  //
  // for (const user of users ?? []) {
  //   const browser = await puppeteer.launch({ headless: false });
  //   const page = await browser.newPage();
  //   await page.setViewport({ width: 800, height: 600 });
  //
  //   await page.goto(
  //     `https://tracker.gg/valorant/profile/riot/${user.name}%23${user.tag}/overview`,
  //   );
  //   const bodyHandle = await page.$("body");
  //   const html = await page.evaluate((body) => {
  //     if (!body) throw Error("Body not found");
  //     return body.innerHTML;
  //   }, bodyHandle);
  //   const $ = cheerio.load(html);
  //   const scoreText = $(".score__text .value").text();
  //   const score = Number(scoreText.split(" ")[0]);
  //
  //   await userRepository().updateScore({
  //     name: user.name,
  //     tag: user.tag,
  //     score,
  //     rank: getRank(score),
  //   });
  //
  //   await browser.close();
  // }

  useDiscord();
  console.log(await generateOutput());
}

main();
