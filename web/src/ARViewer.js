import React from "react";

function ARViewer() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>🕊️ View Tombstone in AR</h2>
      <model-viewer
        src="/models/Tombstones.glb"
        ar
        ar-modes="scene-viewer webxr quick-look"
        auto-rotate
        camera-controls
        style={{ width: "100%", height: "80vh", background: "#eee" }}
      >
      </model-viewer>
    </div>
  );
}

export default ARViewer;
