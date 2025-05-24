import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { identifier, newPassword } = req.body;

  if (!identifier || !newPassword) {
    return res.status(400).json({ message: "Missing identifier or new password." });
  }

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // Optional: Hash password before storing (RECOMMENDED)
    // You can use bcrypt here if you prefer stronger hashing
    const hashedPassword = newPassword; // Replace with hashed if needed

    const [result] = await db.execute(
      `UPDATE user_tbl SET password = ? WHERE username = ? OR email = ?`,
      [hashedPassword, identifier, identifier]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "Password updated successfully." });

  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: "Server error." });
  }
}
