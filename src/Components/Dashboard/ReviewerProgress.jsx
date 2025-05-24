import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReviewerProgress() {
  const [progressData, setProgressData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log("Loaded user:", user);
    if (!user) return;

    const fetchProgress = async () => {
      try {
        const res = await fetch(
          "https://forreact.alwaysdata.net/getReviewerProgress.php?user_id=" + user.user_id
        );
        const text = await res.text();
        console.log("Raw PHP response:", text);
        const result = JSON.parse(text);
        if (Array.isArray(result)) {
          setProgressData(result);
        } else {
          console.error("Unexpected format:", result);
        }
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
          <div className="flex flex-col items-center w-full">
            <div className="w-full ">
              <div className="">
                <button
                key={entry.reviewer_id}
                onClick={() =>
                navigate(
                `/flashcard-content?rid=${entry.reviewer_id}&title=${entry.reviewer_title}`
                )
                }
                className="w-[100%] bg-gray-100 border border-gray-300 rounded p-3 flex justify-between items-center hover:bg-gray-200"
                >
                <span>{entry.reviewer_title}</span>
                <span className="text-gray-600">{entry.progress}%</span>
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No progress found.</p>

      )}
    </>
  );
}
