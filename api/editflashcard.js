import { supabase } from './supabaseServer.js';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { reviewer_id, reviewer_title, questions } = req.body;

  if (!reviewer_id || !reviewer_title || !Array.isArray(questions)) {
    return res.status(400).json({ error: "Missing reviewer_id, title or questions." });
  }

  try {
    const { error: revError } = await supabase
      .from('reviewer_tbl')
      .update({ reviewer_title })
      .eq('reviewer_id', reviewer_id);

    if (revError) throw revError;

    const currentIDs = [];

    for (const q of questions) {
      const { r_ques_id, question, answer } = q;
      if (!r_ques_id || !question || !answer) continue;

      currentIDs.push(r_ques_id);

      const { data: existingQ } = await supabase
        .from('rev_ques_tbl')
        .select('r_ques_id')
        .eq('r_ques_id', r_ques_id)
        .eq('reviewer_id', reviewer_id)
        .single();

      if (existingQ) {
        await supabase
          .from('rev_ques_tbl')
          .update({ reviewer_ques: question })
          .eq('r_ques_id', r_ques_id);
      } else {
        await supabase
          .from('rev_ques_tbl')
          .insert([{ r_ques_id, reviewer_id, reviewer_ques: question, number_count: currentIDs.length }]);
      }

      const { data: existingAns } = await supabase
        .from('rev_ans_tbl')
        .select('rev_ans_id')
        .eq('r_ques_id', r_ques_id);

      if (existingAns && existingAns.length > 0) {
        await supabase
          .from('rev_ans_tbl')
          .update({ reviewer_answer: answer })
          .eq('r_ques_id', r_ques_id);
      } else {
        const answer_id = `QA${Math.floor(Math.random() * 1e8).toString().padStart(8, "0")}`;
        await supabase
          .from('rev_ans_tbl')
          .insert([{ rev_ans_id: answer_id, r_ques_id, reviewer_answer: answer }]);
      }
    }

    if (currentIDs.length > 0) {
      const { data: allQuestions } = await supabase
        .from('rev_ques_tbl')
        .select('r_ques_id')
        .eq('reviewer_id', reviewer_id);

      const idsToDelete = allQuestions
        ?.map(q => q.r_ques_id)
        .filter(id => !currentIDs.includes(id)) || [];

      if (idsToDelete.length > 0) {
        await supabase.from('rev_ans_tbl').delete().in('r_ques_id', idsToDelete);
        await supabase.from('rev_ques_tbl').delete().in('r_ques_id', idsToDelete);
      }
    }

    res.status(200).json({ message: "Flashcard updated successfully" });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ error: "Failed to update flashcard: " + err.message });
  }
}
