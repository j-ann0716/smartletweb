import React, { useEffect, useState } from "react";

export default function QuizScores({ loggedInUser }) {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    if (loggedInUser) {
      fetchScores();
    }
  }, [loggedInUser]);

  const fetchScores = async () => {
    try {
      const response = await fetch(
        `/api/getUserData?type=scores&user_id=${loggedInUser.user_id}`
      );
      const data = await response.json();
      setScores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch quiz scores:", error);
    }
  };

  return (
    <div className="overflow-x-auto mx-auto">
      <table className="min-w-full">
        <thead className="text-[#533d64] border-b border-[#BC80BA] font-semibold">
          <tr>
            <th className="pl-2 py-2 text-left">Quiz (Title)</th>
            <th className="py-2 text-center">Uploaded By</th>
            <th className="pr-2 py-2 text-end">Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.length > 0 ? (
            scores.map((score) => (
              <tr key={score.score_id}>
                <td className="px-4 py-2">{score.file_name}</td>
                <td className="px-4 py-2 text-center">{score.creator_username || "Unknown"}</td>
                <td className="px-4 py-2 text-end">
                  {score.correct_count}/{score.total_num_items}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="py-4 text-gray-500 text-center">
                  No answered quizzes yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
