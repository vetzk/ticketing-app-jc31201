

// "use client"
// import { useEffect, useState } from 'react';
// import { Event } from '@/app/dashboard/eventControl/event/types';

// type Props = {
//   event: Event;
// };

// const EventCard: React.FC <Props> = ({ event }) => {
//   const [additionalData, setAdditionalData] = useState <any> (null);
//   const [loading, setLoading] = useState <boolean> (true);
//   const [error, setError] = useState <string | null> (null);

//   useEffect(() => {
//     console.log('Event ID:', event.id);  // Log event ID

//     if (!event.id) {
//       setError('Invalid event ID');
//       setLoading(false);
//       return;
//     }

//     const fetchAdditionalData = async () => {
//       try {
//         const response = await fetch(`http://localhost:8000/events/${event.id}/`);
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         setAdditionalData(data);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching additional data:', );
//         setError('Failed to fetch additional data');
//         setLoading(false);
//       }
//     };

//     fetchAdditionalData();
//   }, [event.id]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="bg-white p-4 rounded shadow-md">
//       <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded mb-4" />
//       <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
//       <p className="text-gray-600 mb-2">Start: {event.start}</p>
//       <p className="text-gray-600 mb-2">End: {event.end}</p>
//       {additionalData && <p className="text-gray-600 mb-2">Additional Info: {additionalData.info}</p>}
//       <a href={`/events/${event.id}`} className="text-blue-500">View Details</a>
//     </div>
//   );
// };

// export default EventCard ; 
// components/EventCard.tsx  


"use client"
import { useEffect, useState } from 'react';
import { Event } from '@/app/dashboard/eventControl/event/types';

type Props = {
  event: Event;
};

const EventCard: React.FC<Props> = ({ event }) => {
  const [additionalData, setAdditionalData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Event ID:', event.id);  // Log event ID

    if (!event.id) {
      setError('Invalid event ID');
      setLoading(false);
      return;
    }

    const fetchAdditionalData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/events/${event.id}/`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAdditionalData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching additional data:', err.message || err);
        setError('Failed to fetch additional data');
        setLoading(false);
      }
    };

    fetchAdditionalData();
  }, [event.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return ( 
    
    <div className="bg-white p-4 rounded shadow-md">
      <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded mb-4" />
      <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
      <p className="text-gray-600 mb-2">Start: {event.start}</p>
      <p className="text-gray-600 mb-2">End: {event.end}</p>
      {additionalData && <p className="text-gray-600 mb-2">Additional Info: {additionalData.info}</p>}
      <a href={`/events/${event.id}`} className="text-blue-500">View Details</a>
    </div> 
  );
};

export default EventCard;
