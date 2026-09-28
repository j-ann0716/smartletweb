import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Input({ label, name, value, onChange, type = "text", readOnly = false }) {
  return (
    <div className="flex flex-col w-full">
      <label className="text-sm text-gray-600 mb-1">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        readOnly={readOnly}
        className={`border-[1px] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-400 ${readOnly ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />
    </div>
  );
}

export default function Profile() {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        currentPassword: "",
    });

    const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser")) ||
        JSON.parse(sessionStorage.getItem("loggedInUser"));
    const currentUsername = loggedInUser?.username;

    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const res = await fetch("/api/getUserData?type=users");
            const data = await res.json();
            const user = Array.isArray(data) ? data.find((u) => u.username === currentUsername) : null;
            if (user) {
              setUserData(user);
              setFormData({
                  first_name: user.first_name || "",
                  last_name: user.last_name || "",
                  username: user.username,
                  currentPassword: "",
              });
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
        };

        fetchUserData();
    }, [currentUsername]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdate = async () => {
        const { currentPassword, ...profileData } = formData;
        if (!currentPassword) return setMessage("Enter your current password to update.");

        try {
            const res = await fetch("/api/getUserData", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "updateProfile",
                    email: userData.email,
                    password: currentPassword,
                    ...profileData,
                }),
            });

            const result = await res.json();
            if (res.ok) {
                setMessage("Profile updated successfully!");
                setUserData({ ...userData, ...profileData });
                setFormData((prev) => ({ ...prev, currentPassword: "" }));
                setEditing(false);
            } else {
                setMessage(result.message || "Update failed.");
            }
        } catch (error) {
            console.error("Update error:", error);
            setMessage("Something went wrong during update.");
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const res = await fetch("/api/resetpass", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    identifier: userData.email,
                    newPassword,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Password updated successfully.");
                navigate('/home');
            } else {
                setMessage(data.message || "Error resetting password.");
            }
        } catch (err) {
            console.error(err);
            setMessage("Something went wrong.");
        }
    };

    if (loading) return <div className="p-6 text-center">Loading profile...</div>;
    if (!userData) return <div className="p-6 text-center">User not found or not logged in.</div>;

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-white mt-5">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6 font-nunito">My Profile</h2>

        {editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} />
              <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} />
              <Input label="Username" name="username" value={formData.username} onChange={handleChange} />
              <Input label="Current Password" name="currentPassword" type="password" value={formData.currentPassword} onChange={handleChange} />

              <div className="sm:col-span-2 flex justify-end gap-2 mt-4">
                  <button onClick={handleUpdate} className="bg-[#BC80BA] hover:bg-[#A669A4] text-white px-4 py-2 rounded">
                  Save
                  </button>
                  <button onClick={() => setEditing(false)} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">
                  Cancel
                  </button>
              </div>
            </div>
        ) : changingPassword ? (
            <div className="grid grid-cols-1 gap-4">
              <Input label="Email" name="email" value={userData.email} onChange={() => {}} readOnly />
              <Input label="New Password" name="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <Input label="Confirm Password" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

              <div className="flex justify-end gap-2 mt-4">
                  <button onClick={handlePasswordUpdate} className="bg-[#BC80BA] hover:bg-[#A669A4] text-white px-4 py-2 rounded">
                  Change Password
                  </button>
                  <button onClick={() => setChangingPassword(false)} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">
                  Cancel
                  </button>
              </div>
            </div>
        ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="shadow rounded-md p-5">
                    <p className="text-sm text-gray-600">First Name</p>
                    <p className="text-base font-medium text-gray-800">{userData.first_name}</p>
                  </div>
                  <div className="shadow rounded-md p-5">
                    <p className="text-sm text-gray-600">Last Name</p>
                    <p className="text-base font-medium text-gray-800">{userData.last_name}</p>
                  </div>
                  <div className="shadow rounded-md p-5">
                    <p className="text-sm text-gray-600">Username</p>
                    <p className="text-base font-medium text-gray-800">{userData.username}</p>
                  </div>
                  <div className="shadow rounded-md p-5">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-base font-medium text-gray-800">{userData.email}</p>
                  </div>
              </div>

              <div className="flex justify-end gap-2">
                  <button onClick={() => setEditing(true)} className="bg-[#BC80BA] hover:bg-[#A669A4] text-white px-4 py-2 rounded">
                  Edit Profile
                  </button>
                  <button onClick={() => setChangingPassword(true)} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
                  Change Password
                  </button>
              </div>
            </>
        )}

        {message && (
            <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
              <div className="bg-white px-5 py-2 rounded-xl shadow-lg w-full max-w-sm">
                  <div className="flex justify-end items-center mb-1">
                    <button onClick={() => setMessage("")} className="text-gray-500 hover:text-black text-2xl font-bold">&times;</button>
                  </div>
                  <p className="text-gray-700 text-center mb-4">{message}</p>
              </div>
            </div>
        )}
        </div>
    );
}
