import { supabase } from './supabaseServer.js';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { rev_ans_id, reviewer_answer, r_ques_id } = req.body;

  try {
    const { error } = await supabase
      .from('rev_ans_tbl')
      .insert([
        {
          rev_ans_id,
          reviewer_answer,
          r_ques_id
        }
      ]);

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error inserting answer:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
