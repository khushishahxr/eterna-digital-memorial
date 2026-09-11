import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MemoryForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_preset"); // we'll create this next

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dwsns6rxa/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error("Cloudinary upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.warning("Please select an image.");
      return;
    }

    if (image.size > 5 * 1024 * 1024) {
      toast.error("Image too large. Max 5MB.");
      return;
    }

    setIsLoading(true);
    toast.info("Uploading memory...");

    try {
      const imageUrl = await uploadToCloudinary(image);

      await addDoc(collection(db, "memories"), {
        name,
        message,
        imageUrl,
        likes: 0,
        createdAt: new Date(),
      });

      toast.success("Memory submitted successfully! 🕊️");
      setName("");
      setMessage("");
      setImage(null);
      setPreviewURL(null);
    } catch (error) {
      console.error("CLOUDINARY ERROR:", error);
      toast.error("Upload failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewURL(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewURL(null);
    }
  };

  return (
    <div className="container">
      <h2>Share a Memory</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name of the Deceased"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Write a memory or message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <input type="file" accept="image/*" onChange={handleImageChange} required />
        {previewURL && (
          <img
            src={previewURL}
            alt="Preview"
            style={{ width: "100%", borderRadius: "8px", marginTop: "10px" }}
          />
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Memory"}
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default MemoryForm;
