import React, { useState, useEffect } from "react";
import FlashcardCreate from "../Flashcard/FlashcardCreate";
import ReviewerProgress from "./ReviewerProgress";
import FlashcardTable from "../Flashcard/FlashcardTable";
import QuizCreate from "../Quiz/QuizCreate";
import QuizTable from "../Quiz/QuizTable";
import QuizScores from "../Quiz/QuizScore";
import MessageModal from './MessageModal';

export default function TabPanel() {
  const [activeTab, setActiveTab] = useState("tab1");
  const [showUpload, setShowUpload] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");


  const tabs = [
    { id: "tab1", label: "Reviewer Progress" },
    { id: "tab2", label: "Flashcard Draft" },
    { id: "tab3", label: "Quiz Scores" },
    { id: "tab4", label: "Quiz Draft" },
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setLoggedInUser(storedUser);
  }, []);

  useEffect(() => {
    if (activeTab === "tab2" && loggedInUser) fetchFlashcards();
    if (activeTab === "tab4" && loggedInUser) fetchQuizzes();
  }, [activeTab, loggedInUser]);

  const fetchFlashcards = async () => {
    try {
      const res = await fetch("https://forreact.alwaysdata.net/getFlashcardTitle.php");
      const data = await res.json();
      const userFlashcards = data.filter(card => card.creator_id === loggedInUser.user_id);
      setFlashcards(userFlashcards);
    } catch (error) {
      console.error("Failed to fetch flashcards:", error);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await fetch("https://forreact.alwaysdata.net/getQuiz.php");
      const data = await res.json();
      const userQuizzes = data.filter(quiz => quiz.creator_id === loggedInUser.user_id);
      setQuizzes(userQuizzes);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
    }
  };

  const handleFlashcardEdit = (updatedFlashcard) => {
    setFlashcards((prev) =>
      prev.map((card) =>
        card.reviewer_id === updatedFlashcard.reviewer_id ? updatedFlashcard : card
      )
    );
  };

  const handleFlashcardDelete = async (card) => {
    if (!window.confirm(`Are you sure you want to delete "${card.reviewer_title}"? This action cannot be undone.`)) return;

    setDeletingId(card.reviewer_id);

    try {
      const res = await fetch(`https://forreact.alwaysdata.net/deleteFlashcard.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviewer_id: card.reviewer_id }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(`Deleted: ${card.reviewer_title}`);
        setFlashcards((prev) => prev.filter((f) => f.reviewer_id !== card.reviewer_id));
      } else {
        setMessage("Delete failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      setMessage("Delete failed: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleQuizEdit = (updatedQuiz) => {
    setQuizzes((prev) =>
      prev.map((quiz) => (quiz.quiz_id === updatedQuiz.quiz_id ? updatedQuiz : quiz))
    );
  };

  const handleQuizDelete = async (quiz) => {
  if (!window.confirm(`Are you sure you want to delete "${quiz.quiz_title}"? This action cannot be undone.`)) return;

  setDeletingId(quiz.quiz_id);

  try {
    const res = await fetch("https://forreact.alwaysdata.net/deleteQuiz.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quiz_id: quiz.quiz_id }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage(`Deleted: ${quiz.quiz_title}`);
      setQuizzes((prev) => prev.filter((q) => q.quiz_id !== quiz.quiz_id));
    } else {
      setMessage("Delete failed: " + (data.error || "Unknown error"));
    }
  } catch (err) {
    setMessage("Delete failed: " + err.message);
  } finally {
    setDeletingId(null);
  }
};


  const renderTabContent = () => {
    switch (activeTab) {
      case "tab1":
        return <ReviewerProgress />;
      case "tab2":
        return (
          <>
            <div className="flex justify-end mb-4">
              <button
                className="bg-[#BC80BA] text-white px-4 py-2 rounded"
                onClick={() => setShowUpload(true)}
              >
                Create Flashcard
              </button>
            </div>
            {showUpload && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                onClick={() => setShowUpload(false)}
              >
                <div onClick={(e) => e.stopPropagation()}>
                  <FlashcardCreate onClose={() => setShowUpload(false)} />
                </div>
              </div>
            )}
            <FlashcardTable
              flashcards={flashcards}
              loggedInUser={loggedInUser}
              onEdit={handleFlashcardEdit}
              onDelete={handleFlashcardDelete}
              deletingId={deletingId}
            />
          </>
        );
      case "tab3":
        return <QuizScores loggedInUser={loggedInUser} />;
      case "tab4":
        return (
          <>
            <div className="flex justify-end mb-4">
              <button
                className="bg-[#BC80BA] text-white px-4 py-2 rounded"
                onClick={() => setShowUpload(true)}
              >
                Create Quiz
              </button>
            </div>
            {showUpload && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                onClick={() => setShowUpload(false)}
              >
                <div onClick={(e) => e.stopPropagation()}>
                  <QuizCreate onClose={() => setShowUpload(false)} />
                </div>
              </div>
            )}
            <QuizTable
              quizzes={quizzes}
              loggedInUser={loggedInUser}
              onEdit={handleQuizEdit}
              onDelete={handleQuizDelete}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8F4F9] text-[#533d64]">
      {/* Sidebar */}
      <div className="w-full md:w-64 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200 bg-white">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
        <ul className="space-y-2 md:space-y-4">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                className={`w-full text-left px-4 py-2 shadow border-[#533d64]/20 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-[#BC80BA] text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 md:p-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-[#533d64] text-[28px] md:text-[22px] mb-3 font-semibold font-nunito">{tabs.find(t => t.id === activeTab)?.label}</h1>
          <hr className="w-full border-[#533d64]/50 mb-6" />
          {renderTabContent()}
        </div>
      </div>
    </div>
    <MessageModal message={message} onClose={() => setMessage("")} />
    </>
  );
}
