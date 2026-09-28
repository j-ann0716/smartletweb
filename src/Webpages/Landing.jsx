import React, { useEffect, useState } from "react";
import LogIn from "../Components/LoginSignup/LogIn";
import heroImg from "../Webpages/img/hero-img.png";
import { useNavigate } from "react-router-dom";
import quizImg from "../Webpages/img/icons8-quiz-50.png";
import fCard from "../Webpages/img/icons8-flashcards-50.png";
import progressImg from "../Webpages/img/icons8-progress-50.png";
import FlashcardGrid from "../Components/Flashcard/FlashcardGrid";
import FourthSectionAccordion from "../Components/FourthSectionAccordion";
import MessageModal from '../Components/MessageModal';

const Landing = () => {
    document.title = "Smartlet - Landing";

    const [showLogin, setShowLogin] = useState(false); 
    const [data, setData] = useState([]); 
    const [loggedInUser, setLoggedInUser] = useState(null); 
    const [pendingRoute, setPendingRoute] = useState(null);
    const navigate = useNavigate(); 
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("/api/getUserData?type=users")
        .then((res) => res.json())
        .then((resData) => {
            setData(Array.isArray(resData) ? resData : []);
        })
        .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        if (showLogin) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showLogin]);

    const handleLogin = (username) => {
      const user = data.find(u => u.username === username); 
      if (user) { 
          setLoggedInUser(user); 
          setShowLogin(false);
          if (pendingRoute) { 
              navigate(pendingRoute); 
              setPendingRoute(null);
          }
      } else {
          setMessage("User not found!");
      }
    };

    const handleProtectedClick = (path) => {
        if (loggedInUser) { 
            navigate(path);
        } else {
            setPendingRoute(path);
            setShowLogin(true);
        }
    };

    return(
        <>
            <div className="flex items-center flex-row w-full sm:h-150 bg-[#F8F4F9] text-[#000000]">
                <div className="w-auto sm:w-[50%]">
                    <div className="m-10 sm:ml-30 text-[#533d64]">
                        <h1 className="hidden sm:block sm:text-[55px] font-bold font-nunito leading-[1]">Have fun studying with <span className="uppercase"> Smartlet</span>!</h1>
                        <h1 className="text-[40px] sm:hidden font-bold font-nunito leading-[1]">Start studying with <span className="uppercase"> Smartlet</span>!</h1>
                        <p className="text-[18px] sm:text-[14px] sm:mt-3 mt-1">Make learning exciting with SMARTLET’s interactive flipcards and engaging quizzes!</p>
                        <button onClick={() => handleProtectedClick('/home')} className="bg-[#BC80BA] px-5 text-[#FFFFFF] h-10 mt-5 rounded-full hover:bg-[#A669A4]">
                            Get Started
                        </button>
                    </div>
                </div>
                <div className="hidden sm:flex w-[50%] justify-end">
                    <img src={heroImg} className="w-[70%] mr-25" alt=""/>
                </div>
            </div>

            <div className="py-10 w-full bg-[#BC80BA]">
                <div className="mx-auto max-w-7xl px-4 h-full overflow-hidden">
                    <div className="text-center sm:mb-8 mb-6">
                        <h1 className="text-[40px] font-bold font-nunito text-[#F8F4F9]">Flashcards</h1>
                        <p className="text-white text-[14px]">Start reviewing and see how it works!</p>
                    </div>
                    <div className="md:mb-10 mb-5 inline-block sm:flex sm:flex-wrap w-full flex justify-center">
                        <FlashcardGrid />
                    </div>
                    <div className="w-full flex justify-center">
                        <button onClick={() => handleProtectedClick('/flashcard')} className="shadow-[#533d64]/90 bg-[#FFFFFF] px-5 text-[#533d64] font-semibold h-10 rounded-full hover:bg-[#F8F4F9] transition">
                            Start Reviewing
                        </button>
                    </div>
                </div>
            </div>

            <div className="w-full bg-[#F8F4F9] py-10">
                <div className="md:px-30 px-10 pb-3">
                    <div className="pt-15 w-full py-5 max-h-[1000px] min-h-[600px] overflow-auto">
                        <h1 className="text-[30px] font-bold font-nunito text-[#533d64] text-center">Getting Started</h1>
                        <FourthSectionAccordion />
                    </div>
                </div>
            </div>

            <div className="bg-[#BC80BA] h-[40px] w-full flex items-center justify-center text-white text-sm">
                &copy; {new Date().getFullYear()} All rights reserved.
            </div>
            
            {showLogin && <LogIn onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
            <MessageModal message={message} onClose={() => setMessage("")} />
        </>
    )
}

export default Landing;
