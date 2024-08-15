'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import debounce from 'lodash.debounce';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query) {
        setLoading(true); // Show loading indicator
        await router.push(`/eventBrowser?searchTerm=${encodeURIComponent(query)}`);
        setLoading(false); // Hide loading indicator
      }
    }, 300),
    [router]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    debouncedSearch(event.target.value);
  };

  const handleSearchSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true); // Show loading indicator
    await debouncedSearch(searchTerm);
    setLoading(false); // Hide loading indicator
  };

  return (
    <div>
      <div className="bg-white">
        <nav className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-orange-600 font-serif">Fouthly.io</a>
          </div>
          <div className="md:hidden flex items-center">
            <button id="menu-toggle" className="text-gray-700 hover:text-blue-600 focus:outline-none" onClick={handleMenuToggle}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-10 text-sm">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                type="text"
                placeholder="Search events... 🔍"
                value={searchTerm}
                onChange={handleSearchChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-gray-100 text-gray-800 transition ease-in-out duration-300"
              />
              
                          </form>
            <NavigationMenu className="px-0 mx-0 p-0 m-0">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-gray-800 p-0"> Help </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <NavigationMenuLink> Report Product </NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <a href="/dashboard/admin" className="text-gray-700 hover:text-blue-600">Create Event</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Setting</a>
            <a href="#" className="text-gray-700 hover:text-blue-600" onClick={() => router.push('/login')}>Log In</a>
            <a href="#" className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700" onClick={() => router.push('/register')}>Sign Up</a>
          </div>
        </nav>
        <div id="mobile-menu" className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden`}>
          <div className="flex flex-col space-y-2 p-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              
                          </form>
            <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Events</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Create Event</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Resources</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Help Center</a>
          </div>
          <div>
            <span className="text-gray-700 hover:text-blue-600 cursor-pointer" onClick={() => router.push('/login')}> Log In </span>
            <span className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer" onClick={() => router.push('/register')}> Sign Up </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
