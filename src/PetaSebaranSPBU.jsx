import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Select from "react-select";
import spbuData from "../data/converted_data.json";
import fasilitasData from "../data/fasilitas_spbu.json"; // Import the facilities data
import { BsFillFuelPumpFill, BsBagFill, BsWind, BsShop, BsTools, BsCupHotFill, BsCreditCard2BackFill, BsDropletFill, BsSpeedometer, BsArrowLeftRight, BsPaypal } from "react-icons/bs";
import { FaMosque, FaSolarPanel, FaLeaf, FaOilCan, FaToilet, FaChargingStation } from "react-icons/fa";
import LegendBox from "./components/LegendBox";

const PetaSebaranSPBU = () => {
  const mapRef = useRef(null);
  const [selectedSPBU, setSelectedSPBU] = useState(null);
  const [filter, setFilter] = useState("All");
  const [selectedFacilities, setSelectedFacilities] = useState([]);

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
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView([-6.2, 106.816666], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const redIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      shadowSize: [41, 41],
    });

    const filteredSPBU = spbuData.filter((spbu) => {
      if (filter !== "All" && spbu.type !== filter) return false;
      if (selectedFacilities.length === 0) return true;
      const spbuFacilities = fasilitasData.SPBU[spbu.type].fasilitas;
      return selectedFacilities.every((facility) => spbuFacilities[facility.value]);
    });

    filteredSPBU.forEach((spbu) => {
      const marker = L.marker([spbu.latitude / 1e6, spbu.longitude / 1e6], {
        icon: redIcon,
      }).addTo(map);
      marker.on("click", () => setSelectedSPBU(spbu));
    });

    // Show user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = [latitude, longitude];

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
  }, [filter, selectedFacilities]);

  return (
    <div>
      {/* Floating Filters */}
      <div className="filter-container">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Types</option>
          <option value="Green Energy Station">Green Energy Station</option>
          <option value="Pasti Pas">Pasti Pas</option>
          <option value="Pasti Prima">Pasti Prima</option>
        </select>
        <Select isMulti options={facilityOptions} className="multi-select" classNamePrefix="select" onChange={setSelectedFacilities} placeholder="Select Facilities" />
      </div>

      {/* Legend Box */}
      <LegendBox />

      {/* Map Container */}
      <div ref={mapRef} style={{ height: "100vh", width: "100vw" }}></div>

      {/* Modal */}
      {selectedSPBU && (
        <div className="modal-overlay" onClick={() => setSelectedSPBU(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedSPBU(null)}>
              ✖
            </button>
            <img src="/spbu.jpg" alt="SPBU" className="hero-image" />
            <div className="modal-body">
              <h2>{selectedSPBU.name}</h2>
              <p>
                <strong>Latitude:</strong> {selectedSPBU.latitude / 1e6}
              </p>
              <p>
                <strong>Longitude:</strong> {selectedSPBU.longitude / 1e6}
              </p>
              <h3>
                <strong>Facilities:</strong>
              </h3>
              <a href="#" class="block max-w-sm p-4 mt-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <ul className="facilities-list">
                  {Object.entries(fasilitasData.SPBU[selectedSPBU.type].fasilitas).map(([key, value]) =>
                    value ? (
                      <li key={key} className="facility-item">
                        <>
                          {key === "toilet_umum" && <FaToilet size={30} />}
                          {key === "shopping" && <BsBagFill size={30} />}
                          {key === "fuel" && <BsFillFuelPumpFill size={30} />}
                          {key === "tempat_ibadah" && <FaMosque size={30} />}
                          {key === "isi_angin" && <BsWind size={30} />}
                          {key === "minimarket" && <BsShop size={30} />}
                          {key === "bengkel" && <BsTools size={30} />}
                          {key === "cuci_kendaraan" && <BsDropletFill size={30} />}
                          {key === "nitrogen" && <BsSpeedometer size={30} />}
                          {key === "kafe_restoran" && <BsCupHotFill size={30} />}
                          {key === "ATM" && <BsCreditCard2BackFill size={30} />}
                          {key === "SPKLU" && <FaChargingStation size={30} />}
                          {key === "SPBKLU" && <BsArrowLeftRight size={30} />}
                          {key === "edukasi_produk_hijau" && <FaLeaf size={30} />}
                          {key === "pembayaran_non_tunai" && <BsPaypal size={30} />}
                          {key === "PLTS" && <FaSolarPanel size={30} />}
                          {key === "penjualan_produk_pertamina" && <FaOilCan size={30} />}
                        </>
                      </li>
                    ) : null
                  )}
                </ul>
              </a>
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
            border-radius: 10px;
            width: 400px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
            position: relative;
          }
          .close-btn {
            position: absolute;
            top: 10px;
            right: 15px;
            border: none;
            background: transparent;
            font-size: 20px;
            cursor: pointer;
            color: #555;
          }
          .hero-image {
            width: 100%;
            height: 150px;
            object-fit: cover;
          }
          .modal-body {
            padding: 20px;
          }
          .facilities-card {
            background-color: #fecaca; /* bright red-200 */
            padding: 10px;
            border-radius: 8px;
          }
          .facilities-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            padding: 0;
            list-style: none;
          }
          .facility-item {
            display: flex;
            align-items: center;
            gap: 5px;
          }
        `}
      </style>
    </div>
  );
};

export default PetaSebaranSPBU;
