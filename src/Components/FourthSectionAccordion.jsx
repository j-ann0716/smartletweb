import React, { useState } from "react";

export default function FourthSectionAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const accordionItems = [
    {
      title: "Create Flashcard",
      content:
        "Easily create flashcards by uploading a text file or manually typing your questions and answers. Each flashcard set is saved under your account and can be edited anytime.",
    },
    {
      title: "Use Flashcard for a Review",
      content:
        "Review your flashcards one by one using our flashcard viewer. Flip cards to test your memory and track how many you’ve completed. A great way to prepare for exams or reinforce learning.",
    },
    {
      title: "Create Quiz",
      content:
        "Design your own quizzes with multiple-choice questions. Upload a formatted text file or use our manual input tool to build customized quizzes for any subject.",
    },
    {
      title: "Quiz Tips & Strategies",
      content:
        "Take your time to read each question carefully. Eliminate wrong answers first, and use flashcards for topics you find challenging. Practice regularly to improve your score.",
    },
    {
      title: "Track Your Progress",
      content:
        "Monitor your study progress with our built-in tracker. View completed flashcard sets and quiz scores. Resume where you left off and celebrate milestones as you improve.",
    },
  ];


  return (
    <>
      {accordionItems.map((item, index) => (
        <div key={index} className="mb-2 border border-gray-300 rounded text-[#533d64]">
          <button
            onClick={() => toggleIndex(index)}
            className="w-full text-left p-4 bg-white flex justify-between items-center focus:outline-none"
            aria-expanded={openIndex === index}
            aria-controls={`accordion-content-${index}`}
            id={`accordion-header-${index}`}
          >
            <span>{item.title}</span>
            <svg
              className={`w-5 h-5 transform transition-transform duration-300 ${
                openIndex === index ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {openIndex === index && (
            <div
              id={`accordion-content-${index}`}
              role="region"
              aria-labelledby={`accordion-header-${index}`}
              className="p-4 bg-gray-50 text-gray-700"
            >
              {item.content}
            </div>
          )}
        </div>
      ))}
    </>
  );
}
