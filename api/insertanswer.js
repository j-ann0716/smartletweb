import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { rev_ans_id, reviewer_answer, r_ques_id } = req.body;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    await connection.execute(
      "INSERT INTO rev_ans_tbl (rev_ans_id, reviewer_answer, r_ques_id) VALUES (?, ?, ?)",
      [rev_ans_id, reviewer_answer, r_ques_id]
    );

    await connection.end();

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error inserting answer:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
