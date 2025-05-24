import React, { useState, useRef } from "react";
import formatImgFlashcard from "../../Webpages/img/formatFCImg.png";
import closeImg from '../../Webpages/img/icons8-close-48.png';

function generateId(prefix) {
  return prefix + Math.floor(10000000 + Math.random() * 90000000);
}

export default function FlashcardUpload() {
  const [file, setFile] = useState(null);
  const storedUser = localStorage.getItem("loggedInUser");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
  const [showFormatError, setShowFormatError] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setShowFormatError(false);
  };

  const handleUpload = async () => {
    if (!file || !loggedInUser) {
      setMessage("Missing file or user not logged in.");
      return;
    }

    const text = await file.text();
    const parsed = parseQuestions(text);
    if (!parsed.valid) {
      setShowFormatError(true);
      return;
    }

    const reviewer_id = generateId("Rev");
    const uploaded_date = new Date().toISOString();

    try {
      const reviewerResponse = await fetch("/api/insertreviewer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewer_id,
          reviewer_title: file.name.replace(/\.[^/.]+$/, ""),
          creator_id: loggedInUser.user_id,
          uploaded_date,
        }),
      });

      if (!reviewerResponse.ok) {
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

      setMessage("File uploaded successfully.");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      setMessage("An error occurred during upload.");
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

        if (answerLine && answerLine.startsWith("-") && (!nextLine || nextLine === "")) {
          const answer = answerLine.substring(1).trim();
          questions.push({ question, answer });
          i += 3;
        } else {
          return { valid: false };
        }
      } else {
        i++;
      }
    }

    return { valid: true, questions };
  }

  return (
    <>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-xl mx-auto mt-10">
        <h2 className="text-xl font-bold mb-4">Upload Review File</h2>
        <input
          type="file"
          accept=".txt,.docx"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="mb-4 border border-gray-300 p-2 rounded w-full text-[14px]"
        />
        <button
          onClick={handleUpload}
          className="bg-[#BC80BA] text-white px-4 py-2 rounded hover:bg-[#A669A4] w-full"
        >
          Upload
        </button>
      </div>

      {showFormatError && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded max-w-xl mx-auto">
          <p className="text-red-700 font-semibold">Invalid file format.</p>
          <p className="text-sm">Please follow this format:</p>
          <img src={formatImgFlashcard} alt="Correct format example" className="mt-2 max-w-full h-auto rounded" />
        </div>
      )}

      {message && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white px-5 py-5 rounded-xl shadow-lg w-[35%] relative">
            <div className="flex justify-end">
              <button onClick={() => setMessage("")}>
                <img src={closeImg} alt="Close" className="w-6 h-6" />
              </button>
            </div>
            <div className="flex justify-center items-center mt-3">
              <p className="text-[16px] text-[#533d64] text-center">{message}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
