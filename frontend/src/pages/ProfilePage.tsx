import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaPhone,
  FaUserShield,
  FaCalendarCheck,
  FaBuilding,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaIdCard,
} from "react-icons/fa";
import type { TurfItem } from "./HomePage/turfCatalogData";

interface BookingItem {
  reference: string;
  turfId: number;
  turfName: string;
  date: string;
  slotTime: string;
  playerName: string;
  playerEmail: string;
  playerPhone: string;
  amount: number;
  status: string;
  paymentMethod: string;
  timestamp: string;
}

interface UserItem {
  username: string;
  email: string;
  contactNumber: string;
  role: "customer" | "owner" | "admin";
  status: "Verified" | "Pending" | "Rejected";
  ownedTurfId?: number;
  businessName?: string;
  businessAddress?: string;
  licenseNumber?: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<UserItem | null>(null);
  const [myTurfs, setMyTurfs] = useState<TurfItem[]>([]);
  const [myBookings, setMyBookings] = useState<BookingItem[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const email = localStorage.getItem("userEmail");

    if (!token || !email) {
      alert("Please log in to view your profile details.");
      navigate("/login");
      return;
    }

    const loadProfileData = () => {
      // Load user details
      const loadedUsers: UserItem[] = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const matchedUser = loadedUsers.find((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase());

      if (matchedUser) {
        setCurrentUser(matchedUser);

        // Fetch bookings if customer
        const loadedBookings: BookingItem[] = JSON.parse(localStorage.getItem("bookings") || "[]");
        const filteredBookings = loadedBookings.filter((b) => b.playerEmail.trim().toLowerCase() === email.trim().toLowerCase());
        setMyBookings(filteredBookings);

        // Fetch owned turfs if owner
        const loadedTurfs: TurfItem[] = JSON.parse(localStorage.getItem("turfCatalogData") || "[]");
        const filteredTurfs = loadedTurfs.filter((t) => (t.ownerId && t.ownerId.trim().toLowerCase() === email.trim().toLowerCase()) || t.id === matchedUser.ownedTurfId);
        setMyTurfs(filteredTurfs);
      }
    };

    loadProfileData();

    window.addEventListener("storage", loadProfileData);
    const interval = setInterval(loadProfileData, 1000);

    return () => {
      window.removeEventListener("storage", loadProfileData);
      clearInterval(interval);
    };
  }, [navigate]);

