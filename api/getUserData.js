import { supabase } from './supabaseServer.js';

export default async function handler(req, res) {
  const { user_id, type } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  try {
    if (type === 'flashcards') {
      const { data, error } = await supabase
        .from('reviewer_tbl')
        .select('*')
        .eq('creator_id', user_id);
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (type === 'quizzes') {
      const { data, error } = await supabase
        .from('quiz_tbl')
        .select('*')
        .eq('creator_id', user_id);
      if (error) throw error;
      return res.status(200).json(data);
    }

    return res.status(400).json({ error: 'Invalid type' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
