// types.ts
export type Event = {
    id: number | null;
    title: string;
    start: string;
    end: string;
    paymentMethod: string;
    paymentCost: number;
    category: string;
    description: string;
    image: string;
    seatCapacity: number;
    views?: number; // Optional properties
    visitorsThisMonth?: number;
    visitorsLastMonth?: number;
    visitorsThisWeek?: number;
    visitorsLastWeek?: number;
  };
  