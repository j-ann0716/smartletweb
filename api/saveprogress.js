import { supabase } from './supabaseServer.js';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { user_id, reviewer_id, progress } = req.body;

  if (!user_id || !reviewer_id || typeof progress !== 'number') {
    return res.status(400).json({ success: false, error: "Missing or invalid parameters" });
  }

  try {
    const { error } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_id,
          reviewer_id,
          progress,
          last_updated: new Date().toISOString()
        },
        { onConflict: 'user_id,reviewer_id' }
      );

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error saving progress:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
