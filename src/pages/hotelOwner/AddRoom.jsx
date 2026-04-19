import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import API_BASE_URL from "../../config/api";

const AddRoom = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [images, setImages] = useState([]);

  const [inputs, setInputs] = useState({
    title: "",
    roomType: "",
    location: "",
    mobileNo: "",
    pricePerNight: 0,
    description: "",
    amenities: {
      "free Wi-Fi": false,
      "free Brekfast": false,
      "Room Service": false,
      "Mountain View": false,
      "Pool Access": false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validate inputs
      if (
        !inputs.title ||
        !inputs.location ||
        !inputs.mobileNo ||
        !inputs.pricePerNight ||
        !inputs.description
      ) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Check if at least one image is selected
      if (images.length === 0) {
        setError("Please upload at least one image");
        setLoading(false);
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append("title", inputs.title);
      formData.append("roomType", inputs.roomType);
      formData.append("location", inputs.location);
      formData.append("mobileNo", inputs.mobileNo);
      formData.append("pricePerNight", inputs.pricePerNight);
      formData.append("description", inputs.description);
      formData.append("amenities", JSON.stringify(inputs.amenities));

      // Append images
      images.forEach((image) => {
        formData.append("images", image);
      });

      // Make request to backend with multipart/form-data
      // FormData automatically sets Content-Type: multipart/form-data
      // The httpOnly cookie will be sent automatically with credentials: "include"
      const response = await fetch(`${API_BASE_URL}/api/rooms`, {
        method: "POST",
        contentType: "multipart/form-data",
        body: formData,
        credentials: "include",
        headers: {
          // Don't set Content-Type header - let the browser set it automatically
          // when using FormData with multipart/form-data
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create room");
        setLoading(false);
        return;
      }

      setSuccess("Room created successfully!");
      // Reset form
      setInputs({
        title: "",
        roomType: "",
        location: "",
        mobileNo: "",
        pricePerNight: 0,
        description: "",
        amenities: {
          "free Wi-Fi": false,
          "free Brekfast": false,
          "Room Service": false,
          "Air Conditioning": false,
          "Pool Access": false,
        },
      });
      setImages([]);

      setTimeout(() => {
        // Redirect or do something with the created room
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err.message || "An error occurred while creating the room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Title
        align="left"
        font="outfit"
        title="Add Room"
        subTitle="Fill in the details carefully and accurate room detailes, pricing, and amenities, to enhance the user booking experiance"
      />

      {/* Authentication Check */}
      {!isAuthenticated && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Please log in first
        </div>
      )}

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Room Title Input */}
      <div className="w-full max-w-md mt-6">
        <p className="text-gray-800 mb-2">Room Title</p>
        <input
          type="text"
          placeholder="e.g., Luxury Beachfront Room"
          className="border border-gray-300 rounded p-2 w-full"
          value={inputs.title}
          onChange={(e) => setInputs({ ...inputs, title: e.target.value })}
        />
      </div>

      {/* Location and Mobile Number */}
      <div className="w-full flex max-sm:flex-col sm:gap-4 mt-6">
        <div className="flex-1 max-w-xs">
          <p className="text-gray-800 mb-2">Location</p>
          <input
            type="text"
            placeholder="e.g., Beach Area, Downtown"
            className="border border-gray-300 rounded p-2 w-full"
            value={inputs.location}
            onChange={(e) => setInputs({ ...inputs, location: e.target.value })}
          />
        </div>
        <div className="flex-1 max-w-xs">
          <p className="text-gray-800 mb-2">Mobile Number</p>
          <input
            type="tel"
            placeholder="+1 (555) 123-4567"
            className="border border-gray-300 rounded p-2 w-full"
            value={inputs.mobileNo}
            onChange={(e) => setInputs({ ...inputs, mobileNo: e.target.value })}
          />
        </div>
      </div>

      {/* Images Upload */}
      <p className="text-gray-800 mt-10">Images</p>
      <div className="mt-4">
        <label htmlFor="multipleImages" className="cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
            <img
              className="max-h-20 mx-auto opacity-80 mb-2"
              src={assets.uploadArea}
              alt="upload"
            />
            <p className="text-gray-600">Click to select multiple images</p>
            <p className="text-sm text-gray-400">or drag and drop</p>
          </div>
          <input
            type="file"
            accept="image/*"
            id="multipleImages"
            hidden
            multiple
            onChange={(e) => setImages(Array.from(e.target.files))}
          />
        </label>
      </div>

      {/* Display Selected Images */}
      {images.length > 0 && (
        <div className="mt-4">
          <p className="text-gray-800 mb-2">
            Selected Images ({images.length})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() =>
                    setImages(images.filter((_, i) => i !== index))
                  }
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {image.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Room Type and Price */}
      <div className="w-full flex max-sm:flex-col sm:gap-4 mt-6">
        <div className="flex-1 max-w-48">
          <p className="text-gray-800 mb-2">Room Type</p>
          <select
            value={inputs.roomType}
            onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}
            className="border opacity-70 border-gray-300 rounded p-2 w-full"
          >
            <option value="">Select Room Type</option>
            <option value="single">Single Bed</option>
            <option value="double">Double Bed</option>
            <option value="suite">Family Suite</option>
            <option value="luxury">Luxury Room</option>
          </select>
        </div>
        <div>
          <p className="text-gray-800 mb-2">
            Price <span className="text-xs">/night</span>
          </p>
          <input
            type="number"
            placeholder="0"
            className="border border-gray-300 rounded p-2 w-24"
            value={inputs.pricePerNight}
            onChange={(e) =>
              setInputs({ ...inputs, pricePerNight: e.target.value })
            }
          />
        </div>
      </div>

      {/* Description */}
      <div className="w-full mt-6">
        <p className="text-gray-800 mb-2">Description</p>
        <textarea
          placeholder="Enter room description, features, and special details..."
          className="border border-gray-300 rounded p-2 w-full h-24 resize-none"
          value={inputs.description}
          onChange={(e) =>
            setInputs({ ...inputs, description: e.target.value })
          }
        />
      </div>

      {/* Amenities */}
      <p className="text-gray-800 mt-6 mb-2">Amenities</p>
      <div className="flex flex-col flex-wrap mt-2 text-gray-400 max-w-sm">
        {Object.keys(inputs.amenities).map((amenity, index) => (
          <div key={index}>
            <input
              type="checkbox"
              id={`amenities${index + 1}`}
              checked={inputs.amenities[amenity]}
              onChange={() =>
                setInputs({
                  ...inputs,
                  amenities: {
                    ...inputs.amenities,
                    [amenity]: !inputs.amenities[amenity],
                  },
                })
              }
            />
            <label htmlFor={`amenities${index + 1}`}> {amenity}</label>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !isAuthenticated}
        className={`px-8 py-2 rounded mt-8 cursor-pointer mb-20 add-room-btn ${
          loading || !isAuthenticated
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-800 text-white hover:bg-blue-900"
        }`}
      >
        {loading ? "Adding Room..." : "Add Room"}
      </button>
    </form>
  );
};

export default AddRoom;
