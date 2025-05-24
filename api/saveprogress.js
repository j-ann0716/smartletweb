import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { user_id, reviewer_id, progress } = req.body;

  if (!user_id || !reviewer_id || typeof progress !== 'number') {
    return res.status(400).json({ success: false, error: "Missing or invalid parameters" });
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const query = `
      INSERT INTO user_progress (user_id, reviewer_id, progress, last_updated)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON DUPLICATE KEY UPDATE
        progress = VALUES(progress),
        last_updated = CURRENT_TIMESTAMP
    `;

    await connection.execute(query, [user_id, reviewer_id, progress]);
    await connection.end();

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error saving progress:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
