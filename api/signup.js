import { supabase } from './supabaseServer.js';

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { firstname, lastname, username, email, password, account_type } = req.body;

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          first_name: firstname,
          last_name: lastname,
          account_type: account_type || 'User'
        }
      }
    });

    if (authError) throw authError;

    res.status(201).json({ message: "User created", userId: authData.user.id });
  } catch (err) {
    console.error("Signup error:", err);
    if (err.message?.includes('duplicate key') || err.message?.includes('already registered')) {
      return res.status(409).json({ error: "Username or Email already exists" });
    }
    res.status(500).json({ error: err.message || "Internal server error" });
  }
}
