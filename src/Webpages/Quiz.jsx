import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuizBox } from "../Components/Quiz/QuizBox";

export default function Quiz() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Smartlet - Quiz";
    fetch("https://forreact.alwaysdata.net/getQuizList.php")
      .then((res) => res.json())
      .then((data) => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 12);
        setQuizzes(selected);
      })
      .catch((err) => console.error("Failed to fetch quizzes", err));
  }, []);

  const handleCardClick = (quiz) => {
    navigate(`/quiz-content?qid=${quiz.quiz_id}&title=${encodeURIComponent(quiz.quiz_title)}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-[#533d64] text-[28px] font-bold font-nunito my-5 text-center">Quizzes</h1>
      <hr className="border-[#533d64] mb-6" />
      <div className="grid grid-cols-1 justify-items-center sm:grid-cols-3 md:grid-cols-4 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.quiz_id} onClick={() => handleCardClick(quiz)} className="cursor-pointer">
            <QuizBox card={quiz} />
          </div>
        ))}
      </div>
    </div>
  );
}