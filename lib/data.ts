export type Driver = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  trips: number;
  yearsOnBidRide: number;
  vehicle: string;
  vehicleColor: string;
  vehicleImage: string;
  etaMinutes: number;
  distanceKm: number;
  fare: number;
  verified: boolean;
};

export const drivers: Driver[] = [
  {
    id: "david",
    name: "David",
    avatar: "/images/driver-david.png",
    rating: 4.8,
    trips: 1238,
    yearsOnBidRide: 2,
    vehicle: "Toyota Corolla (2019)",
    vehicleColor: "Silver",
    vehicleImage: "/images/toyota-corolla.png",
    etaMinutes: 3,
    distanceKm: 1.2,
    fare: 1240,
    verified: true,
  },
  {
    id: "ada",
    name: "Ada",
    avatar: "/images/driver-ada.png",
    rating: 4.9,
    trips: 950,
    yearsOnBidRide: 1,
    vehicle: "Toyota Camry (2020)",
    vehicleColor: "Black",
    vehicleImage: "/images/toyota-camry.png",
    etaMinutes: 1,
    distanceKm: 0.6,
    fare: 1320,
    verified: true,
  },
  {
    id: "michael",
    name: "Michael",
    avatar: "/images/driver-michael.png",
    rating: 4.7,
    trips: 743,
    yearsOnBidRide: 3,
    vehicle: "Honda Accord (2018)",
    vehicleColor: "Grey",
    vehicleImage: "/images/honda-accord.png",
    etaMinutes: 2,
    distanceKm: 1.0,
    fare: 1390,
    verified: true,
  },
  {
    id: "tunde",
    name: "Tunde",
    avatar: "/images/driver-tunde.png",
    rating: 4.6,
    trips: 512,
    yearsOnBidRide: 2,
    vehicle: "Toyota Corolla",
    vehicleColor: "White",
    vehicleImage: "/images/toyota-corolla.png",
    etaMinutes: 4,
    distanceKm: 1.8,
    fare: 1450,
    verified: true,
  },
];

// Mock wallet balance shown in the TopBar — not tied to any user's real identity.
// This becomes real once a Wallet backend exists.
export const mockWallet = {
  balance: 12400,
};

export const trip = {
  pickup: "15 Admiralty Way, Lekki Phase 1",
  destination: "Murtala Muhammed International Airport",
  distanceKm: 14.6,
  durationMin: 28,
  fareRangeLow: 1400,
  fareRangeHigh: 1900,
};

export const recentPlaces = [
  { id: "home", label: "Home", address: "15 Admiralty Way, Lekki Phase 1", icon: "home" as const },
  { id: "office", label: "Office", address: "27B Bishop Aboyade Cole St, VI", icon: "briefcase" as const },
  { id: "airport", label: "Airport", address: "Murtala Muhammed International Airport", icon: "plane" as const },
];
