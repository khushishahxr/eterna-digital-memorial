import React, { useEffect, useState, useRef } from "react";
import { db, storage } from "./firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./StickyNotes.css";

function MemoryWall() {
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editText, setEditText] = useState("");
  const fileInputRefs = useRef({});
  const containerRef = useRef(null);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(collection(db, "stickyNotes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesArray);
    });
    return () => unsubscribe();
  }, []);

  const createNote = async (x, y) => {
    const newNote = {
      text: "New memory...",
      x,
      y,
      createdBy: user?.displayName || "Anonymous",
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, "stickyNotes"), newNote);
  };

  const handleRightClick = (e) => {
    if (window.innerWidth <= 768) return;
    e.preventDefault();
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createNote(x, y);
  };

  const handleLongPress = (e) => {
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    setTimeout(() => createNote(x, y), 500);
  };

  const handleTextClick = (note) => {
    if (window.innerWidth <= 768) {
      setEditingNoteId(note.id);
      setEditText(note.text);
    }
  };

  const handleDrag = async (noteId, deltaX, deltaY) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    const newX = (note.x || 0) + deltaX;
    const newY = (note.y || 0) + deltaY;

    await updateDoc(doc(db, "stickyNotes", noteId), {
      x: newX,
      y: newY,
    });
  };

  const handleDelete = async (noteId) => {
    await deleteDoc(doc(db, "stickyNotes", noteId));
  };

  const handleEdit = async (noteId) => {
    if (editText.trim() !== "") {
      await updateDoc(doc(db, "stickyNotes", noteId), {
        text: editText,
      });
      setEditingNoteId(null);
      setEditText("");
    }
  };

  const handleFileUpload = async (noteId, file) => {
    const storageRef = ref(storage, `stickyNotes/${noteId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);
    await updateDoc(doc(db, "stickyNotes", noteId), {
      imageUrl,
    });

    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, imageUrl } : note
      )
    );
  };

  return (
    <div
      className="container"
      onContextMenu={handleRightClick}
      onTouchStart={handleLongPress}
      ref={containerRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100vw",
        backgroundImage: "url('/images/wall-bg.png')",
        backgroundSize: "cover",
        backgroundRepeat: "repeat-y",
        backgroundPosition: "top center",
        backgroundAttachment: "fixed",
        overflow: "hidden",
      }}
    >
      {/* Black overlay for readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          zIndex: 0,
        }}
      ></div>

      {/* Sticky notes container */}
      <div style={{ position: "relative", zIndex: 1, padding: "20px" }}>
        <h3 style={{ color: "white", textAlign: "center"}}>This wall is open for your quiet words, shared memories, or unspoken love.</h3>

        {notes.map((note) => (
          <div
            key={note.id}
            className="sticky-note"
            style={{
              position: "absolute",
              left: note.x || 100,
              top: note.y || 100,
              width: "240px",
              height: "240px",
              backgroundImage: `url("/images/sticky-note.png")`,
              backgroundSize: "cover",
              padding: "50px 12px 40px 18px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "move",
            }}
            onMouseDown={(e) => {
              const startX = e.clientX;
              const startY = e.clientY;

              const handleMouseMove = async (moveEvent) => {
                const deltaX = moveEvent.clientX - startX;
                const deltaY = moveEvent.clientY - startY;
                await handleDrag(note.id, deltaX, deltaY);
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
              };

              const handleMouseUp = () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
              };

              document.addEventListener("mousemove", handleMouseMove);
              document.addEventListener("mouseup", handleMouseUp);
            }}
          >
            <div style={{ flex: 1 }}>
              {editingNoteId === note.id ? (
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={{ width: "100%", background: "transparent", border: "none" }}
                />
              ) : (
                <p
                  onClick={() => handleTextClick(note)}
                  style={{ fontWeight: "600", marginTop: "12px" }}
                >
                  {note.text}
                </p>
              )}
              {note.imageUrl && (
                <img
                  src={note.imageUrl}
                  alt="img"
                  style={{ maxHeight: "90px", marginTop: "6px" }}
                />
              )}
            </div>

            {/* Note footer */}
            <div style={{ marginTop: "auto", paddingBottom: "6px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <span style={{ fontSize: "14px", marginBottom: "4px" }}>
                  👤 {note.createdBy}
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => handleDelete(note.id)}>🗑️</button>
                  {editingNoteId === note.id ? (
                    <button onClick={() => handleEdit(note.id)}>💾</button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingNoteId(note.id);
                        setEditText(note.text);
                      }}
                    >
                      ✏️
                    </button>
                  )}
                  <button onClick={() => fileInputRefs.current[note.id]?.click()}>📎</button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => (fileInputRefs.current[note.id] = el)}
                    style={{ display: "none" }}
                    onChange={(e) => handleFileUpload(note.id, e.target.files[0])}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MemoryWall;
