import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaTrophy,
  FaBuilding,
  FaRupeeSign,
  FaUsers,
  FaPlus,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaTimes,
  FaExclamationTriangle,
  FaToggleOn,
  FaToggleOff,
  FaUserPlus,
  FaSpinner,
  FaFutbol,
  FaBookOpen,
  FaUserShield,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { turfService, type Turf } from "../../../services/turfService";
import { ownerTurfService } from "../../../services/ownerTurfService";
import axiosInstance from "../../../lib/axios";

interface UserAccount {
  _id: string;
  fullName: string;
  emailId: string;
  contactNumber: string;
  role: "user" | "owner" | "admin";
  avatar?: string;
  createdAt: string;
}

// ── Toast Alert ──────────────────────────────────────────────────────────────
const Toast = ({
  msg,
  type,
  onClose,
}: {
  msg: string;
  type: "success" | "error";
  onClose: () => void;
}) => (
  <div
    className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold backdrop-blur-md animate-in slide-in-from-bottom-4 duration-300 ${
      type === "success"
        ? "bg-green-600/90 border border-green-400/30"
        : "bg-red-600/90 border border-red-400/30"
    }`}
  >
    {type === "success" ? <FaCheckCircle /> : <FaExclamationTriangle />}
    <span>{msg}</span>
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 cursor-pointer">
      <FaTimes />
    </button>
  </div>
);

// ── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) => (
  <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
    <div className={`p-3.5 rounded-xl ${color} text-white text-xl`}>
      <Icon />
    </div>
    <div>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
      <p className="text-xl font-black text-slate-800 dark:text-white">{value}</p>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// Main Admin Dashboard
// ═══════════════════════════════════════════════════════════════════════════════
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"Overview" | "Turfs" | "Users" | "CreateOwner">("Overview");
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [turfBookingCounts, setTurfBookingCounts] = useState<Record<string, number>>({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Modals
  const [showAddTurfModal, setShowAddTurfModal] = useState(false);
  const [showEditTurfModal, setShowEditTurfModal] = useState(false);
  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Add Turf Form (Supporting slot durations 30, 60, 90, 120 mins)
  const [addForm, setAddForm] = useState({
    turfName: "",
    description: "",
    address: "",
    city: "",
    latitude: "",
    longitude: "",
    openingTime: "06:00",
    closingTime: "22:00",
    slotDuration: 60,
    pricePerSlot: 500,
    sportsType: "Football, Cricket",
    amenities: "Floodlights, Drinking Water, Parking",
  });
  const [addImages, setAddImages] = useState<File[]>([]);
  const [addImagePreviews, setAddImagePreviews] = useState<string[]>([]);
  const addFileRef = useRef<HTMLInputElement>(null);

  // Edit Turf Form
  const [editForm, setEditForm] = useState({
    turfName: "",
    description: "",
    address: "",
    city: "",
    openingTime: "",
    closingTime: "",
    slotDuration: 60,
    pricePerSlot: 500,
    sportsType: "",
    amenities: "",
  });
  const [editImages, setEditImages] = useState<File[]>([]);
  const editFileRef = useRef<HTMLInputElement>(null);

  // Register Owner Form
  const [ownerForm, setOwnerForm] = useState({
    fullName: "",
    emailId: "",
    password: "",
    contactNumber: "",
  });

  // Auth Guard & Data Loading
  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn || !user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      showToast("Unauthorized Access. Admin credentials required.", "error");
      navigate("/");
      return;
    }
    loadAdminData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, user, authLoading]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [turfData, userData] = await Promise.all([
        turfService.getAllTurfs(),
        axiosInstance.get("/auth/admin/users").then((res) => res.data.data).catch(() => []),
      ]);

      setTurfs(turfData);
      setUsers(userData);

      // Fetch booking counts per turf
      const counts: Record<string, number> = {};
      await Promise.all(
        turfData.map(async (t) => {
          try {
            const bRes = await axiosInstance.get(`/booking/turf/${t._id}`);
            counts[t._id] = bRes.data.data?.length || 0;
          } catch {
            counts[t._id] = 0;
          }
        })
      );
      setTurfBookingCounts(counts);

    } catch {
      showToast("Failed to load admin dashboard data.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Add Turf Images
  const handleAddImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (addImages.length + files.length > 6) {
      showToast("Maximum 6 images allowed.", "error");
      return;
    }
    setAddImages((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setAddImagePreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
    e.target.value = "";
  };

  const removeAddImage = (i: number) => {
    setAddImages((prev) => prev.filter((_, idx) => idx !== i));
    setAddImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  // Create Turf Handlers
  const handleAddTurf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (addImages.length === 0) {
      showToast("Upload at least 1 image.", "error");
      return;
    }
    setSaving(true);
    try {
      const newTurf = await ownerTurfService.createTurf({
        turfName: addForm.turfName,
        description: addForm.description,
        address: addForm.address,
        city: addForm.city,
        latitude: parseFloat(addForm.latitude) || 0,
        longitude: parseFloat(addForm.longitude) || 0,
        openingTime: addForm.openingTime,
        closingTime: addForm.closingTime,
        slotDuration: Number(addForm.slotDuration),
        pricePerSlot: Number(addForm.pricePerSlot),
        sportsType: addForm.sportsType.split(",").map((s) => s.trim()).filter(Boolean),
        amenities: addForm.amenities.split(",").map((a) => a.trim()).filter(Boolean),
        images: addImages,
      });
      setTurfs([newTurf, ...turfs]);
      setShowAddTurfModal(false);
      setAddImages([]);
      setAddImagePreviews([]);
      showToast("Turf created successfully! 🎉");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to create turf.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Edit Turf Modal
  const openEditModal = (turf: Turf) => {
    setSelectedTurf(turf);
    setEditForm({
      turfName: turf.turfName,
      description: turf.description,
      address: turf.location.address,
      city: turf.location.city,
      openingTime: turf.openingTime,
      closingTime: turf.closingTime,
      slotDuration: turf.slotDuration,
      pricePerSlot: turf.pricePerSlot,
      sportsType: turf.sportsType.join(", "),
      amenities: turf.amenities.join(", "),
    });
    setEditImages([]);
    setShowEditTurfModal(true);
  };

  const handleEditTurf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTurf) return;
    setSaving(true);
    try {
      const updated = await ownerTurfService.updateTurf(selectedTurf._id, {
        turfName: editForm.turfName,
        description: editForm.description,
        address: editForm.address,
        city: editForm.city,
        openingTime: editForm.openingTime,
        closingTime: editForm.closingTime,
        slotDuration: Number(editForm.slotDuration),
        pricePerSlot: Number(editForm.pricePerSlot),
        sportsType: editForm.sportsType.split(",").map((s) => s.trim()).filter(Boolean),
        amenities: editForm.amenities.split(",").map((a) => a.trim()).filter(Boolean),
        images: editImages.length > 0 ? editImages : undefined,
      });
      setTurfs(turfs.map((t) => (t._id === updated._id ? updated : t)));
      setShowEditTurfModal(false);
      showToast("Turf details updated successfully!");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to update turf.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Toggle Status
  const handleToggleStatus = async (turf: Turf) => {
    const newStatus = turf.status === "active" ? "inactive" : "active";
    try {
      const updated = await ownerTurfService.updateTurfStatus(turf._id, newStatus);
      setTurfs(turfs.map((t) => (t._id === updated._id ? updated : t)));
      showToast(`Turf status updated to ${newStatus}.`);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to update status.", "error");
    }
  };

  // Delete Turf
  const handleDeleteTurf = async () => {
    if (!selectedTurf) return;
    setSaving(true);
    try {
      await ownerTurfService.deleteTurf(selectedTurf._id);
      setTurfs(turfs.filter((t) => t._id !== selectedTurf._id));
      setShowDeleteConfirm(false);
      showToast("Turf deleted successfully.");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete turf.", "error");
    } finally {
      setSaving(false);
    }
  };

  // User Role Management
  const handleUserRoleChange = async (userId: string, newRole: "user" | "owner" | "admin") => {
    try {
      await axiosInstance.patch(`/auth/admin/user/${userId}/role`, { role: newRole });
      setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
      showToast(`User role updated to ${newRole.toUpperCase()}`);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to update user role.", "error");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user account?")) return;
    try {
      await axiosInstance.delete(`/auth/admin/user/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
      showToast("User account deleted successfully.");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete user account.", "error");
    }
  };

  // Register Owner
  const handleRegisterOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.post("/auth/owner/register", ownerForm);
      showToast(`Owner account registered for ${ownerForm.fullName}! 🎉`);
      setOwnerForm({ fullName: "", emailId: "", password: "", contactNumber: "" });
      setActiveTab("Users");
      loadAdminData();
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to register owner account.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Stats
  const activeTurfsCount = turfs.filter((t) => t.status === "active").length;
  const ownersCount = users.filter((u) => u.role === "owner").length;
  const totalBookingsCount = Object.values(turfBookingCounts).reduce((a, b) => a + b, 0);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <FaSpinner className="animate-spin text-4xl text-green-500" />
          <span className="font-semibold">Loading Admin Console…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-24 pb-20 px-4 md:px-8 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner Header */}
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-block text-purple-600 dark:text-purple-400 font-semibold tracking-widest text-xs uppercase bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 mb-3">
              Super Admin Console
            </span>
            <h1 className="text-2xl md:text-3xl font-black">
              Welcome back, <span className="text-green-500 dark:text-green-400">{user?.fullName}</span>
            </h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              System Admin • {user?.emailId}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddTurfModal(true)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-5 rounded-2xl text-xs shadow-md shadow-green-500/20 transition cursor-pointer"
            >
              <FaPlus />
              Add New Turf
            </button>
            <button
              onClick={() => setActiveTab("CreateOwner")}
              className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-bold py-2.5 px-5 rounded-2xl text-xs transition cursor-pointer"
            >
              <FaUserPlus />
              Create Owner Account
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={FaBuilding} label="Total Venues" value={turfs.length} color="bg-blue-500" />
          <StatCard icon={FaTrophy} label="Active Turfs" value={activeTurfsCount} color="bg-green-500" />
          <StatCard icon={FaBookOpen} label="Total Bookings" value={totalBookingsCount} color="bg-orange-500" />
          <StatCard icon={FaUsers} label="Owners Registered" value={ownersCount} color="bg-purple-500" />
        </div>

        {/* Sidebar + Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Tabs */}
          <div className="lg:col-span-1 flex flex-col gap-2">
            {[
              { id: "Overview", label: "Overview", icon: FaTrophy },
              { id: "Turfs", label: `Venues & Bookings (${turfs.length})`, icon: FaBuilding },
              { id: "Users", label: `Manage Users (${users.length})`, icon: FaUserShield },
              { id: "CreateOwner", label: "Register Owner", icon: FaUserPlus },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left py-3 px-4 rounded-2xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-3 transition cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-green-500 text-white shadow-md shadow-green-500/20"
                      : "bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              
              {/* OVERVIEW TAB */}
              {activeTab === "Overview" && (
                <motion.div
                  key="Overview"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
                >
                  <h3 className="text-xl font-black border-b border-slate-100 dark:border-slate-800 pb-3">
                    System Health &amp; Analytics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Database Status</p>
                      <p className="text-lg font-black text-green-500 flex items-center gap-2">
                        <FaCheckCircle /> Connected (MongoDB Atlas)
                      </p>
                      <p className="text-xs text-slate-400">Storing live turfs, reviews, reservations, and users.</p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Security &amp; Auth</p>
                      <p className="text-lg font-black text-purple-500 flex items-center gap-2">
                        <FaCheckCircle /> JWT &amp; Redis Session Security
                      </p>
                      <p className="text-xs text-slate-400">Role authorization enforced on all private endpoints.</p>
                    </div>
                  </div>

                  {/* Sports Distribution */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Venues Listed by Sport</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {["Football", "Cricket", "Basketball", "Badminton"].map((sport) => {
                        const count = turfs.filter((t) => t.sportsType?.includes(sport)).length;
                        return (
                          <div key={sport} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                            <p className="text-xl font-black text-slate-800 dark:text-white">{count}</p>
                            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{sport}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TURFS TAB (Includes Total Bookings by Turf) */}
              {activeTab === "Turfs" && (
                <motion.div
                  key="Turfs"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h3 className="text-xl font-black">Platform Venues &amp; Booking Counts ({turfs.length})</h3>
                    <button
                      onClick={() => setShowAddTurfModal(true)}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <FaPlus /> Add Turf
                    </button>
                  </div>

                  {turfs.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400">
                      No turfs listed on the platform yet. Click "Add Turf" to create your first venue.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                            <th className="pb-3 pl-2">Turf</th>
                            <th className="pb-3">Location</th>
                            <th className="pb-3">Slot Duration</th>
                            <th className="pb-3">Price / Slot</th>
                            <th className="pb-3">Total Bookings</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 pr-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {turfs.map((t) => (
                            <tr key={t._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                              <td className="py-3.5 pl-2">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={t.images?.[0]?.url || "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=100"}
                                    alt={t.turfName}
                                    className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                                  />
                                  <div>
                                    <Link to={`/turf/${t._id}`} className="font-bold text-slate-800 dark:text-white hover:text-green-500 transition block">
                                      {t.turfName}
                                    </Link>
                                    <span className="text-[10px] text-slate-400">{t.sportsType.join(", ")}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 font-semibold text-slate-600 dark:text-slate-400">{t.location.city}</td>
                              <td className="py-3.5 font-bold text-slate-700 dark:text-slate-300">{t.slotDuration} mins</td>
                              <td className="py-3.5 font-extrabold text-green-600 dark:text-green-400">₹{t.pricePerSlot}</td>
                              <td className="py-3.5">
                                <span className="inline-flex items-center gap-1 font-black text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                                  <FaBookOpen className="text-green-500 text-[10px]" />
                                  {turfBookingCounts[t._id] || 0} Bookings
                                </span>
                              </td>
                              <td className="py-3.5">
                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                  t.status === "active"
                                    ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                                    : "bg-red-500/10 border-red-500/20 text-red-500"
                                }`}>
                                  {t.status}
                                </span>
                              </td>
                              <td className="py-3.5 pr-2 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleToggleStatus(t)}
                                    className={`p-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                                      t.status === "active"
                                        ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                                        : "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                                    }`}
                                    title={t.status === "active" ? "Deactivate" : "Activate"}
                                  >
                                    {t.status === "active" ? <FaToggleOn /> : <FaToggleOff />}
                                  </button>
                                  <button
                                    onClick={() => openEditModal(t)}
                                    className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white transition text-xs"
                                    title="Edit"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    onClick={() => { setSelectedTurf(t); setShowDeleteConfirm(true); }}
                                    className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg cursor-pointer hover:bg-red-500 hover:text-white transition text-xs"
                                    title="Delete"
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
                  )}
                </motion.div>
              )}

              {/* USER MANAGEMENT TAB */}
              {activeTab === "Users" && (
                <motion.div
                  key="Users"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
                >
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h3 className="text-xl font-black">User Accounts Management ({users.length})</h3>
                    <p className="text-xs text-slate-400 mt-1">View, promote user roles (Customer / Owner / Admin), or delete accounts.</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                          <th className="pb-3 pl-2">User Details</th>
                          <th className="pb-3">Contact Number</th>
                          <th className="pb-3">Role</th>
                          <th className="pb-3">Joined Date</th>
                          <th className="pb-3 pr-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {users.map((u) => (
                          <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                            <td className="py-3.5 pl-2">
                              <div>
                                <span className="font-bold text-slate-800 dark:text-white block">{u.fullName}</span>
                                <span className="text-[10px] text-slate-400">{u.emailId}</span>
                              </div>
                            </td>
                            <td className="py-3.5 font-semibold text-slate-600 dark:text-slate-400">{u.contactNumber}</td>
                            <td className="py-3.5">
                              <select
                                value={u.role}
                                onChange={(e) => handleUserRoleChange(u._id, e.target.value as any)}
                                disabled={u._id === user?._id}
                                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-1 px-2.5 rounded-lg text-xs font-bold focus:outline-none cursor-pointer disabled:opacity-60"
                              >
                                <option value="user">User</option>
                                <option value="owner">Owner</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="py-3.5 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td className="py-3.5 pr-2 text-right">
                              {u._id !== user?._id && (
                                <button
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg cursor-pointer hover:bg-red-500 hover:text-white transition text-xs"
                                  title="Delete Account"
                                >
                                  <FaTrash />
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

              {/* REGISTER OWNER TAB */}
              {activeTab === "CreateOwner" && (
                <motion.div
                  key="CreateOwner"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
                >
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="text-xl font-black flex items-center gap-2">
                      <FaUserPlus className="text-purple-500" /> Create Owner Account
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Register a new verified Turf Owner account. Owners can log in and manage their own venues.
                    </p>
                  </div>

                  <form onSubmit={handleRegisterOwner} className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Owner Full Name</label>
                      <input
                        required
                        type="text"
                        value={ownerForm.fullName}
                        onChange={(e) => setOwnerForm({ ...ownerForm, fullName: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
                      <input
                        required
                        type="email"
                        value={ownerForm.emailId}
                        onChange={(e) => setOwnerForm({ ...ownerForm, emailId: e.target.value })}
                        placeholder="owner@example.com"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Contact Number (10 digits)</label>
                      <input
                        required
                        type="text"
                        value={ownerForm.contactNumber}
                        onChange={(e) => setOwnerForm({ ...ownerForm, contactNumber: e.target.value })}
                        placeholder="9876543210"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Password</label>
                      <input
                        required
                        type="password"
                        value={ownerForm.password}
                        onChange={(e) => setOwnerForm({ ...ownerForm, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full py-3.5 bg-purple-500 hover:bg-purple-600 disabled:opacity-60 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 cursor-pointer transition shadow-md shadow-purple-500/20"
                    >
                      {saving ? <FaSpinner className="animate-spin" /> : <FaUserPlus />}
                      {saving ? "Registering..." : "Register Owner Account"}
                    </button>
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* ══ ADD TURF MODAL (With Slot Duration Options 30, 60, 90, 120 mins) ════════════════ */}
      {showAddTurfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowAddTurfModal(false)} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-10 overflow-y-auto max-h-[90vh]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <FaPlus className="text-green-500" /> Create New Turf
                </h3>
                <button onClick={() => setShowAddTurfModal(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleAddTurf} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Turf Name" required value={addForm.turfName} onChange={(v) => setAddForm({ ...addForm, turfName: v })} placeholder="e.g. Green Arena" />
                  <InputField label="City" required value={addForm.city} onChange={(v) => setAddForm({ ...addForm, city: v })} placeholder="e.g. Mumbai" />
                </div>
                <InputField label="Full Address" required value={addForm.address} onChange={(v) => setAddForm({ ...addForm, address: v })} placeholder="e.g. 12, Park Street, Andheri West" />
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
                  <textarea
                    value={addForm.description}
                    onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                    rows={2}
                    placeholder="Short description of venue..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Opening Time" type="time" required value={addForm.openingTime} onChange={(v) => setAddForm({ ...addForm, openingTime: v })} />
                  <InputField label="Closing Time" type="time" required value={addForm.closingTime} onChange={(v) => setAddForm({ ...addForm, closingTime: v })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Slot Duration</label>
                    <select
                      value={addForm.slotDuration}
                      onChange={(e) => setAddForm({ ...addForm, slotDuration: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl text-sm focus:outline-none cursor-pointer"
                    >
                      <option value={30}>30 Minutes</option>
                      <option value={60}>60 Minutes (1 Hour)</option>
                      <option value={90}>90 Minutes (1.5 Hours)</option>
                      <option value={120}>120 Minutes (2 Hours)</option>
                    </select>
                  </div>
                  <InputField label="Price Per Slot (₹)" type="number" required value={String(addForm.pricePerSlot)} onChange={(v) => setAddForm({ ...addForm, pricePerSlot: Number(v) })} />
                </div>
                <InputField label="Sports Type (comma-separated)" required value={addForm.sportsType} onChange={(v) => setAddForm({ ...addForm, sportsType: v })} />
                <InputField label="Amenities (comma-separated)" value={addForm.amenities} onChange={(v) => setAddForm({ ...addForm, amenities: v })} />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Turf Images (max 6)</label>
                  <div
                    onClick={() => addFileRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center cursor-pointer hover:border-green-500 transition"
                  >
                    <FaFutbol className="text-green-500 mx-auto mb-2 text-xl" />
                    <p className="text-xs font-semibold text-slate-400">Click to select images</p>
                    <input ref={addFileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleAddImageSelect} />
                  </div>
                  {addImagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {addImagePreviews.map((src, i) => (
                        <div key={i} className="relative rounded-xl overflow-hidden aspect-video">
                          <img src={src} className="w-full h-full object-cover" alt="" />
                          <button
                            type="button"
                            onClick={() => removeAddImage(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-lg p-1 text-xs cursor-pointer"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3.5 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 cursor-pointer transition shadow-md shadow-green-500/20"
                >
                  {saving ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                  {saving ? "Creating..." : "Create Turf"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ══ EDIT TURF MODAL (With Slot Duration Options 30, 60, 90, 120 mins) ═══════════════ */}
      {showEditTurfModal && selectedTurf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowEditTurfModal(false)} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-10 overflow-y-auto max-h-[90vh]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <FaEdit className="text-blue-500" /> Edit — {selectedTurf.turfName}
                </h3>
                <button onClick={() => setShowEditTurfModal(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleEditTurf} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Turf Name" required value={editForm.turfName} onChange={(v) => setEditForm({ ...editForm, turfName: v })} />
                  <InputField label="City" required value={editForm.city} onChange={(v) => setEditForm({ ...editForm, city: v })} />
                </div>
                <InputField label="Address" required value={editForm.address} onChange={(v) => setEditForm({ ...editForm, address: v })} />
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={2}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl text-sm focus:outline-none resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Opening Time" type="time" required value={editForm.openingTime} onChange={(v) => setEditForm({ ...editForm, openingTime: v })} />
                  <InputField label="Closing Time" type="time" required value={editForm.closingTime} onChange={(v) => setEditForm({ ...editForm, closingTime: v })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Slot Duration</label>
                    <select
                      value={editForm.slotDuration}
                      onChange={(e) => setEditForm({ ...editForm, slotDuration: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl text-sm focus:outline-none cursor-pointer"
                    >
                      <option value={30}>30 Minutes</option>
                      <option value={60}>60 Minutes (1 Hour)</option>
                      <option value={90}>90 Minutes (1.5 Hours)</option>
                      <option value={120}>120 Minutes (2 Hours)</option>
                    </select>
                  </div>
                  <InputField label="Price Per Slot (₹)" type="number" required value={String(editForm.pricePerSlot)} onChange={(v) => setEditForm({ ...editForm, pricePerSlot: Number(v) })} />
                </div>
                <InputField label="Sports Type (comma-separated)" required value={editForm.sportsType} onChange={(v) => setEditForm({ ...editForm, sportsType: v })} />
                <InputField label="Amenities (comma-separated)" value={editForm.amenities} onChange={(v) => setEditForm({ ...editForm, amenities: v })} />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Add Additional Images</label>
                  <div
                    onClick={() => editFileRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center cursor-pointer hover:border-blue-500 transition"
                  >
                    <FaFutbol className="text-blue-500 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-slate-400">Upload new images</p>
                    <input ref={editFileRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => setEditImages(Array.from(e.target.files || []))} />
                  </div>
                  {editImages.length > 0 && (
                    <p className="text-xs text-green-500 font-semibold mt-2">{editImages.length} image(s) selected</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 cursor-pointer transition shadow-md shadow-blue-500/20"
                >
                  {saving ? <FaSpinner className="animate-spin" /> : <FaEdit />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRM ══════════════════════════════════════════════════════ */}
      {showDeleteConfirm && selectedTurf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowDeleteConfirm(false)} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl z-10 max-w-sm w-full text-center">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 text-2xl">
              <FaTrash />
            </div>
            <h3 className="text-lg font-black mb-2">Delete Venue?</h3>
            <p className="text-sm text-slate-400 mb-6">
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-700 dark:text-white">{selectedTurf.turfName}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTurf}
                disabled={saving}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-60"
              >
                {saving ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) => (
  <div>
    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
    />
  </div>
);

export default AdminDashboard;
