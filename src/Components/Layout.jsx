import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import logoImg from "../Webpages/img/logo.png";
import LogIn from "./LoginSignup/LogIn";
import menuImg from "../Webpages/img/icons8-menu-48.png";
import closeImg from "../Webpages/img/icons8-close-48 (1).png";
import MessageModal from "./MessageModal";

export default function Layout() {
    const [showLogin, setShowLogin] = useState(false);
    const [showAdminLink, setShowAdminLink] = useState(false);
    const [data, setData] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [pendingRoute, setPendingRoute] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showMobileProfile, setShowMobileProfile] = useState(false);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetch('/api/getUserData?type=users')
            .then(res => res.json())
            .then(resData => {
                setData(Array.isArray(resData) ? resData : []);
            })
            .catch(err => console.log("Fetch error:", err));
    }, []);

    useEffect(() => {
        const stored = localStorage.getItem("loggedInUser");
        if (stored) {
            const parsed = JSON.parse(stored);
            setLoggedInUser(parsed);
            setShowAdminLink(parsed.account_type === 'Admin');
        }
    }, []);

    const handleLogin = (username) => {
        const user = data.find(u => u.username === username);
        if (user) {
            setLoggedInUser(user);
            localStorage.setItem("loggedInUser", JSON.stringify(user));
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

    const handleLogout = (path) => {
        localStorage.removeItem('loggedInUser');
        setLoggedInUser(null);
        setShowProfile(false);
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("progress_")) {
                localStorage.removeItem(key);
            }
        });
        navigate(path);
    };

    const handleProtectedClick = (path) => {
        if (loggedInUser && loggedInUser.username) {
            navigate(path);
        } else {
            setPendingRoute(path);
            setShowLogin(true);
        }
        setSidebarOpen(false);
    };

    const handleProtectedClickUser = () => {
        setShowLogin(true);
    };

    return (
        <>
            <div className='flex items-center justify-between w-full h-[40px] bg-[#BC80BA] text-fuchsia-100 font-medium text-[14px]'>
                <div className='w-auto ml-4 sm:w-[15%] sm:ml-10'>
                    <img src={logoImg} className='w-[50%] sm:w-[80%] flex items-center justify-center' alt="Logo" />
                </div>

                <div className='w-[70%]'>
                    <ul className='hidden sm:flex flex-row justify-center'>
                        <button onClick={() => handleProtectedClick('/home')} className="basis-[90px] text-center flex items-center justify-center hover:bg-[#A669A4] hover:text-[#FFFFFF] h-[40px]">Home</button>
                        <button onClick={() => handleProtectedClick('/flashcard')} className="basis-[120px] text-center flex items-center justify-center hover:bg-[#A669A4] h-[40px] hover:text-[#FFFFFF]">Flashcard</button>
                        <button onClick={() => handleProtectedClick('/quiz')} className="basis-[90px] text-center flex items-center justify-center hover:bg-[#A669A4] h-[40px] hover:text-[#FFFFFF]">Quiz</button>
                        <button onClick={() => handleProtectedClick('/dashboard')} className="basis-[120px] text-center flex items-center justify-center hover:bg-[#A669A4] h-[40px] hover:text-[#FFFFFF]">Dashboard</button>
                        {showAdminLink && (
                            <button onClick={() => handleProtectedClick('/admin')} className="basis-[130px] text-center flex items-center justify-center hover:bg-[#A669A4] h-[40px] hover:text-[#FFFFFF]">Admin Panel</button>
                        )}
                    </ul>
                </div>

                <div className='hidden sm:flex w-[15%] mr-10 justify-end'>
                    <button
                        onClick={() => {
                            if (loggedInUser && loggedInUser.username) {
                                setShowProfile(prev => !prev);
                            } else {
                                handleProtectedClickUser();
                            }
                        }}
                        className="basis-[100px] text-center flex items-center justify-center hover:bg-[#A669A4] h-[40px] hover:text-[#FFFFFF]">
                        {loggedInUser?.username || "Log In"}
                    </button>
                </div>

                {loggedInUser && (
                    <div className={`absolute top-[41px] right-10 w-[100px] bg-[#BC80BA] text-white shadow-lg z-50 sm:block hidden transform transition-all duration-300 ease-out ${showProfile ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
                        <div className="flex flex-col gap-2 p-4">
                            <button onClick={() => handleProtectedClick('/profile')} className="text-left hover:bg-[#A669A4]">Profile</button>
                            <button onClick={() => { handleLogout('/'); setShowProfile(false); }} className="text-left hover:bg-[#A669A4]">Log out</button>
                        </div>
                    </div>
                )}

                <div className="sm:hidden flex w-[15%] mr-4 justify-end">
                    <button onClick={() => setSidebarOpen(true)}>
                        <img src={menuImg} alt="menu" className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <hr className='border-[#BC80BA]' />

            <div className={`fixed top-0 right-0 table h-[250px] bg-[#BC80BA] text-white transform transition-transform duration-300 z-50 ${sidebarOpen ? 'translate-y-0' : '-translate-y-full'} sm:hidden`}>
                <div className="flex flex-col gap-4 p-6 mt-10">
                    <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-white hover:bg-[#A669A4]">
                        <img src={closeImg} alt="Close" className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleProtectedClick('/home')} className="text-left hover:bg-[#A669A4]">Home</button>
                    <button onClick={() => handleProtectedClick('/flashcard')} className="text-left hover:bg-[#A669A4]">Flashcard</button>
                    <button onClick={() => handleProtectedClick('/quiz')} className="text-left hover:bg-[#A669A4]">Quiz</button>
                    <button onClick={() => handleProtectedClick('/dashboard')} className="text-left hover:bg-[#A669A4]">Dashboard</button>
                    {showAdminLink && (
                        <button onClick={() => handleProtectedClick('/admin')} className="text-left hover:bg-[#A669A4]">Admin Panel</button>
                    )}
                    <div className="relative w-full">
                        <button onClick={() => setShowMobileProfile((prev) => !prev)} className="text-left hover:bg-[#A669A4] flex items-center justify-between w-full">
                            {loggedInUser?.username || "Log In"}
                            <span className="ml-1">{showMobileProfile ? '▲' : '▼'}</span>
                        </button>

                        <div className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${showMobileProfile ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="flex flex-col gap-2 mt-2 bg-[#BC80BA] p-4 rounded text-white shadow w-full">
                                <button onClick={() => { handleProtectedClick('/profile'); setShowMobileProfile(false); }} className="text-left hover:bg-[#A669A4]">Profile</button>
                                <button onClick={() => { handleLogout('/'); setShowMobileProfile(false); }} className="text-left hover:bg-[#A669A4]">Log out</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showLogin && <LogIn onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
            <MessageModal message={message} onClose={() => setMessage("")} />
            <Outlet />
        </>
    );
}
