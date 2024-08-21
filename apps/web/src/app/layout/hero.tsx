import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import React, { useState } from 'react';
import Image from 'next/image';

const Hero: React.FC = () => {
  return (
    <div>
      <div className="relative">
        <Image
          src="https://i0.wp.com/hariannusantara.com/wp-content/uploads/2019/06/gambar-animasi-pemandangan-gunung3-1.gif"
          alt="Hero"
          layout="fill"
          objectFit="cover"
          className="w-full h-screen"
        />
        <div className=" bg-black bg-opacity-50 flex flex-col justify-center items-center min-h-screen shadow-md">
          <div className="backdrop-blur-md flex flex-col items-center p-14 rounded-xl border-solid border-[1px] border-white shadow-xl bg-[#ffffff34]">
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-12 text-center font-sans">
              Discover Events #
            </h1>
            <div className="flex space-x-4">
              <button className="bg-blue-800  text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                Find your next Events
              </button> {' '}
            </div> {' '}
          </div> 
        </div>
      </div>
    </div>
  );
};

export default Hero;
