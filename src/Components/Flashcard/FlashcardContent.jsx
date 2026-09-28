import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import backArrow from "../../Webpages/img/icons8-back-96.png";
import BackBtn from "../BackBtn";
import { supabase } from "../../supabaseClient";

export default function FlashcardContent() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const reviewerId = queryParams.get("rid");
    const reviewerTitle = queryParams.get("title");

    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flip, setFlip] = useState(false);

    const saveProgressToDb = async (progressPercent) => {
        try {
            const user = JSON.parse(localStorage.getItem("loggedInUser"));
            if (!user?.user_id || !reviewerId) return;

            // Assuming you have a progress table in Supabase
            await supabase
                .from("user_progress")
                .upsert({
                    user_id: user.user_id,
                    reviewer_id: reviewerId,
                    progress: Math.round(progressPercent),
                }, { onConflict: ['user_id', 'reviewer_id'] });
        } catch (error) {
            console.error("Failed to save progress:", error);
        }
    };

    const handleBackButton = async () => {
        const progress = ((currentIndex + 1) / cards.length) * 100;
        localStorage.setItem(
            `progress_${reviewerId}`,
            JSON.stringify({
                reviewerTitle,
                reviewerId,
                progress: Math.round(progress),
            })
        );
        await saveProgressToDb(progress);
        navigate("/flashcard");
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch questions linked to this reviewer
                const { data: questions, error: qError } = await supabase
                    .from("reviewer_questions")
                    .select("r_ques_id, reviewer_ques, number_count")
                    .eq("reviewer_id", reviewerId)
                    .order("number_count", { ascending: true });

                if (qError) throw qError;

                if (!questions || questions.length === 0) {
                    setCards([]);
                    return;
                }

                const qIds = questions.map((q) => q.r_ques_id);

                // Fetch matching answers
                const { data: answers, error: aError } = await supabase
                    .from("reviewer_answers")
                    .select("r_ques_id, reviewer_answer")
                    .in("r_ques_id", qIds);

                if (aError) throw aError;

                const joined = questions.map((q) => {
                    const match = answers?.find((a) => a.r_ques_id === q.r_ques_id);
                    return {
                        question: q.reviewer_ques,
                        answer: match?.reviewer_answer || "No answer available",
                    };
                });

                setCards(joined);
                setCurrentIndex(0);
                setFlip(false);
            } catch (error) {
                console.error("Error fetching flashcards:", error);
            }
        };

        if (reviewerId) {
            fetchData();

            const user = JSON.parse(localStorage.getItem("loggedInUser"));
            if (user?.user_id) {
                supabase
                    .from("user_progress")
                    .upsert({
                        user_id: user.user_id,
                        reviewer_id: reviewerId,
                        progress: 0,
                    }, { onConflict: ['user_id', 'reviewer_id'] })
                    .then(({ error }) => {
                        if (error) console.error("Failed to save initial progress:", error);
                    });
            }
        }
    }, [reviewerId]);

    const handleNext = () => {
        setFlip(false);
        setCurrentIndex((prev) => (prev + 1 < cards.length ? prev + 1 : prev));
    };

    if (!cards.length) {
        return (
            <div className="h-[590px] flex justify-center items-center">
                <p className="text-center text-[#533d64] text-lg">Loading flashcards...</p>
            </div>
        );
    }

    const current = cards[currentIndex];

    return (
        <div className="h-[590px] px-5 py-5 md:px-25 md:py-10">
            <div className="mb-5">
                <button onClick={handleBackButton} className="flex">
                    <BackBtn image={backArrow} />
                    <span className="ml-3 text-[#533d64]">Back</span>
                </button>
            </div>

            <div className="flex flex-col justify-center items-center">
                <div
                    onClick={() => setFlip(!flip)}
                    className="w-full h-[360px] shadow-md shadow-[#533d64]/90 bg-white rounded flex items-center justify-center border-[1px] border-[#533d64]/30 cursor-pointer p-6 transition-transform duration-300"
                >
                    <p className="text-center text-lg text-[#533d64] font-semibold">{flip ? current.answer : current.question}</p>
                </div>

                {currentIndex + 1 === cards.length ? (
                    <button
                        onClick={handleBackButton}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Finish
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="mt-4 px-4 py-2 bg-[#533d64] text-white rounded hover:bg-[#402b4e]"
                    >
                        Next
                    </button>
                )}

                <p className="mt-2 text-sm text-gray-600">
                    {currentIndex + 1} / {cards.length} ({Math.round(((currentIndex + 1) / cards.length) * 100)}%)
                </p>
            </div>
        </div>
    );
}
