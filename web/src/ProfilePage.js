import React, { useState } from "react";
import { db, storage } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


function ProfilePage({ userId }) {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    dod: "",
    bio: "",
    creatorName: "",
    creatorEmail: "",
    placeOfDeath: "",
    restingPlace: "",
    profileImageUrl: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    const imageRef = ref(storage, `deceasedProfiles/${userId}/profile.jpg`);
    await uploadBytes(imageRef, imageFile);
    return await getDownloadURL(imageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    const imageUrl = imageFile ? await handleImageUpload() : formData.profileImageUrl;
    const finalData = { ...formData, profileImageUrl: imageUrl };
    await setDoc(doc(db, "deceasedProfiles", userId), finalData);
    setUploading(false);
    alert("Profile saved successfully.");
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "2rem auto",
        padding: "2rem",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 0 8px rgba(0,0,0,0.1)",
        fontFamily: "'Josefin Sans', sans-serif",
      }}
    >
      <h2
        style={{
          fontWeight: "700",
          fontSize: "24px",
          marginBottom: "1rem",
        }}
      >
        Deceased Profile Details
      </h2>

      {/* Profile Image Upload */}
      {formData.profileImageUrl && (
        <img
          src={formData.profileImageUrl}
          alt="Profile"
          style={{ width: "120px", borderRadius: "50%", marginBottom: "1rem" }}
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        style={{ marginBottom: "1rem" }}
      />

      {/* Form Fields */}
      <input
        name="fullName"
        placeholder="Full Name of the Deceased"
        onChange={handleChange}
        value={formData.fullName}
        className="input"
        required
      />

      <input
        type="text"
        name="dob"
        onFocus={(e) => (e.target.type = "date")}
        onBlur={(e) => {
          if (!e.target.value) e.target.type = "text";
        }}
        placeholder="Date of Birth"
        onChange={handleChange}
        value={formData.dob}
        className="input"
        required
      />

      <input
        type="text"
        name="dod"
        onFocus={(e) => (e.target.type = "date")}
        onBlur={(e) => {
          if (!e.target.value) e.target.type = "text";
        }}
        placeholder="Date of Death"
        onChange={handleChange}
        value={formData.dod}
        className="input"
        required
      />

      <textarea
        name="bio"
        placeholder="Short Biography or About Them"
        onChange={handleChange}
        value={formData.bio}
        className="input"
        rows="3"
      />

      <input
        name="creatorName"
        placeholder="Creator Name"
        onChange={handleChange}
        value={formData.creatorName}
        className="input"
        required
      />
      <input
        name="creatorEmail"
        type="email"
        placeholder="Creator Email"
        onChange={handleChange}
        value={formData.creatorEmail}
        className="input"
        required
      />
      <input
        name="placeOfDeath"
        placeholder="Place of Death (optional)"
        onChange={handleChange}
        value={formData.placeOfDeath}
        className="input"
      />
      <input
        name="restingPlace"
        placeholder="Resting Place / Memorial Location (optional)"
        onChange={handleChange}
        value={formData.restingPlace}
        className="input"
      />

      <button
        type="submit"
        onClick={handleSubmit}
        disabled={uploading}
        style={{
          marginTop: "1rem",
          padding: "0.6rem 1.2rem",
          background: "#000",
          color: "#fff",
          borderRadius: "6px",
          fontWeight: "600",
        }}
      >
        {uploading ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}

export default ProfilePage;
