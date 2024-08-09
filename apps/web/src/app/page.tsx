import Image from 'next/image';
import styles from './page.module.css';
import { User } from 'lucide-react';
import Navbar from '@/app/control-layout/navbar';
import Hero from '@/app/control-layout/hero';
import Footer from '@/app/control-layout/footer';
import EventDetail from './control-layout/test/[id]/page';
import EventDetailPage from './dashboard/eventControl/eventDetail';
import EventCard from './dashboard/eventControl/eventForm/eventCard';
import EventsPageFilter from './dashboard/eventControl/event/categotyFilter';
import EventDetailCard from './dashboard/eventControl/event/[id]';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      {/* content event Filter & Detail */}
            <EventsPageFilter events={[]} totalPages={0} currentPage={0} category={''} /> 
            <EventDetailCard event={null} />     
            <EventCard event={{
        id: null,
        title: '',
        start: '',
        end: '',
        paymentMethod: '',
        paymentCost: 0,
        category: '',
        description: '',
        image: '',
        seatCapacity: 0,
        views: undefined,
        visitorsThisMonth: undefined,
        visitorsLastMonth: undefined,
        visitorsThisWeek: undefined,
        visitorsLastWeek: undefined
      }} />    
      <Footer /> </main> 
  );

}