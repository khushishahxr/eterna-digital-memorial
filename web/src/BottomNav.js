import React from "react";
import { Link } from "react-router-dom";
import wallIcon from "./assets/icons/home.png";
import createIcon from "./assets/icons/create.png";
import arIcon from "./assets/icons/AR.png";
import profileIcon from "./assets/icons/profile.png";

export default function BottomNav({ isGuest }) {
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        background: "#fff",
        borderTop: "1px solid #ccc",
        display: "flex",
        justifyContent: "space-around",
        padding: "0.5rem 0",
        zIndex: 1000,
      }}
    >
      <Link to="/wall" style={{ textAlign: "center" }}>
        <img src={wallIcon} alt="Wall" style={{ width: "28px", height: "28px" }} />
      </Link>

      {!isGuest && (
        <Link to="/create" style={{ textAlign: "center" }}>
          <img src={createIcon} alt="Create" style={{ width: "28px", height: "28px" }} />
        </Link>
      )}

      <Link to="/ar" style={{ textAlign: "center" }}>
        <img src={arIcon} alt="AR" style={{ width: "28px", height: "28px" }} />
      </Link>

      <Link to="/profile" style={{ textAlign: "center" }}>
        <img src={profileIcon} alt="Profile" style={{ width: "28px", height: "28px" }} />
      </Link>
    </nav>
  );
}
