'use client';
import AdminSidebar from '@/components/AdminSidebar';
import * as React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import withRole from '@/hoc/roleGuard';
import { useMutation, useQuery } from '@tanstack/react-query';
import apiCall from '@/helper/apiCall';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';

type Seat = {
  totalSeats: number;
  availableSeats: number;
};

type Images = {
  id: number;
  path: string;
};
type Events = {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  images: Images[];
  ticketType: string;
  startTime: Date;
  endTIme: Date;
  seat: Seat[];
};
interface IEventListProps {}

const EventList: React.FunctionComponent<IEventListProps> = (props) => {
  const [myEvent, setMyEvent] = React.useState<Events[]>([]);
  const router = useRouter();
  const token = localStorage.getItem('token');

  const { data, error, isLoading } = useQuery({
    queryKey: ['fetchEvents'],
    queryFn: async () => {
      const { data } = await apiCall.get('/api/admin/user-event', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyEvent(data.result);
      console.log(myEvent);

      return data.result;
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiCall.patch(
        `/api/admin/inactive-event?id=${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return data;
    },
    onSuccess: (data) => {
      toast('Delete success');
    },
    onError: (error: any) => {
      toast('Error deleting your event');
    },
  });
  const HandleDelete = (id: string) => {
    deleteEvent.mutate(id);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 p-5 lg:ml-[30rem]">
        <div className="w-full h-auto justify-center gap-5 flex-col flex items-center">
          <div className="w-full">
            <p className="text-2xl lg:text-3xl">Your Event List</p>
          </div>
          {myEvent.map((e) => (
            <React.Fragment key={e.id}>
              <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-10">
                <div className="w-full lg:w-auto flex justify-center lg:block">
                  <Image
                    src={
                      e.images.length > 0
                        ? `http://localhost:8000${e.images[0].path}`
                        : '/blackpink.webp'
                    }
                    alt={'image'}
                    width={300}
                    height={300}
                    className="rounded-xl"
                  />
                </div>
                <div className="flex flex-col justify-center items-start gap-3 w-full lg:w-1/4">
                  <div>
                    <p className="text-xl lg:text-2xl font-bold">{e.title}</p>
                  </div>
                  <div>
                    <p className="text-lg lg:text-xl">
                      {new Date(e.startTime).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg lg:text-xl">
                      Available Seats:{' '}
                      {e.seat.map((s, i) => (
                        <span key={i}>{s.availableSeats}</span>
                      ))}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg lg:text-xl">Status: {e.ticketType}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-5 w-full lg:w-auto">
                  <Button
                    onClick={() => router.push(`/admin/list/${e.id}`)}
                    className="bg-blue-200 text-lg lg:text-2xl w-full lg:w-auto"
                  >
                    Edit Event
                  </Button>
                  <Button
                    onClick={() => HandleDelete(String(e.id))}
                    className="bg-red-400 text-lg lg:text-2xl w-full lg:w-auto"
                  >
                    Delete Event
                  </Button>
                  <Button
                    onClick={() => router.push(`/admin/attendee/${e.id}`)}
                    className="bg-purple-400 text-lg lg:text-2xl w-full lg:w-auto"
                  >
                    List Attendee
                  </Button>
                </div>
              </div>
              <div className="w-full bg-slate-400 h-0.5 my-5"></div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
export default withRole(EventList, 'ADMIN');
