// /pages/api/saveQuizScore.js
import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { score_id, file_name, quiz_id, user_id, creator_id, uploaded_date } = req.body;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    await connection.execute(
      `INSERT INTO quiz_score_tbl (score_id, file_name, quiz_id, user_id, creator_id, uploaded_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [score_id, file_name, quiz_id, user_id, creator_id, uploaded_date]
    );

    res.status(200).json({ message: 'Score saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
