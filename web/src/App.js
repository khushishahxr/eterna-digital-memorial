import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import './styles.css';
import logo from "./assets/icons/logo.png";
import arIcon from "./assets/icons/AR.png";

import MemoryWall from "./MemoryWall";
import ARViewer from "./ARViewer";
import ProfilePage from "./ProfilePage";
import Login from "./Login";
import MemoryForm from "./MemoryForm";
import Sidebar from "./Sidebar";
import TombstoneCreator from "./TombstoneCreator";
import QRPage from './QRPage';

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const auth = getAuth();
  const navigate = useNavigate();
  const isGuest = new URLSearchParams(window.location.search).get("guest") === "true";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const sidebarWidth = showSidebar ? 250 : 0;

  return (
    <>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          background: "#fff",
          zIndex: 1001,
          padding: "10px 20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <img src={logo} alt="App Logo" style={{ width: "40px", marginRight: "8px" }} />
          <span style={{ fontSize: "1.8rem", fontWeight: "bold", fontFamily: "SpaceMono-Regular" }}>
            ETERNA
          </span>
        </div>

        <img
          src={arIcon}
          alt="AR View"
          onClick={() => navigate("/ar")}
          style={{
            position: "absolute",
            right: "60px",
            top: "16px",
            width: "28px",
            height: "28px",
            cursor: "pointer"
          }}
        />
      </div>

      {showSidebar && (
        <Sidebar
          onClose={() => setShowSidebar(false)}
          onLogout={() => {
            signOut(auth).then(() => setUser(null));
          }}
          onOpenChatbox={() => {
            setShowSidebar(false);
            setShowChat(true);
          }}
        />
      )}

      {showChat && (
        <div
          style={{
            position: "fixed",
            top: "100px",
            right: "20px",
            width: "250px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            background: "#fff",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
            padding: "10px",
            cursor: "move"
          }}
          draggable="true"
          onDragEnd={(e) => {
            const chat = e.target;
            chat.style.top = `${e.clientY}px`;
            chat.style.left = `${e.clientX}px`;
            chat.style.right = "auto";
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
            <span style={{ fontWeight: "bold" }}>AI CHATBOX</span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setMinimized(!minimized)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  padding: "0",
                  lineHeight: "1",
                  color: "#333"
                }}
                title="Minimize"
              >
                -
              </button>
              <button
                onClick={() => setShowChat(false)}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  padding: "0",
                  lineHeight: "1",
                  color: "#333"
                }}
                title="Close"
              >
                x
              </button>
            </div>
          </div>
          {!minimized && (
            <div style={{ minHeight: "50px", textAlign: "center", color: "#666" }}>
              AI CHATBOX COMING SOON
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div
        style={{
          marginLeft: sidebarWidth ? sidebarWidth + 16 : 0,
          transition: "margin-left 0.3s ease",
          paddingTop: "4rem",
          paddingBottom: "70px",
          position: "relative",
        }}
      >
        {user && !isGuest ? (
          <Routes>
            <Route path="/" element={<MemoryWall />} />
            <Route path="/wall" element={<MemoryWall />} />
            <Route path="/ar" element={<ARViewer />} />
            <Route path="/create" element={<MemoryForm />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/qr" element={<QRPage />} />
            <Route path="/share" element={<p>🔗 Share Access Page</p>} />
            <Route path="/create-tombstone" element={<TombstoneCreator />} />
          </Routes>
        ) : isGuest ? (
          <Routes>
            <Route path="/" element={<MemoryWall />} />
            <Route path="/wall" element={<MemoryWall />} />
            <Route path="/ar" element={<p>📷 AR View (Guest)</p>} />
            <Route path="/profile" element={<p>👤 Guest Profile Page</p>} />
            <Route path="/create-tombstone" element={<TombstoneCreator />} />
          </Routes>
        ) : (
          <Login onLogin={setUser} />
        )}
      </div>
    </>
  );
}

export default AppWrapper;
