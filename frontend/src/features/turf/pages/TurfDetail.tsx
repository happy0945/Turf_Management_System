import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaMapMarkerAlt, FaStar, FaFutbol, FaClock, FaCheck, FaArrowLeft,
  FaCalendarCheck, FaSpinner, FaExclamationTriangle
} from "react-icons/fa";
import { turfService, type Turf } from "../../../services/turfService";

const SPORTS_ICONS: Record<string, string> = {
  Cricket: "🏏",
  Football: "⚽",
  Basketball: "🏀",
  Badminton: "🏸",
};

const TurfDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImg, setSelectedImg] = useState<string>("");

  useEffect(() => {
    if (!id) return;
    const fetchTurf = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await turfService.getTurfById(id);
        setTurf(data);
        if (data.images && data.images.length > 0) {
          setSelectedImg(data.images[0].url);
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load turf details.");
      } finally {
        setLoading(false);
      }
    };
    fetchTurf();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-28 pb-20 flex flex-col items-center justify-center gap-4">
        <FaSpinner className="text-green-500 text-4xl animate-spin" />
        <p className="text-slate-500 font-semibold">Loading turf details...</p>
      </div>
    );
  }

  if (error || !turf) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-28 pb-20 flex flex-col items-center justify-center gap-4">
        <FaExclamationTriangle className="text-red-500 text-5xl" />
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Turf Not Found</h2>
        <p className="text-slate-500">{error || "The turf you requested does not exist."}</p>
        <Link to="/turfs" className="px-6 py-2.5 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition">
          Back to Turfs
        </Link>
      </div>
    );
  }

  const ownerInfo = typeof turf.owner === "object" ? turf.owner : null;
  const fallbackImg = "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1200&auto=format&fit=crop&q=80";

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-28 pb-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-green-500 font-bold mb-6 transition cursor-pointer text-sm"
        >
          <FaArrowLeft /> Back to Turfs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column (Images & Details) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Gallery */}
            <div className="space-y-4">
              <div className="h-96 w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-900">
                <img
                  src={selectedImg || fallbackImg}
                  alt={turf.turfName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = fallbackImg;
                  }}
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-white font-bold">
                  <FaStar className="text-yellow-400" /> {turf.rating.toFixed(1)}
                </div>
              </div>

              {/* Image Thumbnails */}
              {turf.images && turf.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {turf.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImg(img.url)}
                      className={`h-20 w-28 rounded-xl overflow-hidden border-2 flex-shrink-0 transition cursor-pointer ${
                        selectedImg === img.url ? "border-green-500 shadow-md scale-105" : "border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img.url} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Location */}
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-2">
                {turf.sportsType.map((s) => (
                  <span key={s} className="bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 text-xs font-bold px-3 py-1 rounded-full">
                    {SPORTS_ICONS[s]} {s}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-white mb-2">
                {turf.turfName}
              </h1>
              <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-semibold">
                <FaMapMarkerAlt className="text-green-500" />
                {turf.location.address}, {turf.location.city}
              </p>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">About this Turf</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm whitespace-pre-line">
                {turf.description}
              </p>
            </div>

            {/* Amenities */}
            {turf.amenities && turf.amenities.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Available Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {turf.amenities.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                      <FaCheck className="text-green-500 text-xs" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Booking Box */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-xl sticky top-28 space-y-6">
              
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Price per slot</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-green-500">₹{turf.pricePerSlot.toLocaleString()}</span>
                  <span className="text-xs text-slate-400 font-semibold">/ {turf.slotDuration} mins</span>
                </div>
              </div>

              <div className="space-y-3 border-t border-b border-slate-100 dark:border-slate-800 py-4 text-sm">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-2"><FaClock className="text-green-500" /> Opening Hours</span>
                  <span className="font-bold">{turf.openingTime} - {turf.closingTime}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-2"><FaFutbol className="text-green-500" /> Slot Duration</span>
                  <span className="font-bold">{turf.slotDuration} Minutes</span>
                </div>
              </div>

              {ownerInfo && (
                <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Managed By</p>
                  <p className="font-bold text-slate-800 dark:text-white text-sm">{ownerInfo.fullName}</p>
                  <p className="text-xs text-slate-500">{ownerInfo.emailId}</p>
                </div>
              )}

              <button
                onClick={() => navigate(`/book-turf?turfId=${turf._id}`)}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-lg rounded-2xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FaCalendarCheck /> Book a Slot Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurfDetail;
