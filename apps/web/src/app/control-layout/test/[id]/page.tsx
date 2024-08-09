// src/pages/events/[id].tsx
"use client"
// src/app/control-layout/test/[id]/page.tsx (for the new App Router)
// src/app/events/[id]/page.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

interface Event {
  id: number;
  title: string;
  description: string;
  paymentCost?: number;
}

const EventDetail: React.FC = () => {
  const { id } = useParams(); // Extract route parameter
  const [event, setEvent] = useState<Event | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const response = await axios.get(`/api/events/${id}`);
          setEvent(response.data);
        } catch (error) {
          console.error('Error fetching event:', error);
        }
      };

      fetchEvent();
    }
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handlePurchase = async () => {
    if (!event) return;
    try {
      await axios.post('/api/payments/create', {
        eventId: event.id,
        amount: event.paymentCost ? event.paymentCost * quantity : 0,
        method: 'credit_card', // or based on user choice
        status: 'pending',
      });
      alert('Purchase successful');
      // Redirect or update state as needed
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment');
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p className="text-lg">{event.description}</p>
      <p className="text-xl font-semibold">
        {event.paymentCost ? `Price: IDR ${event.paymentCost}` : 'Free Event'}
      </p>
      {event.paymentCost && (
        <div className="mt-4">
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            className="px-4 py-2 border rounded-lg"
          />  
          <button
            onClick={handlePurchase}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ml-4"
          >
            Purchase Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetail;
