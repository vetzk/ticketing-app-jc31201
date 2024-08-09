// components/EventCard.tsx
"use client"
import Link from 'next/link';
import { Event } from '@/app/dashboard/eventControl/event/types';


type EventCardProps = {
  event: Event;
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <Link href={`/events/${event.id}`}>
      <div className="p-4 border rounded shadow-lg hover:shadow-xl transition-shadow">
        <img src={event.image} alt={event.title} className="w-full h-32 object-cover mb-4 rounded" />
        <h2 className="text-xl font-bold mb-2">{event.title}</h2>
        <p className="text-gray-600">{event.category}</p>
      </div>
    </Link>
  );
};

export default EventCard;
