import React, { useEffect, useRef, useState, useContext } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Select from "react-select";
import axios from "axios"; // Import axios for API calls
import fasilitasData from "../data/fasilitas_spbu.json"; // Import the facilities data
import { BsFillFuelPumpFill, BsBagFill, BsWind, BsShop, BsTools, BsCupHotFill, BsCreditCard2BackFill, BsDropletFill, BsSpeedometer, BsArrowLeftRight, BsPaypal } from "react-icons/bs";
import { FaMosque, FaSolarPanel, FaLeaf, FaOilCan, FaToilet, FaChargingStation } from "react-icons/fa";
import { HiOutlineX } from "react-icons/hi"; // Import the HiOutlineX icon
import LegendBox from "./components/LegendBox";
import { HiOutlinePencil } from "react-icons/hi";
import { AuthContext } from "./context/AuthContext";

const PetaSebaranSPBU = () => {
  const mapRef = useRef(null);
  const [spbuData, setSpbuData] = useState([]);
  const [selectedSPBU, setSelectedSPBU] = useState(null);
  const [filter, setFilter] = useState("All");
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [showTabs, setShowTabs] = useState(true);
  const { user } = useContext(AuthContext);
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [numberOfReviews, setNumberOfReviews] = useState(0);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageRotationInterval, setImageRotationInterval] = useState(null);

  const facilityOptions = [
    { value: "toilet_umum", label: "Toilet Umum" },
    { value: "tempat_ibadah", label: "Tempat Ibadah" },
    { value: "isi_angin", label: "Isi Angin" },
    { value: "minimarket", label: "Minimarket" },
    { value: "bengkel", label: "Bengkel" },
    { value: "cuci_kendaraan", label: "Cuci Kendaraan" },
    { value: "nitrogen", label: "Nitrogen" },
    { value: "kafe_restoran", label: "Kafe Restoran" },
    { value: "ATM", label: "ATM" },
    { value: "SPKLU", label: "SPKLU" },
    { value: "SPBKLU", label: "SPBKLU" },
    { value: "edukasi_produk_hijau", label: "Edukasi Produk Hijau" },
    { value: "pembayaran_non_tunai", label: "Pembayaran Non Tunai" },
    { value: "PLTS", label: "PLTS" },
    { value: "penjualan_produk_pertamina", label: "Penjualan Produk Pertamina" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/spbu");
        setSpbuData(response.data);
      } catch (err) {
        console.error("Error fetching SPBU data:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([-6.2, 106.816666], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const createCustomIcon = (color) => {
      return L.icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        shadowSize: [41, 41],
      });
    };

    const filteredSPBU = spbuData.filter((spbu) => {
      if (filter !== "All" && spbu.type !== filter) return false;
      if (selectedFacilities.length === 0) return true;
      const spbuFacilities = fasilitasData.SPBU[spbu.type].fasilitas;
      return selectedFacilities.every((facility) => spbuFacilities[facility.value]);
    });

    filteredSPBU.forEach((spbu) => {
      let markerColor;
      if (spbu.averageRating > 4) {
        markerColor = "gold";
      } else if (spbu.averageRating >= 2 && spbu.averageRating <= 4) {
        markerColor = "green";
      } else {
        markerColor = "red";
      }

      const marker = L.marker([spbu.latitude / 1e6, spbu.longitude / 1e6], {
        icon: createCustomIcon(markerColor),
      }).addTo(map);

      marker.on("click", () => {
        setSelectedSPBU(spbu);
        if (userLocation) {
          const distance = calculateDistance(userLocation, [spbu.latitude / 1e6, spbu.longitude / 1e6]);
          setDistance(distance);
        }
      });
    });

    // Show user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = [latitude, longitude];
        setUserLocation(userLocation);

        // Add a blue circle to indicate the user's location
        L.circle(userLocation, {
          color: "blue",
          fillColor: "#30f",
          fillOpacity: 0.5,
          radius: 300,
        }).addTo(map);

        // Center the map on the user's location
        map.setView(userLocation, 13);
      });
    }

    return () => {
      map.remove();
    };
  }, [filter, selectedFacilities, spbuData]);

  useEffect(() => {
    if (selectedSPBU) {
      fetchReviews(selectedSPBU._id);
      const initialAverageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
      const initialNumberOfReviews = reviews.length;
      setAverageRating(initialAverageRating);
      setNumberOfReviews(initialNumberOfReviews);
    }
  }, [selectedSPBU, reviews]);

  const getBadgeColor = (type) => {
    switch (type) {
      case "Green Energy Station":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Pasti Pas":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "Pasti Prima":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  const isOpen = (open, close) => {
    if (open === "00:00" && close === "00:00") {
      return true;
    }
    const currentTime = new Date();
    const [openHour, openMinute] = open.split(":").map(Number);
    const [closeHour, closeMinute] = close.split(":").map(Number);
    const openTime = new Date();
    openTime.setHours(openHour, openMinute);
    const closeTime = new Date();
    closeTime.setHours(closeHour, closeMinute);
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const calculateDistance = (userLocation, spbuLocation) => {
    const [lat1, lon1] = userLocation;
    const [lat2, lon2] = spbuLocation;

    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // in metres
    return distance > 1000 ? `${(distance / 1000).toFixed(2)} km` : `${Math.round(distance)} m`;
  };

  const navigateToWaze = () => {
    if (selectedSPBU) {
      const wazeUrl = `https://www.waze.com/ul?ll=${selectedSPBU.latitude / 1e6},${selectedSPBU.longitude / 1e6}&navigate=yes&zoom=17&q=${encodeURIComponent(selectedSPBU.name)}`;
      window.open(wazeUrl, "_blank");
    }
  };

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "/api/ratings",
        {
          spbuId: selectedSPBU._id,
          rating: selectedRating,
          review,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Fetch the updated reviews
      await fetchReviews(selectedSPBU._id);

      // Recalculate the average rating and total rating
      const updatedReviews = await axios.get(`/api/ratings/${selectedSPBU._id}`);
      setReviews(updatedReviews.data);
      const updatedAverageRating = updatedReviews.data.length > 0 ? updatedReviews.data.reduce((sum, review) => sum + review.rating, 0) / updatedReviews.data.length : 0;
      const updatedNumberOfReviews = updatedReviews.data.length;
      setAverageRating(updatedAverageRating);
      setNumberOfReviews(updatedNumberOfReviews);

      // Switch to the "Ulasan" tab
      setShowTabs(true);
      setActiveTab("dashboard");
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  const fetchReviews = async (spbuId) => {
    try {
      const response = await axios.get(`/api/ratings/${spbuId}`);
      setReviews(response.data);

      // Check if the logged-in user has already submitted a review
      if (user && user._id) {
        const userReview = response.data.find((review) => String(review.user._id) === String(user._id));
        setHasReviewed(!!userReview);
      } else {
        setHasReviewed(false);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const createdAt = new Date(date);
    const diffInSeconds = Math.floor((now - createdAt) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count > 0) {
        return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.25 && rating % 1 < 0.75 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.564-.955L10 0l2.948 5.955 6.564.955-4.756 4.635 1.122 6.545z" />
          </svg>
        ))}
        {halfStar === 1 && (
          <svg key="half" className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.564-.955L10 0l2.948 5.955 6.564.955-4.756 4.635 1.122 6.545z" opacity="0.5" />
            <path d="M10 0v15l-5.878 3.09 1.122-6.545L.488 6.91l6.564-.955L10 0z" fill="currentColor" opacity="0.5" />
          </svg>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.564-.955L10 0l2.948 5.955 6.564.955-4.756 4.635 1.122 6.545z" />
          </svg>
        ))}
      </>
    );
  };

  useEffect(() => {
    if (selectedSPBU) {
      // Clear any existing interval when a new SPBU is selected
      clearInterval(imageRotationInterval);
  
      // Calculate the starting image index based on the SPBU's position in the array
      const spbuIndex = spbuData.findIndex((spbu) => spbu._id === selectedSPBU._id);
      const startImageIndex = spbuIndex * 5 + 1;
  
      // Reset the current image index
      setCurrentImageIndex(0);
  
      // Start a new interval for rotating images
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 5); // Rotate through 5 images
      }, 3000); // Change image every 3 seconds
  
      setImageRotationInterval(interval);
  
      // Cleanup interval when the component unmounts or SPBU changes
      return () => clearInterval(interval);
    }
  }, [selectedSPBU]);
  
  const getHeroImage = () => {
    if (!selectedSPBU) return null;
  
    // Determine the starting image index based on the SPBU's position in the array
    const spbuIndex = spbuData.findIndex((spbu) => spbu._id === selectedSPBU._id);
    const startImageIndex = spbuIndex * 5 + 1;
  
    // Calculate the current image file name
    const currentImageFile = startImageIndex + currentImageIndex;
  
    // Reset to the first set of images (1–5) if the range exceeds the total number of images
    const totalImages = 35; // Assuming there are 35 images in total
    const normalizedImageFile = ((currentImageFile - 1) % totalImages) + 1;
  
    return `/public/${normalizedImageFile}.jpg`;
  };

  return (
    <div>
      {/* Floating Filters */}
      <div className="filter-container">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">Semua Tipe</option>
          <option value="Green Energy Station">Green Energy Station</option>
          <option value="Pasti Pas">Pasti Pas</option>
          <option value="Pasti Prima">Pasti Prima</option>
        </select>
        <Select isMulti options={facilityOptions} className="multi-select" classNamePrefix="select" onChange={setSelectedFacilities} placeholder="Pilih Fasilitas" />
      </div>

      {/* Legend Box */}
      <LegendBox />

      {/* Map Container */}
      <div ref={mapRef} style={{ height: "100vh", width: "100vw" }}></div>

      {/* Modal */}
      {selectedSPBU && (
        <div className="modal-overlay" onClick={() => setSelectedSPBU(null)}>
          <div className="modal-content rounded-lg shadow-sm dark:bg-gray-700" onClick={(e) => e.stopPropagation()}>
            {showTabs && (
              <>
                <button className="close-btn" onClick={() => setSelectedSPBU(null)}>
                  <HiOutlineX size={24} color="#1a56db" />
                </button>
                <img src={getHeroImage()} alt="SPBU" className="hero-image rounded-t-lg" />
              </>
            )}
            <div className="modal-body">
              {showTabs ? (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Informasi SPBU</h2>
                  <div className="flex items-center gap-4">
                    <img src="/Logo Pertamina.webp" width={50} />
                    <p className="text-md font-medium text-gray-900 dark:text-white mb-4">{selectedSPBU.name}</p>
                  </div>
                  <div id="ratings-overview" className="flex items-center gap-1 mt-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{averageRating.toFixed(1)}</span>
                    <div className="flex items-center">{renderStars(averageRating)}</div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">({numberOfReviews} reviews)</span>
                  </div>
                  <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
                    <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-tab" data-tabs-toggle="#default-tab-content" role="tablist">
                      <li class="me-2" role="presentation">
                        <button
                          className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === "profile" ? "border-blue-600 text-blue-600" : "border-transparent"}`}
                          id="profile-tab"
                          data-tabs-target="#profile"
                          type="button"
                          role="tab"
                          aria-controls="profile"
                          aria-selected={activeTab === "profile"}
                          onClick={() => setActiveTab("profile")}
                        >
                          Deskripsi
                        </button>
                      </li>
                      <li class="me-2" role="presentation">
                        <button
                          className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === "dashboard" ? "border-blue-600 text-blue-600" : "border-transparent"}`}
                          id="dashboard-tab"
                          data-tabs-target="#dashboard"
                          type="button"
                          role="tab"
                          aria-controls="dashboard"
                          aria-selected={activeTab === "dashboard"}
                          onClick={() => setActiveTab("dashboard")}
                        >
                          Ulasan
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div id="default-tab-content">
                    <div className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 ${activeTab === "profile" ? "" : "hidden"}`} id="profile" role="tabpanel" aria-labelledby="profile-tab">
                      <div id="badge" className="flex mt-2">
                        <span className={`${getBadgeColor(selectedSPBU.type)} text-xs font-medium me-2 px-3.5 py-1.5 rounded-sm`}>{selectedSPBU.type}</span>
                        <span
                          className={`${
                            isOpen(selectedSPBU.open, selectedSPBU.close) ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          } text-xs font-medium me-2 px-3.5 py-1.5 rounded-sm`}
                        >
                          {isOpen(selectedSPBU.open, selectedSPBU.close) ? "Buka" : "Tutup"}
                        </span>
                        {distance && <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-3.5 py-1.5 rounded-sm dark:bg-blue-900 dark:text-blue-300">{distance}</span>}
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-6" id="fuel-prices">
                        <div className="block max-w-sm py-1 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                          <div className="flex flex-col items-center justify-between h-10"> {/* Add a fixed height */}
                            <img src="/DexLite.png" className="mx-auto h-12 object-contain" alt="DexLite" /> {/* Use object-contain */}
                            <p className="text-xs text-center mt-1">Rp 14.300</p>
                          </div>
                        </div>
                        <div class="block max-w-sm py-1 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                          <div className="flex flex-col items-center justify-between h-10"> {/* Add a fixed height */}
                            <img src="/Pertamina Dex.png" alt="Pertamina Dex" className="mx-auto" />
                            <p className="text-xs text-center mt-1">Rp 14.600</p>
                          </div>
                        </div>
                        <div class="block max-w-sm py-1 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                          <div className="flex flex-col items-center justify-between h-10"> {/* Add a fixed height */}
                            <img src="/Pertamina Bio Solar.jpg" className="mx-auto h-4" alt="Pertamina Bio Solar" />
                            <p className="text-xs text-center mt-1">Rp 6.800</p>
                          </div>
                        </div>
                        <div class="block max-w-sm py-1 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                          <div className="flex flex-col items-center justify-between h-10"> {/* Add a fixed height */}
                            <img src="/Pertamax Turbo.png" className="mx-auto" alt="Pertamax Turbo" />
                            <p className="text-xs text-center mt-1">Rp 14.000</p>
                          </div>
                        </div>
                        <div class="block max-w-sm py-1 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                          <div className="flex flex-col items-center justify-between h-10"> {/* Add a fixed height */}
                            <img src="/Pertamax Green 95.jpg" className="mx-auto h-4" alt="Pertamax Green 95" />
                            <p className="text-xs text-center mt-1">Rp 13.700</p>
                          </div>
                        </div>
                        <div class="block max-w-sm py-1 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                          <div className="flex flex-col items-center justify-between h-10"> {/* Add a fixed height */}
                            <img src="/Pertamax.jpg" className="mx-auto" alt="Pertamax" />
                            <p className="text-xs text-center mt-1">Rp 12.900</p>
                          </div>
                        </div>
                        <div class="block max-w-sm py-1 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                          <div className="flex flex-col items-center justify-between h-10"> {/* Add a fixed height */}
                            <img src="/Pertalite.jpg" className="mx-auto" alt="Pertamax" />
                            <p className="text-xs text-center mt-1">Rp 10.000</p>
                          </div>
                        </div>
                      </div>
                      <div className="block max-w-sm p-4 my-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                        <ul className="facilities-list">
                          {Object.entries(fasilitasData.SPBU[selectedSPBU.type].fasilitas).map(([key, value]) =>
                            value ? (
                              <li key={key} className="facility-item">
                                <>
                                  {key === "toilet_umum" && <FaToilet size={20} />}
                                  {key === "shopping" && <BsBagFill size={20} />}
                                  {key === "fuel" && <BsFillFuelPumpFill size={20} />}
                                  {key === "tempat_ibadah" && <FaMosque size={20} />}
                                  {key === "isi_angin" && <BsWind size={20} />}
                                  {key === "minimarket" && <BsShop size={20} />}
                                  {key === "bengkel" && <BsTools size={20} />}
                                  {key === "cuci_kendaraan" && <BsDropletFill size={20} />}
                                  {key === "nitrogen" && <BsSpeedometer size={20} />}
                                  {key === "kafe_restoran" && <BsCupHotFill size={20} />}
                                  {key === "ATM" && <BsCreditCard2BackFill size={20} />}
                                  {key === "SPKLU" && <FaChargingStation size={20} />}
                                  {key === "SPBKLU" && <BsArrowLeftRight size={20} />}
                                  {key === "edukasi_produk_hijau" && <FaLeaf size={20} />}
                                  {key === "pembayaran_non_tunai" && <BsPaypal size={20} />}
                                  {key === "PLTS" && <FaSolarPanel size={20} />}
                                  {key === "penjualan_produk_pertamina" && <FaOilCan size={20} />}
                                </>
                              </li>
                            ) : null
                          )}
                        </ul>
                      </div>
                      <button
                        type="button"
                        class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full w-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={navigateToWaze}
                      >
                        Navigasi ke SPBU
                      </button>
                    </div>
                    <div
                      className={`py-4 rounded-lg bg-gray-50 dark:bg-gray-800 ${activeTab === "dashboard" ? "" : "hidden"}`}
                      id="dashboard"
                      role="tabpanel"
                      aria-labelledby="dashboard-tab"
                      style={{ maxHeight: "260px", overflowY: "auto" }}
                    >
                      <div id="ratings-statistic" className="grid grid-cols-4 items-center mb-3">
                        <div className="flex flex-col gap-2 px-4 col-span-3">
                          {[5, 4, 3, 2, 1].map((star) => {
                            const starCount = reviews.filter((review) => review.rating === star).length;
                            const percentage = numberOfReviews > 0 ? (starCount / numberOfReviews) * 100 : 0;

                            return (
                              <div key={star} className="flex items-center gap-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400">{star}</span>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                  <div className="bg-yellow-300 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="text-center">
                          <h2 className="text-4xl font-semibold text-gray-900 dark:text-white mb-2">{averageRating.toFixed(1)}</h2>
                          <div className="flex items-center">{renderStars(averageRating)}</div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{numberOfReviews} reviews</span>
                        </div>
                      </div>
                      <div className="text-center">
                        {!hasReviewed ? (
                          <button
                            type="button"
                            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center gap-1"
                            onClick={() => setShowTabs(false)}
                          >
                            <HiOutlinePencil color="#1a56db" size={16} />
                            Tulis review
                          </button>
                        ) : null}
                      </div>
                      <hr className="mt-2 mb-4" />
                      <div id="reviews">
                        {reviews.length > 0 ? (
                          reviews.map((review, index) => (
                            <div key={review._id}>
                              <div className="mb-4 px-4">
                                <div className="flex items-center gap-4">
                                  <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                    <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                    </svg>
                                  </div>
                                  <div className="font-medium dark:text-white">
                                    <div>{review.user.name}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">{formatDate(review.createdAt)}</div>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <div className="flex items-center mt-3 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                      <svg key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-300" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.564-.955L10 0l2.948 5.955 6.564.955-4.756 4.635 1.122 6.545z" />
                                      </svg>
                                    ))}
                                  </div>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">{review.review}</p>
                                </div>
                              </div>
                              {index < reviews.length - 1 && <hr className="my-4" />}
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 px-4">Belum ada ulasan.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{selectedSPBU.name}</h2>
                  <div class="flex items-center gap-4">
                    <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                      <svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <div class="font-medium dark:text-white">
                      <div>{user.name}</div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">{user.createdAt ? `Joined in ${new Date(user.createdAt).toLocaleString("en-US", { year: "numeric" })}` : "Join date unavailable"}</div>
                    </div>
                  </div>
                  {!hasReviewed ? (
                    <form onSubmit={handleSubmit}>
                      <div className="flex items-center justify-center my-4" id="ratings">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-6 h-6 ${selectedRating >= star ? "text-yellow-300" : "text-gray-300"} ms-1`}
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 22 20"
                            onClick={() => handleRatingClick(star)}
                            style={{ cursor: "pointer" }}
                          >
                            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                          </svg>
                        ))}
                      </div>
                      <textarea
                        id="review"
                        name="review"
                        rows="4"
                        className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Tulis review Anda di sini..."
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                      ></textarea>
                      <div className="mt-8 flex justify-end">
                        <button
                          type="button"
                          className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                          onClick={() => setSelectedSPBU(null)} // Close the modal
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                          Post
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">You have already submitted a review for this SPBU.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>
        {`
          .filter-container {
            position: absolute;
            top: 80px; /* Adjust this value based on the height of your navbar */
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 10px;
            border-radius: 999px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            display: flex;
            gap: 10px;
          }
          .filter-container select, .multi-select {
            border: none;
            border-radius: 999px;
            padding: 5px 10px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
          }
          .filter-container select:focus, .multi-select:focus {
            box-shadow: none;
          }
          .css-t3ipsp-control, .select__control {
            box-shadow: none;
            border-width: 0px;
          }
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          .modal-content {
            background: white;
            padding: 0;
            width: 400px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
            position: relative;
          }
          .close-btn {
            position: absolute;
            top: 10px;
            right: 15px;
            cursor: pointer;
          }
          .hero-image {
            width: 100%;
            height: 150px;
            object-fit: cover;
          }
          .modal-body {
            padding: 20px;
          }
          .facilities-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding: 0;
            list-style: none;
          }
        `}
      </style>
    </div>
  );
};

export default PetaSebaranSPBU;
