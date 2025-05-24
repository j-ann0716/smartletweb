import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { reviewer_id, reviewer_title, creator_id, uploaded_date } = req.body;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    await connection.execute(
      "INSERT INTO reviewer_tbl (reviewer_id, reviewer_title, creator_id, uploaded_date) VALUES (?, ?, ?, ?)",
      [reviewer_id, reviewer_title, creator_id, uploaded_date]
    );

    await connection.end();

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error inserting reviewer:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
