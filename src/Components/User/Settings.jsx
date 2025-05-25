import { useEffect, useState } from "react";
import BackBtn from "../BackBtn";
import closeImg from '../../Webpages/img/icons8-close-48.png';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("loggedInUser")) ||
      JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) {
      setUserId(storedUser.user_id || "");
      setUsername(storedUser.username || "");
    }

    const isDark = localStorage.getItem("theme") === "dark";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
  };

  const handleDeleteAccount = async () => {
    if (!userId && !username) {
      setMessage("User ID or Username not found.");
      setShowMessage(true);
      return;
    }
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        "https://forreact.alwaysdata.net/deleteUserProfile.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, username }),
        }
      );

      const text = await res.text(); // Get raw text
      // console.log("Raw response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        setMessage("Server returned invalid JSON: " + text);
        setShowMessage(true);
        return;
      }

      if (data.success) {
        setMessage("Account deleted successfully.");
        setShowMessage(true);
        // Clear storage and redirect after a short delay so user can read message
        setTimeout(() => {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/";
        }, 2000);
      } else {
        setMessage("Delete failed: " + (data.error || "Unknown error"));
        setShowMessage(true);
      }
    } catch (err) {
      setMessage("An error occurred: " + err.message);
      setShowMessage(true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  const closeMessage = () => {
    setShowMessage(false);
    setMessage("");
  };

  return (
    <div className="space-y-4">
      {/* <button
        onClick={toggleDarkMode}
        className="w-full bg-[#ffffff] text-[#533d64] py-3 px-6 rounded-lg shadow hover:bg-[#ebebeb] transition-all"
      >
        {darkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
      </button> */}

      <button
        onClick={handleDeleteAccount}
        className="w-full bg-[#ffffff] text-[#533d64] py-3 px-6 rounded-lg shadow hover:bg-[#ebebeb] transition-all"
      >
        Delete Account
      </button>

      <button
        onClick={handleLogout}
        className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg shadow hover:bg-gray-500 transition-all"
      >
        Logout
      </button>

      {showMessage && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white px-5 py-5 rounded-xl shadow-lg w-[35%] relative">
            <div className="w-full flex justify-end">
              <button onClick={closeMessage}>
                <BackBtn image={closeImg} />
              </button>
            </div>
            <div className="flex justify-center items-center">
              <p className="text-[18px] text-[#533d64] text-center mb-5">{message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
