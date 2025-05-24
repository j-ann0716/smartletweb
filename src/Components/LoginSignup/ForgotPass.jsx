import { useState } from "react";
import BackBtn from "../BackBtn";
import backArrow from '../../Webpages/img/icons8-back-96.png';
import lockImg from '../../Webpages/img/icons8-lock-30.png';
import usernameImg from '../../Webpages/img/icons8-username-48.png';
import passImg from '../../Webpages/img/icons8-password-48.png';
import closeImg from '../../Webpages/img/icons8-close-48.png';

export default function ForgotPassword({ onClose }) {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        try {
            const res = await fetch("/api/resetpass", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    identifier: emailOrUsername,
                    newPassword,
            }),
        });

        const data = await res.json();

        if (res.ok) {
            setMessage("Password updated successfully.");
        } else {
            setMessage(data.message || "Error resetting password.");
        }
        } catch (err) {
            console.error(err);
            setMessage("Something went wrong.");
        }
    };


    return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white px-7 sm:px-15 py-7 sm:py-15 rounded shadow-lg sm:w-[45%] w-[80%] relative">
                <div className="">
                    <button onClick={onClose} >
                    <BackBtn image={backArrow}/>
                    </button>
                </div>
                <div className="px-8 sm:px-15">
                    <div className="flex items-center justify-center">
                        <button disabled className="w-15 h-15 rounded-full bg-[#bc80ba] flex items-center justify-center">
                            <img src={lockImg} className="flex w-[60%] items-center"/>
                        </button>
                    </div>

                <h2 className="font-bold sm:text-[25px] text-[28px] mt-3 text-center">Forget Password</h2>
                <p className="sm:text-[14px] text-[16px] font-ibm font-semibold text-[#291d28] mb-3 text-center">Reset your password to open your account.</p>
                <form onSubmit={handleSubmit}>
                    <div className="relative w-full max-w-sm">
                        <input
                            type="text"
                            placeholder="Email or Username"
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                            className="mt-2 block font-ibm pr-10 mb-2 sm:mb-3 border-1 border-[#483e47]/60 p-3 rounded-full w-full h-[40px] text-[14px] focus:outline-none"
                        />
                            <img src={usernameImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                    </div>
                    <div className="relative w-full max-w-sm">
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block font-ibm pr-10 mb-2 sm:mb-3 border-1 border-[#483e47]/60 p-3 rounded-full w-full h-[40px] text-[14px] focus:outline-none"
                        />
                        <img src={passImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                    </div>
                    <div className="relative w-full max-w-sm">
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block font-ibm pr-10 mb-2 sm:mb-3 border-1 border-[#483e47]/60 p-3 rounded-full w-full h-[40px] text-[14px] focus:outline-none"
                        />
                        <img src={passImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                    </div>


                    <button
                        type="submit"
                        className="bg-[#BC80BA] text-[#FFFFFF] py-2 px-4 mt-2 sm:mt-5 mb-4 sm:mb-2 rounded-full w-full hover:bg-[#A669A4]"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
            {message && 
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                    <div className="bg-white px-5 py-5 rounded-xl shadow-lg w-[35%] relative">
                        <div className="w-full">
                            <div className="flex justify-end">
                                <button  onClick={onClose} >
                                    <BackBtn image={closeImg}/>
                                </button>
                            </div>
                             <div className="flex justify-center items-center">
                                <p className="text-[18px] text-[#533d64] text-center mb-5">{message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            }
            </div>
        </div>
    );
}
