import React, { useRef, useState } from "react";
import formatImgQuiz from "../../Webpages/img/image.png";
import closeImg from "../../Webpages/img/icons8-close-48.png";
import BackBtn from "../BackBtn";

function generateId(prefix) {
  return prefix + Math.floor(100000000 + Math.random() * 900000000);
}

export default function QuizCreate({ onClose }) {
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

  const handleUpload = async () => {
    setMessage("");
    setShowFormatError(false);

    if (!loggedInUser) {
      setMessage("User not logged in.");
      return;
    }

    let text = "";
    let quiz_title = "";

    if (mode === "upload") {
      if (!file) {
        setMessage("No file selected.");
        return;
      }
      try {
        text = await file.text();
      } catch (error) {
        setMessage("Failed to read file. Try selecting it again.");
        return;
      }
      quiz_title = file.name.replace(/\.[^/.]+$/, "");
    } else {
      if (!manualText.trim()) {
        setMessage("Manual text is empty.");
        return;
      }
      if (!title.trim()) {
        setMessage("Please enter a title for your quiz.");
        return;
      }
      text = manualText;
      quiz_title = title.trim();
    }

    const parsed = parseQuiz(text);
    if (!parsed.valid || parsed.questions.length === 0) {
      setShowFormatError(true);
      setMessage(parsed.error || "Invalid file format.");
      return;
    }

    const quiz_id = generateId("Qu");
    const uploaded_date = new Date().toISOString();

    try {
      const res = await fetch("https://forreact.alwaysdata.net/createQuiz.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quiz_id,
          quiz_title,
          number_of_items: parsed.questions.length,
          creator_id: loggedInUser.user_id,
          uploaded_date,
          questions: parsed.questions,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setMessage("Quiz uploaded successfully.");
        setFile(null);
        setManualText("");
        setTitle("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setMessage("Error: " + result.message);
      }
    } catch (err) {
      setMessage("Network or server error.");
    }
  };

  function parseQuiz(text) {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const questions = [];
    let i = 0;

    while (i < lines.length) {
      const questionMatch = lines[i].match(/^\d+[\.\)]\s*(.+)$/);
      if (!questionMatch) return { valid: false, error: `Invalid question format at line ${i + 1}` };

      const question = questionMatch[1];
      const choices = {};
      let validChoices = true;

      for (let j = 0; j < 4; j++) {
        const choiceLine = lines[i + 1 + j];
        const match = choiceLine?.match(/^([a-dA-D])\)\s*(.+)$/);
        if (!match) {
          validChoices = false;
          break;
        }
        choices[match[1].toLowerCase()] = match[2].trim();
      }

      const answerLine = lines[i + 5]?.match(/^Answer:\s*([a-dA-D])$/);
      if (!validChoices || !answerLine) {
        return { valid: false, error: `Invalid choices or answer near question ${questions.length + 1}` };
      }

      questions.push({
        question,
        choices,
        correct: answerLine[1].toLowerCase(),
      });

      i += 6;
    }

    return { valid: true, questions };
  }

  return (
    <>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-xl mx-auto mt-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-end">
          <button onClick={onClose}>
            <BackBtn image={closeImg} />
          </button>
        </div>
        <h2 className="text-xl font-bold mb-4">Create Quiz</h2>

        <div className="flex justify-center mb-4 gap-4">
          <button onClick={() => setMode("upload")} className={`px-4 py-2 rounded text-white ${mode === "upload" ? "bg-[#BC80BA]" : "bg-gray-400"}`}>
            Upload File
          </button>
          <button onClick={() => setMode("manual")} className={`px-4 py-2 rounded text-white ${mode === "manual" ? "bg-[#BC80BA]" : "bg-gray-400"}`}>
            Type Manually
          </button>
        </div>

        {mode === "manual" && (
          <>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" className="mb-4 border border-gray-300 p-2 rounded w-full text-sm" />
            <textarea rows="10" value={manualText} onChange={(e) => setManualText(e.target.value)} placeholder="Type your quiz content here..." className="mb-4 border border-gray-300 p-2 rounded w-full text-sm" />
          </>
        )}

        {mode === "upload" && (
          <input type="file" accept=".txt" ref={fileInputRef} onChange={handleFileChange} className="mb-4 border border-gray-300 p-2 rounded w-full text-sm" />
        )}

        <button onClick={handleUpload} className="bg-[#BC80BA] text-white px-4 py-2 rounded hover:bg-[#A669A4] w-full">
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
              <img src={formatImgQuiz} alt="Correct quiz format" className="mt-2 max-w-full h-auto rounded mx-auto" />
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
