import { useEffect, useState } from 'react';
import { FlashcardBox } from './FlashcardBox';

function getRandomItems(arr, count) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function FlashcardGrid() {
  const [randomCards, setRandomCards] = useState([]);

  useEffect(() => {
    fetch('https://forreact.alwaysdata.net/getFlashcardTitle.php')
      .then((res) => res.json())
      .then((result) => {
        if (Array.isArray(result)) {
            setRandomCards(getRandomItems(result, 4));
        } else {
            console.error('Unexpected response format:', result);
        }
        })
      .catch((error) => console.error('Error fetching flashcards:', error));
  }, []);

  return (
    <div className="mt-3 sm:mt-4 w-full sm:h-50 h-80 inline-block mx-auto">
      <div className="flex sm:gap-10 gap-5 md:gap-4 justify-center md:flex-wrap ">
        {randomCards.map((card, idx) => (
          <div key={idx} className={`${idx > 1 ? 'hidden sm:block' : ''}`}>
            <FlashcardBox card={card} />
          </div>
        ))}
      </div>
    </div>

  );
}
