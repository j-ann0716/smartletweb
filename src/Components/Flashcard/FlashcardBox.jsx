export function FlashcardBox({ card }) {
  if (!card) return null;

  return (
    <div className="w-[240px] h-[160px] shadow-md shadow-[#533d64]/90 bg-white rounded flex items-center">
      <div className="text-center w-full">
        <h1 className="text-[#533d64] font-semibold">{card.reviewer_title}</h1>
        <p className="text-[#533d64] text-[14px]">by: {card.username}</p>
      </div>
    </div>
  );
}
