'use client';
import Image from 'next/image';
import styles from './page.module.css';
import withAuth from '@/hoc/authGuard';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import apiCall from '@/helper/apiCall';
import EventList from '@/components/EventList';
import { Button } from '@/components/ui/button';

function Home() {
  const listImages = [
    { src: '/coldplay.jpg', alt: 'Coldplay' },
    { src: '/theweeknd.png', alt: 'The Weeknd' },
    { src: '/baby-metal.webp', alt: 'Baby Metal' },
  ];
  const [images, setImages] = useState<File[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [events, setEvents] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const nextIndex = () => {
    setCurrentIndex((index) =>
      index === listImages.length - 1 ? 0 : index + 1,
    );
  };

  const previousIndex = () => {
    setCurrentIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  };
  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await apiCall.get('/api/event/events');
      return data;
    },
    onSuccess: (data) => {
      console.log(data.result);

      setEvents(data.result);
    },
    onError: (error) => {
      console.error('Error fetching events:', error);
    },
  });

  useEffect(() => {
    mutation.mutate();
  }, []);
  return (
    <main className="w-full h-auto p-10 flex-col flex gap-20  ">
      <div className="w-full min-h-screen relative">
        <Image
          src={listImages[currentIndex].src}
          alt={listImages[currentIndex].alt}
          layout="fill"
          objectFit="cover"
          className="rounded-xl"
        />
        <div className="w-full absolute top-20 text-center justify-center items-center">
          <p className="text-9xl text-white font-new-amsterdam">
            WORLD&apos;S BIGGEST
            <br /> EVENT TICKET WEBSITE
          </p>
        </div>
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
          <Button variant="ghost" onClick={previousIndex}>
            <MdNavigateBefore size={70} color="white" />
          </Button>
        </div>
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
          <Button variant="ghost" onClick={nextIndex}>
            <MdNavigateNext size={70} color="white" />
          </Button>
        </div>
        <div className="overflow-hidden w-full absolute bottom-10 bg-black bg-opacity-70 py-3">
          <div className="animate-marquee whitespace-nowrap text-white text-2xl font-new-amsterdam tracking-wider">
            Get your tickets now! Best prices available! Don&apos;t miss out on
            the world&apos;s biggest events!
          </div>
        </div>
      </div>
      <div className="w-full h-auto">
        <p className="text-7xl font-bold font-new-amsterdam">
          Favorite Artists
        </p>
      </div>
      <EventList />
      <div className="w-full h-auto">
        <p className="text-7xl font-bold font-new-amsterdam">Seat Plan</p>
      </div>
      <div className="w-full min-h-screen relative my-20">
        <Image
          src="/seat-plan2.png"
          alt="seat-plan"
          objectFit="cover"
          layout="fill"
        />
      </div>
    </main>
  );
}

export default Home;
