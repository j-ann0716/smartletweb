import { supabase } from './supabaseServer.js';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { user_id, account_type, activity } = req.body;

  if (!user_id || !activity) {
    return res.status(400).json({ success: false, error: "Missing user_id or activity" });
  }

  try {
    const { error } = await supabase
      .from('activity_log_tbl')
      .insert([
        {
          user_id,
          account_type: account_type || "User",
          activity,
          timestamp: new Date().toISOString()
        }
      ]);

    if (error) throw error;

    return res.status(200).json({ success: true, message: "Activity logged successfully" });
  } catch (err) {
    console.error("Error logging activity:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
