export type CampusPlaceCategory =
  | "gate"
  | "hostel"
  | "faculty"
  | "library"
  | "hall"
  | "landmark";

export type CampusPlace = {
  id: string;
  name: string;
  category: CampusPlaceCategory;
  latitude: number;
  longitude: number;
};

export const FUPRE_CAMPUS = {
  id: "fupre-effurun",
  name: "Federal University of Petroleum Resources, Effurun",
  shortName: "FUPRE",
  address: "Warri-Port Harcourt Express Way, East-West Road, Delta State, Nigeria",
  centerLat: 5.5741125,
  centerLng: 5.8370005,
  radiusKm: 4,
} as const;

// These are product seed points for the campus MVP. Replace them with verified
// coordinates collected from a campus survey before claiming map accuracy.
export const FUPRE_PLACES: CampusPlace[] = [
  {
    id: "fupre-main-gate",
    name: "FUPRE Main Gate",
    category: "gate",
    latitude: 5.5741125,
    longitude: 5.8370005,
  },
  {
    id: "fupre-engineering",
    name: "College of Engineering and Technology",
    category: "faculty",
    latitude: 5.5761,
    longitude: 5.8384,
  },
  {
    id: "fupre-science",
    name: "College of Science",
    category: "faculty",
    latitude: 5.5728,
    longitude: 5.8358,
  },
  {
    id: "fupre-library",
    name: "FUPRE Central Library",
    category: "library",
    latitude: 5.5752,
    longitude: 5.8359,
  },
  {
    id: "fupre-hostels",
    name: "Student Hostels",
    category: "hostel",
    latitude: 5.5708,
    longitude: 5.8381,
  },
  {
    id: "fupre-senate",
    name: "Senate Building",
    category: "hall",
    latitude: 5.5739,
    longitude: 5.8392,
  },
  {
    id: "fupre-sports",
    name: "Sports Ground",
    category: "landmark",
    latitude: 5.5698,
    longitude: 5.8348,
  },
];

export function getCampusPlace(placeId: string) {
  return FUPRE_PLACES.find((place) => place.id === placeId) ?? null;
}

export function campusPlaceLabel(placeId: string) {
  return getCampusPlace(placeId)?.name ?? placeId;
}
