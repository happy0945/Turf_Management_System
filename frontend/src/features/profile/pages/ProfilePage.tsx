import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope, FaPhone, FaCalendarCheck, FaTimes,
  FaMapMarkerAlt, FaSpinner, FaEdit, FaSave
} from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { bookingService, type Booking } from "../../../services/bookingService";
import { authService } from "../../../services/authService";

const ProfilePage = () => {
  const { user, refreshProfile } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [contactNumber, setContactNumber] = useState(user?.contactNumber || "");
  const [saving, setSaving] = useState(false);

  // Update edit form when user context loads/changes
  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setContactNumber(user.contactNumber);
    }
  }, [user]);

  // Fetch My Bookings
  const loadBookings = async () => {
    try {
      setLoadingBookings(true);
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch {
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // Save profile changes
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await authService.updateProfile({ fullName, contactNumber });
      await refreshProfile();
      setIsEditing(false);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  // Cancel booking
  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await bookingService.cancelBooking(bookingId);
      await loadBookings();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to cancel booking.");
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-28 pb-20 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-10">
        
        {/* Profile Banner Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden"
        >
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-green-500/20 overflow-hidden flex-shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
            ) : (
              user?.fullName?.charAt(0).toUpperCase()
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-3">
              {isEditing ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="text-2xl font-black text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-300 dark:border-slate-700"
                />
              ) : (
                <h1 className="text-3xl font-black text-slate-800 dark:text-white">{user?.fullName}</h1>
              )}
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-extrabold text-xs uppercase">
                {user?.role}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><FaEnvelope className="text-green-500" /> {user?.emailId}</span>
              {isEditing ? (
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-300 dark:border-slate-700 font-mono text-xs"
                />
              ) : (
                <span className="flex items-center gap-1.5"><FaPhone className="text-green-500" /> {user?.contactNumber}</span>
              )}
            </div>
          </div>

          {/* Edit / Save Action */}
          <div>
            {isEditing ? (
              <button
                disabled={saving}
                onClick={handleSaveProfile}
                className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition text-sm flex items-center gap-2 cursor-pointer shadow-md shadow-green-500/20"
              >
                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                <span>Save</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition text-sm flex items-center gap-2 cursor-pointer"
              >
                <FaEdit />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* My Reservations Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
              <FaCalendarCheck className="text-green-500" /> My Reservations
            </h2>
            <span className="text-sm font-bold text-slate-400">
              {bookings.length} Total
            </span>
          </div>

          {loadingBookings && (
            <div className="flex items-center justify-center py-16 gap-3 text-slate-400 font-semibold">
              <FaSpinner className="text-green-500 animate-spin text-2xl" /> Loading booking history...
            </div>
          )}

          {!loadingBookings && bookings.length === 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 rounded-3xl text-center space-y-3">
              <FaCalendarCheck className="text-slate-300 dark:text-slate-700 text-5xl mx-auto" />
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">No Reservations Found</h3>
              <p className="text-slate-500 text-sm">You haven't booked any slots yet.</p>
            </div>
          )}

          {!loadingBookings && bookings.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4 hover:border-green-500/30 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-slate-800 dark:text-white text-lg">
                        {b.turf?.turfName || "Sports Turf"}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <FaMapMarkerAlt className="text-green-500" />
                        {b.turf?.location?.city || "Location"}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        b.status === "confirmed"
                          ? "bg-green-500/10 text-green-500"
                          : b.status === "cancelled"
                          ? "bg-red-500/10 text-red-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Date:</span>
                      <span className="font-bold">{new Date(b.bookingDate).toDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Time:</span>
                      <span className="font-bold text-green-500">{b.startTime} – {b.endTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Paid:</span>
                      <span className="font-black">₹{b.totalAmount}</span>
                    </div>
                    {b.payment?.razorpayPaymentId && (
                      <div className="flex justify-between font-mono text-[10px] text-slate-400 border-t border-slate-200/50 dark:border-slate-700/50 pt-2 mt-2">
                        <span>Payment Ref:</span>
                        <span>{b.payment.razorpayPaymentId}</span>
                      </div>
                    )}
                  </div>

                  {b.status === "confirmed" && (
                    <button
                      onClick={() => handleCancelBooking(b._id)}
                      className="w-full py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FaTimes /> Cancel Reservation
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
