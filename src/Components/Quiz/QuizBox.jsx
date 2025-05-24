export function QuizBox({ card }) {
  if (!card) return null;

  return (
    <div className="w-[240px] h-[160px] shadow-md shadow-[#533d64]/90 bg-white rounded flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-[#533d64] font-semibold">{card.quiz_title}</h1>
      <p className="text-[#533d64] text-[14px]">by: {card.username}</p>

      <div className="mt-5 text-sm text-[#533d64]">
        {card.number_of_items} items
      </div>
    </div>
  );
}
