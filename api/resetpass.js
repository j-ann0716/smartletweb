import { supabase } from './supabaseServer.js';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { identifier, newPassword } = req.body;

  if (!identifier || !newPassword) {
    return res.status(400).json({ message: "Missing identifier or new password." });
  }

  try {
    const { data: userData, error: userError } = await supabase
      .from('user_tbl')
      .select('user_id')
      .or(`username.eq.${identifier},email.eq.${identifier}`)
      .single();

    if (userError || !userData) {
      return res.status(404).json({ message: "User not found." });
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userData.user_id,
      { password: newPassword }
    );

    if (updateError) throw updateError;

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ message: err.message || "Server error." });
  }
}
