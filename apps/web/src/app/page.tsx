'use client';
import Image from 'next/image';
import styles from './page.module.css';
import withAuth from '@/hoc/authGuard';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import EventList from '@/components/EventList';
import apiCall from '@/helper/apiCall';

function Home() {
  const listImages = [
    { src: '/coldplay.jpg', alt: 'Coldplay' },
    { src: '/theweeknd.png', alt: 'The Weeknd' },
    { src: '/baby-metal.webp', alt: 'Baby Metal' },
  ];
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [events, setEvents] = useState<any[]>([]);

  const nextIndex = () => {
    setCurrentIndex((index) =>
      index === listImages.length - 1 ? 0 : index + 1,
    );
  };

  const previousIndex = () => {
    setCurrentIndex((index) =>
      index === 0 ? listImages.length - 1 : index - 1,
    );
  };

  return (
    <main className="w-full h-auto p-5 lg:p-10 flex-col flex gap-10 lg:gap-20">
      <div className="w-full min-h-[50vh] lg:min-h-screen relative">
        <Image
          src={listImages[currentIndex].src}
          alt={listImages[currentIndex].alt}
          layout="fill"
          objectFit="cover"
          className="rounded-xl"
        />
        <div className="w-full absolute top-20 text-center justify-center items-center px-4 lg:px-0">
          <p className="text-4xl lg:text-9xl text-white font-new-amsterdam">
            WORLD&apos;S BIGGEST
            <br /> EVENT TICKET WEBSITE
          </p>
        </div>
        <div className="absolute left-4 lg:left-0 top-1/2 transform -translate-y-1/2">
          <Button variant="ghost" onClick={previousIndex}>
            <MdNavigateBefore className="text-white text-3xl lg:text-5xl" />
          </Button>
        </div>
        <div className="absolute right-4 lg:right-0 top-1/2 transform -translate-y-1/2">
          <Button variant="ghost" onClick={nextIndex}>
            <MdNavigateNext className="text-white text-3xl lg:text-5xl" />
          </Button>
        </div>
        <div className="overflow-hidden w-full absolute bottom-10 bg-black bg-opacity-70 py-3 px-2 lg:px-0">
          <div className="animate-marquee whitespace-nowrap text-white text-xl lg:text-2xl font-new-amsterdam tracking-wider">
            Get your tickets now! Best prices available! Don&apos;t miss out on
            the world&apos;s biggest events!
          </div>
        </div>
      </div>
      <div className="w-full h-auto">
        <p className="text-4xl lg:text-7xl font-bold px-4 lg:px-0">
          Favorite Artists
        </p>
      </div>
      <EventList />
      <div className="w-full h-auto">
        <p className="text-4xl lg:text-7xl font-bold px-4 lg:px-0">Seat Plan</p>
      </div>
      <div className="w-full min-h-[50vh] lg:min-h-screen relative my-10 lg:my-20">
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

export default withAuth(Home);
