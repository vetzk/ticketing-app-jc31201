"use client"  


import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { FaPlus, FaSun, FaMoon, FaUser } from 'react-icons/fa';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import apiCall from '@/helper/axiosInstance';
import EventForm from '@/app/dashboard/eventControl/eventForm/page';

type Event = {
  id: number | null;
  title: string;
  start: string;
  end: string;
  paymentMethod: string;
  paymentCost: number;
  category: string;
  description: string;
  image: string;
  views: number;
  visitorsThisMonth: number;
  visitorsLastMonth: number;
  visitorsThisWeek: number;
  visitorsLastWeek: number;
  seatCapacity: number;
};

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await apiCall.get('/events');
      setEvents(data);
    };
    fetchEvents();
  }, []);

  const analyticsData = useMemo(
    () => ({
      totalEvents: events.length,
      upcomingEvents: events.filter(
        (event) => new Date(event.start) > new Date(),
      ).length,
      pastEvents: events.filter((event) => new Date(event.end) < new Date())
        .length,
      totalRevenue: events.reduce(
        (total, event) => total + event.paymentCost,
        0,
      ),
      totalVisitors: events.reduce(
        (total, event) => total + event.visitorsThisMonth,
        0,
      ),
    }),
    [events],
  );

  const handleCreateEvent = useCallback(() => {
    setSelectedEvent({
      id: null,
      title: '',
      start: '',
      end: '',
      paymentMethod: 'Free',
      paymentCost: 0,
      category: 'Bar-Night',
      description: '',
      image: '',
      views: 0,
      visitorsThisMonth: 0,
      visitorsLastMonth: 0,
      visitorsThisWeek: 0,
      visitorsLastWeek: 0,
      seatCapacity: 100,
    });
    setShowEventForm(true);
  }, []);

  const handleEditEvent = useCallback((event: Event) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  }, []);

  const handleDeleteEvent = useCallback(
    async (id: number) => {
      await apiCall.delete(`/events/${id}`);
      setEvents(events.filter((event) => event.id !== id));
    },
    [events],
  );

  const handleSaveEvent = useCallback(
    async (event: Event) => {
      if (selectedEvent && selectedEvent.id !== null) {
        const updatedEvent = await apiCall.put(`/events/${selectedEvent.id}`, event);
        setEvents(
          events.map ((e) =>
            e.id === selectedEvent.id ? updatedEvent.data : e,
          ),
        );
      } else {
        const newEvent = await apiCall.post('/events', event);
        setEvents([...events, newEvent.data]);
      }
      setSelectedEvent(null);
      setShowEventForm(false);
    },
    [events, selectedEvent],
  );

  const handleCancelEvent = useCallback(() => {
    setSelectedEvent(null);
    setShowEventForm(false);
  }, []);

  const handleToggleDarkMode = useCallback(() => {
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode]);

  return (
    <div
      className={`flex h-screen w-full flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
    >
      <header
        className={`flex h-16 items-center justify-between border-b ${isDarkMode ? 'bg-gray-800' : 'bg-background'} px-6`}
      >
        <div className="flex items-center gap-4">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <span className="text-lg font-bold"> Admin Dashboard </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleCreateEvent}>
            <FaPlus className="h-4 w-4" />
            Create Event
          </Button>
          <Button variant="outline" onClick={handleToggleDarkMode}>
            {isDarkMode ? (
              <FaSun className="h-4 w-4" />
            ) : (
              <FaMoon className="h-4 w-4" />
            )}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <FaUser className="h-4 w-4" />
                User
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main
        className={`flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-muted/40'} p-6`}
      >
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Events</h1>
            <div className="flex items-center gap-2">
              {/* Additional Controls */}
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Total Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">
                  {analyticsData.totalEvents}
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">
                  {analyticsData.upcomingEvents}
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Past Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">
                  {analyticsData.pastEvents}
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">
                  Rp. {analyticsData.totalRevenue}
                </span>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Total Visitors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-4xl font-bold">
                  {analyticsData.totalVisitors}
                </span>
              </CardContent>
            </Card>
          </div>
          {showEventForm && (
            <EventForm
              event={selectedEvent}
              onSave={handleSaveEvent}
              onCancel={handleCancelEvent} isDarkMode={false}            />
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Title</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Seat Capacity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id ?? -1}>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{event.start}</TableCell>
                  <TableCell>{event.end}</TableCell>
                  <TableCell>
                    {event.paymentMethod === 'Free' ? 'Free' : event.paymentMethod}
                  </TableCell>
                  <TableCell>{event.category}</TableCell>
                  <TableCell>Rp. {event.paymentCost}</TableCell>
                  <TableCell>{event.seatCapacity}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditEvent(event)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id ?? -1)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
