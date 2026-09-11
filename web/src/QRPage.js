import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { getAuth } from "firebase/auth";

function QRPage() {
  const [isPublic, setIsPublic] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    }
  }, []);

  const profileLink = `http://192.168.178.98:3000/profile/${userId}`;

  const handleToggleAccess = () => {
    setIsPublic(!isPublic);
    // TODO: Update public access in Firestore
    alert(`Access changed to: ${!isPublic ? "Public" : "Private"}`);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(profileLink);
      alert("Profile link copied to clipboard!");
    } catch (err) {
      alert("Failed to copy the link.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "2rem auto",
        padding: "2rem",
        background: "#fff",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        fontFamily: "'Josefin Sans', sans-serif"
      }}
    >
      <h2 style={{ fontWeight: "700", fontSize: "24px", marginBottom: "1rem" }}>
        QR Code Page
      </h2>

      <p style={{ marginBottom: "1rem" }}>
        Friends and family can scan this QR to view the profile and memory wall.
        They can post notes and view AR but cannot edit anything.
      </p>

      {userId ? (
        <>
          <QRCodeCanvas value={profileLink} size={200} style={{ marginBottom: "1rem" }} />

          <div style={{ margin: "1rem 0" }}>
            <p>
              <strong>Public Access:</strong> {isPublic ? "Enabled" : "Disabled"}
            </p>
            <button
              onClick={handleToggleAccess}
              style={{
                padding: "0.4rem 1rem",
                background: isPublic ? "#f44336" : "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              {isPublic ? "Disable Public Access" : "Enable Public Access"}
            </button>
          </div>

          <button
            onClick={handleShare}
            style={{
              marginTop: "1rem",
              padding: "0.6rem 1.2rem",
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600"
            }}
          >
            Copy QR Link
          </button>
        </>
      ) : (
        <p>Loading QR code...</p>
      )}
    </div>
  );
}

export default QRPage;
