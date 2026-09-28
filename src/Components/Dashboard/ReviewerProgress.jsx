import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../api/supabaseServer";

export default function ReviewerProgress() {
  const [progressData, setProgressData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) return;

    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from("user_progress")
          .select("reviewer_id, progress, reviewer_tbl(reviewer_title)")
          .eq("user_id", user.user_id);

        if (error) throw error;

        const formatted = data.map((entry) => ({
          reviewer_id: entry.reviewer_id,
          progress: entry.progress,
          reviewer_title: entry.reviewer_tbl?.reviewer_title || "Untitled Flashcard",
        }));

        setProgressData(formatted);
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    };

    fetchProgress();
  }, []);

  return (
    <>
      {progressData.length > 0 ? (
        progressData.map((entry) => (
          <div key={entry.reviewer_id} className="flex flex-col items-center w-full mb-2">
            <div className="w-full">
              <button
                onClick={() =>
                  navigate(
                    `/flashcard-content?rid=${entry.reviewer_id}&title=${entry.reviewer_title}`
                  )
                }
                className="w-full bg-gray-100 border border-gray-300 rounded p-3 flex justify-between items-center hover:bg-gray-200"
              >
                <span>{entry.reviewer_title}</span>
                <span className="text-gray-600">{entry.progress}%</span>
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No progress found.</p>
      )}
    </>
  );
}
