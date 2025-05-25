import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import backArrow from "../../Webpages/img/icons8-back-96.png";
import BackBtn from "../BackBtn";
import MessageModal from './MessageModal';

export default function QuizContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const quizId = queryParams.get('qid');
  const quizTitle = queryParams.get('title');

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizMeta, setQuizMeta] = useState({});
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchQuizData = async () => {
      if (!quizId) {
        setMessage('Quiz ID not provided in the URL.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`https://forreact.alwaysdata.net/getFullQuizById.php?quiz_id=${quizId}`);
        const data = await res.json();

        if (!isMounted) return;

        if (!data || !Array.isArray(data.questions)) {
          setMessage('Invalid quiz format. Please contact support.');
          setLoading(false);
          return;
        }

        const formattedQuestions = data.questions.map(q => {
          const correctLetter = q.correct?.trim().toUpperCase() || '';
          const choices = q.choices || {};

          const orderedChoices = {
            A: choices.a || '',
            B: choices.b || '',
            C: choices.c || '',
            D: choices.d || '',
          };

          return {
            question: q.question || '',
            choices: orderedChoices,
            correctLetter,
            correctText: orderedChoices[correctLetter] || '',
          };
        });

        setQuestions(formattedQuestions);
        setQuizMeta(data.meta || {});
      } catch (err) {
        console.error('Quiz fetch error:', err);
        setMessage('Failed to load quiz. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();

    return () => {
      isMounted = false;
    };
  }, [quizId]);

  const handleChoiceSelect = (letter) => {
    if (isAnswered) return;

    const selected = letter.toUpperCase();
    setSelectedLetter(selected);
    setIsAnswered(true);

    const current = questions[currentIndex];
    if (!current) return;

    if (selected === current.correctLetter) {
      setCorrectCount(prev => prev + 1);
      setFeedback('Correct!');
    } else {
      setFeedback(`Incorrect! Correct answer: ${current.correctLetter}. ${current.correctText}`);
    }
  };

  const handleNext = () => {
    setSelectedLetter(null);
    setFeedback('');
    setIsAnswered(false);
    setCurrentIndex(prev => prev + 1);
  };

  const handleFinish = async () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user?.user_id) {
      setMessage('User not logged in.');
      return;
    }

    const scoreId = 'Sc' + Math.floor(100000000 + Math.random() * 900000000);
    const payload = {
      score_id: scoreId,
      file_name: quizTitle,
      correct_count: correctCount,
      total_num_items: questions.length,
      quiz_id: quizId,
      user_id: user.user_id,
      creator_id: quizMeta.creator_id,
      uploaded_date: new Date().toISOString().split('T')[0],
    };

    try {
      const res = await fetch('https://forreact.alwaysdata.net/submitQuizScore.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`Quiz completed! You scored ${correctCount} out of ${questions.length}.`);
        navigate('/quiz');
      } else {
        setMessage(data.message || 'Failed to submit score.');
      }
    } catch (err) {
      console.error('Score submission error:', err);
      setMessage('An error occurred while submitting your score.');
    }
  };

  if (loading) {
    return (
      <div className="h-[590px] flex justify-center items-center">
        <p className="text-[#533d64] text-lg">Loading quiz...</p>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="h-[590px] flex justify-center items-center">
        <p className="text-red-600 text-lg">No questions available for this quiz.</p>
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <>
    <div className="h-[590px] px-5 py-5 md:px-25 md:py-10">
      <div className="mb-5">
        <button onClick={() => navigate('/quiz')} className="flex items-center text-[#533d64]">
          <BackBtn image={backArrow} />
          <span className="ml-3 text-[#533d64]">Back</span>
        </button>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full max-w-2xl p-6 bg-white rounded shadow-md">
          <h2 className="text-xl font-semibold text-[#533d64] mb-4">
            {currentIndex + 1}. {current.question}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(current.choices).map(([letter, text]) => (
              <button
                key={letter}
                onClick={() => handleChoiceSelect(letter)}
                className={`p-4 border rounded text-left transition-colors duration-200 ${
                  selectedLetter === letter
                    ? letter === current.correctLetter
                      ? 'bg-green-200 border-green-500'
                      : 'bg-red-200 border-red-500'
                    : 'bg-white border-gray-300 hover:bg-gray-100'
                }`}
                disabled={isAnswered}
              >
                <span className="font-bold mr-2">{letter}.</span> {text}
              </button>
            ))}
          </div>

          {feedback && (
            <div className="mt-4 text-center text-lg font-semibold text-[#533d64]">
              {feedback}
            </div>
          )}

          {isAnswered && (
            <div className="mt-4 text-right">
              {currentIndex + 1 < questions.length ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-[#533d64] text-white rounded hover:bg-[#402b4e]"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Finish
                </button>
              )}
            </div>
          )}

          <p className="mt-2 text-sm text-gray-600 text-right">
            {currentIndex + 1} / {questions.length}
          </p>
        </div>
      </div>
    </div>
    <MessageModal message={message} onClose={() => setMessage("")} />
    </>
  );
}
