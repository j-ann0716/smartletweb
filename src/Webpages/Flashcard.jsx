import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlashcardBox } from "../Components/Flashcard/FlashcardBox";

export default function Flashcard() {
    const [reviewers, setReviewers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Smartlet - Flashcard";
        fetch("https://forreact.alwaysdata.net/getFlashcardTitle.php")
            .then((res) => res.json())
            .then((data) => {
                const shuffled = data.sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 12);
                setReviewers(selected);
            })
            .catch((err) => console.error("Failed to fetch reviewers", err));
    }, []);

    const handleCardClick = (reviewer) => {
        navigate(`/flashcard-content?rid=${reviewer.reviewer_id}&title=${encodeURIComponent(reviewer.reviewer_title)}`);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-[#533d64] text-[28px] font-bold font-nunito leading-[1] my-6 text-center">Flashcards</h1>
            <hr className="border-[#533d64] mb-6" />
            <div className="grid grid-cols-1 justify-items-center sm:grid-cols-3 md:grid-cols-4 gap-6">
                {reviewers.map((card) => (
                    <div key={card.reviewer_id} onClick={() => handleCardClick(card)} className="cursor-pointer">
                        <FlashcardBox card={card} />
                    </div>
                ))}
            </div>
        </div>
    );
}
