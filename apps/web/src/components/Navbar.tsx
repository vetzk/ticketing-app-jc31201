'use client';
import Image from 'next/image';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from './ui/navigation-menu';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from './ui/button';
import { useContext, useEffect, useState } from 'react';
import { MdOutlineArticle } from 'react-icons/md';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { UserContext } from '@/contexts/UserContext';
import { useMutation } from '@tanstack/react-query';
import { FiHome, FiSearch, FiBell, FiMessageSquare } from 'react-icons/fi';
import apiCall from '@/helper/apiCall';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar } from './ui/avatar';
import { Exo_2 } from '@next/font/google';
import { title } from 'process';
import React from 'react';

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Choose the font weights you need
});

const menu = [
  {
    title: 'Home',
    path: '/',
    icon: <FiHome />,
  },
  {
    title: 'Explore',
    path: '/explore',
    icon: <FiSearch />,
  },
  {
    title: 'About Us',
    path: '#',
    icon: <IoMdInformationCircleOutline />,
  },
  {
    title: 'Contact Us',
    path: '#',
    icon: <FiMessageSquare />,
  },
  {
    title: 'Blog',
    path: '#',
    icon: <MdOutlineArticle />,
  },
];

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useContext(UserContext);
  const [isToggleOpen, setIsToggleOpen] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await apiCall.post('/api/auth/logout');
      return data;
    },
    onSuccess: (data) => {
      localStorage.removeItem('token');
      setUser(null);
      router.replace('/login');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = () => {
    mutation.mutate();
  };

  const toggleMenu = () => {
    setIsToggleOpen(!isToggleOpen);
  };

  return (
    <>
      <nav
        className={`w-full ${exo2.className} bg-white flex justify-between sticky top-0 items-center p-5 z-20`}
      >
        <div>
          <Image
            src="/logo-no-background.png"
            alt="image"
            width={120}
            height={120}
            className="w-32 h-auto"
          />
        </div>
        <div className="hidden lg:flex">
          {user?.role === 'USER' || !user ? (
            <NavigationMenu>
              <NavigationMenuList className="gap-5 text-black">
                {menu.map((e, i) => {
                  const isActive = pathname === e.path;
                  return (
                    <React.Fragment key={i}>
                      <NavigationMenuItem>
                        <Link href={e.path}>
                          <span
                            className={
                              isActive
                                ? 'text-green-500 text-lg md:text-2xl lg:text-3xl font-bold'
                                : 'text-black text-lg md:text-2xl lg:text-3xl font-bold'
                            }
                          >
                            {e.title}
                          </span>
                        </Link>
                      </NavigationMenuItem>
                    </React.Fragment>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          ) : (
            <p className="text-2xl md:text-4xl">Welcome to your dashboard</p>
          )}
        </div>

        {user?.email ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer w-12 h-12 md:w-20 md:h-20">
                <Image
                  src={
                    user.image
                      ? `http://localhost:8000${user.image}`
                      : '/pngegg.png'
                  }
                  alt="User Avatar"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto p-5 bg-white">
              <DropdownMenuItem className="text-lg md:text-2xl">
                {user.role === 'USER' &&
                  `Your Points: ${user.points ? user.points : 0}`}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-lg md:text-2xl cursor-pointer hover:bg-green-200"
                onClick={() => {
                  user.role === 'ADMIN'
                    ? router.push('/admin/profile')
                    : router.push('/user/profile');
                }}
              >
                Profile
              </DropdownMenuItem>
              <div className="bg-slate-200 w-full h-0.5"></div>
              <DropdownMenuItem
                className="text-lg md:text-2xl cursor-pointer hover:bg-green-200"
                onClick={handleSubmit}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex lg:flex gap-3">
            <Button
              onClick={() => router.replace('/login')}
              className="bg-slate-400 text-lg"
            >
              Login
            </Button>
            <Button
              onClick={() => router.replace('/register')}
              className="bg-green-300 text-lg"
            >
              Register
            </Button>
          </div>
        )}
      </nav>
      <div
        className={`fixed bottom-0 shadow-xl left-0 w-full bg-white border-t-2 border-gray-200 z-30 lg:hidden ${exo2.className}`}
      >
        <NavigationMenu>
          <NavigationMenuList className="flex gap-[1.4rem] justify-between items-center p-5">
            {menu.map((e, i) => {
              const isActive = pathname === e.path;
              return (
                <React.Fragment key={i}>
                  <NavigationMenuItem className="text-center">
                    <Link
                      className={`flex flex-col items-center gap-1 ${isActive ? 'text-green-500' : 'text-black'}`}
                      href={e.path}
                    >
                      {e.icon}
                      <span className="text-sm">{e.title}</span>
                    </Link>
                  </NavigationMenuItem>
                </React.Fragment>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
};
