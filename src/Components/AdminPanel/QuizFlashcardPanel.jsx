import { useEffect, useState } from "react";

export default function QuizFlashcardPanel() {
  const [quizData, setQuizData] = useState([]);
  const [questionData, setQuestionData] = useState([]);
  const [choiceData, setChoiceData] = useState([]);
  const [answerData, setAnswerData] = useState([]);
  const [users, setUsers] = useState([]);
  const [flashcardData, setFlashcardData] = useState([]);
  const [questionDataF, setQuestionDataF] = useState([]);
  const [answerDataF, setAnswerDataF] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, quesRes, choiceRes, ansRes, userRes, flashcardRes, fQuesRes, fAnsRes] = await Promise.all([
          fetch("https://forreact.alwaysdata.net/getQuiz.php").then((res) => res.json()),
          fetch("https://forreact.alwaysdata.net/getQuizQuestions.php").then((res) => res.json()),
          fetch("https://forreact.alwaysdata.net/getQuizChoices.php").then((res) => res.json()),
          fetch("https://forreact.alwaysdata.net/getQuizAnswers.php").then((res) => res.json()),

          fetch("https://forreact.alwaysdata.net/getUsers.php").then((res) => res.json()),

          fetch("https://forreact.alwaysdata.net/getFlashcardTitle.php").then((res) => res.json()),
          fetch("https://forreact.alwaysdata.net/getFlashcardQuestions.php").then((res) => res.json()),
          fetch("https://forreact.alwaysdata.net/getFlashcardAnswers.php").then((res) => res.json()),
          
        ]);

        setQuizData(quizRes);
        setQuestionData(quesRes);
        setChoiceData(choiceRes);
        setAnswerData(Array.isArray(ansRes) ? ansRes : [ansRes]);
        setUsers(userRes);
        setFlashcardData(flashcardRes);
        setQuestionDataF(fQuesRes);
        setAnswerDataF(fAnsRes);
      } catch (error) {
        console.error("Data fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const getUsername = (creatorId) => {
    const user = users.find((u) => u.user_id === creatorId);
    return user ? user.username : "Unknown";
  };

  const sortedQuestions = [...questionData].sort((a, b) => a.ques_id.localeCompare(b.ques_id));
  const sortedChoicesQIDs = Array.from(new Set(choiceData.map((c) => c.ques_id))).sort();
  const sortedAnswers = [...answerData].sort((a, b) => a.ques_id.localeCompare(b.ques_id));

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Quiz Table */}
        <div className="bg-white p-4 rounded shadow border-[#533d64]/80">
          <h2 className="text-lg font-bold mb-2 text-[#533d64]">Quiz Table</h2>
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-[#BC80BA] text-white">
              <tr>
                <th className="p-2 border">Quiz ID</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Creator</th>
                <th className="p-2 border">Uploaded</th>
                <th className="p-2 border">Items</th>
              </tr>
            </thead>
            <tbody>
              {quizData.map((quiz) => (
                <tr key={quiz.quiz_id} className="odd:bg-white even:bg-gray-50 text-center">
                  <td className="p-2 border">{quiz.quiz_id}</td>
                  <td className="p-2 border">{quiz.quiz_title}</td>
                  <td className="p-2 border">{getUsername(quiz.creator_id)}</td>
                  <td className="p-2 border">{quiz.uploaded_date}</td>
                  <td className="p-2 border">{quiz.number_of_items}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Question Table */}
        <div className="bg-white p-4 rounded shadow border-[#533d64]/80">
          <h2 className="text-lg font-bold mb-2 text-[#533d64]">Questions Table</h2>
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-[#BC80BA] text-white">
              <tr>
                <th className="p-2 border">Question ID</th>
                <th className="p-2 border">Question</th>
                <th className="p-2 border">Number</th>
              </tr>
            </thead>
            <tbody>
              {sortedQuestions.map((q) => (
                <tr key={q.ques_id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border">{q.ques_id}</td>
                  <td className="p-2 border">{q.questions}</td>
                  <td className="p-2 border text-center">{q.number_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Choices Table */}
        <div className="bg-white p-4 rounded shadow border-[#533d64]/80 overflow-x-auto">
          <h2 className="text-lg font-bold mb-2 text-[#533d64]">Choices Table</h2>
          <table className="w-full text-sm border border-[#533d64] overflow-x-auto">
            <thead className="bg-[#BC80BA] text-white">
              <tr>
                <th className="p-2 border">Question ID</th>
                <th className="p-2 border">A</th>
                <th className="p-2 border">B</th>
                <th className="p-2 border">C</th>
                <th className="p-2 border">D</th>
              </tr>
            </thead>
            <tbody>
              {sortedChoicesQIDs.map((ques_id) => {
                const grouped = choiceData.filter((c) => c.ques_id === ques_id);
                const choices = {
                  a: grouped.find((c) => c.letter_choices === "a")?.choices_content || "-",
                  b: grouped.find((c) => c.letter_choices === "b")?.choices_content || "-",
                  c: grouped.find((c) => c.letter_choices === "c")?.choices_content || "-",
                  d: grouped.find((c) => c.letter_choices === "d")?.choices_content || "-",
                };
                return (
                  <tr key={ques_id} className="odd:bg-white even:bg-gray-50 text-center">
                    <td className="p-2 border">{ques_id}</td>
                    <td className="p-2 border">{choices.a}</td>
                    <td className="p-2 border">{choices.b}</td>
                    <td className="p-2 border">{choices.c}</td>
                    <td className="p-2 border">{choices.d}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Answer Table */}
        <div className="bg-white p-4 rounded shadow border-[#533d64]/80">
          <h2 className="text-lg font-bold mb-2 text-[#533d64]">Answer Table</h2>
          <table className="w-full text-sm border border-[#533d64]">
            <thead className="bg-[#BC80BA] text-white">
              <tr>
                <th className="p-2 border">Question ID</th>
                <th className="p-2 border">Letter</th>
                <th className="p-2 border">Correct Answer</th>
              </tr>
            </thead>
            <tbody>
              {sortedAnswers.map((ans) => (
                <tr key={ans.anss_id} className="odd:bg-white even:bg-gray-50 text-center">
                  <td className="p-2 border">{ans.ques_id}</td>
                  <td className="p-2 border">{ans.ans_letter}</td>
                  <td className="p-2 border">{ans.correct_ans}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Flashcard Table */}
        <div className="bg-white p-4 rounded shadow border-[#533d64]/80">
          <h2 className="text-lg font-bold mb-2 text-[#533d64]">Flashcard Table</h2>
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-[#BC80BA] text-white">
              <tr>
                <th className="p-2 border">Flashcard ID</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Creator</th>
                <th className="p-2 border">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {flashcardData.map((fc) => (
                <tr key={fc.r_ques_id} className="odd:bg-white even:bg-gray-50 text-center">
                  <td className="p-2 border">{fc.reviewer_id}</td>
                  <td className="p-2 border">{fc.reviewer_title}</td>
                  <td className="p-2 border">{getUsername(fc.username)}</td>
                  <td className="p-2 border">{fc.uploaded_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Flashcard Questions Table */}
        <div className="bg-white p-4 rounded shadow border-[#533d64]/80">
          <h2 className="text-lg font-bold mb-2 text-[#533d64]">Flashcard Questions Table</h2>
          <table className="w-full text-sm border border-gray-300">
            <thead className="bg-[#BC80BA] text-white">
              <tr>
                <th className="p-2 border">Question ID</th>
                <th className="p-2 border">Question</th>
                <th className="p-2 border">Number</th>
              </tr>
            </thead>
            <tbody>
              {[...questionDataF]
                .sort((a, b) => a.r_ques_id.localeCompare(b.r_ques_id))
                .map((q) => (
                  <tr key={q.flashcard_ques_id} className="odd:bg-white even:bg-gray-50">
                    <td className="p-2 border">{q.r_ques_id}</td>
                    <td className="p-2 border">{q.reviewer_ques}</td>
                    <td className="p-2 border text-center">{q.number_count}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Flashcard Answers Table */}
        <div className="bg-white p-4 rounded shadow border-[#533d64]/80">
          <h2 className="text-lg font-bold mb-2 text-[#533d64]">Flashcard Answers Table</h2>
          <table className="w-full text-sm border border-[#533d64]">
            <thead className="bg-[#BC80BA] text-white">
              <tr>
                <th className="p-2 border">Question ID</th>
                <th className="p-2 border">Answer</th>
              </tr>
            </thead>
            <tbody>
              {[...answerDataF]
                .sort((a, b) => a.r_ques_id.localeCompare(b.r_ques_id))
                .map((ans) => (
                  <tr key={ans.flashcard_ans_id} className="odd:bg-white even:bg-gray-50 text-center">
                    <td className="p-2 border">{ans.r_ques_id}</td>
                    <td className="p-2 border">{ans.reviewer_answer}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
