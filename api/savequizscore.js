import { supabase } from './supabaseServer.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { score_id, file_name, correct_count, total_num_items, quiz_id, user_id, creator_id, uploaded_date } = req.body;

  try {
    const { error } = await supabase
      .from('quiz_score_tbl')
      .insert([
        {
          score_id,
          file_name,
          correct_count: correct_count || 0,
          total_num_items: total_num_items || 0,
          quiz_id,
          user_id,
          creator_id,
          uploaded_date: uploaded_date || new Date().toISOString()
        }
      ]);

    if (error) throw error;

    res.status(200).json({ message: 'Score saved successfully' });
  } catch (error) {
    console.error("Error saving quiz score:", error);
    res.status(500).json({ error: error.message });
  }
}
