// EventDetail.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
//import imgBack from "../../img/back.png";

export default function EventContent() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [category, setCategory] = useState('');
  const [creator, setCreator] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [eventRes, catRes, userRes] = await Promise.all([
        fetch('https://6834d971cd78db2058bf87f2.mockapi.io/eventify/event'),
        fetch('https://6834d971cd78db2058bf87f2.mockapi.io/eventify/event-category'),
        fetch('https://6834806d464b499636031d7e.mockapi.io/eventify/users')
      ]);

      const events = await eventRes.json();
      const categories = await catRes.json();
      const users = await userRes.json();

      const selectedEvent = events.find(e => e.event_id === eventId);
      if (!selectedEvent) return;

      setEvent(selectedEvent);

      const matchedCategory = categories.find(c => c.category_id === selectedEvent['event-categoryId']);
      setCategory(matchedCategory?.category_name || 'Unknown');

      const matchedUser = users.find(u => u.user_id === selectedEvent.creator_id);
      setCreator(matchedUser ? `${matchedUser.username}` : 'Unknown');
    };

    fetchData();
  }, [eventId]);

  if (!event) return <p>Loading...</p>;

  return (
    <div className="bg-green-50 min-h-screen flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-[auto_65%_35%] items-start gap-6 mt-6">
        <div className="md:col-span-1">
          <div className="flex justify-start">
            {/* <button onClick={() => window.history.back()} className="w-10 text-[20px]">
              <img className="w-[80%]" src={imgBack} alt="Back" />
            </button> */}
          </div>
        </div>

        {/* Image */}
        <div>
          <img
            src={event.event_img}
            alt={event.event_name}
            className="w-full h-[500px] object-cover rounded-md"
          />
        </div>

        {/* Event Details */}
        <div className="bg-white rounded-md p-10 border-[#586140]/50 shadow-sm">
          <h2 className="text-2xl font-bold mb-2 poppins text-[#527000]">{event.event_name}</h2>
          <p className="text-sm poppins text-gray-700 mb-10">{event.event_description}</p>

          <ul className="text-sm font-light poppins text-[#586140] mb-4 space-y-2">
            <li>📅 {event.event_date}</li>
            <li>🕘 {event.event_time}</li>
            <li>📍 {event.location}</li>
          </ul>

          <span className="inline-block bg-red-600 poppins text-white text-xs px-3 py-1 rounded-full mb-[80px]">
            {category}
          </span>

          <p className="poppins text-sm text-gray-600 mb-6">
            Created by <span className="poppins text-[#A6C237] font-semibold">{creator}</span>
          </p>

          <button className="w-full bg-lime-600 hover:bg-lime-700 poppins text-white py-2 px-4 rounded shadow">
            RSVP
          </button>
        </div>
      </div>
    </div>
  );
}
