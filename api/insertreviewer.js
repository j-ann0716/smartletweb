import { supabase } from './supabaseServer.js';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { reviewer_id, reviewer_title, creator_id, uploaded_date } = req.body;

  try {
    const { error } = await supabase
      .from('reviewer_tbl')
      .insert([
        {
          reviewer_id,
          reviewer_title,
          creator_id,
          uploaded_date: uploaded_date || new Date().toISOString()
        }
      ]);

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error inserting reviewer:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
