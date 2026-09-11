import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

import homeIcon from "./assets/icons/home.png";       // 🆕 Add this PNG in your icons folder
import profileIcon from "./assets/icons/profile.png";
import tombIcon from "./assets/icons/3d.png";
import qrIcon from "./assets/icons/qr.png";
import shareIcon from "./assets/icons/sharing.png";
import chatIcon from "./assets/icons/chatbot.png";
import logoutIcon from "./assets/icons/logout.png";

const Sidebar = ({ onClose, onLogout, onOpenChatbox }) => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: homeIcon, label: "Home", path: "/wall" },                            // 🆕 Home added at top
    { icon: profileIcon, label: "Profile", path: "/profile" },
    { icon: tombIcon, label: "My Tombstone", path: "/create-tombstone" },
    { icon: qrIcon, label: "QR Code", path: "/qr" },
    { icon: shareIcon, label: "Share Access", path: "/share" },
    { icon: chatIcon, label: "AI Chatbox", onClick: onOpenChatbox },
    { icon: logoutIcon, label: "Logout", onClick: onLogout },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "230px",
        height: "100%",
        background: "#f9f4ed",
        boxShadow: "2px 0 6px rgba(0,0,0,0.1)",
        padding: "60px 10px 20px",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      }}
    >
      {menuItems.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            if (item.path) navigate(item.path);
            if (item.onClick) item.onClick();
            onClose();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "background 0.2s",
            fontWeight: 500
          }}
          className="sidebar-item"
        >
          <img src={item.icon} alt={item.label} style={{ width: "22px", marginRight: "12px" }} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
