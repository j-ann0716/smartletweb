import { Link } from 'react-router-dom';

export function FlashBtn() {
  return (
    <Link to="/flashcard">
      <button 
        className="bg-[#BC80BA] px-5 text-[#FFFFFF] h-10 mt-5 rounded-full hover:bg-[#A669A4]"
      >
        Get Started
      </button>
    </Link>
  );
}
