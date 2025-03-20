import { Client, GatewayIntentBits, SlashCommandBuilder } from "discord.js";
import { userRepository } from "../repository/user";
import { generateOutput, generateRanking } from "../util";

export const useDiscord = () => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });

  const register = new SlashCommandBuilder()
    .setName("register")
    .setDescription("ヒーロー登録の手続きをします")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription(
          "Valorantのユーザー名を入れてください。例: bao#ばおばおならbao",
        )
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("tagline")
        .setDescription(
          "Valorantのタグラインを入れてください。例: bao#ばおばおならばおばお",
        )
        .setRequired(true),
    );

  const getRanking = new SlashCommandBuilder()
    .setName("ranking")
    .setDescription("ヒーローランキングを表示します");

  client.once("ready", async () => {
    if (process.env.DISCORD_SERVER_ID === undefined) {
      throw new Error("DISCORDの環境変数が設定されていません。");
    }

    console.log("Discord: Logged in");

    client.application?.commands.set(
      [register, getRanking],
      process.env.DISCORD_SERVER_ID,
    );
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "register") {
      const name = String(interaction.options.get("name")?.value);
      const tag = String(interaction.options.get("tagline")?.value);

      await interaction.deferReply();
      if (!name || !tag) {
        await interaction.editReply("入力に不備があります!!");
      }

      try {
        await userRepository().addUser({ name, tag });
        await interaction.editReply("ヒーロー登録が完了しました!!");
      } catch (_) {
        await interaction.editReply("登録時にエラーが発生しました...");
      }
    } else if (interaction.commandName === "ranking") {
      await interaction.deferReply();
      try {
        await generateRanking();
      } catch (e) {
        return await interaction.editReply("ランキング作成に失敗しました");
      }

      const text = await generateOutput();

      if (!text) {
        return await interaction.editReply(
          "まだランキングが作成されていません",
        );
      }

      await interaction.editReply(text);
    }
  });

  client.login(process.env.DISCORD_TOKEN);
};
