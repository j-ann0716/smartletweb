import mysql from 'mysql2/promise';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { firstname, lastname, username, email, password, account_type } = req.body;
  console.log("Received data:", req.body);

  // Generate a 9-digit number (e.g., 123456789)
  const userId = 'Us' + Math.floor(Math.random() * 900000000 + 100000000); // Generates a 9-digit number

  try {
    // Connect to the database using environment variables
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    // Insert the data into the database, including the user_id
    const [result] = await db.execute(
      `INSERT INTO user_tbl (user_id, first_name, last_name, username, email, password, account_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, firstname, lastname, username, email, password, account_type]
    );

    console.log("Insert result:", result);

    res.status(201).json({ message: "User created", userId });
  } catch (err) {
    console.error("Database error:", err);

    // Handle duplicate username error (MySQL error code 1062)
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "Username already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}