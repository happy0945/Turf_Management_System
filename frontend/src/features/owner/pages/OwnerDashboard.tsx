import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaBuilding,
  FaDollarSign,
  FaBookOpen,
  FaImage,
  FaTrash,
  FaPlus,
  FaUpload,
  FaCalendarAlt,
} from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
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

const OwnerDashboard = () => {
  const navigate = useNavigate();

  // Logged-in owner info
  const [ownerUser, setOwnerUser] = useState<UserItem | null>(null);
  const [myTurfs, setMyTurfs] = useState<TurfItem[]>([]);
  const [selectedTurf, setSelectedTurf] = useState<TurfItem | null>(null);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [showAddTurfModal, setShowAddTurfModal] = useState(false);

  // Turf editing form state
  const [turfForm, setTurfForm] = useState({
    name: "",
    location: "",
    pricePerHour: 50,
    sport: "Cricket" as TurfItem["sport"],
    amenities: "",
  });

  // Add new turf form state
  const [newTurfFormData, setNewTurfFormData] = useState({
    name: "",
    location: "",
    pricePerHour: 50,
    sport: "Cricket" as TurfItem["sport"],
    amenities: "Drinking Water, Floodlights",
  });

  const [uploadedRegisterImages, setUploadedRegisterImages] = useState<string[]>([]);

  // Multiple images state
  const [imageList, setImageList] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    // 1. Auth check
    const token = localStorage.getItem("userToken");
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");

    if (!token || role !== "owner" || !email) {
      alert("Unauthorized Access. Turf Owner credentials required.");
      navigate("/login");
      return;
    }

    // 2. Fetch owner user record
    const loadedUsers: UserItem[] = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const matchedOwner = loadedUsers.find((u) => u.email.trim().toLowerCase() === email.trim().toLowerCase());

    if (matchedOwner) {
      setOwnerUser(matchedOwner);

      // Fetch turfs
      const loadedTurfs: TurfItem[] = JSON.parse(localStorage.getItem("turfCatalogData") || "[]");
      const filteredMyTurfs = loadedTurfs.filter((t) => (t.ownerId && t.ownerId.trim().toLowerCase() === email.trim().toLowerCase()) || t.id === matchedOwner.ownedTurfId);
      setMyTurfs(filteredMyTurfs);

      const initialTurf = filteredMyTurfs.find((t) => t.id === matchedOwner.ownedTurfId) || filteredMyTurfs[0] || null;
      if (initialTurf) {
        setSelectedTurf(initialTurf);
        setTurfForm({
          name: initialTurf.name,
          location: initialTurf.location,
          pricePerHour: initialTurf.pricePerHour,
          sport: initialTurf.sport,
          amenities: initialTurf.amenities.join(", "),
        });
        setImageList(initialTurf.images || [initialTurf.image]);
      }

      // Fetch bookings for ALL of my turfs
      const myTurfIds = filteredMyTurfs.map((t) => t.id);
      const loadedBookings: BookingItem[] = JSON.parse(localStorage.getItem("bookings") || "[]");
      const turfBookings = loadedBookings.filter((b) => myTurfIds.includes(b.turfId));
      setBookings(turfBookings);
    }
  }, [navigate]);

  const handleSelectTurfChange = (id: number) => {
    const matched = myTurfs.find((t) => t.id === id);
    if (matched) {
      setSelectedTurf(matched);
      setTurfForm({
        name: matched.name,
        location: matched.location,
        pricePerHour: matched.pricePerHour,
        sport: matched.sport,
        amenities: matched.amenities.join(", "),
      });
      setImageList(matched.images || [matched.image]);
    }
  };

  // Handle local image file uploads and read them as Base64 strings
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (imageList.length + files.length > 20) {
      alert("Error: You can upload a maximum of 20 images. (Currently have " + imageList.length + ")");
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Url = uploadEvent.target?.result as string;
        if (base64Url) {
          setImageList((prev) => {
            const updated = [...prev, base64Url];
            // Auto save to database
            saveImagesToDatabase(updated);
            return updated;
          });
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = ""; // reset input file value
  };

  const handleRegisterImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (uploadedRegisterImages.length + files.length > 20) {
      alert("Error: You can upload a maximum of 20 images.");
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Url = uploadEvent.target?.result as string;
        if (base64Url) {
          setUploadedRegisterImages((prev) => {
            if (prev.length >= 20) return prev;
            return [...prev, base64Url];
          });
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  // Add external image URL
  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageList.length >= 20) {
      alert("Error: You can add a maximum of 20 images.");
      return;
    }
    if (newImageUrl.trim()) {
      setImageList((prev) => {
        const updated = [...prev, newImageUrl.trim()];
        saveImagesToDatabase(updated);
        return updated;
      });
      setNewImageUrl("");
    }
  };

  // Remove image from gallery
  const handleRemoveImage = (index: number) => {
    if (imageList.length <= 2) {
      alert("Error: A turf must have at least 2 gallery images.");
      return;
    }
    setImageList((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      saveImagesToDatabase(updated);
      return updated;
    });
  };

  // Sync images to database
  const saveImagesToDatabase = (updatedImages: string[]) => {
    if (!selectedTurf) return;
    const loadedTurfs: TurfItem[] = JSON.parse(localStorage.getItem("turfCatalogData") || "[]");
    const updated = loadedTurfs.map((t) => {
      if (t.id === selectedTurf.id) {
        return {
          ...t,
          image: updatedImages[0] || t.image, // update primary image with first item
          images: updatedImages,
        };
      }
      return t;
    });
    localStorage.setItem("turfCatalogData", JSON.stringify(updated));
    setSelectedTurf({
      ...selectedTurf,
      image: updatedImages[0] || selectedTurf.image,
      images: updatedImages,
    });
    setMyTurfs(myTurfs.map(t => t.id === selectedTurf.id ? { ...t, image: updatedImages[0] || t.image, images: updatedImages } : t));
  };

  // Save Turf form changes
  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTurf) return;

    const parsedAmenities = turfForm.amenities
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    const loadedTurfs: TurfItem[] = JSON.parse(localStorage.getItem("turfCatalogData") || "[]");
    const updated = loadedTurfs.map((t) => {
      if (t.id === selectedTurf.id) {
        return {
          ...t,
          name: turfForm.name,
          location: turfForm.location,
          pricePerHour: Number(turfForm.pricePerHour),
          sport: turfForm.sport,
          amenities: parsedAmenities,
        };
      }
      return t;
    });

    localStorage.setItem("turfCatalogData", JSON.stringify(updated));
    const updatedTurfObj = {
      ...selectedTurf,
      name: turfForm.name,
      location: turfForm.location,
      pricePerHour: Number(turfForm.pricePerHour),
      sport: turfForm.sport,
      amenities: parsedAmenities,
    };
    setSelectedTurf(updatedTurfObj);
    setMyTurfs(myTurfs.map(t => t.id === selectedTurf.id ? updatedTurfObj : t));
    alert("Turf details updated successfully!");
  };

  // Add new turf handler
  const handleSaveNewTurf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerUser) return;

    if (uploadedRegisterImages.length < 2) {
      alert("Error: You must upload at least 2 images for the turf.");
      return;
    }
    if (uploadedRegisterImages.length > 20) {
      alert("Error: You can upload a maximum of 20 images.");
      return;
    }

    const parsedAmenities = newTurfFormData.amenities
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");

    const loadedTurfs: TurfItem[] = JSON.parse(localStorage.getItem("turfCatalogData") || "[]");
    const newId = loadedTurfs.length > 0 ? Math.max(...loadedTurfs.map((t) => t.id)) + 1 : 1;

    const newTurf: TurfItem = {
      id: newId,
      name: newTurfFormData.name,
      location: newTurfFormData.location,
      pricePerHour: Number(newTurfFormData.pricePerHour),
      sport: newTurfFormData.sport,
      rating: 5.0,
      image: uploadedRegisterImages[0] || "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=600&auto=format&fit=crop",
      images: uploadedRegisterImages,
      amenities: parsedAmenities,
      ownerId: ownerUser.email,
    };

    const updatedCatalog = [...loadedTurfs, newTurf];
    localStorage.setItem("turfCatalogData", JSON.stringify(updatedCatalog));

    // Update user ownedTurfId in registeredUsers if they didn't have one before
    const loadedUsers: UserItem[] = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
    const updatedUsers = loadedUsers.map((u) => {
      if (u.email === ownerUser.email && u.ownedTurfId === undefined) {
        return { ...u, ownedTurfId: newId };
      }
      return u;
    });
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

    const updatedMyTurfs = [...myTurfs, newTurf];
    setMyTurfs(updatedMyTurfs);
    setSelectedTurf(newTurf);
    setTurfForm({
      name: newTurf.name,
      location: newTurf.location,
      pricePerHour: newTurf.pricePerHour,
      sport: newTurf.sport,
      amenities: newTurf.amenities.join(", "),
    });
    setImageList(newTurf.images || []);

    // Refresh bookings for the updated set of owned turfs
    const myTurfIds = updatedMyTurfs.map((t) => t.id);
    const loadedBookings: BookingItem[] = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(loadedBookings.filter((b) => myTurfIds.includes(b.turfId)));

    setShowAddTurfModal(false);
    setUploadedRegisterImages([]);
    alert("New turf registered successfully!");
  };

  // Stats
  const confirmedBookings = bookings.filter((b) => b.status === "Confirmed");
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.amount, 0);

  if (!ownerUser) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading Dashboard...</div>
      </div>
    );
  }

  const isPending = ownerUser.status === "Pending";
  const isRejected = ownerUser.status === "Rejected";
  const isVerified = ownerUser.status === "Verified";

  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500 min-h-screen pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Profile Header (Showing Owner Name on Top) */}
        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-205 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <span className="text-green-600 dark:text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              Turf Owner Account
            </span>
            <h1 className="text-3xl font-black mt-3">
              Welcome back, <span className="text-green-500 dark:text-green-400 font-black">{ownerUser.username}</span>
            </h1>
            <p className="text-xs text-slate-400 font-semibold uppercase mt-1">
              Business: {ownerUser.businessName || "Personal"} • Email: {ownerUser.email}
            </p>
            {isVerified && myTurfs.length > 0 && (
              <div className="flex items-center gap-3 mt-4">
                <span className="text-xs font-bold text-slate-400">Managing Venue:</span>
                <select
                  value={selectedTurf?.id || ""}
                  onChange={(e) => handleSelectTurfChange(Number(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-1.5 px-3.5 rounded-xl text-xs font-bold focus:outline-none"
                >
                  {myTurfs.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {isVerified && (
              <button
                onClick={() => {
                  setNewTurfFormData({
                    name: "",
                    location: "",
                    pricePerHour: 50,
                    sport: "Football",
                    amenities: "Drinking Water, Floodlights",
                  });
                  setUploadedRegisterImages([]);
                  setShowAddTurfModal(true);
                }}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 px-5 rounded-2xl text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-green-500/10 transition"
              >
                <FaPlus />
                <span>Add Turf</span>
              </button>
            )}

            {isVerified && (
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4.5 py-2.5 rounded-2xl text-green-600 dark:text-green-400 text-sm font-black shadow-sm">
                <FaCheckCircle className="text-base" />
                <span>Verified Account</span>
              </div>
            )}
            {isPending && (
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4.5 py-2.5 rounded-2xl text-yellow-600 dark:text-yellow-400 text-sm font-black shadow-sm">
                <FaExclamationTriangle className="text-base animate-pulse" />
                <span>Verification Pending</span>
              </div>
            )}
            {isRejected && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4.5 py-2.5 rounded-2xl text-red-600 dark:text-red-400 text-sm font-black shadow-sm">
                <FaTimesCircle className="text-base" />
                <span>Verification Rejected</span>
              </div>
            )}
          </div>
        </div>        {/* Dashboard Workspaces (Depends on Verification Status) */}
        {!isVerified ? (
          /* PENDING / REJECTED STATUS SCREEN */
          <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl max-w-2xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mx-auto text-yellow-500 text-2xl">
              <FaExclamationTriangle />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">
              {isPending ? "Account Under Review" : "Account Verification Rejected"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              {isPending
                ? "Your owner profile registration is currently pending verification review by our Administrators. We are inspecting your license ID and business address details. You will get full access to manage your turf slots and photo galleries once verified. Thank you!"
                : "Your owner verification credentials have been rejected by the administrator console. Please contact support or register again with valid business documents."}
            </p>
          </div>
        ) : !selectedTurf ? (
          /* NO TURF ASSIGNED SCREEN */
          <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-205 dark:border-slate-800 rounded-3xl p-8 shadow-xl max-w-2xl mx-auto text-center space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500 text-2xl">
              <FaBuilding />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">
              No Turf Assigned Yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Your account has been fully verified! However, you do not manage a turf yet.
              You can wait for an administrator to assign an existing turf to your account, or claim/initialize your own turf now.
            </p>
            <button
              onClick={() => {
                setNewTurfFormData({
                  name: `${ownerUser.username}'s Turf Arena`,
                  location: ownerUser.businessAddress || "TBD Address",
                  pricePerHour: 50,
                  sport: "Football",
                  amenities: "Drinking Water, Floodlights",
                });
                setUploadedRegisterImages([]);
                setShowAddTurfModal(true);
              }}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-green-500/10 mx-auto"
            >
              <FaPlus />
              <span>Register & Build Your First Turf</span>
            </button>
          </div>
        ) : (
          /* ACTIVE VERIFIED OWNER WORKSPACE */
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Analytics Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Turf Name", val: selectedTurf.name, sub: selectedTurf.location, icon: FaBuilding, col: "text-blue-500" },
                { label: "Total Bookings", val: bookings.length, sub: "Reservations count", icon: FaBookOpen, col: "text-purple-500" },
                { label: "Total Revenue", val: `$${totalRevenue}.00`, sub: "Calculated earnings", icon: FaDollarSign, col: "text-green-500" },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-205 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
                        {stat.label}
                      </span>
                      <span className="text-xl font-black block truncate max-w-[200px]">{stat.val}</span>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[200px]">{stat.sub}</span>
                    </div>
                    <div className={`p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl text-xl ${stat.col}`}>
                      <Icon />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Layout Workspaces Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Edit Details Form */}
              <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <h3 className="text-xl font-black border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
                  <FaBuilding className="text-green-500 text-sm" />
                  <span>Update Turf Specifications</span>
                </h3>

                <form onSubmit={handleSaveDetails} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Turf Arena Name</label>
                    <input
                      required
                      type="text"
                      value={turfForm.name}
                      onChange={(e) => setTurfForm({ ...turfForm, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-3 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Venue Address / Location</label>
                    <input
                      required
                      type="text"
                      value={turfForm.location}
                      onChange={(e) => setTurfForm({ ...turfForm, location: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-3 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Hourly Fee ($)</label>
                      <input
                        required
                        type="number"
                        value={turfForm.pricePerHour}
                        onChange={(e) => setTurfForm({ ...turfForm, pricePerHour: Number(e.target.value) })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-3 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Primary Sport</label>
                      <select
                        value={turfForm.sport}
                        onChange={(e) => setTurfForm({ ...turfForm, sport: e.target.value as any })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-slate-850 dark:text-slate-200 py-3 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500"
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
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Amenities (comma-separated)</label>
                    <input
                      type="text"
                      value={turfForm.amenities}
                      onChange={(e) => setTurfForm({ ...turfForm, amenities: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-3 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500"
                      placeholder="e.g. Drinking Water, Floodlights"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-green-500/10 transition"
                  >
                    Save Specifications
                  </button>
                </form>
              </div>

              {/* Right Column: Multiple Images Manager */}
              <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-205 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <h3 className="text-xl font-black border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FaImage className="text-green-500 text-sm" />
                    <span>Turf Photo Gallery</span>
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    imageList.length >= 2 && imageList.length <= 20
                      ? "bg-green-500/10 text-green-550 dark:text-green-400"
                      : "bg-red-500/10 text-red-550 dark:text-red-400"
                  }`}>
                    {imageList.length} / 20 Images
                  </span>
                </h3>
                <p className="text-[10px] text-slate-450 dark:text-slate-500 -mt-3.5 block font-bold">
                  A minimum of 2 and a maximum of 20 images are required.
                </p>

                {/* Local image uploader button */}
                <div className="bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto text-lg">
                    <FaUpload />
                  </div>
                  <div>
                    <span className="font-bold text-xs block">Upload Venue Images</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Select image files from your computer</span>
                  </div>
                  <label className="inline-block py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-[10px] cursor-pointer shadow-sm">
                    Browse Files
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleLocalImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* External URL adder */}
                <form onSubmit={handleAddImageUrl} className="flex gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Or paste external image URL..."
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl text-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl cursor-pointer"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </form>

                {/* Thumbnail list */}
                <div className="grid grid-cols-4 gap-3.5 pt-2">
                  {imageList.map((img, index) => (
                    <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group">
                      <img src={img} alt="turf preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute inset-0 bg-red-650/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center text-white cursor-pointer"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>            {/* Bottom Row: Bookings List Schedule */}
            <div className="bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
              <h3 className="text-xl font-black border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2 mb-6">
                <FaCalendarAlt className="text-green-500 text-sm" />
                <span>Your Turf Bookings Schedule</span>
              </h3>

              {bookings.length === 0 ? (
                <div className="text-center py-16 bg-slate-55/10 dark:bg-slate-955/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-850">
                  <p className="text-slate-400 dark:text-slate-500 font-semibold">No bookings have been scheduled for your turf yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-205 dark:border-slate-800 text-slate-400 uppercase font-bold tracking-wider">
                        <th className="pb-3 pl-2">Reference</th>
                        <th className="pb-3">Booking Date</th>
                        <th className="pb-3">Time Slot</th>
                        <th className="pb-3">Player details</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3 pr-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                      {bookings.map((b) => (
                        <tr key={b.reference} className="hover:bg-slate-50 dark:hover:bg-white/5 transition">
                          <td className="py-4 pl-2 font-extrabold text-slate-800 dark:text-white">{b.reference}</td>
                          <td className="py-4 font-semibold text-slate-600 dark:text-slate-400">{b.date}</td>
                          <td className="py-4 font-semibold text-slate-605 dark:text-slate-400">{b.slotTime}</td>
                          <td className="py-4">
                            <span className="font-bold block">{b.playerName}</span>
                            <span className="text-[10px] text-slate-400">{b.playerEmail}</span>
                          </td>
                          <td className="py-4 font-extrabold text-green-600 dark:text-green-400">${b.amount}</td>
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

          </div>
        )}


      {/* Add Turf Modal Overlay */}
      <AnimatePresence>
        {showAddTurfModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              onClick={() => setShowAddTurfModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
            />
            {/* Card Content */}
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl z-10 text-slate-800 dark:text-slate-200 animate-in zoom-in-95 duration-250">
              <h3 className="text-xl font-black mb-4">
                Register New Turf
              </h3>

              <form onSubmit={handleSaveNewTurf} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Turf Name</label>
                  <input
                    required
                    type="text"
                    value={newTurfFormData.name}
                    onChange={(e) => setNewTurfFormData({ ...newTurfFormData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl focus:outline-none"
                    placeholder="e.g. Stamford Pitch"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Location Address</label>
                  <input
                    required
                    type="text"
                    value={newTurfFormData.location}
                    onChange={(e) => setNewTurfFormData({ ...newTurfFormData, location: e.target.value })}
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
                      value={newTurfFormData.pricePerHour}
                      onChange={(e) => setNewTurfFormData({ ...newTurfFormData, pricePerHour: Number(e.target.value) })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Sport Type</label>
                    <select
                      value={newTurfFormData.sport}
                      onChange={(e) => setNewTurfFormData({ ...newTurfFormData, sport: e.target.value as any })}
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Upload Turf Images (2 to 20 images required)
                  </label>
                  <div className="bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-center space-y-3">
                    <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto text-base">
                      <FaUpload />
                    </div>
                    <div>
                      <span className="font-bold text-[11px] block">Select Local Files</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">JPEG, PNG formats supported</span>
                    </div>
                    <label className="inline-block py-2 px-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg text-[10px] cursor-pointer shadow-sm">
                      Browse Files
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleRegisterImagesUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {/* Preview of uploaded files */}
                  {uploadedRegisterImages.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-3 max-h-24 overflow-y-auto p-1.5 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800">
                      {uploadedRegisterImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 group">
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setUploadedRegisterImages((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute inset-0 bg-red-650/80 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] cursor-pointer"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className={`text-[10px] mt-1 font-semibold ${
                    uploadedRegisterImages.length >= 2 && uploadedRegisterImages.length <= 20
                      ? "text-green-500"
                      : "text-red-550 dark:text-red-400"
                  }`}>
                    Currently uploaded: {uploadedRegisterImages.length} images (Min 2, max 20).
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Amenities (Comma separated)</label>
                  <input
                    type="text"
                    value={newTurfFormData.amenities}
                    onChange={(e) => setNewTurfFormData({ ...newTurfFormData, amenities: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-2.5 px-4 rounded-xl focus:outline-none"
                    placeholder="Drinking Water, Changing Rooms"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-xs cursor-pointer shadow-md shadow-green-500/10"
                  >
                    Save Turf
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTurfModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold py-3 rounded-xl text-xs cursor-pointer text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>

      </div>
    </div>
  );
};

export default OwnerDashboard;
