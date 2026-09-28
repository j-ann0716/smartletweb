import { supabase } from './supabaseServer.js';

export default async function handler(req, res) {
  const { user_id, type, quiz_id } = req.query;

  try {
    if (type === 'users') {
      const { data, error } = await supabase.from('user_tbl').select('*');
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (type === 'quizzes' && !user_id) {
      const { data, error } = await supabase.from('quiz_tbl').select('*, user_tbl(username)');
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (type === 'flashcardTitles') {
      const { data, error } = await supabase.from('reviewer_tbl').select('*, user_tbl(username)');
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (type === 'scores') {
      if (!user_id) return res.status(400).json({ error: 'Missing user_id for scores' });
      const { data, error } = await supabase.from('quiz_score_tbl').select('*').eq('user_id', user_id);
      if (error) throw error;
      return res.status(200).json(data);
    }

    if (!user_id) {
      return res.status(400).json({ error: 'Missing user_id' });
    }

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
