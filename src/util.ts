import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { userRepository } from "./repository/user";

export type Rank = "S" | "A" | "B" | "C" | "D";

export const getRank = (score: number): Rank => {
  if (825 <= score) {
    return "S";
  } else if (625 <= score) {
    return "A";
  } else if (475 <= score) {
    return "B";
  } else if (300 <= score) {
    return "C";
  } else {
    return "D";
  }
};

export const generateRanking = async () => {
  const { data: users } = await userRepository().getUserList();

  for (const user of users ?? []) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 });

    await page.goto(
      `https://tracker.gg/valorant/profile/riot/${user.name}%23${user.tag}/overview`,
    );
    const bodyHandle = await page.$("body");
    const html = await page.evaluate((body) => {
      if (!body) throw Error("Body not found");
      return body.innerHTML;
    }, bodyHandle);
    const $ = cheerio.load(html);
    const scoreText = $(".score__text .value").text();
    const score = Number(scoreText.split(" ")[0]);

    await userRepository().updateScore({
      name: user.name,
      tag: user.tag,
      score,
      rank: getRank(score),
    });

    await browser.close();
  }
};

export const generateOutput = async () => {
  const text: string[] = [];
  const { data: result } = await userRepository().getUserList();

  if (!result) return;

  const groupedData = result.reduce<Record<string, typeof result>>(
    (acc, item) => {
      if (!acc[item.rank]) {
        acc[item.rank] = [];
      }
      acc[item.rank].push(item);
      return acc;
    },
    {},
  );

  Object.keys(groupedData).forEach((rank) => {
    groupedData[rank].sort((a, b) => b.score - a.score);
  });

  Object.keys(groupedData).forEach((rank) => {
    text.push(`# ${rank}級ヒーロー\n`);
    groupedData[rank].forEach((user, idx) => {
      text.push(
        `${idx + 1}位: ${user.name}#${user.tag} -- スコア: ${user.score}\n`,
      );
    });
    text.push("\n");
  });

  return text.join().replace(/,/g, "");
};
