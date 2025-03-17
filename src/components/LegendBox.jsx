import React from "react";
import { FaMosque, FaSolarPanel, FaLeaf, FaOilCan, FaToilet, FaChargingStation } from "react-icons/fa";
import { BsFillFuelPumpFill, BsBagFill, BsWind, BsShop, BsTools, BsCupHotFill, BsCreditCard2BackFill, BsDropletFill, BsSpeedometer, BsArrowLeftRight, BsPaypal } from "react-icons/bs";

const LegendBox = () => {
  const facilities = [
    { icon: <FaToilet size={20} />, label: "Toilet Umum" },
    { icon: <FaMosque size={20} />, label: "Tempat Ibadah" },
    { icon: <BsWind size={20} />, label: "Isi Angin" },
    { icon: <BsShop size={20} />, label: "Minimarket" },
    { icon: <BsTools size={20} />, label: "Bengkel" },
    { icon: <BsDropletFill size={20} />, label: "Cuci Kendaraan" },
    { icon: <BsSpeedometer size={20} />, label: "Nitrogen" },
    { icon: <BsCupHotFill size={20} />, label: "Kafe Restoran" },
    { icon: <BsCreditCard2BackFill size={20} />, label: "ATM" },
    { icon: <FaChargingStation size={20} />, label: "SPKLU" },
    { icon: <BsArrowLeftRight size={20} />, label: "SPBKLU" },
    { icon: <FaLeaf size={20} />, label: "Edukasi Produk Hijau" },
    { icon: <BsPaypal size={20} />, label: "Pembayaran Non Tunai" },
    { icon: <FaSolarPanel size={20} />, label: "PLTS" },
    { icon: <FaOilCan size={20} />, label: "Penjualan Produk Pertamina" },
  ];

  return (
    <div className="legend-box">
      <h3 className="legend-title">Detail Fasilitas</h3>
      <ul className="legend-list">
        {facilities.map((facility, index) => (
          <li key={index} className="legend-item">
            {facility.icon}
            <span className="legend-label">{facility.label}</span>
          </li>
        ))}
      </ul>
      <style>
        {`
          .legend-box {
            position: absolute;
            top: 80px; /* Adjust this value based on the height of your navbar */
            right: 20px;
            background: white;
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
            z-index: 1000;
          }
          .legend-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .legend-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .legend-item {
            display: flex;
            align-items: center;
            margin-bottom: 5px;
          }
          .legend-label {
            margin-left: 5px;
            font-size: 14px;
          }
        `}
      </style>
    </div>
  );
};

export default LegendBox;
