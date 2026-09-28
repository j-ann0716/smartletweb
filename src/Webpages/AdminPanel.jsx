import { useState, useEffect } from "react";
import UserManagement from "../Components/AdminPanel/UserManagement";
import QuizFlashcardPanel from "../Components/AdminPanel/QuizFlashcardPanel";
import ActivityLog from "../Components/AdminPanel/ActivityLog";

export default function AdminPanel() {
  document.title = "Smartlet - Admin Panel";

  const [activeTab, setActiveTab] = useState("User Data");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === "User Data") {
      setLoading(true);
      fetch("/api/getUserData?type=users")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch users");
          return res.json();
        })
        .then((data) => {
          setUsers(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [activeTab]);

  const renderUserTable = () => {
    if (loading) return <p>Loading users...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!users.length) return <p>No users found.</p>;

    return (
        <div>
            <UserManagement users={users} />
            <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-[#BC80BA] text-white">
                        <th className="border border-gray-300 px-3 py-2">User ID</th>
                        <th className="border border-gray-300 px-3 py-2">First Name</th>
                        <th className="border border-gray-300 px-3 py-2">Last Name</th>
                        <th className="border border-gray-300 px-3 py-2">Username</th>
                        <th className="border border-gray-300 px-3 py-2">Email</th>
                        <th className="border border-gray-300 px-3 py-2">Account Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(
                        ({
                            user_id,
                            first_name,
                            last_name,
                            username,
                            email,
                            account_type,
                        }) => (
                            <tr key={user_id} className="odd:bg-white even:bg-gray-100">
                            <td className="border border-gray-300 px-3 py-2">{user_id}</td>
                            <td className="border border-gray-300 px-3 py-2">{first_name ?? "-"}</td>
                            <td className="border border-gray-300 px-3 py-2">{last_name ?? "-"}</td>
                            <td className="border border-gray-300 px-3 py-2">{username}</td>
                            <td className="border border-gray-300 px-3 py-2">{email ?? "-"}</td>
                            <td className="border border-gray-300 px-3 py-2">{account_type}</td>
                            </tr>
                        )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "User Data":
        return <div>{renderUserTable()}</div>;
      case "Quizzes & Flashcards":
        return <QuizFlashcardPanel />;
      case "Activity Log":
        return <ActivityLog />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8F4F9] text-[#533d64]">
      <div className="w-full md:w-64 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200 bg-white">
        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Admin Panel</h2>
        <ul className="space-y-2 md:space-y-4">
          {["User Data", "Quizzes & Flashcards", "Activity Log"].map((tab) => (
            <li key={tab}>
              <button
                className={`w-full text-left px-4 py-2 shadow border-[#533d64]/20 rounded-lg transition-all ${
                  activeTab === tab ? "bg-[#BC80BA] text-white" : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 p-4 md:p-6">
        <div className="bg-white p-4 md:p-8 rounded-lg shadow">
            <h2 className="text-[#533d64] md:text-[22px] mb-3 font-semibold font-nunito">{activeTab}</h2>
            <hr className="w-full border-[#533d64]/50 mb-6" />
            {renderContent()}
        </div>
      </div>
    </div>
  );
}
