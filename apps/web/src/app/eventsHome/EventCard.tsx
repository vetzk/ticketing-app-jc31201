'use client';

import { ReactNode, useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Carousel } from '@/components/ui/carousel'; // Adjust the import path if needed
import { Input } from '@/components/ui/input';
  
type Event = {
  seatsAvailable: ReactNode;
  id: number;
  title: string;
  description: string;
  descriptionDetail?: string; // Detailed description
  image: string;
  start: string;
  end: string;
  paymentMethod: string;
  paymentCost: number;
  category: string;
  seatCapacity: number;
  voucherCode?: string; // Voucher code field
  additionalData?: any;
};

const EventListCategory: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [inputVoucherCode, setInputVoucherCode] = useState<string>('');
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/events');
        setEvents(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching events:', err.message || err);
        setError('Failed to fetch events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const filterByCategory = (category: string) => {
    if (category === 'All') {
      return events;
    }
    return events.filter(
      (event) => event.category.toLowerCase() === category.toLowerCase(),
    );
  };

  const categories = ['All', 'Bar-Night', 'Party', 'Marriage', 'Music'];

  const handleShowDetail = (event: Event) => {
    setSelectedEvent(event);
    setDiscountApplied(false);
    setInputVoucherCode('');
  };

  const handleApplyVoucher = () => {
    if (selectedEvent) {
      const eventVoucherCode = selectedEvent.voucherCode?.toString() || '';
      if (inputVoucherCode === eventVoucherCode) {
        setDiscountApplied(true);
      } else {
        alert('Invalid voucher code');
      }
    }
  };

  return (
    <div className="p-6 lg:p-10 xl:px-28 px-12">
      {/* Category Buttons */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'solid' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={`transition-all duration-300 ease-in-out ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'} shadow-md transform ${selectedCategory === category ? 'scale-105' : 'scale-100'}`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Carousel for Event List */}
      <Carousel className="flex overflow-x-auto space-x-4 p-4 lg:p-14">
        {filterByCategory(selectedCategory).map((event) => (
          <div
            key={event.id}
            className="bg-gray-200 p-4 rounded-lg shadow-md flex-shrink-0 w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-sm cursor-pointer"
            onClick={() => handleShowDetail(event)}
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-lg font-semibold mb-2 truncate">
              {event.title}
            </h2>
            <p className="text-gray-600 mb-2 text-sm truncate">
              {event.description}
            </p>
            <p className="text-gray-600 mb-2 text-sm">Start: {event.start}</p>
            <p className="text-gray-600 mb-2 text-sm">End: {event.end}</p>
            <p className="text-gray-600 mb-2 text-sm">
              {event.paymentMethod === 'Free'
                ? 'Free'
                : `Rp. ${event.paymentCost}`}
            </p>
            <p className="text-gray-600 mb-2 text-sm">
              Category: {event.category}
            </p>
            <p className="text-gray-600 mb-2 text-sm">
              Seat Capacity: {event.seatCapacity}
            </p>
            {event.additionalData && (
              <p className="text-gray-600 mb-2 text-sm truncate">
                Additional Info: {event.additionalData.info}
              </p>
            )}
            <div className="text-right mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowDetail(event);
                }}
              >
                Show Detail
              </Button>
            </div>
          </div>
        ))}
      </Carousel>

      {selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-4xl relative">
            <button
              className="absolute top-2 right-2 text-gray-600 text-2xl"
              onClick={() => setSelectedEvent(null)}
            >
              ×
            </button>
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-bold mb-2">{selectedEvent.title}</h3>
            <p className="text-lg mb-4">{selectedEvent.description}</p>
            <p className="text-lg mb-2">
              Price: $
              {discountApplied
                ? (selectedEvent.price ?? 0) * 0.9
                : (selectedEvent.price ?? 'Free')}
            </p>
            <p className="text-lg mb-4">
              Seats Available: {selectedEvent.seatsAvailable}
            </p>
            {selectedEvent.voucherCode !== null && (
              <div className="mb-4">
                <p className="font-semibold"> Enter Voucher Code: </p>
                <Input
                  value={inputVoucherCode}
                  onChange={(e) => setInputVoucherCode(e.target.value)}
                  placeholder="Enter voucher code"
                  className="mb-2"
                />
                <Button
                  onClick={handleApplyVoucher}
                  className="w-full bg-blue-500 text-white"
                >
                  Apply Code
                </Button>
              </div>
            )}
            <Button className="w-full bg-green-500 text-white">Buy</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventListCategory;
