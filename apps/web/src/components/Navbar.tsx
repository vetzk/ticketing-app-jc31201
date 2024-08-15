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
import { useContext, useEffect } from 'react';
import { UserContext } from '@/contexts/UserContext';
import { useMutation } from '@tanstack/react-query';
import apiCall from '@/helper/apiCall';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar } from './ui/avatar';

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, loading } = useContext(UserContext);
  console.log(user?.image);

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

  console.log(user?.points);

  return (
    <nav
      className={`w-full ${pathname === '/login' || pathname === '/register' ? 'bg-transparent' : 'bg-white'} flex justify-between sticky top-0  items-center p-5 z-20`}
    >
      <div className="">
        <Image
          src={'/logo-no-background.png'}
          alt={'image'}
          width={150}
          height={150}
        />
      </div>
      <div>
        <NavigationMenu>
          <NavigationMenuList
            className={`gap-5 ${pathname !== '/login' && pathname !== '/register' ? 'text-black' : 'text-white'}`}
          >
            <NavigationMenuItem>
              <Link href="/landing">
                <span className=" text-3xl font-bold">Home</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about">
                <span className=" text-3xl font-bold">Explore</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about">
                <span className=" text-3xl font-bold">About Us</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about">
                <span className=" text-3xl font-bold">Contact Us</span>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about">
                <span className=" text-3xl font-bold">Blog</span>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {user?.email ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer w-20 h-20">
              <Image
                src={
                  user.image
                    ? `http://localhost:8000${user.image}`
                    : '/pngegg.png'
                } // Replace with user's avatar URL
                alt="User Avatar"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-auto mr-10 p-5 bg-white">
            <DropdownMenuItem className="text-2xl">
              Your Points: {user.points ? user.points : 0}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-2xl cursor-pointer hover:bg-green-200"
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
              className="text-2xl cursor-pointer hover:bg-green-200"
              onClick={handleSubmit}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-5">
          {' '}
          <Button
            onClick={() => router.replace('/login')}
            className="bg-white text-xl"
          >
            Login
          </Button>
          <Button
            onClick={() => router.replace('/register')}
            className="bg-green-300 text-xl"
          >
            Register
          </Button>
        </div>
      )}
    </nav>
  );
};
