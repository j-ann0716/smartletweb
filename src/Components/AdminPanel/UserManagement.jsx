import { useState, useEffect } from "react";
import BackBtn from "../BackBtn"; 
import closeImg from "../../Webpages/img/icons8-close-48.png";
import { supabase } from "../../../api/supabaseServer";

const ACTIONS = ["Update", "Insert", "Delete"];

export default function UserManagement({ users }) {
    const [action, setAction] = useState("Update");
    const [selectedUserId, setSelectedUserId] = useState("");
    const [formData, setFormData] = useState({
        user_id: "",
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        account_type: "User",
    });

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const isInsert = action === "Insert";
    const isUpdate = action === "Update";
    const isDelete = action === "Delete";

    useEffect(() => {
        if (isInsert) {
            setSelectedUserId("");
            setFormData({
                user_id: "",
                first_name: "",
                last_name: "",
                username: "",
                email: "",
                password: "",
                account_type: "User",
            });
        } else if (selectedUserId) {
            const user = users.find((u) => u.user_id === selectedUserId);
            if (user) {
                setFormData({
                    user_id: user.user_id,
                    first_name: user.first_name ?? "",
                    last_name: user.last_name ?? "",
                    username: user.username ?? "",
                    email: user.email ?? "",
                    password: "",
                    account_type: user.account_type ?? "User",
                });
            }
        }
    }, [action, selectedUserId, users]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((fd) => ({ ...fd, [name]: value }));
    };

    const handleExecute = async () => {
        if (isInsert) {
            try {
                const res = await fetch("/api/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                });
                const data = await res.json();
                setModalMessage("Insert success!");
                setShowModal(true);
            } catch (err) {
                setModalMessage("Insert failed: " + err.message);
                setShowModal(true);
            }
        } else if (isUpdate) {
            if (!selectedUserId) return showPopup("Please select a user to update");

            try {
                const { error } = await supabase
                    .from("user_tbl")
                    .update({
                        first_name: formData.first_name,
                        last_name: formData.last_name,
                        username: formData.username,
                        email: formData.email,
                        account_type: formData.account_type
                    })
                    .eq("user_id", selectedUserId);

                if (error) throw error;

                setModalMessage("Update success!");
                setShowModal(true);
            } catch (err) {
                setModalMessage("Update failed: " + err.message);
                setShowModal(true);
            }
        } else if (isDelete) {
            if (!selectedUserId) return showPopup("Please select a user to delete");
            if (!window.confirm(`Are you sure you want to delete user ${selectedUserId}?`)) return;

            try {
                const { error } = await supabase
                    .from("user_tbl")
                    .delete()
                    .eq("user_id", selectedUserId);

                if (error) throw error;

                setModalMessage("Delete success!");
                setShowModal(true);
            } catch (err) {
                setModalMessage("Delete failed: " + err.message);
                setShowModal(true);
            }
        }
    };

    const showPopup = (msg) => {
        setModalMessage(msg);
        setShowModal(true);
    };

    return (
        <div className="max-w-5xl mx-auto px-6 pb-6 bg-white rounded space-y-6 text-[14px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-[#533d64]">
                <div>
                    <label className="block font-semibold mb-1">Action</label>
                    <select
                        className="appearance-none border-[#533d64]/50 border-[1px] rounded px-4 py-2 font-semibold bg-white outline-none w-full"
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                    >
                        {ACTIONS.map((a) => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold mb-1">User ID</label>
                    <select
                        className="appearance-none border-[#533d64]/50 border-[1px] rounded px-4 py-2 outline-none w-full"
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        value={selectedUserId}
                        disabled={isInsert}
                    >
                        <option value="">-- Select user --</option>
                        {users.map((u) => (
                            <option key={u.user_id} value={u.user_id}>{u.user_id}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold mb-1">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        disabled={isDelete}
                        className="border-[#533d64]/50 border-[1px] rounded px-3 py-2 outline-none w-full"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        disabled={isDelete}
                        className="border-[#533d64]/50 border-[1px] rounded px-3 py-2 outline-none w-full"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-[#533d64]">
                <div>
                    <label className="block font-semibold mb-1">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        disabled={isDelete}
                        className="border-[#533d64]/50 border-[1px] rounded px-3 py-2 outline-none w-full"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isDelete}
                        className="border-[#533d64]/50 border-[1px] rounded px-3 py-2 outline-none w-full"
                    />
                </div>

                <div>
                    <label className="block font-semibold mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isDelete}
                        className="border-[#533d64]/50 border-[1px] rounded px-3 py-2 outline-none w-full"
                    />
                </div>

                <div className="flex items-end">
                    <button
                        onClick={handleExecute}
                        className="bg-[#BC80BA] hover:bg-[#533d64] text-white font-semibold py-2 rounded transition w-full"
                    >
                        Execute
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                    <div className="bg-white px-5 py-5 rounded-xl shadow-lg w-[90%] md:w-[35%] relative">
                        <div className="flex justify-end">
                            <button onClick={() => setShowModal(false)}>
                                <BackBtn image={closeImg} />
                            </button>
                        </div>
                        <div className="flex justify-center items-center">
                            <p className="text-[18px] text-[#533d64] text-center mb-5">{modalMessage}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
