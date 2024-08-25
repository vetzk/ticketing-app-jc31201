'use client';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category, Location, Images } from '@/contexts/type';
import apiCall from '@/helper/apiCall';
import withAuth from '@/hoc/authGuard';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';

interface IExploreProps {}

type Event = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: Category;
  location: Location;
  startDate: string;
  endDate: string;
  images: Images[];
};

const Explore: React.FunctionComponent<IExploreProps> = (props) => {
  const [allEvents, setAllEvents] = React.useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] =
    React.useState<string>(searchQuery);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [selectedLocation, setSelectedLocation] = React.useState<string>('');
  const router = useRouter();

  const eventsPerPage = 8;

  const { data, isError, isLoading } = useQuery({
    queryKey: ['all-data'],
    queryFn: async () => {
      const { data } = await apiCall.get('/api/admin/all-events');
      setAllEvents(data.result);
      console.log(data.result);

      return data.result;
    },
  });

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedLocation, debouncedSearchQuery]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [loading]);

  if (loading) {
    return <Loading duration={2500} />;
  }

  if (isError) {
    return <p>Cannot get your data</p>;
  }

  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(debouncedSearchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === '' ||
      event.category.categoryName === selectedCategory;
    const matchesLocation =
      selectedLocation === '' ||
      event.location.locationName === selectedLocation;

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * eventsPerPage,
    currentPage * eventsPerPage,
  );

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  return (
    <div className="p-4 mb-16">
      <div className="mb-4">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Events..."
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 p-4 border-b lg:border-r lg:border-b-0 border-gray-200 mb-4 lg:mb-0">
          <p className="font-bold text-xl mb-4">Filter Options</p>

          <div className="mb-4">
            <p className="font-semibold">Category</p>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All Categories</option>
              <option value="Music">Music</option>
              <option value="Technology">Technology</option>
              <option value="Art">Art</option>
              <option value="Food">Food</option>
              <option value="Fitness">Fitness</option>
              <option value="Film">Film</option>
              <option value="Literature">Literature</option>
              <option value="Photography">Photography</option>
              <option value="Business">Business</option>
              <option value="Gaming">Gaming</option>
            </select>
          </div>

          <div className="mb-4">
            <p className="font-semibold">Location</p>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">All Locations</option>
              <option value="Los Angeles, CA">Los Angeles, CA</option>
              <option value="San Francisco, CA">San Francisco, CA</option>
              <option value="New York, NY">New York, NY</option>
              <option value="Austin, TX">Austin, TX</option>
              <option value="Miami, FL">Miami, FL</option>
              <option value="Chicago, IL">Chicago, IL</option>
              <option value="Seattle, WA">Seattle, WA</option>
              <option value="Las Vegas, NV">Las Vegas, NV</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4 p-4">
          {paginatedEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {paginatedEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => router.push(`/event/${event.id}`)}
                  className="border rounded-lg overflow-hidden shadow-sm cursor-pointer"
                >
                  <Image
                    src={`${
                      event.images.length > 0
                        ? `http://localhost:8000${event.images[0].path}`
                        : '/blackpink.webp'
                    }`}
                    alt={event.title}
                    width={1000}
                    height={1000}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-lg font-semibold">{event.title}</p>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No Events found</p>
          )}

          <div className="mt-4 flex justify-between items-center">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded"
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((next) => Math.min(next + 1, totalPages))
              }
              className="px-4 py-2 border rounded"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Explore);
