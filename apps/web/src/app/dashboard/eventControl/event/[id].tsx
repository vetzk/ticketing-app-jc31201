// pages/events/[id].tsx
"use client"
import { GetServerSideProps } from 'next';
import apiCall from '@/helper/axiosInstance';
import { Event } from '@/app/dashboard/eventControl/event/types';

type Props = {
  event: Event | null;
};

const EventDetailCard: React.FC<Props> = ({ event }) => {
  if (!event) return <div>No event data available</div>;

  const handlePurchase = () => {
    // Logic for handling the purchase
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
      <img src={event.image} alt={event.title} className="w-full h-48 object-cover mb-4 rounded" />
      <p className="mb-2"><strong>Start:</strong> {event.start}</p>
      <p className="mb-2"><strong>End:</strong> {event.end}</p>
      <p className="mb-2"><strong>Category:</strong> {event.category}</p>
      <p className="mb-2"><strong>Description:</strong> {event.description}</p>
      <p className="mb-2"><strong>Seat Capacity:</strong> {event.seatCapacity}</p>
      <p className="mb-2"><strong>Payment Method:</strong> {event.paymentMethod}</p>
      <p className="mb-2"><strong>Payment Cost:</strong> Rp. {event.paymentCost}</p>

      {event.paymentMethod !== 'Free' && (
        <button onClick={handlePurchase} className="bg-blue-500 text-white p-2 rounded">
          Purchase
        </button>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { id } = context.query;
  const event = id && typeof id === 'string' ? await apiCall.get(`/events/${id}`) : null;

  return {
    props: {
      event: event?.data || null,
    },
  };
};

export default EventDetailCard;
