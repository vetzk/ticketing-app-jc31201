import Image from 'next/image';
import styles from './page.module.css';
import Navbar from './control-layout/navbar';
import Hero from './control-layout/hero';
import Footer from './control-layout/footer';
import EventCard from './eventsHome/EventCard';
import Component from './eventBrowser/page';

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <EventCard />
      <Footer />
    </div>
  );
}
