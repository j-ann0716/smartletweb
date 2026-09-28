import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BackBtn from "../BackBtn";
import backArrow from '../../Webpages/img/icons8-back-96.png';
import closeImg from '../../Webpages/img/icons8-close-48.png';
import MessageModal from '../MessageModal';

export default function SignUp({ onClose, onLogin }) {
  const [message, setMessage] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    if (e.target.name === "confirmPassword") {
      if (e.target.value !== formData.password) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstname, lastname, username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    const newUser = { firstname, lastname, username, email, password, account_type: "User" };

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      if (res.status === 409) {
        const data = await res.json();
        setUsernameError(data.error || "Username already exists");
        return;
      }

      if (!res.ok) throw new Error("Failed to create account");

      setMessage("Account created successfully!");
      onClose();
      window.location.reload();
    } catch (err) {
      console.error(err);
      setMessage("Could not create account");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="bg-white px-7 sm:px-15 py-7 sm:py-10 rounded shadow-lg w-[80%] sm:w-[45%] relative">
          <div>
              <button onClick={onClose}>
                  <BackBtn image={backArrow}/>
              </button>
          </div>
          <div className="px-8 sm:px-15">
              <div className="flex flex-row w-full items-start justify-between">
                  <div className="flex justify-start mb-2 sm:mb-6">
                      <div>
                          <h2 className="font-black font-ibm text-[32px] sm:text-[28px] text-[#291d28] sm:mb-1">Sign Up</h2>
                          <p className="sm:text-[14px] text-[16px] font-ibm font-semibold text-[#291d28]">Create your account here so you can use our website.</p>
                      </div>
                  </div>
              </div>
              <form onSubmit={handleSubmit}>
                <input name="firstname" onChange={handleChange} value={formData.firstname}
                type="text" placeholder="First Name"
                className="block font-ibm px-5 mb-2 border-1 border-[#483e47]/60 p-3 rounded-full w-full h-[40px] text-[14px] focus:outline-none"
                />
                <input name="lastname" onChange={handleChange} value={formData.lastname}
                type="text" placeholder="Last Name"
                className="block font-ibm px-5 mb-2 border-1 border-[#483e47]/60 p-3 rounded-full w-full h-[40px] sm:text-[14px] text-[16px] focus:outline-none"
                />
                <input name="username" onChange={handleChange} value={formData.username}
                type="text" placeholder="Username"
                className="block font-ibm px-5 mb-2 border-1 border-[#483e47]/60 p-3 rounded-full w-full h-[40px] sm:text-[14px] text-[16px] focus:outline-none"
                />
                <input name="email" onChange={handleChange} value={formData.email}
                type="email" placeholder="Email"
                className="block font-ibm px-5 mb-2 border-1 border-[#483e47]/60 p-3 rounded-full w-full h-[40px] sm:text-[14px] text-[16px] focus:outline-none"
                />
                <input name="password" onChange={handleChange} value={formData.password}
                type="password" placeholder="Password"
                className="block font-ibm px-5 mb-2 border-1 border-[#483e47]/60 p-3 rounded-full w-full h-[40px] sm:text-[14px] text-[16px] focus:outline-none"
                />
                <div className="mb-4">
                  <input name="confirmPassword" onChange={handleChange} value={formData.confirmPassword}
                  type="password" placeholder="Confirm Password"
                  className={`block font-ibm px-5 mb-2 border-1 border-[#483e47]/60 p-3 rounded-full w-full h-[40px] sm:text-[14px] text-[16px] focus:outline-none ${passwordError ? 'border-red-500' : ''}`}
                  />
                  {passwordError && (
                    <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                  )}
                </div>

                <button type="submit" className="bg-[#BC80BA] text-[#FFFFFF] py-2 px-4 sm:mb-2 rounded-full w-full hover:bg-[#A669A4]">
                  Sign Up
                </button>
              </form>
              <div className="flex justify-center text-[14px] mb-7 sm:mb-10">
                  <p>
                      Already have an account?{" "}
                      <button type="button" className="text-[#6c3b6c]" onClick={onClose}>
                          Log In
                      </button>
                  </p>
              </div>
            </div>
            {usernameError && 
              <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                <div className="bg-white px-5 py-5 rounded-xl shadow-lg w-[35%] relative">
                  <div className="w-full">
                    <div className="flex justify-end">
                      <button onClick={() => setUsernameError("")}>
                        <BackBtn image={closeImg} />
                      </button>
                    </div>
                    <div className="flex justify-center items-center">
                      <p className="text-[18px] text-[#533d64] text-center mb-5">{usernameError}</p>
                    </div>
                  </div>
                </div>
              </div>
            }
        </div>
        <MessageModal message={message} onClose={() => setMessage("")} />
    </div>
  );
}
