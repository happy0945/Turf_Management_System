import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTrophy,
  FaBookOpen,
  FaDollarSign,
  FaUsers,
  FaPlus,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaBuilding,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import type { TurfItem } from "../../home/data/turfCatalogData";

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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"Overview" | "Turfs" | "Approvals" | "Users" | "Bookings">("Overview");

  // State loaded from LocalStorage
  const [turfs, setTurfs] = useState<TurfItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);

  // Add/Edit Turf Modal states
  const [showTurfModal, setShowTurfModal] = useState(false);
  const [editingTurf, setEditingTurf] = useState<TurfItem | null>(null);
  const [turfFormData, setTurfFormData] = useState({
    name: "",
    location: "",
    pricePerHour: 50,
    sport: "Cricket" as TurfItem["sport"],
    amenities: "",
    image: "",
  });

  useEffect(() => {
    // Auth Guard check: Admin role required
    const token = localStorage.getItem("userToken");
    const role = localStorage.getItem("userRole");
    if (!token || role !== "admin") {
      alert("Unauthorized Access. Admin credentials required.");
      navigate("/login");
      return;
    }

    const loadData = () => {
      const loadedTurfs = JSON.parse(localStorage.getItem("turfCatalogData") || "[]");
      const loadedBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
      const loadedUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");

      setTurfs(loadedTurfs);
      setBookings(loadedBookings);
      setUsers(loadedUsers);
    };

    loadData();

    // Listen to local storage updates from other tabs
    window.addEventListener("storage", loadData);
    const interval = setInterval(loadData, 1000); // Polling for same-tab updates

    return () => {
      window.removeEventListener("storage", loadData);
      clearInterval(interval);
    };
  }, [navigate]);

  // Sync back to local storage helper functions
  const saveTurfsToStorage = (updatedTurfs: TurfItem[]) => {
    localStorage.setItem("turfCatalogData", JSON.stringify(updatedTurfs));
    setTurfs(updatedTurfs);
  };

  const saveUsersToStorage = (updatedUsers: UserItem[]) => {
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const saveBookingsToStorage = (updatedBookings: BookingItem[]) => {
    localStorage.setItem("bookings", JSON.stringify(updatedBookings));
    setBookings(updatedBookings);
  };

  // Add or Edit Turf CRUD
  const handleOpenAddModal = () => {
    setEditingTurf(null);
    setTurfFormData({
      name: "",
      location: "",
      pricePerHour: 50,
      sport: "Cricket",
      amenities: "Drinking Water, Changing Rooms, Parking, Floodlights",
      image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=600&auto=format&fit=crop",
    });
    setShowTurfModal(true);
  };

  const handleOpenEditModal = (turf: TurfItem) => {
    setEditingTurf(turf);
    setTurfFormData({
      name: turf.name,
      location: turf.location,
      pricePerHour: turf.pricePerHour,
      sport: turf.sport,
      amenities: turf.amenities.join(", "),
      image: turf.image,
    });
    setShowTurfModal(true);
  };

  const handleSaveTurf = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmenities = turfFormData.amenities
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    if (editingTurf) {
      // Edit mode
      const updated = turfs.map((t) =>
        t.id === editingTurf.id
          ? {
              ...t,
              name: turfFormData.name,
              location: turfFormData.location,
              pricePerHour: Number(turfFormData.pricePerHour),
              sport: turfFormData.sport,
              amenities: parsedAmenities,
              image: turfFormData.image,
            }
          : t
      );
      saveTurfsToStorage(updated);
    } else {
      // Add mode
      const newId = turfs.length > 0 ? Math.max(...turfs.map((t) => t.id)) + 1 : 1;
      const newTurf: TurfItem = {
        id: newId,
        name: turfFormData.name,
        location: turfFormData.location,
        pricePerHour: Number(turfFormData.pricePerHour),
        sport: turfFormData.sport,
        rating: 5.0, // default rating for new turfs
        amenities: parsedAmenities,
        image: turfFormData.image,
      };
      saveTurfsToStorage([...turfs, newTurf]);
    }
    setShowTurfModal(false);
  };

  const handleDeleteTurf = (id: number) => {
    if (confirm("Are you sure you want to delete this turf?")) {
      const updated = turfs.filter((t) => t.id !== id);
      saveTurfsToStorage(updated);
    }
  };

  // Ownership Assignment
  const handleAssignOwner = (turfId: number, ownerEmail: string) => {
    // 1. Link ownerEmail to Turf
    const updatedTurfs = turfs.map((t) => {
      if (t.id === turfId) {
        return { ...t, ownerId: ownerEmail || undefined };
      }
      return t;
    });
    saveTurfsToStorage(updatedTurfs);

    // 2. Link turfId to User record
    const updatedUsers = users.map((u) => {
      if (u.email.trim().toLowerCase() === ownerEmail.trim().toLowerCase()) {
        return { ...u, ownedTurfId: turfId };
      }
      // If user previously owned this turf, clear it
      if (u.ownedTurfId === turfId && u.email.trim().toLowerCase() !== ownerEmail.trim().toLowerCase()) {
        return { ...u, ownedTurfId: undefined };
      }
      return u;
    });
    saveUsersToStorage(updatedUsers);

    // Prompt to switch view and show owner dashboard
    const ownerRecord = updatedUsers.find((u) => u.email.trim().toLowerCase() === ownerEmail.trim().toLowerCase());
    if (ownerRecord && confirm("Ownership assigned successfully! Would you like to view this owner's dashboard now? (You will be automatically logged in as this owner)")) {
      localStorage.setItem("userToken", "mock-token-" + ownerEmail);
      localStorage.setItem("userEmail", ownerEmail);
      localStorage.setItem("userName", ownerRecord.username);
      localStorage.setItem("userRole", "owner");
      navigate("/owner");
    } else {
      alert("Ownership assigned successfully!");
    }
  };

  // Verify Owner Registration Details
  const handleApproveOwner = (email: string) => {
    const updated = users.map((u) => (u.email.trim().toLowerCase() === email.trim().toLowerCase() ? { ...u, status: "Verified" as const } : u));
    saveUsersToStorage(updated);
    alert("Owner account approved and verified!");
  };

  const handleRejectOwner = (email: string) => {
    if (confirm("Are you sure you want to reject this owner verification?")) {
      const updated = users.map((u) => (u.email.trim().toLowerCase() === email.trim().toLowerCase() ? { ...u, status: "Rejected" as const } : u));
      saveUsersToStorage(updated);
    }
  };

  // Promote User roles
  const handlePromoteRole = (email: string, newRole: UserItem["role"]) => {
    const updated = users.map((u) => (u.email === email ? { ...u, role: newRole, status: "Verified" as const } : u));
    saveUsersToStorage(updated);
    alert(`User promoted to ${newRole.toUpperCase()} successfully!`);
  };

  // Cancel Bookings
  const handleCancelBooking = (ref: string) => {
    if (confirm("Are you sure you want to cancel this booking reservation?")) {
      const updated = bookings.map((b) => (b.reference === ref ? { ...b, status: "Cancelled" } : b));
      saveBookingsToStorage(updated);
    }
  };

  // Stats calculators
  const totalRevenue = bookings
    .filter((b) => b.status === "Confirmed")
    .reduce((sum, b) => sum + b.amount, 0);

  const pendingApprovalsCount = users.filter((u) => u.role && u.role.trim().toLowerCase() === "owner" && u.status && u.status.trim().toLowerCase() === "pending").length;

  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500 min-h-screen pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Banner Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <span className="text-green-600 dark:text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              System Admin
            </span>
            <h1 className="text-4xl font-black mt-2">Console Center</h1>
          </div>
          <div className="text-sm font-semibold text-slate-400">
            Welcome back, <span className="text-green-500 font-extrabold">Super Admin</span>
          </div>
        </div>

        {/* Dashboard Panels Grid */}
        <div className="grid grid-cols-5 gap-8">
          {/* Sidebar Tabs Column */}
          <div className="col-span-5 md:col-span-1 flex flex-col gap-2">
            {[
              { id: "Overview", label: "Overview", icon: FaTrophy },
              { id: "Turfs", label: "Manage Turfs", icon: FaBuilding },
              { id: "Approvals", label: `Approvals (${pendingApprovalsCount})`, icon: FaBuilding },
              { id: "Users", label: "Users List", icon: FaUsers },
              { id: "Bookings", label: "All Bookings", icon: FaBookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 transition cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-green-500 text-white shadow-md shadow-green-500/15"
                      : "bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Workspace View Column */}
          <div className="col-span-5 md:col-span-4 bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.01)] min-h-[500px]">
            <AnimatePresence mode="wait">
              {/* TAB 1: OVERVIEW */}
              {activeTab === "Overview" && (
                <motion.div
                  key="Overview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  <h3 className="text-xl font-black mb-4">Site Analytics</h3>

                  {/* Summary grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Total Bookings", val: bookings.length, icon: FaBookOpen, col: "text-blue-500" },
                      { label: "Active Revenue", val: `$${totalRevenue}`, icon: FaDollarSign, col: "text-green-500" },
                      { label: "Verified Venues", val: turfs.length, icon: FaTrophy, col: "text-yellow-500" },
                      { label: "Registered Users", val: users.length, icon: FaUsers, col: "text-purple-500" },
                    ].map((stat, i) => {
                      const Icon = stat.icon;
                      return (
                        <div key={i} className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-850 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                              {stat.label}
                            </span>
                            <span className="text-2xl font-black">{stat.val}</span>
                          </div>
                          <div className={`p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-lg ${stat.col}`}>
                            <Icon />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Charts Simulation */}
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 p-6 rounded-2xl">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Booking Density</h4>
                    <div className="flex items-end justify-between h-40 gap-3 pt-6 border-b border-slate-200 dark:border-slate-800">
                      {[60, 45, 90, 75, 50, 110, 80].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full bg-green-500/10 dark:bg-green-500/5 rounded-t-lg relative group h-32 flex items-end">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${h}%` }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                              className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg shadow-md group-hover:from-green-400 group-hover:to-emerald-350 transition-colors"
                            />
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] py-1 px-2 rounded font-black opacity-0 group-hover:opacity-100 transition-opacity">
                              {h}%
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Day {i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: TURFS MANAGEMENT */}
              {activeTab === "Turfs" && (
                <motion.div
                  key="Turfs"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black">Registered Venues</h3>
                    <button
                      onClick={handleOpenAddModal}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-green-500/10"
                    >
                      <FaPlus />
                      <span>Add New Turf</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-205 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                          <th className="pb-3 pl-2">Turf Details</th>
                          <th className="pb-3">Sport</th>
                          <th className="pb-3">Hourly Rate</th>
                          <th className="pb-3">Assign Owner</th>
                          <th className="pb-3 text-right pr-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                        {turfs.map((turf) => (
                          <tr key={turf.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition duration-200">
                            <td className="py-4 pl-2">
                              <div className="flex items-center gap-3">
                                <img src={turf.image} alt={turf.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-800" />
                                <div>
                                  <span className="font-bold text-slate-800 dark:text-white block">{turf.name}</span>
                                  <span className="text-[10px] text-slate-400">{turf.location}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 font-semibold text-slate-600 dark:text-slate-400">{turf.sport}</td>
                            <td className="py-4 font-extrabold text-slate-800 dark:text-slate-200">${turf.pricePerHour}/hr</td>
                            <td className="py-4">
                              <select
                                value={turf.ownerId || ""}
                                onChange={(e) => handleAssignOwner(turf.id, e.target.value)}
                                className="bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-lg p-1.5 text-xs text-slate-700 dark:text-slate-350 focus:outline-none"
                              >
                                <option value="">Unassigned</option>
                                {users
                                  .filter((u) => u.role === "owner" && u.status === "Verified")
                                  .map((u) => (
                                    <option key={u.email} value={u.email}>
                                      {u.username}
                                    </option>
                                  ))}
                              </select>
                            </td>
                            <td className="py-4 text-right pr-2">
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => handleOpenEditModal(turf)}
                                  className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition cursor-pointer"
                                  title="Edit Turf"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDeleteTurf(turf.id)}
                                  className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition cursor-pointer"
                                  title="Delete Turf"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: OWNER VERIFICATION APPROVALS */}
              {activeTab === "Approvals" && (
                <motion.div
                  key="Approvals"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-black mb-4">Pending Turf Owners Approvals</h3>
                  
                  {users.filter((u) => u.role && u.role.trim().toLowerCase() === "owner" && u.status && u.status.trim().toLowerCase() === "pending").length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      <FaBuilding className="text-4xl text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                      <p className="text-slate-400 dark:text-slate-500 font-semibold">No pending owner accounts for verification.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {users
                        .filter((u) => u.role && u.role.trim().toLowerCase() === "owner" && u.status && u.status.trim().toLowerCase() === "pending")
                        .map((owner) => (
                          <div key={owner.email} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-6 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-base">{owner.username}</span>
                                <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full uppercase">
                                  Pending Verification
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-1 text-slate-500 text-xs">
                                <div><span className="font-semibold text-slate-400">Email:</span> {owner.email}</div>
                                <div><span className="font-semibold text-slate-400">Contact:</span> {owner.contactNumber}</div>
                                <div><span className="font-semibold text-slate-400">License ID:</span> {owner.licenseNumber}</div>
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                <div><span className="font-semibold text-slate-400">Business:</span> {owner.businessName}</div>
                                <div><span className="font-semibold text-slate-400">Address:</span> {owner.businessAddress}</div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveOwner(owner.email)}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-green-500/10"
                              >
                                <FaCheckCircle />
                                <span>Verify & Approve</span>
                              </button>
                              <button
                                onClick={() => handleRejectOwner(owner.email)}
                                className="bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                              >
                                <FaTimesCircle />
                                <span>Reject</span>
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 4: REGISTERED USERS LIST */}
              {activeTab === "Users" && (
                <motion.div
                  key="Users"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-black mb-4">User Accounts</h3>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-205 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                          <th className="pb-3 pl-2">Name / Email</th>
                          <th className="pb-3">Contact</th>
                          <th className="pb-3">Role</th>
                          <th className="pb-3">Verification</th>
                          <th className="pb-3 text-right pr-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                        {users.map((user) => (
                          <tr key={user.email} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                            <td className="py-4 pl-2">
                              <div>
                                <span className="font-bold text-slate-850 dark:text-white block">{user.username}</span>
                                <span className="text-[10px] text-slate-400">{user.email}</span>
                              </div>
                            </td>
                            <td className="py-4 font-semibold text-slate-655 dark:text-slate-400">{user.contactNumber}</td>
                            <td className="py-4">
                              <span className={`px-2.5 py-1 rounded-lg font-black uppercase text-[10px] tracking-wider border ${
                                user.role === "admin"
                                  ? "bg-purple-500/10 border-purple-500/20 text-purple-550 dark:text-purple-400"
                                  : user.role === "owner"
                                  ? "bg-blue-500/10 border-blue-500/20 text-blue-550 dark:text-blue-400"
                                  : "bg-slate-100 border-slate-200 text-slate-500 dark:bg-slate-950 dark:border-slate-850"
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-4">
                              <span className={`text-[10px] font-bold ${
                                user.status === "Verified"
                                  ? "text-green-500"
                                  : user.status === "Rejected"
                                  ? "text-red-500"
                                  : "text-yellow-500"
                              }`}>
                                {user.status || "Verified"}
                              </span>
                            </td>
                            <td className="py-4 text-right pr-2">
                              {user.role !== "admin" && (
                                <div className="flex gap-2 justify-end">
                                  {user.role === "customer" && (
                                    <button
                                      onClick={() => handlePromoteRole(user.email, "owner")}
                                      className="py-1.5 px-3 bg-blue-500 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-blue-600 shadow"
                                    >
                                      Promote to Owner
                                    </button>
                                  )}
                                  {user.role === "owner" && (
                                    <button
                                      onClick={() => handlePromoteRole(user.email, "admin")}
                                      className="py-1.5 px-3 bg-purple-500 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-purple-600 shadow"
                                    >
                                      Promote to Admin
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* TAB 5: MANAGE BOOKINGS */}
              {activeTab === "Bookings" && (
                <motion.div
                  key="Bookings"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-black mb-4">All Turf Reservations</h3>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-205 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                          <th className="pb-3 pl-2">Booking Ref / Date</th>
                          <th className="pb-3">Turf Target</th>
                          <th className="pb-3">Client Contact</th>
                          <th className="pb-3">Fee / Payment</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right pr-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                        {bookings.map((booking) => (
                          <tr key={booking.reference} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                            <td className="py-4 pl-2">
                              <div>
                                <span className="font-extrabold text-slate-800 dark:text-white block">{booking.reference}</span>
                                <span className="text-[10px] text-slate-400">{booking.date} • {booking.slotTime}</span>
                              </div>
                            </td>
                            <td className="py-4 font-bold text-slate-700 dark:text-slate-300">{booking.turfName}</td>
                            <td className="py-4">
                              <div>
                                <span className="font-semibold block">{booking.playerName}</span>
                                <span className="text-[10px] text-slate-400">{booking.playerEmail}</span>
                              </div>
                            </td>
                            <td className="py-4">
                              <span className="font-bold text-slate-800 dark:text-slate-200 block">${booking.amount}</span>
                              <span className="text-[10px] text-slate-400 font-semibold">{booking.paymentMethod}</span>
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase border ${
                                booking.status === "Confirmed"
                                  ? "bg-green-500/10 border-green-500/20 text-green-500"
                                  : "bg-red-500/10 border-red-500/20 text-red-500"
                              }`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="py-4 text-right pr-2">
                              {booking.status === "Confirmed" && (
                                <button
                                  onClick={() => handleCancelBooking(booking.reference)}
                                  className="py-1 px-2.5 bg-red-500 text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-red-600 shadow"
                                >
                                  Cancel Booking
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Add / Edit Turf Modal Overlay */}
      <AnimatePresence>
        {showTurfModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTurfModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            {/* Card Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10"
            >
              <h3 className="text-xl font-black mb-4">
                {editingTurf ? "Edit Turf Specifications" : "Register New Turf"}
              </h3>

              <form onSubmit={handleSaveTurf} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Turf Name</label>
                  <input
                    required
                    type="text"
                    value={turfFormData.name}
                    onChange={(e) => setTurfFormData({ ...turfFormData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl focus:outline-none"
                    placeholder="e.g. Stamford Pitch"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Location Address</label>
                  <input
                    required
                    type="text"
                    value={turfFormData.location}
                    onChange={(e) => setTurfFormData({ ...turfFormData, location: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl focus:outline-none"
                    placeholder="e.g. Manchester, UK"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Price / Hour ($)</label>
                    <input
                      required
                      type="number"
                      value={turfFormData.pricePerHour}
                      onChange={(e) => setTurfFormData({ ...turfFormData, pricePerHour: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Sport Type</label>
                    <select
                      value={turfFormData.sport}
                      onChange={(e) => setTurfFormData({ ...turfFormData, sport: e.target.value as any })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl focus:outline-none"
                    >
                      <option value="Cricket">Cricket</option>
                      <option value="Football">Football</option>
                      <option value="Tennis">Tennis</option>
                      <option value="Basketball">Basketball</option>
                      <option value="Badminton">Badminton</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Cover Photo Image URL</label>
                  <input
                    type="text"
                    value={turfFormData.image}
                    onChange={(e) => setTurfFormData({ ...turfFormData, image: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Amenities (Comma separated)</label>
                  <input
                    type="text"
                    value={turfFormData.amenities}
                    onChange={(e) => setTurfFormData({ ...turfFormData, amenities: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl focus:outline-none"
                    placeholder="Drinking Water, Changing Rooms"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-xs cursor-pointer shadow-md shadow-green-500/10"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTurfModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold py-3 rounded-xl text-xs cursor-pointer text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
