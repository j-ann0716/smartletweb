import React, { useRef, useState } from "react";
import formatImgFlashcard from "../../Webpages/img/formatFCImg.png";
import closeImg from "../../Webpages/img/icons8-close-48.png";
import BackBtn from "../BackBtn";

function generateId(prefix) {
  return prefix + Math.floor(10000000 + Math.random() * 90000000);
}

export default function FlashcardCreate({ onClose }) {
  const [file, setFile] = useState(null);
  const [manualText, setManualText] = useState("");
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("upload");
  const [showFormatError, setShowFormatError] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef();

  const storedUser = localStorage.getItem("loggedInUser");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setTitle(uploadedFile.name.replace(/\.[^/.]+$/, ""));
    setShowFormatError(false);
  };

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
      console.error("Error logging activity:", err);
    }
  };

  const handleUpload = async () => {
    setMessage("");
    setShowFormatError(false);

    if (!loggedInUser) {
      setMessage("User not logged in.");
      return;
    }

    let text = "";
    let reviewer_title = "";

    if (mode === "upload") {
      if (!file) {
        setMessage("No file selected.");
        return;
      }
      text = await file.text();
      reviewer_title = file.name.replace(/\.[^/.]+$/, "");
    } else {
      if (!manualText.trim()) {
        setMessage("Manual text is empty.");
        return;
      }
      if (!title.trim()) {
        setMessage("Please enter a title for your flashcard.");
        return;
      }
      text = manualText;
      reviewer_title = title.trim();
    }

    const parsed = parseQuestions(text);
    if (!parsed.valid || parsed.questions.length === 0) {
      setShowFormatError(true);
      return;
    }

    const reviewer_id = generateId("Rev");
    const uploaded_date = new Date().toISOString();

    try {
      const reviewerRes = await fetch("/api/insertreviewer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewer_id,
          reviewer_title,
          creator_id: loggedInUser.user_id,
          uploaded_date,
        }),
      });

      if (!reviewerRes.ok) {
        setMessage("Failed to insert reviewer.");
        return;
      }

      for (let i = 0; i < parsed.questions.length; i++) {
        const q = parsed.questions[i];
        const r_ques_id = generateId("RQ");

        const questionRes = await fetch("/api/insertquestion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            r_ques_id,
            reviewer_ques: q.question,
            number_count: i + 1,
            reviewer_id,
          }),
        });

        if (!questionRes.ok) {
          setMessage(`Failed to insert question ${i + 1}`);
          return;
        }

        const answerRes = await fetch("/api/insertanswer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rev_ans_id: generateId("QA"),
            reviewer_answer: q.answer,
            r_ques_id,
          }),
        });

        if (!answerRes.ok) {
          setMessage(`Failed to insert answer for question ${i + 1}`);
          return;
        }
      }

      setMessage("Flashcard uploaded successfully.");
      setFile(null);
      setManualText("");
      setTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      await logActivity("User created a flashcard set");
    } catch (err) {
      console.error(err);
      setMessage("An error occurred while uploading flashcards.");
    }
  };

  function parseQuestions(text) {
    const lines = text.split(/\r?\n/);
    const questions = [];
    let i = 0;

    while (i < lines.length) {
      const questionMatch = lines[i].match(/^\d+[\.\)]\s*(.+)$/);
      if (questionMatch) {
        const question = questionMatch[1].trim();
        const answerLine = lines[i + 1]?.trim();
        const nextLine = lines[i + 2]?.trim();

        if (
          answerLine &&
          answerLine.startsWith("-") &&
          (!nextLine || /^\d+[\.\)]\s*/.test(nextLine) || nextLine === "")
        ) {
          const answer = answerLine.substring(1).trim();
          if (!question || !answer) return { valid: false };

          questions.push({ question, answer });
          i += 2;
          if (nextLine === "") i += 1;
        } else {
          return { valid: false };
        }
      } else if (lines[i].trim() !== "") {
        return { valid: false };
      } else {
        i++;
      }
    }

    return questions.length > 0 ? { valid: true, questions } : { valid: false };
  }

  return (
    <>
      <div
        className="bg-white p-6 rounded shadow-md w-full max-w-xl mx-auto mt-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button onClick={onClose}>
            <BackBtn image={closeImg} />
          </button>
        </div>
        <h2 className="text-xl font-bold mb-4">Create Flashcard</h2>

        <div className="flex justify-center mb-4 gap-4">
          <button
            onClick={() => setMode("upload")}
            className={`px-4 py-2 rounded text-white ${
              mode === "upload" ? "bg-[#BC80BA]" : "bg-gray-400"
            }`}
          >
            Upload File
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`px-4 py-2 rounded text-white ${
              mode === "manual" ? "bg-[#BC80BA]" : "bg-gray-400"
            }`}
          >
            Type Manually
          </button>
        </div>

        {mode === "manual" && (
          <>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              className="mb-4 border border-gray-300 p-2 rounded w-full text-sm"
            />
            <textarea
              rows="10"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Type your questions and answers here..."
              className="mb-4 border border-gray-300 p-2 rounded w-full text-sm"
            />
          </>
        )}

        {mode === "upload" && (
          <input
            type="file"
            accept=".txt,.docx"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="mb-4 border border-gray-300 p-2 rounded w-full text-sm"
          />
        )}

        <button
          onClick={handleUpload}
          className="bg-[#BC80BA] text-white px-4 py-2 rounded hover:bg-[#A669A4] w-full"
        >
          Submit
        </button>
      </div>

      {showFormatError && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white px-5 py-5 rounded shadow-lg w-[90%] sm:w-[35%] relative">
            <div className="flex justify-end">
              <button onClick={() => setShowFormatError(false)}>
                <BackBtn image={closeImg} />
              </button>
            </div>
            <div className="text-center">
              <p className="text-red-700 font-bold text-lg mb-2">Invalid Format</p>
              <p className="text-sm text-gray-700 mb-2">Please follow this format:</p>
              <img
                src={formatImgFlashcard}
                alt="Correct format example"
                className="mt-2 max-w-full h-auto rounded mx-auto"
              />
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white px-5 py-5 rounded-xl shadow-lg w-[80%] sm:w-[35%] relative">
            <div className="w-full">
              <div className="flex justify-end">
                <button onClick={() => setMessage("")}>
                  <BackBtn image={closeImg} />
                </button>
              </div>
              <div className="flex justify-center items-center">
                <p className="text-[18px] text-[#533d64] text-center mb-5">{message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
