import React from "react";
import { Link } from "react-router-dom";
import Footer from "./components/Footer";
import { FaMapMarkerAlt, FaGasPump, FaCreditCard, FaBolt, FaChartBar } from "react-icons/fa";

const Home = () => {
  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Temukan SPBU Terdekat dengan Mudah!</h1>
          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">
            Butuh bahan bakar? 🚗💨 Cari dan temukan SPBU terdekat di sekitarmu dengan cepat dan akurat! Dapatkan informasi lengkap, mulai dari lokasi, fasilitas, hingga metode pembayaran yang tersedia.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0">
            <Link
              to="/peta-sebaran-spbu"
              className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            >
              Cari SPBU Sekarang
              <svg className="w-3.5 h-3.5 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
              </svg>
            </Link>
            <a
              href="#"
              className="py-3 px-5 sm:ms-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>
      <div className="mb-14">
        <div className="flex items-center justify-center">
          <svg className="w-6 h-6 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
          <svg className="w-6 h-6 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
          <svg className="w-6 h-6 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
          <svg className="w-6 h-6 text-yellow-300 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
          <svg className="w-6 h-6 ms-1 text-gray-300 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        </div>
        <p className="mb-8 text-center mt-4 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-400">Direview oleh 2.312 pengguna</p>
      </div>
      <section className="bg-gray-100 dark:bg-gray-900 py-8">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Fitur Unggulan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <FaMapMarkerAlt className="text-blue-700 dark:text-blue-500 w-12 h-12 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white">Pencarian SPBU Terdekat</p>
              <p>Gunakan peta interaktif untuk menemukan SPBU terdekat berdasarkan lokasimu secara real-time.</p>
            </div>
            <div className="flex flex-col items-center">
              <FaGasPump className="text-blue-700 dark:text-blue-500 w-12 h-12 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white">Pembayaran Cashless</p>
              <p>Lihat SPBU yang mendukung pembayaran digital seperti QRIS, e-wallet, dan kartu kredit/debit.</p>
            </div>
            <div className="flex flex-col items-center">
              <FaCreditCard className="text-blue-700 dark:text-blue-500 w-12 h-12 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white">Fasilitas Pendukung</p>
              <p>Temukan SPBU dengan toilet, mushola, ATM, kafe, restoran, dan cuci mobil dalam satu tempat!</p>
            </div>
            <div className="flex flex-col items-center">
              <FaBolt className="text-blue-700 dark:text-blue-500 w-12 h-12 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white">SPBU dengan Layanan Khusus</p>
              <p>🔧 SPBU dengan pengisian nitrogen untuk ban kendaraanmu. 🔋 SPBU dengan stasiun pengisian daya listrik untuk kendaraan listrik. 🌞 SPBU yang mendukung energi terbarukan dengan pembangkit listrik tenaga surya.</p>
            </div>
            <div className="flex flex-col items-center">
              <FaChartBar className="text-blue-700 dark:text-blue-500 w-12 h-12 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-white">Statistik & Ulasan Pengguna</p>
              <p>Dapatkan informasi rating, ulasan pengguna, serta statistik penggunaan BBM di berbagai SPBU!</p>
            </div>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-2 mt-16 md:grid-cols-3 gap-4">
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/spbu-1.png" alt="" />
        </div>
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/spbu-2.png" alt="" />
        </div>
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/spbu-3.png" alt="" />
        </div>
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/spbu-4.png" alt="" />
        </div>
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/spbu-5.png" alt="" />
        </div>
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/spbu-6.png" alt="" />
        </div>
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/spbu-7.png" alt="" />
        </div>
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/spbu-8.png" alt="" />
        </div>
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/spbu-9.png" alt="" />
        </div>
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/spbu-10.png" alt="" />
        </div>
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/spbu-11.png" alt="" />
        </div>
        <div>
          <img className="h-auto max-w-full rounded-lg" src="/spbu-12.png" alt="" />
        </div>
      </div>
    </>
  );
};

export default Home;
