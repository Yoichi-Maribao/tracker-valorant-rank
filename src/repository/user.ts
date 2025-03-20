import { useSupabase } from "../lib/supabase";
import { Rank } from "../util";

export const userRepository = () => {
  const { supabase } = useSupabase();

  const getUserList = async () => {
    return await supabase.from("users").select("tag, name, rank, score");
  };

  const addUser = async ({ name, tag }: { name: string; tag: string }) => {
    const { data: userData, error } = await getUserByNameAndTag({ name, tag });

    if (userData && userData.length > 0) {
      console.log(
        "すでに追加されているユーザーです。 \n ユーザー情報:",
        userData,
      );
      throw new Error("登録に失敗しました。");
    } else {
      const { data, error: insertErr } = await supabase
        .from("users")
        .insert({ name, tag })
        .select("*");
      console.log("ユーザーを追加しました。\n ユーザー情報:", data);

      if (insertErr) {
        console.error(insertErr);
        throw new Error("登録に失敗しました。");
      }
    }

    if (error) {
      console.error(error);
      throw new Error("登録に失敗しました。");
    }
  };

  const getUserByNameAndTag = async ({
    name,
    tag,
  }: {
    name: string;
    tag: string;
  }) => {
    return await supabase
      .from("users")
      .select("*")
      .eq("name", name)
      .eq("tag", tag);
  };

  const updateScore = async ({
    name,
    tag,
    score,
    rank,
  }: {
    name: string;
    tag: string;
    score: number;
    rank: Rank;
  }) => {
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("name", name)
      .eq("tag", tag);

    if (userData && userData.length > 0) {
      await supabase
        .from("users")
        .update({ score, rank })
        .eq("id", userData[0].id);
    } else {
      console.error("該当ユーザーが見つかりませんでした;;");
    }
  };

  return {
    getUserList,
    addUser,
    getUserByNameAndTag,
    updateScore,
  };
};
