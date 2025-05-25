import { useState } from "react";
import Profile from "../Components/User/Profile";
import Settings from "../Components/User/Settings";

export default function UserProfile() {
  document.title = "Smartlet - Profile";

  const [activeTab, setActiveTab] = useState("Profile");

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return <div><Profile /></div>;
      case "Settings":
        return <div><Settings /></div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#F8F4F9] text-[#533d64]">
      {/* Sidebar */}
      <div className="w-full md:w-64 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200 bg-white">
        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">User Menu</h2>
        <ul className="space-y-2 md:space-y-4">
          {["Profile", "Settings"].map((tab) => (
            <li key={tab}>
              <button
                className={`w-full text-left px-4 py-2 shadow border-[#533d64]/20 rounded-lg transition-all ${
                  activeTab === tab
                    ? "bg-[#BC80BA] text-white"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 md:p-8S md:max-h-[593px]">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow h-full overflow-y-auto max-h-[calc(100%-2rem)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
  
          //<h2 className="text-[#533d64] md:text-[22px] mb-3 font-semibold font-nunito">{activeTab}</h2>
          //<hr className="w-full border-[#533d64]/50 mb-6" />
}