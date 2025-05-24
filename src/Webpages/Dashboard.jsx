import TabPanel from '../Components/Dashboard/TabPanel';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.title = "Smartlet - Dashboard";
    const stored = localStorage.getItem("loggedInUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!user) return <p className="text-center mt-10">Please log in to access your dashboard.</p>;

  return <TabPanel user={user} />;
}
