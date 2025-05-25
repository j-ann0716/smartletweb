import { useState } from "react";
import BackBtn from "../BackBtn";
import closeImg from '../../Webpages/img/icons8-close-48.png';
import usernameImg from '../../Webpages/img/icons8-username-48.png';
import passImg from '../../Webpages/img/icons8-password-48.png';
import SignUp from './SignUp';
import ForgotPassword from "./ForgotPass";

export default function LogIn({ onLogin, onClose }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showLogin, setShowLogin] = useState(true);
    const [showSignUp, setShowSignUp] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false); 

    const handleSignUp = (path) => {
        if (loggedInUser) {
        navigate(path);
        } else {
        setPendingRoute(path);
        setShowSignUp(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("https://forreact.alwaysdata.net/getUsers.php")
        .then((res) => res.json())
        .then((users) => {
        const user = users.find((u) => u.username === username);

        if (!user) {
        alert("Username does not exist.");
        return;
        }

        if (user.password !== password) {
        alert("Incorrect password.");
        return;
        }
        
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        localStorage.setItem("user", JSON.stringify(user));


        onLogin(user.username);
        })
        .catch((err) => {
        console.error("Fetch error:", err);
        alert("Server error. Please try again later.");
        });
    };
    

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" id="toDis">
        <div className="w-[80%] bg-white px-10 sm:px-15 py-7 sm:py-10 rounded shadow-lg sm:w-[45%] relative">
            <div className="flex justify-end">
                <button  onClick={onClose} >
                    <BackBtn image={closeImg}/>
                </button>
            </div>
            <div className="px-10 sm:px-15 sm:py-5 ">
                <div className="flex flex-row w-full items-start justify-between">
                    <div className="flex justify-start mb-3 sm:mb-6">
                        <div>
                            <h2 className="font-black font-ibm text-[32px] sm:text-[28px] text-[#291d28] sm:mb-3">Log In</h2>
                            <p className="text-[14px] font-ibm font-semibold text-[#291d28]">We are so happy to see you again!! Please put your email account to log you in.</p>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="relative w-full max-w-sm">
                        <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block font-ibm pr-10 mb-2 sm:mb-5 border-1 border-[#483e47]/60 p-3 rounded-full w-full h-[40px] text-[14px] focus:outline-none"
                        />
                        <img src={usernameImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                    </div>
                    
                    <div className="relative w-full max-w-sm">
                        <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block font-ibm pr-10 mb-1 border-1 border-[#483e47]/60 p-3 rounded-full w-full h-[40px] text-[14px] focus:outline-none"
                        />
                        <img src={passImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                    </div>
                    <div className="flex justify-end mb-4 sm:mb-7">
                        <button type="button" className="text-[#6c3b6c] sm:text-[14px] text-[16px]" onClick={() => setShowForgotPassword(true)}>
                            Forget Password?
                        </button>
                    </div>
                    <button type="submit" className="bg-[#BC80BA] text-[#FFFFFF] py-2 px-4 mb-1 sm:mb-2 rounded-full w-full hover:bg-[#A669A4]">
                    Log In
                    </button>
                </form>
                <div className="flex justify-center text-[14px] mb-5 sm:mb-10">
                    <p>
                        Don't have an account?<span className="text-[#FFFFFF]/0">s</span>
                        <button type="button" className="text-[#6c3b6c]" onClick={() => setShowSignUp(true)}>
                            Sign Up
                        </button>
                    </p>
                </div>
        </div>
        </div>
        {/*<Button text={"Close"} onClick={handleLoginClose}/>*/}
        {showSignUp && <SignUp onClose={() => setShowSignUp(false)} onLogin={onLogin} />}
        {showForgotPassword && (
        <ForgotPassword onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
    
  );
}
