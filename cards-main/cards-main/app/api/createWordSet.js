// pages/api/createWordSet.js

import { createClient } from "@/utils/supabase/server";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Initialize Supabase client
    const supabase = createClient();

    const { user_id, name } = req.body;

    // Validate input
    if (!user_id || !name) {
      return res
        .status(400)
        .json({ error: "Missing required fields: user_id or name" });
    }

    try {
      const { data, error } = await supabase
        .from("word_sets")
        .insert([{ user_id, name }], { returning: "representation" });

      if (error) {
        throw error;
      }

      return res
        .status(201)
        .json({ message: "Word set created successfully", data: data[0] });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
