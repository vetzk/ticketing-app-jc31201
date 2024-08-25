'use client';

import React, { useState, useEffect, useMemo, ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pagination, PaginationPrevious, PaginationItem, PaginationNext } from '@/components/ui/pagination';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '../layout/navbar';
import Footer from '../layout/footer';

interface Event {
  start: ReactNode;
  title: ReactNode;
  end: ReactNode;
  id: number;
    date: string;
  location: string | null;
  description: string;
  favorite: boolean;
  category: string;
  image: string;
  price: number | null;
  voucherCode: number | null;
  seatsAvailable: number;
}

const Component: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('searchTerm') || '');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [inputVoucherCode, setInputVoucherCode] = useState<string>('');
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/events', {
          params: { searchTerm },
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, [searchTerm]);

  useEffect(() => {
    const newSearchTerm = searchParams.get('searchTerm') || '';
    if (searchTerm !== newSearchTerm) {
      setSearchTerm(newSearchTerm);
    }
  }, [searchParams, searchTerm]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (locationFilter && (event.location === null || !event.location.toLowerCase().includes(locationFilter.toLowerCase()))) {
        return false;
      }
      if (categoryFilter && event.category !== categoryFilter) {
        return false;
      }
      return true;
    });
  }, [events, searchTerm, locationFilter, categoryFilter]);

  const eventsPerPage = 7;
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleFavoriteToggle = (eventId: number) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, favorite: !event.favorite } : event,
      ),
    );
  };

  const handleLocationFilter = (location: string) => {
    setLocationFilter(location);
  };

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
  };

  const handleShowDetails = (event: Event) => {
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 pt-12 md:py-16 flex-grow h-[960px]">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Events</h2>
            <p className="text-muted-foreground text-gray-600">Explore our exciting lineup of events.</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button> Filter by Location </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Location</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleLocationFilter('')}>All Locations</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLocationFilter('New York')}>New York</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLocationFilter('Los Angeles')}>Los Angeles</DropdownMenuItem>
                {/* Add more locations as needed */}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>Filter by Category</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleCategoryFilter('')}> All Categories </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCategoryFilter('Music')}> Music </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCategoryFilter('Sports')}> Sports </DropdownMenuItem>
                { /* Add more categories as needed */ }
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentEvents.map((event) => (
            <Card key={event.id} className="w-full bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent>
                <img src={event.image} alt={event.title} className="w-full h-32 object-cover rounded-lg mb-4" />
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-600"> {event.start} </p>
                <p className="text-sm text-gray-600"> {event.location} </p>
                <p className="text-sm text-gray-600"> {event.category} </p>
                <p className="text-sm text-gray-600"> {event.end} </p>
                <p className="text-sm text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-600">Price: ${event.price ?? 'Free'}</p>
                <p className="text-sm text-gray-600">Seats Available: {event.seatsAvailable}</p>
                <Button className="mt-2" onClick={() => handleShowDetails(event)}> Show Details </Button>
              </CardContent>
            </Card>
          ))}
        </div>
</div>
        <div className="flex justify-center my-8">
          <Pagination className="inline-flex items-center space-x-1 list-none">
            <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)}> Previous </PaginationPrevious>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {index + 1}
              </PaginationItem>
            ))}
            <PaginationNext onClick={() => handlePageChange(currentPage + 1)}> Next </PaginationNext>
          </Pagination>
        

        {selectedEvent && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-4xl relative">
              <button className="absolute top-2 right-2 text-gray-600 text-2xl" onClick={() => setSelectedEvent(null)}>×</button>
              <img src={selectedEvent.image} alt = { selectedEvent.title } className="w-full h-64 object-cover rounded-lg mb-4" />
              <h3 className="text-2xl font-bold mb-2">{selectedEvent.title}</h3>
              <p className="text-lg mb-4">{selectedEvent.description}</p>
              <p className="text-lg mb-2">Price: ${discountApplied ? (selectedEvent.price ?? 0) * 0.9 : selectedEvent.price ?? 'Free'}</p>
              <p className="text-lg mb-4">Seats Available: {selectedEvent.seatsAvailable}</p>
              {selectedEvent.voucherCode !== null && (
                <div className="mb-4">
                  <p className="font-semibold"> Enter Voucher Code: </p>
                  <Input
                    value={inputVoucherCode}
                    onChange={(e) => setInputVoucherCode(e.target.value)}
                    placeholder="Enter voucher code"
                    className="mb-2"
                  />
                  <Button onClick={handleApplyVoucher} className="w-full bg-blue-500 text-white">Apply Code</Button>
                </div>
              )}
              <Button className="w-full bg-green-500 text-white">Buy</Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Component;
