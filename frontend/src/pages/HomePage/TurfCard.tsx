import Tilt from "./Tilt";
import { FaMapMarkerAlt, FaStar, FaArrowRight } from "react-icons/fa";

type turfProb = {
  image: string;
  name: string;
  location: string;
  pricePerHour: number;
  rating: number;
};

const TurfCard = ({ image, name, location, pricePerHour, rating }: turfProb) => {
  return (
    <Tilt className="h-full">
      <div className="group h-full bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 hover:border-green-500/30 dark:hover:border-green-500/30 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_rgba(34,197,94,0.06)] dark:hover:shadow-[0_20px_40px_rgba(34,197,94,0.1)] transition-all duration-300 flex flex-col justify-between">
        
        {/* Image Container with Zoom effect */}
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Price Badge */}
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-green-600 dark:text-green-400 font-bold px-3 py-1 rounded-full text-sm">
            ${pricePerHour}/hr
          </div>
          {/* Subtle gradient overlay on bottom of image */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        </div>

        {/* Card Details */}
        <div className="p-5 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 line-clamp-1">
              {name}
            </h3>
            
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-4">
              <FaMapMarkerAlt className="text-green-500 flex-shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto">
            {/* Rating */}
            <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-lg text-yellow-600 dark:text-yellow-400 text-xs font-semibold">
              <FaStar className="fill-current" />
              <span>{rating.toFixed(1)}</span>
            </div>

            {/* Book CTA Action */}
            <button className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors duration-300 cursor-pointer">
              Book Turf
              <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </Tilt>
  );
};

export default TurfCard;