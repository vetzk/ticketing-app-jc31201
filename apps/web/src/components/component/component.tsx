import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui/pagination';
import { FC } from 'react';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  favorite: boolean;
}

const Component: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [locationFilter, setLocationFilter] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/events');
        setEvents(response.data);
      } catch (err) {
        setError('Failed to fetch events.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (favoriteOnly && !event.favorite) {
        return false;
      }
      if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (locationFilter && !event.location.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [events, searchTerm, favoriteOnly, locationFilter]);

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
        event.id === eventId ? { ...event, favorite: !event.favorite } : event
      )
    );
  };

  const handleLocationFilter = (location: string) => {
    setLocationFilter(location);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Upcoming Events</h2>
          <p className="text-muted-foreground">Explore our exciting lineup of events.</p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full md:w-[300px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={favoriteOnly} onCheckedChange={(checked) => setFavoriteOnly(checked)} />
            <span className="text-muted-foreground">Show favorites only</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4" />
                {locationFilter ? locationFilter : 'Filter by location'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              <DropdownMenuLabel>Filter by location</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleLocationFilter('')}>All locations</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLocationFilter('New York')}>New York</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLocationFilter('Seattle')}>Seattle</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLocationFilter('Chicago')}>Chicago</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLocationFilter('San Francisco')}>San Francisco</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLocationFilter('Los Angeles')}>Los Angeles</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLocationFilter('Sedona')}>Sedona</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLocationFilter('Portland')}>Portland</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLocationFilter('Flagstaff')}>Flagstaff</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLocationFilter('Denver')}>Denver</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isLoading ? (
        <p>Loading events...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {currentEvents.map((event) => (
              <Card key={event.id} className="relative group">
                <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                  <span className="sr-only">View event</span>
                </Link>
                <CardContent className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="text-muted-foreground">{event.date}</p>
                    <p className="text-muted-foreground">{event.location}</p>
                    <p className="text-sm mt-2">{event.description}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-9 h-9 ml-auto mt-4 hidden group-hover:flex"
                    onClick={() => handleFavoriteToggle(event.id)}
                  >
                    <HeartIcon className="w-6 h-6" />
                    <span className="sr-only">Toggle favorite</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink href="#" isActive={page === currentPage} onClick={() => handlePageChange(page)}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
};

const HeartIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3a5.5 5.5 0 0 0-5.5 5.5c0 2.29 1.51 4.04 3 5.5a11.38 11.38 0 0 0 1.5 1.34 11.38 11.38 0 0 0 1.5-1.34z" />
  </svg>
);

const MapPinIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 19l-6 6V12a6 6 0 0 1 6-6 6 6 0 0 1 6 6v13l-6-6z" />
  </svg>
);

const SearchIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default Component;
