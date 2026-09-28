import React, { useRef, useState } from "react";
import formatImgQuiz from "../../Webpages/img/image.png";
import closeImg from "../../Webpages/img/icons8-close-48.png";
import BackBtn from "../BackBtn";

export default function EditQuiz({ quizData, onClose }) {
  const [file, setFile] = useState(null);
  const [manualText, setManualText] = useState("");
  const [mode, setMode] = useState("upload");
  const [showFormatError, setShowFormatError] = useState(false);
  const [title, setTitle] = useState(quizData.quiz_title || "");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef();

  const storedUser = localStorage.getItem("loggedInUser");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setShowFormatError(false);
  };

  const parseQuiz = (text) => {
    const lines = text.split(/\r?\n/);
    const questions = [];
    let i = 0;

    while (i < lines.length) {
      const questionMatch = lines[i].match(/^\d+[\.\)]\s*(.+)$/);
      if (questionMatch) {
        const question = questionMatch[1].trim();
        const choices = {};
        let correctAnswer = null;

        for (let j = 1; j <= 4; j++) {
          const choiceLine = lines[i + j]?.trim();
          if (!choiceLine || !/^(-)?[a-dA-D][\.\)]\s+/.test(choiceLine)) return { valid: false };

          const isCorrect = choiceLine.startsWith("-");
          const letterMatch = choiceLine.match(/^(-)?([a-dA-D])[\.\)]\s+(.*)$/);
          if (!letterMatch) return { valid: false };

          const letter = letterMatch[2].toLowerCase();
          const textChoice = letterMatch[3].trim();

          choices[letter] = textChoice;
          if (isCorrect) {
            if (correctAnswer !== null) return { valid: false };
            correctAnswer = letter;
          }
        }

        if (!correctAnswer) return { valid: false };

        const questionObj = {
          q_ques_id: "QQ" + Math.floor(10000000 + Math.random() * 90000000),
          question,
          choices,
          correctAnswer,
        };

        questions.push(questionObj);
        i += 5;
      } else {
        i++;
      }
    }

    return { valid: true, questions };
  };

  const handleUpdate = async () => {
    if (!loggedInUser || loggedInUser.user_id !== quizData.creator_id) {
      setMessage("You are not authorized to edit this quiz.");
      return;
    }

    let text = "";
    if (mode === "upload") {
      if (!file) {
        setMessage("No file selected.");
        return;
      }
      text = await file.text();
    } else {
      if (!manualText.trim()) {
        setMessage("Manual text is empty.");
        return;
      }
      text = manualText;
    }

    const parsed = parseQuiz(text);
    if (!parsed.valid) {
      setShowFormatError(true);
      return;
    }

    const payload = {
      quiz_id: quizData.quiz_id,
      quiz_title: title.trim(),
      questions: parsed.questions,
    };

    try {
      const res = await fetch("/api/getUserData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateQuiz", ...payload }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Quiz updated successfully.");
      } else {
        setMessage(data.message || "Failed to update quiz.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    }
  };

  return (
    <>
      <div
        className="bg-white p-6 rounded shadow-md w-full max-w-xl mx-auto mt-10 relative z-40"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button onClick={onClose}>
            <BackBtn image={closeImg} />
          </button>
        </div>
        <h2 className="text-xl font-bold mb-4">Edit Quiz</h2>

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
              placeholder="Edit title"
              className="mb-4 border border-gray-300 p-2 rounded w-full text-sm"
            />
            <textarea
              rows="10"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Edit your questions and choices..."
              className="mb-4 border border-gray-300 p-2 rounded w-full text-sm font-mono"
            />
          </>
        )}

        {mode === "upload" && (
          <input
            type="file"
            accept=".txt"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="mb-4 border border-gray-300 p-2 rounded w-full text-sm"
          />
        )}

        <button
          onClick={handleUpdate}
          className="bg-[#BC80BA] text-white px-4 py-2 rounded hover:bg-[#A669A4] w-full"
        >
          Update
        </button>
      </div>

      {showFormatError && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded max-w-xl mx-auto z-30">
          <p className="text-red-700 font-semibold">Invalid format.</p>
          <p className="text-sm">Please follow this format:</p>
          <img
            src={formatImgQuiz}
            alt="Correct quiz format"
            className="mt-2 max-w-full h-auto rounded"
          />
        </div>
      )}

      {message && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white px-5 py-5 rounded-xl shadow-lg w-[35%] relative">
            <div className="w-full">
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setMessage("");
                    onClose();
                  }}
                >
                  <BackBtn image={closeImg} />
                </button>
              </div>
              <div className="flex justify-center items-center">
                <p className="text-[16px] text-[#533d64] text-center mb-5">{message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
