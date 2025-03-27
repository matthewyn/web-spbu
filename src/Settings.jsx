import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "./context/AuthContext"; // Import AuthContext

const Settings = () => {
  const { user, setUser, fetchUserProfile } = useContext(AuthContext); // Access user and setUser from AuthContext
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // Fetch the user's profile data
  useEffect(() => {
    axios
      .get("/api/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the user's token
        },
      })
      .then((response) => {
        const baseUrl = "http://localhost:5000"; // Replace with your backend URL
        const imageUrl = response.data.profileImage ? `${baseUrl}${response.data.profileImage}?t=${Date.now()}` : null;
        setProfileImage(imageUrl); // Set the full image URL with a timestamp
        setFormData({
          name: response.data.name,
          email: response.data.email,
        });
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
      });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file);

      axios
        .post("/api/users/upload-profile-image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          toast.success("Profile image updated!");
          fetchUserProfile(); // Update the profileImage in the context
        })
        .catch((err) => {
          console.error("Error uploading profile image:", err);
          toast.error("Error uploading profile image. Please try again.");
        });
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        "/api/users/profile",
        { name: formData.name, email: formData.email },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include the user's token
          },
        }
      )
      .then((response) => {
        console.log("Profile terupdate:", response.data);
        toast.success("Profile terupdate!"); // Show success toast

        // Update the user in AuthContext
        const updatedUser = { ...user, name: formData.name, email: formData.email };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Update localStorage
      })
      .catch((err) => {
        console.error("Error update profile:", err);
        toast.error("Error update profile. Silahkan coba lagi."); // Show error toast
      });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster /> {/* Add Toaster component */}
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
      <div className="flex flex-1">
        <aside id="default-sidebar" className="top-[64px] left-0 z-40 w-64 h-[calc(100vh-64px)] transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
          <div className="h-full px-3 py-4 overflow-y-auto">
            <ul className="space-y-2 font-medium">
              <li>
                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <svg
                    className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                </a>
              </li>
            </ul>
          </div>
        </aside>

        <main className="flex-1 p-4">
          <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Edit profile</h2>
            <form id="update-profile-form" onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-5 gap-6 mt-6">
                <div className="text-center">
                  {profileImage ? (
                    <img className="w-[7rem] h-[7rem] rounded-full mx-auto" src={profileImage} alt="Profile" />
                  ) : (
                    <div className="relative w-[7rem] h-[7rem] overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 mx-auto">
                      <svg className="absolute w-[7.5rem] h-[7.5rem] text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  )}
                  <form id="upload-photo-form" className="mt-4">
                    <label htmlFor="profileImage" className="text-sm underline text-gray-500 dark:text-gray-400 cursor-pointer">
                      Change profile image
                    </label>
                    <input type="file" id="profileImage" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </form>
                </div>
                <div className="col-span-2">
                  <div className="mb-5">
                    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Nama
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="John Doe"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@flowbite.com"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full mt-8"
              >
                Update akun
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
