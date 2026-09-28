import React, { useState } from "react";
import EditFlashcard from "./EditFlashcard";
import MessageModal from "../MessageModal";

export default function FlashcardTable({ flashcards, loggedInUser, onEdit, onDelete, deletingId }) {
  const [editingFlashcard, setEditingFlashcard] = useState(null);
  const [message, setMessage] = useState("");

  const logActivity = async (activity) => {
    if (!loggedInUser) return;
    try {
      await fetch("/api/logActivity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: loggedInUser.user_id,
          account_type: loggedInUser.account_type || "User",
          activity,
        }),
      });
    } catch (err) {
      console.error("Failed to log activity:", err);
    }
  };

  const handleEditClick = (card) => {
    if (loggedInUser?.user_id !== card.creator_id) {
      setMessage("You can only edit flashcards you created.");
      return;
    }
    setEditingFlashcard(card);
    logActivity(`User edited flashcard "${card.reviewer_title}"`);
  };

  const handleCloseEdit = () => {
    setEditingFlashcard(null);
  };

  const handleDeleteClick = (card) => {
    if (loggedInUser?.user_id !== card.creator_id) {
      setMessage("You can only delete flashcards you created.");
      return;
    }
    onDelete(card);
    logActivity(`User deleted flashcard "${card.reviewer_title}"`);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[16px]">
          <thead>
            <tr className="border-b border-[#BC80BA] text-[#4B0049] font-semibold">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2 text-center">Author</th>
              <th className="px-4 py-2 text-center">Time Uploaded</th>
              <th className="py-2 text-end pr-15">Action</th>
            </tr>
          </thead>
          <tbody>
            {flashcards.map((card) => (
              <tr key={card.reviewer_id} className="border-b border-gray-200 hover:bg-purple-50">
                <td className="px-4 py-2">{card.reviewer_title}</td>
                <td className="px-4 py-2 text-center">{loggedInUser?.username || "Unknown"}</td>
                <td className="px-4 py-2 text-center">{card.uploaded_date}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-end gap-2">
                    <button
                      className="text-sm text-white bg-[#BC80BA] hover:bg-[#a852a0] px-3 py-1 rounded"
                      onClick={() => handleEditClick(card)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(card)}
                      disabled={deletingId === card.reviewer_id}
                      className={`bg-red-500 text-[#ffffff] hover:bg-red-700 px-3 py-1 rounded ${
                        deletingId === card.reviewer_id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {flashcards.length === 0 && (
              <tr>
                <td colSpan="4" className="py-4 text-gray-500 text-center">
                  No flashcards uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingFlashcard && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 z-50 flex items-center justify-center">
          <EditFlashcard flashcardData={editingFlashcard} onClose={handleCloseEdit} />
        </div>
      )}

      <MessageModal message={message} onClose={() => setMessage("")} />
    </>
  );
}