  if (!currentUser) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-pulse text-slate-400">Loading profile details...</div>
      </div>
    );
  }

  const isCustomer = currentUser.role === "customer";
  const isOwner = currentUser.role === "owner";
  const isAdmin = currentUser.role === "admin";

  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500 min-h-screen pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
        
        {/* Banner Title Header */}
        <div className="text-center md:text-left">
          <span className="text-green-600 dark:text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
            Account Center
          </span>
          <h1 className="text-4xl font-black mt-3">My Profile</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-3 mx-auto md:mx-0" />
        </div>

        {/* Profile Card & Details Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Profile Details Card */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col items-center text-center space-y-6">
            {/* User Avatar Circle */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 border-4 border-white dark:border-slate-800 shadow-xl flex items-center justify-center text-white text-3xl font-black">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>

            {/* Profile Info */}
            <div className="space-y-1 w-full">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white truncate">{currentUser.username}</h3>
              <span className={`inline-block px-3 py-1 rounded-full font-black uppercase text-[10px] tracking-wider border ${
                isAdmin
                  ? "bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400"
                  : isOwner
                  ? "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
                  : "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
              }`}>
                {currentUser.role}
              </span>
            </div>

            <hr className="border-slate-100 dark:border-slate-800 w-full" />

            {/* General Contact Info Details list */}
            <div className="w-full space-y-4.5 text-left text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-green-500 text-base" />
                <span className="truncate">{currentUser.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-green-500 text-base" />
                <span>{currentUser.contactNumber || "Not Provided"}</span>
              </div>
              {isOwner && (
                <div className="flex items-center gap-3">
                  <FaBuilding className="text-green-500 text-base" />
                  <span className="truncate">{currentUser.businessName || "No Business Name"}</span>
                </div>
              )}
            </div>

            {isOwner && (
              <>
                <hr className="border-slate-100 dark:border-slate-800 w-full" />
                <div className="w-full text-center">
                  {currentUser.status === "Verified" && (
                    <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-xl text-green-600 dark:text-green-400 text-xs font-black">
                      <FaCheckCircle className="text-sm" />
                      <span>Verified Owner</span>
                    </div>
                  )}
                  {currentUser.status === "Pending" && (
                    <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl text-yellow-600 dark:text-yellow-400 text-xs font-black">
                      <FaExclamationTriangle className="text-sm" />
                      <span>Verification Pending</span>
                    </div>
                  )}
                  {currentUser.status === "Rejected" && (
                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl text-red-600 dark:text-red-400 text-xs font-black">
                      <FaTimesCircle className="text-sm" />
                      <span>Verification Rejected</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* RIGHT PANEL: Custom Workspaces based on account type */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* OWNER ROLE WORKSPACE */}
            {isOwner && (
              <>
                {/* Business details panel */}
                <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
                  <h3 className="text-lg font-black border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                    <FaIdCard className="text-green-500" />
                    <span>Business Verification Details</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">Business Name</span>
                      <span className="font-bold text-slate-800 dark:text-white">{currentUser.businessName || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">License ID / Registration Proof</span>
                      <span className="font-bold text-slate-800 dark:text-white">{currentUser.licenseNumber || "N/A"}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">Business Address</span>
                      <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-red-500 text-xs flex-shrink-0" />
                        <span>{currentUser.businessAddress || "N/A"}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Managed Turfs panel */}
                <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <h3 className="text-lg font-black border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                    <FaBuilding className="text-green-500" />
                    <span>My Managed Turf Arenas ({myTurfs.length})</span>
                  </h3>

                  {myTurfs.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl">
                      <p className="text-slate-400 font-semibold">You have not registered or been assigned any turf arenas yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {myTurfs.map((turf) => (
                        <div key={turf.id} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden flex flex-col justify-between">
                          <img src={turf.image} alt={turf.name} className="w-full h-36 object-cover" />
                          <div className="p-4 space-y-3">
                            <div>
                              <span className="font-black text-sm block truncate">{turf.name}</span>
                              <span className="text-[10px] text-slate-400 block truncate">{turf.location}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs font-bold border-t border-slate-100 dark:border-slate-900 pt-2">
                              <span className="text-green-500">${turf.pricePerHour}/hr</span>
                              <span className="text-slate-400 uppercase tracking-wider text-[10px]">{turf.sport}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* CUSTOMER ROLE WORKSPACE */}
            {(isCustomer || myBookings.length > 0) && (
              <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-205 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-black border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                  <FaCalendarCheck className="text-green-500" />
                  <span>My Booking Reservations ({myBookings.length})</span>
                </h3>

                {myBookings.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl">
                    <p className="text-slate-400 font-semibold">You have not scheduled any reservations yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                          <th className="pb-3 pl-2">Reference</th>
                          <th className="pb-3">Turf Arena</th>
                          <th className="pb-3">Date</th>
                          <th className="pb-3">Time Slot</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Payment</th>
                          <th className="pb-3 pr-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                        {myBookings.map((b) => (
                          <tr key={b.reference} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition">
                            <td className="py-4 pl-2 font-extrabold text-slate-850 dark:text-white">{b.reference}</td>
                            <td className="py-4 font-bold text-slate-800 dark:text-slate-200">{b.turfName}</td>
                            <td className="py-4 font-semibold text-slate-500 dark:text-slate-400">{b.date}</td>
                            <td className="py-4 font-semibold text-slate-500 dark:text-slate-400">{b.slotTime}</td>
                            <td className="py-4 font-extrabold text-green-600 dark:text-green-400">${b.amount}</td>
                            <td className="py-4 font-semibold text-slate-500 dark:text-slate-400">{b.paymentMethod}</td>
                            <td className="py-4 pr-2 text-right">
                              <span className={`px-2.5 py-0.5 rounded-full font-black text-[9px] uppercase border ${
                                b.status === "Confirmed"
                                  ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                                  : "bg-red-500/10 border-red-500/20 text-red-500"
                              }`}>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ADMIN ROLE WORKSPACE */}
            {isAdmin && (
              <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-black border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                  <FaUserShield className="text-green-500" />
                  <span>Admin Actions</span>
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  As a system administrator, you have full control over registered turfs, owner approvals, and user accounts. You can manage them in real-time from the console center.
                </p>
                <button
                  onClick={() => navigate("/admin")}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-green-500/10 transition"
                >
                  <FaUserShield />
                  <span>Launch Admin Console Center</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
