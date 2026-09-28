import React, { useState } from "react";
import EditQuiz from "./EditQuiz"; 
import MessageModal from "../MessageModal";

export default function QuizTable({ quizzes, loggedInUser, onEdit, onDelete }) {
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [message, setMessage] = useState("");

  const handleEditClick = (quiz) => {
    if (loggedInUser?.user_id !== quiz.creator_id) {
      setMessage("You can only edit quizzes you created.");
      return;
    }
    setEditingQuiz(quiz);
  };

  const handleDeleteClick = (quiz) => {
    if (!loggedInUser) {
      setMessage("You need to be logged in to delete a quiz.");
      return;
    }
    onDelete(quiz);
  };

  const handleCloseEdit = () => {
    setEditingQuiz(null);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[16px]">
          <thead>
            <tr className="border-b border-[#BC80BA] text-[#533d64] font-semibold">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2 text-center">Author</th>
              <th className="px-4 py-2 text-center">Time Uploaded</th>
              <th className="px-4 py-2 text-center"># of Items</th>
              <th className="py-2 text-end pr-15">Action</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr
                key={quiz.quiz_id}
                className="border-b border-gray-200 hover:bg-purple-50"
              >
                <td className="px-4 py-2">{quiz.quiz_title}</td>
                <td className="px-4 py-2 text-center">
                  {loggedInUser?.username || "Unknown"}
                </td>
                <td className="px-4 py-2 text-center">{quiz.uploaded_date}</td>
                <td className="px-4 py-2 text-center">{quiz.number_of_items}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-end gap-2">
                    <button
                      className="text-sm text-white bg-[#BC80BA] hover:bg-[#a852a0] px-3 py-1 rounded"
                      onClick={() => handleEditClick(quiz)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm bg-red-500 text-[#ffffff] hover:bg-red-700 px-3 py-1 rounded"
                      onClick={() => handleDeleteClick(quiz)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {quizzes.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 text-gray-500 text-center">
                  No quizzes uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editingQuiz && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 z-50 flex items-center justify-center">
          <EditQuiz quizData={editingQuiz} onClose={handleCloseEdit} />
        </div>
      )}

      <MessageModal message={message} onClose={() => setMessage("")} />
    </>
  );
}
