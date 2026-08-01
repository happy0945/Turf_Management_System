import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaBuilding,
  FaRupeeSign,
  FaBookOpen,
  FaImage,
  FaTrash,
  FaPlus,
  FaUpload,
  FaCalendarAlt,
  FaEdit,
  FaTimes,
  FaToggleOn,
  FaToggleOff,
  FaChartBar,
  FaSpinner,
} from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { ownerTurfService } from "../../../services/ownerTurfService";
import type { Turf } from "../../../services/turfService";
import axiosInstance from "../../../lib/axios";

// ─── Types ───────────────────────────────────────────────────────────────────
interface OwnerBooking {
  _id: string;
  user: { fullName: string; emailId: string; contactNumber: string };
  turfId: { turfName: string };
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
}

// ─── Helper: toast ────────────────────────────────────────────────────────────
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

// ─── Stat Card ────────────────────────────────────────────────────────────────
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
    <div className={`p-3 rounded-xl ${color} text-white text-xl`}>
      <Icon />
    </div>
    <div>
      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
      <p className="text-xl font-black text-slate-800 dark:text-white">{value}</p>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════════════
const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();

  const [myTurfs, setMyTurfs] = useState<Turf[]>([]);
  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const [bookings, setBookings] = useState<OwnerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Modals ──────────────────────────────────────────────────────────────────
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ── Add Turf Form ───────────────────────────────────────────────────────────
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
    sportsType: "Football",
    amenities: "Floodlights, Drinking Water",
  });
  const [addImages, setAddImages] = useState<File[]>([]);
  const [addImagePreviews, setAddImagePreviews] = useState<string[]>([]);
  const addFileRef = useRef<HTMLInputElement>(null);

  // ── Edit Turf Form ──────────────────────────────────────────────────────────
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

  // ── Auth Guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn || !user) {
      navigate("/login");
      return;
    }
    if (user.role !== "owner" && user.role !== "admin") {
      showToast("Access denied. Owner account required.", "error");
      navigate("/");
      return;
    }
    // Load data
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, user, authLoading]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const turfs = await ownerTurfService.getMyTurfs();
      setMyTurfs(turfs);
      if (turfs.length > 0) {
        setSelectedTurf(turfs[0]);
        await loadBookingsForTurf(turfs[0]._id);
      }
    } catch {
      showToast("Failed to load your turfs.", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadBookingsForTurf = async (turfId: string) => {
    try {
      const res = await axiosInstance.get(`/booking/turf/${turfId}`);
      setBookings(res.data.data || []);
    } catch {
      setBookings([]);
    }
  };

  const handleSelectTurf = async (turf: Turf) => {
    setSelectedTurf(turf);
    await loadBookingsForTurf(turf._id);
  };

  // ── Add Images ──────────────────────────────────────────────────────────────
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

  // ── Add Turf Submit ─────────────────────────────────────────────────────────
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
      const updated = [newTurf, ...myTurfs];
      setMyTurfs(updated);
      setSelectedTurf(newTurf);
      await loadBookingsForTurf(newTurf._id);
      setShowAddModal(false);
      setAddImages([]);
      setAddImagePreviews([]);
      setAddForm({
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
        sportsType: "Football",
        amenities: "Floodlights, Drinking Water",
      });
      showToast("Turf created successfully! 🎉");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to create turf.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Open Edit Modal ─────────────────────────────────────────────────────────
  const openEditModal = () => {
    if (!selectedTurf) return;
    setEditForm({
      turfName: selectedTurf.turfName,
      description: selectedTurf.description,
      address: selectedTurf.location.address,
      city: selectedTurf.location.city,
      openingTime: selectedTurf.openingTime,
      closingTime: selectedTurf.closingTime,
      slotDuration: selectedTurf.slotDuration,
      pricePerSlot: selectedTurf.pricePerSlot,
      sportsType: selectedTurf.sportsType.join(", "),
      amenities: selectedTurf.amenities.join(", "),
    });
    setEditImages([]);
    setShowEditModal(true);
  };

  // ── Edit Turf Submit ────────────────────────────────────────────────────────
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
      const updatedList = myTurfs.map((t) => (t._id === updated._id ? updated : t));
      setMyTurfs(updatedList);
      setSelectedTurf(updated);
      setShowEditModal(false);
      showToast("Turf updated successfully!");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to update turf.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle Status ────────────────────────────────────────────────────────────
  const handleToggleStatus = async () => {
    if (!selectedTurf) return;
    const newStatus = selectedTurf.status === "active" ? "inactive" : "active";
    try {
      const updated = await ownerTurfService.updateTurfStatus(selectedTurf._id, newStatus);
      const updatedList = myTurfs.map((t) => (t._id === updated._id ? updated : t));
      setMyTurfs(updatedList);
      setSelectedTurf(updated);
      showToast(`Turf is now ${newStatus}.`);
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to update status.", "error");
    }
  };

  // ── Delete Turf ──────────────────────────────────────────────────────────────
  const handleDeleteTurf = async () => {
    if (!selectedTurf) return;
    setSaving(true);
    try {
      await ownerTurfService.deleteTurf(selectedTurf._id);
      const remaining = myTurfs.filter((t) => t._id !== selectedTurf._id);
      setMyTurfs(remaining);
      setSelectedTurf(remaining[0] || null);
      setBookings([]);
      if (remaining[0]) await loadBookingsForTurf(remaining[0]._id);
      setShowDeleteConfirm(false);
      showToast("Turf deleted.", "success");
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Failed to delete turf.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Stats ─────────────────────────────────────────────────────────────────────
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const totalRevenue = confirmedBookings.reduce((s, b) => s + b.totalAmount, 0);

  // ── Loading/Redirecting ───────────────────────────────────────────────────────
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <FaSpinner className="animate-spin text-4xl text-green-500" />
          <span className="font-semibold">Loading Dashboard…</span>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-24 pb-20 px-4 md:px-8 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-block text-green-600 dark:text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 mb-3">
              {user?.role === "admin" ? "Admin" : "Turf Owner"} Dashboard
            </span>
            <h1 className="text-2xl md:text-3xl font-black">
              Welcome back,{" "}
              <span className="text-green-500 dark:text-green-400">{user?.fullName}</span>
            </h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              {user?.emailId} • {myTurfs.length} Turf{myTurfs.length !== 1 ? "s" : ""} Managed
            </p>

            {/* Turf selector */}
            {myTurfs.length > 1 && (
              <div className="flex items-center gap-3 mt-4">
                <span className="text-xs font-bold text-slate-400">Viewing:</span>
                <select
                  value={selectedTurf?._id || ""}
                  onChange={(e) => {
                    const t = myTurfs.find((t) => t._id === e.target.value);
                    if (t) handleSelectTurf(t);
                  }}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-1.5 px-3 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                  {myTurfs.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.turfName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-5 rounded-2xl text-xs shadow-md shadow-green-500/20 transition cursor-pointer"
            >
              <FaPlus />
              Add New Turf
            </button>
            {selectedTurf && (
              <>
                <button
                  onClick={openEditModal}
                  className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold py-2.5 px-5 rounded-2xl text-xs transition cursor-pointer"
                >
                  <FaEdit />
                  Edit Turf
                </button>
                <button
                  onClick={handleToggleStatus}
                  className={`flex items-center gap-2 font-bold py-2.5 px-5 rounded-2xl text-xs border transition cursor-pointer ${
                    selectedTurf.status === "active"
                      ? "bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                      : "bg-green-500/10 hover:bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/20"
                  }`}
                >
                  {selectedTurf.status === "active" ? <FaToggleOn /> : <FaToggleOff />}
                  {selectedTurf.status === "active" ? "Set Inactive" : "Set Active"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold py-2.5 px-5 rounded-2xl text-xs transition cursor-pointer"
                >
                  <FaTrash />
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* ── No Turf yet ─────────────────────────────────────────────── */}
        {myTurfs.length === 0 && (
          <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center shadow-sm max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500 text-2xl">
              <FaBuilding />
            </div>
            <h3 className="text-xl font-black">No Turfs Yet</h3>
            <p className="text-slate-400 text-sm">
              You haven't added any turfs yet. Click "Add New Turf" to get started!
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-2xl text-xs shadow-md cursor-pointer transition"
            >
              <FaPlus />
              Register Your First Turf
            </button>
          </div>
        )}

        {/* ── Dashboard Panels (when turf selected) ─────────────────────── */}
        {selectedTurf && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={FaBuilding} label="Turf Name" value={selectedTurf.turfName} color="bg-blue-500" />
              <StatCard icon={FaRupeeSign} label="Price / Slot" value={`₹${selectedTurf.pricePerSlot}`} color="bg-green-500" />
              <StatCard icon={FaBookOpen} label="Total Bookings" value={bookings.length} color="bg-purple-500" />
              <StatCard icon={FaChartBar} label="Revenue (Confirmed)" value={`₹${totalRevenue.toLocaleString()}`} color="bg-orange-500" />
            </div>

            {/* Turf Details Card */}
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              {/* Images row */}
              {selectedTurf.images.length > 0 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {selectedTurf.images.map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt={`turf-${i}`}
                      className="h-32 w-48 object-cover rounded-xl flex-shrink-0"
                    />
                  ))}
                </div>
              )}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Location</p>
                  <p className="font-bold text-slate-700 dark:text-slate-200">{selectedTurf.location.address}</p>
                  <p className="text-xs text-slate-400">{selectedTurf.location.city}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Hours</p>
                  <p className="font-bold text-slate-700 dark:text-slate-200">
                    {selectedTurf.openingTime} – {selectedTurf.closingTime}
                  </p>
                  <p className="text-xs text-slate-400">{selectedTurf.slotDuration} min slots</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Sports</p>
                  <p className="font-bold text-slate-700 dark:text-slate-200">
                    {selectedTurf.sportsType.join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${
                      selectedTurf.status === "active"
                        ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                        : "bg-red-500/10 border-red-500/20 text-red-500"
                    }`}
                  >
                    {selectedTurf.status}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTurf.amenities.map((a) => (
                      <span
                        key={a}
                        className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-lg"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-black flex items-center gap-2 mb-5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <FaCalendarAlt className="text-green-500" />
                Bookings for {selectedTurf.turfName}
              </h3>
              {bookings.length === 0 ? (
                <div className="text-center py-14 text-slate-400 font-semibold border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  No bookings yet for this turf.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                        <th className="pb-3 pl-2">Player</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Slot</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3 pr-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {bookings.map((b) => (
                        <tr key={b._id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                          <td className="py-3.5 pl-2">
                            <span className="font-bold block text-slate-800 dark:text-white">
                              {b.user?.fullName}
                            </span>
                            <span className="text-[10px] text-slate-400">{b.user?.emailId}</span>
                          </td>
                          <td className="py-3.5 font-semibold text-slate-600 dark:text-slate-400">
                            {new Date(b.bookingDate).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 font-semibold text-slate-600 dark:text-slate-400">
                            {b.startTime} – {b.endTime}
                          </td>
                          <td className="py-3.5 font-extrabold text-green-600 dark:text-green-400">
                            ₹{b.totalAmount}
                          </td>
                          <td className="py-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                b.paymentStatus === "paid"
                                  ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                                  : "bg-yellow-500/10 border-yellow-500/20 text-yellow-600"
                              }`}
                            >
                              {b.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3.5 pr-2 text-right">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                                b.status === "confirmed"
                                  ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                                  : b.status === "cancelled"
                                  ? "bg-red-500/10 border-red-500/20 text-red-500"
                                  : "bg-yellow-500/10 border-yellow-500/20 text-yellow-600"
                              }`}
                            >
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
          </>
        )}
      </div>

      {/* ══ ADD TURF MODAL ══════════════════════════════════════════════════════ */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowAddModal(false)}
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-10 overflow-y-auto max-h-[90vh]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <FaPlus className="text-green-500" /> Register New Turf
                </h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
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
                    placeholder="Short description of the turf..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-sm resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputField label="Latitude (optional)" value={addForm.latitude} onChange={(v) => setAddForm({ ...addForm, latitude: v })} placeholder="e.g. 19.076090" />
                  <InputField label="Longitude (optional)" value={addForm.longitude} onChange={(v) => setAddForm({ ...addForm, longitude: v })} placeholder="e.g. 72.877426" />
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
                <InputField label="Sports Type (comma-separated)" required value={addForm.sportsType} onChange={(v) => setAddForm({ ...addForm, sportsType: v })} placeholder="e.g. Football, Cricket" />
                <InputField label="Amenities (comma-separated)" value={addForm.amenities} onChange={(v) => setAddForm({ ...addForm, amenities: v })} placeholder="e.g. Floodlights, Parking" />

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Turf Images (max 6)
                  </label>
                  <div
                    onClick={() => addFileRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center cursor-pointer hover:border-green-500 transition"
                  >
                    <FaUpload className="text-green-500 mx-auto mb-2 text-xl" />
                    <p className="text-xs font-semibold text-slate-400">
                      Click to upload images
                    </p>
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

      {/* ══ EDIT TURF MODAL ════════════════════════════════════════════════════ */}
      {showEditModal && selectedTurf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowEditModal(false)} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-10 overflow-y-auto max-h-[90vh]">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black flex items-center gap-2">
                  <FaEdit className="text-blue-500" /> Edit — {selectedTurf.turfName}
                </h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
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
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-sm resize-none"
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

                {/* Add more images */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Add More Images (optional)
                  </label>
                  <div
                    onClick={() => editFileRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center cursor-pointer hover:border-blue-500 transition"
                  >
                    <FaImage className="text-blue-500 mx-auto mb-1" />
                    <p className="text-xs font-semibold text-slate-400">Upload additional images</p>
                    <input ref={editFileRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => setEditImages(Array.from(e.target.files || []))} />
                  </div>
                  {editImages.length > 0 && (
                    <p className="text-xs text-green-500 font-semibold mt-2">{editImages.length} new image(s) selected</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 cursor-pointer transition"
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
            <h3 className="text-lg font-black mb-2">Delete Turf?</h3>
            <p className="text-sm text-slate-400 mb-6">
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-700 dark:text-white">{selectedTurf.turfName}</strong>? This
              cannot be undone.
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

      {/* ── Toast ─────────────────────────────────────────────────────────────── */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

// ── Reusable input ─────────────────────────────────────────────────────────────
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
    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
    />
  </div>
);

export default OwnerDashboard;
