import turfImage1 from "../../assets/turfImages/turf1.jpg";
import turfImage2 from "../../assets/turfImages/turf2.jpg";
import turfImage3 from "../../assets/turfImages/turf3.jpg";
import turfImage4 from "../../assets/turfImages/turf4.jpg";

export interface TurfItem {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  pricePerHour: number;
  sport: "Cricket" | "Football" | "Tennis" | "Basketball" | "Badminton";
  amenities: string[];
}

export const turfCatalogData: TurfItem[] = [
  {
    id: 1,
    name: "Greenfield Cricket Ground",
    location: "New York, USA",
    image: turfImage1,
    rating: 4.5,
    pricePerHour: 50,
    sport: "Cricket",
    amenities: ["Drinking Water", "Changing Rooms", "Parking", "Floodlights", "Lockers"],
  },
  {
    id: 2,
    name: "Sunnyvale Sports Complex",
    location: "California, USA",
    image: turfImage2,
    rating: 4.2,
    pricePerHour: 40,
    sport: "Football",
    amenities: ["Drinking Water", "Parking", "Lockers"],
  },
  {
    id: 3,
    name: "Riverside Cricket Arena",
    location: "London, UK",
    image: turfImage3,
    rating: 4.7,
    pricePerHour: 60,
    sport: "Cricket",
    amenities: ["Drinking Water", "Changing Rooms", "Parking", "Floodlights"],
  },
  {
    id: 4,
    name: "Apex Cricket Stadium",
    location: "Chicago, USA",
    image: turfImage4,
    rating: 4.8,
    pricePerHour: 70,
    sport: "Cricket",
    amenities: ["Drinking Water", "Changing Rooms", "Parking", "Floodlights", "Lockers"],
  },
  {
    id: 5,
    name: "Old Trafford Football Turf",
    location: "Manchester, UK",
    image: turfImage2, // recycle existing images for styling consistency
    rating: 4.6,
    pricePerHour: 55,
    sport: "Football",
    amenities: ["Drinking Water", "Changing Rooms", "Floodlights"],
  },
  {
    id: 6,
    name: "Wimbledon Tennis Court",
    location: "London, UK",
    image: turfImage3,
    rating: 4.9,
    pricePerHour: 35,
    sport: "Tennis",
    amenities: ["Drinking Water", "Changing Rooms", "Lockers"],
  },
  {
    id: 7,
    name: "Boston Celtics Hoop Court",
    location: "Boston, USA",
    image: turfImage1,
    rating: 4.4,
    pricePerHour: 30,
    sport: "Basketball",
    amenities: ["Parking", "Lockers"],
  },
  {
    id: 8,
    name: "Wembley Badminton Academy",
    location: "London, UK",
    image: turfImage4,
    rating: 4.3,
    pricePerHour: 25,
    sport: "Badminton",
    amenities: ["Drinking Water", "Changing Rooms", "Lockers"],
  },
];
