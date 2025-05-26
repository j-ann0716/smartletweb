import { useState, useEffect } from "react";

export default function ActivityLog() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://forreact.alwaysdata.net/getActivityLog.php")
            .then((response) => response.json())
            .then((data) => {
                setLogs(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching activity logs:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading activity logs...</p>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6 bg-white rounded shadow">
            <h1 className="text-xl font-bold mb-4 text-[#533d64]">Activity Logs</h1>
            <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Log ID</th>
                        <th className="border border-gray-300 p-2">User ID</th>
                        <th className="border border-gray-300 p-2">Username</th>
                        <th className="border border-gray-300 p-2">Account Type</th>
                        <th className="border border-gray-300 p-2">Activity</th>
                        <th className="border border-gray-300 p-2">Date & Time</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.log_id} className="odd:bg-white even:bg-gray-50">
                            <td className="border border-gray-300 p-2">{log.log_id}</td>
                            <td className="border border-gray-300 p-2">{log.user_id}</td>
                            <td className="border border-gray-300 p-2">{log.username || "N/A"}</td>
                            <td className="border border-gray-300 p-2">{log.account_type}</td>
                            <td className="border border-gray-300 p-2">{log.activity}</td>
                            <td className="border border-gray-300 p-2">{log.date_time_log}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
