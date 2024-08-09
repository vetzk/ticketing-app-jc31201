// pages/events/index.tsx
"use client"
import { GetServerSideProps } from 'next';
import apiCall from '@/helper/axiosInstance';
import EventCard from '@/app/dashboard/eventControl/event/categotyFilter';
import { Event } from '@/app/dashboard/eventControl/event/types';
import { useState } from 'react';

type Props = {
  events: Event[];
  totalPages: number;
  currentPage: number;
  category: string;
};

const EventsPage: React.FC<Props> = ({ events, totalPages, currentPage, category }) => {
  const [selectedCategory, setSelectedCategory] = useState <string> (category);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    window.location.href = `/events?page=1&category=${newCategory}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Events</h1>
      <div className="mb-4">
        <label htmlFor="category" className="mr-2">Filter by Category:</label>
        <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="">All</option>
          <option value="Bar-Night">Bar-Night</option>
          <option value="Music">Music</option>
          <option value="Study-Tour">Study-Tour</option>
          <option value="Marriage">Marriage</option>
          <option value="Travel">Travel</option>
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} events={event} />
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        {currentPage > 1 && (
          <a href={`/events?page=${currentPage - 1}&category=${selectedCategory}`} className="text-blue-500">Previous</a>
        )}
        {currentPage < totalPages && (
          <a href={`/events?page=${currentPage + 1}&category=${selectedCategory}`} className="text-blue-500">Next</a>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const page = parseInt(context.query.page as string) || 1;
  const category = context.query.category as string || '';

  try {
    const { data } = await apiCall.get('/events', {
      params: {
        page,
        category,
      },
    });

    return {
      props: {
        events: data.events,
        totalPages: data.totalPages,
        currentPage: page,
        category,
      },
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    return {
      props: {
        events: [],
        totalPages: 0,
        currentPage: 1,
        category: '',
      },
    };
  }
};

export default EventsPage;
