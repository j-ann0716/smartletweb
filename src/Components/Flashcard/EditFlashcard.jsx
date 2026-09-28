import React, { useRef, useState } from "react";
import formatImgFlashcard from "../../Webpages/img/formatFCImg.png";
import closeImg from "../../Webpages/img/icons8-close-48.png";
import BackBtn from "../BackBtn";
import { supabase } from "../../supabaseClient"; // Adjust path to your supabase client

export default function EditFlashcard({ flashcardData, onClose }) {
  const [file, setFile] = useState(null);
  const [manualText, setManualText] = useState("");
  const [mode, setMode] = useState("upload");
  const [showFormatError, setShowFormatError] = useState(false);
  const [title, setTitle] = useState(flashcardData.reviewer_title || "");
  const [message, setMessage] = useState("");
  const fileInputRef = useRef();

  const storedUser = localStorage.getItem("loggedInUser");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setShowFormatError(false);
  };

  const parseQuestions = (text) => {
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
  };

  const handleUpdate = async () => {
    if (!loggedInUser || loggedInUser.user_id !== flashcardData.creator_id) {
      setMessage("You are not authorized to edit this flashcard.");
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

    const parsed = parseQuestions(text);
    if (!parsed.valid) {
      setShowFormatError(true);
      return;
    }

    try {
      // 1. Update Reviewer Title
      const { error: reviewerError } = await supabase
        .from("reviewers")
        .update({ reviewer_title: title.trim() })
        .eq("reviewer_id", flashcardData.reviewer_id);

      if (reviewerError) throw reviewerError;

      // 2. Delete old questions & answers associated with this reviewer
      const { data: oldQuestions, error: fetchQError } = await supabase
        .from("reviewer_questions")
        .select("r_ques_id")
        .eq("reviewer_id", flashcardData.reviewer_id);

      if (fetchQError) throw fetchQError;

      const qIds = oldQuestions.map((q) => q.r_ques_id);
      if (qIds.length > 0) {
        await supabase.from("reviewer_answers").delete().in("r_ques_id", qIds);
        await supabase.from("reviewer_questions").delete().eq("reviewer_id", flashcardData.reviewer_id);
      }

      // 3. Insert new questions and answers
      for (let i = 0; i < parsed.questions.length; i++) {
        const q = parsed.questions[i];
        const r_ques_id = "RQ" + Math.floor(10000000 + Math.random() * 90000000);

        const { error: qInsertError } = await supabase.from("reviewer_questions").insert([
          {
            r_ques_id,
            reviewer_ques: q.question,
            number_count: i + 1,
            reviewer_id: flashcardData.reviewer_id,
          },
        ]);

        if (qInsertError) throw qInsertError;

        const { error: aInsertError } = await supabase.from("reviewer_answers").insert([
          {
            rev_ans_id: "QA" + Math.floor(10000000 + Math.random() * 90000000),
            reviewer_answer: q.answer,
            r_ques_id,
          },
        ]);

        if (aInsertError) throw aInsertError;
      }

      setMessage("Flashcard updated successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong during update.");
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
        <h2 className="text-xl font-bold mb-4">Edit Flashcard</h2>

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
              placeholder="Edit your questions and answers..."
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
            src={formatImgFlashcard}
            alt="Correct format example"
            className="mt-2 max-w-full h-auto rounded"
          />
        </div>
      )}

      {message && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white px-5 py-5 rounded-xl shadow-lg w-[35%] relative">
            <div className="w-full">
              <div className="flex justify-end">
                <button onClick={() => { setMessage(""); onClose(); }}>
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
