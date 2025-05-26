import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EventCategory() {
  const [events, setEvents] = useState([]);
  const { categoryId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, usersRes] = await Promise.all([
          axios.get('https://6834d971cd78db2058bf87f2.mockapi.io/eventify/event'),
          axios.get('https://6834806d464b499636031d7e.mockapi.io/eventify/users'),
        ]);

        const allEvents = eventsRes.data;
        const users = usersRes.data;

        const filteredEvents = allEvents.filter(event => event['event-categoryId'] === categoryId);

        const enrichedEvents = filteredEvents.map(event => {
          const creator = users.find(u => u.user_id === event.creator_id);
          return {
            ...event,
            creator_username: creator ? creator.username : 'Unknown',
          };
        });

        setEvents(enrichedEvents);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [categoryId]);

  return (
    <div className="bg-green-50 min-h-screen font-sans">
      <section className="py-10 px-[150px] text-center">
        <div className="my-[100px] flex flex-wrap justify-center gap-[90px]">
          {events.map((event, index) => (
            <div
              key={index}
              onClick={() => navigate(`/event-details/${event.event_id}`)}
              className="bg-white shadow-md rounded-lg overflow-hidden w-80 cursor-pointer"
            >
              <img src={event.event_img} alt={event.event_name} className="w-full h-auto object-cover rounded-t-lg" />
              <div className="p-5 text-left">
                <h3 className="font-semibold text-[#3D5300] poppins text-lg">Event Name: {event.event_name}</h3>
                <p className="pb-2 text-sm text-gray-500 mb-2">📅 {event.event_date}</p>
                <p className="pb-7 poppins text-sm font-light mb-2">{event.event_description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm poppins text-gray-600 mb-2">
                    Created by <br /><span className="text-[#A6C237] poppins font-bold">{event.creator_username}</span>
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/event/${event.event_id}`);
                    }}
                    className="mt-2 px-4 py-1 poppins text-[14px] font-semibold border-2 border-[#3D5300] text-[#3D5300] rounded-[7px] hover:bg-[#3D5300] hover:text-white transition"
                  >
                    SEE EVENT
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
