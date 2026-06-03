import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import API_BASE_URL from "../../config/api";

const UpdateRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [inputs, setInputs] = useState({
    title: "",
    location: "",
    mobileNo: "",
    simplePrice: 0,
    luxuryPrice: 0,
    premiumPrice: 0,
    simpleGuestLimit: 1,
    luxuryGuestLimit: 1,
    premiumGuestLimit: 1,
    description: "",
    amenities: {
      "free Wi-Fi": false,
      "free Brekfast": false,
      "Room Service": false,
      "Mountain View": false,
      "Pool Access": false,
    },
  });

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  // Fetch room details
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${API_BASE_URL}/api/rooms/${id}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to fetch room");
          return;
        }

        // Set existing images
        setExistingImages(data.images || []);

        // Map amenities from MongoDB format to form format
        const amenitiesMap = {
          "free Wi-Fi": data.amenities?.wifi || false,
          "free Brekfast": data.amenities?.breakfast || false,
          "Room Service": data.amenities?.roomService || false,
          "Mountain View": data.amenities?.airConditioning || false,
          "Pool Access": data.amenities?.parking || false,
        };

        // Set form inputs
        setInputs({
          title: data.title || "",
          location: data.location || "",
          mobileNo: data.contact || "",
          simplePrice: data.categoryPrices?.simple ?? data.price ?? 0,
          luxuryPrice: data.categoryPrices?.luxury ?? data.price ?? 0,
          premiumPrice: data.categoryPrices?.premium ?? data.price ?? 0,
          simpleGuestLimit: data.categoryGuestLimits?.simple ?? 1,
          luxuryGuestLimit: data.categoryGuestLimits?.luxury ?? 1,
          premiumGuestLimit: data.categoryGuestLimits?.premium ?? 1,
          description: data.description || "",
          amenities: amenitiesMap,
        });
      } catch (err) {
        setError(err.message || "Error fetching room details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoomDetails();
    }
  }, [id]);

  const handleRemoveExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      // Validate inputs
      if (
        !inputs.title ||
        !inputs.location ||
        !inputs.mobileNo ||
        !inputs.simplePrice ||
        !inputs.luxuryPrice ||
        !inputs.premiumPrice ||
        !inputs.simpleGuestLimit ||
        !inputs.luxuryGuestLimit ||
        !inputs.premiumGuestLimit ||
        !inputs.description
      ) {
        setError("Please fill in all required fields");
        setSubmitting(false);
        return;
      }

      // Check if at least one image exists (existing or new)
      if (existingImages.length === 0 && images.length === 0) {
        setError("Please keep at least one image or upload new images");
        setSubmitting(false);
        return;
      }

      // Create FormData
      const formData = new FormData();
      formData.append("title", inputs.title);
      formData.append("location", inputs.location);
      formData.append("mobileNo", inputs.mobileNo);
      formData.append("simplePrice", inputs.simplePrice);
      formData.append("luxuryPrice", inputs.luxuryPrice);
      formData.append("premiumPrice", inputs.premiumPrice);
      formData.append("simpleGuestLimit", inputs.simpleGuestLimit);
      formData.append("luxuryGuestLimit", inputs.luxuryGuestLimit);
      formData.append("premiumGuestLimit", inputs.premiumGuestLimit);
      formData.append("description", inputs.description);
      formData.append("amenities", JSON.stringify(inputs.amenities));
      formData.append("existingImages", JSON.stringify(existingImages));

      // Append new images
      images.forEach((image) => {
        formData.append("images", image);
      });

      // Make request to backend
      const response = await fetch(`${API_BASE_URL}/api/rooms/${id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update room");
        setSubmitting(false);
        return;
      }

      setSuccess("Room updated successfully!");
      setTimeout(() => {
        navigate("/owner/list-room");
      }, 2000);
    } catch (err) {
      setError(err.message || "An error occurred while updating the room");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 md:py-28 px-4 sm:px-6 md:px-12 lg:px-20 xl:px-32 flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading room details...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Title
        align="left"
        font="outfit"
        title="Update Room"
        subTitle="Edit the room details, pricing, and amenities to keep information up-to-date"
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

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="mt-10">
          <p className="text-gray-800 mb-4">Current Images</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Current ${index + 1}`}
                  className="w-full h-32 object-cover rounded border border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Images Upload */}
      <p className="text-gray-800 mt-10">Add New Images</p>
      <div className="mt-4">
        <label htmlFor="multipleImages" className="cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
            <img
              className="max-h-20 mx-auto opacity-80 mb-2"
              src={assets.uploadArea}
              alt="upload"
            />
            <p className="text-gray-600">Click to select additional images</p>
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

      {/* Display New Selected Images */}
      {images.length > 0 && (
        <div className="mt-4">
          <p className="text-gray-800 mb-2">New Images ({images.length})</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`New ${index + 1}`}
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

      {/* Room Categories and Prices */}
      <div className="w-full flex flex-col gap-4 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-800 mb-2">Simple Price</p>
            <input
              type="number"
              placeholder="₹0"
              className="border border-gray-300 rounded p-2 w-full"
              value={inputs.simplePrice}
              onChange={(e) =>
                setInputs({ ...inputs, simplePrice: e.target.value })
              }
            />
          </div>
          <div>
            <p className="text-gray-800 mb-2">Luxury Price</p>
            <input
              type="number"
              placeholder="₹0"
              className="border border-gray-300 rounded p-2 w-full"
              value={inputs.luxuryPrice}
              onChange={(e) =>
                setInputs({ ...inputs, luxuryPrice: e.target.value })
              }
            />
          </div>
          <div>
            <p className="text-gray-800 mb-2">Premium Price</p>
            <input
              type="number"
              placeholder="₹0"
              className="border border-gray-300 rounded p-2 w-full"
              value={inputs.premiumPrice}
              onChange={(e) =>
                setInputs({ ...inputs, premiumPrice: e.target.value })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-800 mb-2">Simple Guest Limit</p>
            <input
              type="number"
              placeholder="1"
              min="1"
              className="border border-gray-300 rounded p-2 w-full"
              value={inputs.simpleGuestLimit}
              onChange={(e) =>
                setInputs({ ...inputs, simpleGuestLimit: e.target.value })
              }
            />
          </div>
          <div>
            <p className="text-gray-800 mb-2">Luxury Guest Limit</p>
            <input
              type="number"
              placeholder="1"
              min="1"
              className="border border-gray-300 rounded p-2 w-full"
              value={inputs.luxuryGuestLimit}
              onChange={(e) =>
                setInputs({ ...inputs, luxuryGuestLimit: e.target.value })
              }
            />
          </div>
          <div>
            <p className="text-gray-800 mb-2">Premium Guest Limit</p>
            <input
              type="number"
              placeholder="1"
              min="1"
              className="border border-gray-300 rounded p-2 w-full"
              value={inputs.premiumGuestLimit}
              onChange={(e) =>
                setInputs({ ...inputs, premiumGuestLimit: e.target.value })
              }
            />
          </div>
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
        disabled={submitting || !isAuthenticated}
        className={`px-8 py-2 rounded mt-8 cursor-pointer mb-20 add-room-btn ${
          submitting || !isAuthenticated
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-800 text-white hover:bg-blue-900"
        }`}
      >
        {submitting ? "Updating Room..." : "Update Room"}
      </button>
    </form>
  );
};

export default UpdateRoom;
