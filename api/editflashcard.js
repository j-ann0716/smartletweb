import mysql from "mysql2/promise";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { reviewer_id, reviewer_title, questions } = req.body;

  if (!reviewer_id || !reviewer_title || !Array.isArray(questions)) {
    return res.status(400).json({ error: "Missing reviewer_id, title or questions." });
  }

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  try {
    await conn.beginTransaction();

    await conn.query(
      "UPDATE reviewer_tbl SET reviewer_title = ? WHERE reviewer_id = ?",
      [reviewer_title, reviewer_id]
    );

    const currentIDs = [];

    for (const q of questions) {
      const { r_ques_id, question, answer } = q;

      if (!r_ques_id || !question || !answer) continue;
      currentIDs.push(r_ques_id);

      const [qRes] = await conn.query(
        "UPDATE rev_ques_tbl SET reviewer_ques = ? WHERE r_ques_id = ? AND reviewer_id = ?",
        [question, r_ques_id, reviewer_id]
      );

      if (qRes.affectedRows === 0) {
        await conn.query(
          "INSERT INTO rev_ques_tbl (r_ques_id, reviewer_id, reviewer_ques) VALUES (?, ?, ?)",
          [r_ques_id, reviewer_id, question]
        );
      }

      const [aRes] = await conn.query(
        "SELECT * FROM rev_ans_tbl WHERE r_ques_id = ?",
        [r_ques_id]
      );

      if (aRes.length > 0) {
        await conn.query(
          "UPDATE rev_ans_tbl SET reviewer_answer = ? WHERE r_ques_id = ?",
          [answer, r_ques_id]
        );
      } else {
        const answer_id = `QA${Math.floor(Math.random() * 1e8).toString().padStart(8, "0")}`;
        await conn.query(
          "INSERT INTO rev_ans_tbl (rev_ans_id, r_ques_id, reviewer_answer) VALUES (?, ?, ?)",
          [answer_id, r_ques_id, answer]
        );
      }
    }

    // DELETE if any questions removed
    if (currentIDs.length > 0) {
      const placeholders = currentIDs.map(() => "?").join(",");
      await conn.query(
        `DELETE FROM rev_ans_tbl 
         WHERE r_ques_id IN (
           SELECT r_ques_id FROM rev_ques_tbl 
           WHERE reviewer_id = ? AND r_ques_id NOT IN (${placeholders})
         )`,
        [reviewer_id, ...currentIDs]
      );

      await conn.query(
        `DELETE FROM rev_ques_tbl 
         WHERE reviewer_id = ? AND r_ques_id NOT IN (${placeholders})`,
        [reviewer_id, ...currentIDs]
      );
    }

    await conn.commit();
    res.status(200).json({ message: "Flashcard updated successfully" });
  } catch (err) {
    await conn.rollback();
    console.error("Update failed:", err);
    res.status(500).json({ error: "Failed to update flashcard" });
  } finally {
    await conn.end();
  }
}
