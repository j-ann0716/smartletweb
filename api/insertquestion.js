import { supabase } from './supabaseServer.js';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { r_ques_id, reviewer_ques, number_count, reviewer_id } = req.body;

  try {
    const { error } = await supabase
      .from('rev_ques_tbl')
      .insert([
        {
          r_ques_id,
          reviewer_ques,
          number_count,
          reviewer_id
        }
      ]);

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error inserting question:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
