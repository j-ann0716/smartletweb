import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { r_ques_id, reviewer_ques, number_count, reviewer_id } = req.body;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    await connection.execute(
      "INSERT INTO rev_ques_tbl (r_ques_id, reviewer_ques, number_count, reviewer_id) VALUES (?, ?, ?, ?)",
      [r_ques_id, reviewer_ques, number_count, reviewer_id]
    );

    await connection.end();

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error inserting question:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
