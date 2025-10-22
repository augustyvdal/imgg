import express, { Request, Response } from "express";
import { supabase } from "../utils/supabaseClient.js";
import multer from "multer";

const profileRouter = express.Router();

export type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  updated_at: string;
};

const upload = multer({ storage: multer.memoryStorage() });

/** GET /api/leaderboard */
profileRouter.get("/", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Missing Authorization header" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData?.user) {
        return res.status(401).json({ error: "Unauthorized user" });
    }

    const user = userData.user;

    const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") throw error; 
  res.status(200).json((data as Profile) ?? null);
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

profileRouter.put("/", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Missing Authorization header" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData?.user) {
        return res.status(401).json({ error: "Unauthorized user" });
    }

    const { username } = req.body;
    const updates = {
      username,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userData.user.id);

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

profileRouter.post("/avatar", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Missing Authorization header" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData?.user) {
        return res.status(401).json({ error: "Unauthorized user" });
    }

    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const ext = file.originalname.split(".").pop()?.toLowerCase() || "png";
    const path = `avatars/${userData.user.id}-${Date.now()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("avatars")
      .upload(path, file.buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.mimetype || `image/${ext}`,
      });

    if (uploadErr) throw uploadErr;

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = data.publicUrl;

    await supabase
      .from("profiles")
      .update({ avatar_url: path, updated_at: new Date().toISOString() })
      .eq("id", userData.user.id);

    res.status(200).json({ path, publicUrl });
  } catch (err) {
    console.error("Error uploading avatar:", err);
    res.status(500).json({ error: "Failed to upload avatar" });
  }
});


export default profileRouter;