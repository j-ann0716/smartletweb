import { useEffect, useState } from 'react';
import { QuizBox } from './QuizBox';

function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function QuizGrid() {
  const [randomCards, setRandomCards] = useState([]);

  useEffect(() => {
    fetch('/api/getUserData?type=quizzes')
      .then((res) => res.json())
      .then((result) => {
        if (Array.isArray(result)) {
            setRandomCards(getRandomItems(result, 4));
        } else {
            console.error('Unexpected response format:', result);
        }
      })
      .catch((error) => console.error('Error fetching quiz list:', error));
  }, []);

  return (
    <div className="mt-3 sm:mt-4 w-full sm:h-50 h-80 inline-block">
      <div className="flex sm:gap-10 gap-5 justify-center flex-wrap">
        {randomCards.map((card, idx) => (
          <div key={idx} className={`${idx > 1 ? 'hidden sm:block' : ''}`}>
            <QuizBox card={card} />
          </div>
        ))}
      </div>
    </div>
  );
}
