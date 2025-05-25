import React, { useEffect, useState } from "react";
import LogIn from "../Components/LoginSignup/LogIn";
import heroImg from "../Webpages/img/hero-img.png";
import { useNavigate } from "react-router-dom";
import quizImg from "../Webpages/img/icons8-quiz-50.png";
import fCard from "../Webpages/img/icons8-flashcards-50.png";
import progressImg from "../Webpages/img/icons8-progress-50.png";
import FlashcardGrid from "../Components/Flashcard/FlashcardGrid";
import FourthSectionAccordion from "../Components/FourthSectionAccordion";
import MessageModal from './MessageModal';

const Landing = () => {
    document.title = "Smartlet - Landing";

    const [showLogin, setShowLogin] = useState(false); 
    const [showAdminLink, setShowAdminLink] = useState(false); 
    const [data, setData] = useState([]); 
    const [loggedInUser, setLoggedInUser] = useState(null); 
    const [pendingRoute, setPendingRoute] = useState(null);
    const navigate = useNavigate(); 
    const [message, setMessage] = useState("");

    // Fetch data
    useEffect(() => {
        fetch("https://forreact.alwaysdata.net/getUsers.php")
        .then((res) => res.json())
        .then((data) => {
            setData(data);
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

    // handle login success
    const handleLogin = (username) => {
    const user = data.find(u => u.username === username); 
    if (user) { 
        setLoggedInUser(user); 
        setShowLogin(false);
        setShowAdminLink(user.account_type === 'Admin'); 
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

    const storedUser = localStorage.getItem("loggedInUser");
    const user = storedUser ? JSON.parse(storedUser) : null;

    return(
        <>
            {/*First Section*/}
            <div className="flex items-center flex-row w-full sm:h-150 bg-[#F8F4F9] text-[#000000]">
                <div className="w-auto sm:w-[50%]">
                    <div className="m-10 sm:ml-30 text-[#533d64]">
                        <h1 className="hidden sm:block sm:text-[55px] font-bold font-nunito leading-[1]">Have fun studying with 
                            <span className="uppercase"> Smartlet</span>!
                        </h1>
                        <h1 className="text-[40px] sm:hidden font-bold font-nunito leading-[1]">Start studying with 
                            <span className="uppercase"> Smartlet</span>!
                        </h1>
                        <p className="text-[18px] sm:text-[14px] sm:mt-3 mt-1">Make learning exciting with SMARTLET’s interactive flipcards and engaging quizzes! Whether you're preparing for a big test or just want to keep your memory sharp, SMARTLET makes studying feel less like a chore and more like a game. Flip through flashcards to master key concepts, then test yourself with quizzes to see how much you’ve learned—all while tracking your progress along the way.</p>
                        <button onClick={() => handleProtectedClick('/home')} className="bg-[#BC80BA] px-5 text-[#FFFFFF]  h-10 mt-5 rounded-full hover:bg-[#A669A4]">
                            Get Started
                        </button>
                    </div>
                </div>
                <div className="hidden sm:flex w-[50%] justify-end">
                    <img src={heroImg} className="w-[70%] mr-25" alt=""/>
                </div>
            </div>
            {/* Second Section */}
            <div className="bg-[#FFFFFF] text-[#FFFFFF] w-full">
                <div className="m-15 sm:m-30">
                    <div className="w-full text-[#533d64]">
                        <h1 className="text-[40px] sm:text-[35px] font-bold font-nunito leading-[1] text-center">Features</h1>
                        <p className="text-[18px] sm:text-[14px] mb-4 sm:mb-10 text-center">Our website can help you study through these features.</p>

                        <div className="flex flex-col sm:flex-row items-center sm:items-stretch justify-between w-full gap-4">
                            <div className="w-full sm:w-[33%] flex justify-center">
                                <div className="m-1 p-3 table bg-[#F8F4F9] w-[90%] h-full rounded-md inset-shadow-sm inset-shadow-[#cccccc]/90">
                                    <div className="m-5 sm:m-10 inline-block">
                                        <img src={fCard} className="mb-3" />
                                        <hr className="mb-2 w-[70px]" />
                                        <h3 className="text-[28px] sm:text-[22px] font-bold font-nunito leading-[1]">Create Flashcards</h3>
                                        <p className="text-[18px] sm:text-[14px]">You can create your own flashcards and use it as your reviewer.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full sm:w-[34%] flex justify-center">
                                <div className="m-1 p-3 table bg-[#F8F4F9] w-[90%] h-full rounded-md inset-shadow-sm inset-shadow-[#cccccc]/90">
                                    <div className="m-5 sm:m-10 inline-block">
                                        <img src={quizImg} className="mb-3" />
                                        <hr className="mb-2 w-[70px]" />
                                        <h3 className="text-[28px] sm:text-[23px] font-bold font-nunito leading-[1]">Play Quizzes</h3>
                                        <p className="text-[18px] sm:text-[14px]">You can play your own quizzes and quizzes uploaded by other users.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full sm:w-[33%] flex justify-center">
                                <div className="m-1 p-3 table bg-[#F8F4F9] w-[90%] h-full rounded-md inset-shadow-sm inset-shadow-[#cccccc]/90">
                                    <div className="m-5 sm:m-10 inline-block">
                                        <img src={progressImg} className="mb-3" />
                                        <hr className="mb-2 w-[70px]" />
                                        <h3 className="text-[28px] sm:text-[25px] font-bold font-nunito leading-[1]">Track Progress</h3>
                                        <p className="text-[18px] sm:text-[14px]">You’ll see how much you need to improve, how much your memory will improve based on the quizzes you played.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/*Third Section*/}
            <div className="py-10 w-full bg-[#BC80BA] ">
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
            {/* Fourth Section */}
            <div className="w-full bg-[#F8F4F9] py-10">
                <div className="md:px-30 px-10 pb-3">
                    <div className="pt-15 w-full py-5 max-h-[1000px] min-h-[600px] overflow-auto">
                        <h1 className="text-[30px] font-bold font-nunito text-[#533d64] text-center">Getting Started</h1>
                        <p className="mb-6"></p>
                        <FourthSectionAccordion />
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="bg-[#BC80BA] h-[40px] w-full flex items-center justify-center text-white text-sm">
                &copy; {new Date().getFullYear()} All rights reserved.
            </div>
            
            {showLogin && <LogIn onLogin={handleLogin} onClose={() => setShowLogin(false)}  />}
            <MessageModal message={message} onClose={() => setMessage("")} />
        </>
    )
}

export default Landing