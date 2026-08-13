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
    avatar: "",
    rating: 4.8,
    trips: 1238,
    yearsOnBidRide: 2,
    vehicle: "Toyota Corolla (2019)",
    vehicleColor: "Silver",
    vehicleImage: "",
    etaMinutes: 3,
    distanceKm: 1.2,
    fare: 1240,
    verified: true,
  },
  {
    id: "ada",
    name: "Ada",
    avatar: "",
    rating: 4.9,
    trips: 950,
    yearsOnBidRide: 1,
    vehicle: "Toyota Camry (2020)",
    vehicleColor: "Black",
    vehicleImage: "",
    etaMinutes: 1,
    distanceKm: 0.6,
    fare: 1320,
    verified: true,
  },
  {
    id: "michael",
    name: "Michael",
    avatar: "",
    rating: 4.7,
    trips: 743,
    yearsOnBidRide: 3,
    vehicle: "Honda Accord (2018)",
    vehicleColor: "Grey",
    vehicleImage: "",
    etaMinutes: 2,
    distanceKm: 1.0,
    fare: 1390,
    verified: true,
  },
  {
    id: "tunde",
    name: "Tunde",
    avatar: "",
    rating: 4.6,
    trips: 512,
    yearsOnBidRide: 2,
    vehicle: "Toyota Corolla",
    vehicleColor: "White",
    vehicleImage: "",
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
  pickup: "FUPRE Main Gate",
  destination: "Student Hostels",
  distanceKm: 2.1,
  durationMin: 9,
  fareRangeLow: 650,
  fareRangeHigh: 950,
};

export const recentPlaces = [
  { id: "main-gate", label: "Main Gate", address: "FUPRE Main Gate", icon: "home" as const },
  { id: "hostels", label: "Student Hostels", address: "FUPRE Student Hostels", icon: "briefcase" as const },
  { id: "engineering", label: "Engineering", address: "College of Engineering and Technology", icon: "plane" as const },
  { id: "library", label: "Central Library", address: "FUPRE Central Library", icon: "home" as const },
];
