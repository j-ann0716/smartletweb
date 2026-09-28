import { supabase } from './supabaseServer.js';

export default async function handler(req, res) {
  const { rid } = req.query;

  if (!rid) {
    return res.status(400).json({ error: "Missing reviewer_id (rid)" });
  }

  try {
    const { data: questions, error: qError } = await supabase
      .from('rev_ques_tbl')
      .select('r_ques_id, reviewer_ques, number_count')
      .eq('reviewer_id', rid)
      .order('number_count', { ascending: true });

    if (qError) throw qError;

    if (!questions || questions.length === 0) {
      return res.status(200).json([]);
    }

    const questionIds = questions.map(q => q.r_ques_id);

    const { data: answers, error: aError } = await supabase
      .from('rev_ans_tbl')
      .select('r_ques_id, reviewer_answer')
      .in('r_ques_id', questionIds);

    if (aError) throw aError;

    const combined = questions.map(q => {
      const match = answers.find(a => a.r_ques_id === q.r_ques_id);
      return {
        question: q.reviewer_ques,
        answer: match ? match.reviewer_answer : "No answer available"
      };
    });

    return res.status(200).json(combined);
  } catch (err) {
    console.error("Error fetching flashcard content:", err);
    return res.status(500).json({ error: err.message });
  }
}
