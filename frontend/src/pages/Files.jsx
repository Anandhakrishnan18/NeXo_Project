import Layout from "../components/Layout";
import "../styles/files.css";
import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import socket from "../socket";

function Files() {
  const [contextType, setContextType] = useState("team"); // 'team' or 'meeting'
  const [teams, setTeams] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [selectedContextId, setSelectedContextId] = useState("");
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchTeams();
    fetchMeetings();
  }, []);

  useEffect(() => {
    if (selectedContextId) {
      fetchFiles();
    } else {
      setFiles([]);
    }
  }, [selectedContextId, contextType]);

  useEffect(() => {
    const handleFileUploaded = (file) => {
      if (
        (contextType === "team" && file.teamId === selectedContextId) ||
        (contextType === "meeting" && file.meetingId === selectedContextId)
      ) {
        setFiles((prev) => {
          if (prev.find((f) => f._id === file._id)) return prev;
          return [file, ...prev];
        });
      }
    };

    const handleFileDeleted = (fileId) => {
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
    };

    socket.on("file-uploaded", handleFileUploaded);
    socket.on("file-deleted", handleFileDeleted);

    return () => {
      socket.off("file-uploaded", handleFileUploaded);
      socket.off("file-deleted", handleFileDeleted);
    };
  }, [contextType, selectedContextId]);

  const fetchTeams = async () => {
    try {
      const res = await API.get("/teams");
      setTeams(res.data);
      if (res.data.length > 0 && contextType === "team" && !selectedContextId) {
        setSelectedContextId(res.data[0]._id);
      }
    } catch (err) {
      console.error("Error fetching teams:", err);
    }
  };

  const fetchMeetings = async () => {
    try {
      const res = await API.get("/meetings");
      setMeetings(res.data);
    } catch (err) {
      console.error("Error fetching meetings:", err);
    }
  };

  const fetchFiles = async () => {
    if (!selectedContextId) return;
    try {
      const endpoint = contextType === "team" 
        ? `/files?teamId=${selectedContextId}` 
        : `/files?meetingId=${selectedContextId}`;
      const res = await API.get(endpoint);
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const handleContextTypeChange = (e) => {
    const newType = e.target.value;
    setContextType(newType);
    if (newType === "team" && teams.length > 0) {
      setSelectedContextId(teams[0]._id);
    } else if (newType === "meeting" && meetings.length > 0) {
      setSelectedContextId(meetings[0]._id);
    } else {
      setSelectedContextId("");
    }
  };

  const handleFileUpload = async (file) => {
    if (!file || !selectedContextId) return;

    const formData = new FormData();
    formData.append("file", file);
    if (contextType === "team") {
      formData.append("teamId", selectedContextId);
    } else {
      formData.append("meetingId", selectedContextId);
    }

    try {
      setUploadProgress(10);
      await API.post("/files/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      setTimeout(() => setUploadProgress(0), 1000);
      // Real-time socket will update the list
    } catch (err) {
      console.error("Error uploading file:", err);
      alert(err.response?.data?.message || "Failed to upload file.");
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async (fileId) => {
    if (window.confirm("Are you sure you want to delete this file? This will remove it from the server.")) {
      try {
        await API.delete(`/files/${fileId}`);
        // Real-time socket will remove it from list
      } catch (err) {
        console.error("Error deleting file:", err);
        alert("Failed to delete file.");
      }
    }
  };

  const handleSecureDownload = async (file) => {
    try {
      const res = await API.get(`/files/download/${file._id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.originalName || file.fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error securely downloading file:", err);
      alert("Failed to securely download file.");
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return "📄";
    const ext = fileName.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf": return "📕";
      case "doc":
      case "docx": return "📘";
      case "xls":
      case "xlsx": return "📊";
      case "ppt":
      case "pptx": return "📙";
      case "png":
      case "jpg":
      case "jpeg":
      case "gif": return "🖼️";
      case "mp4":
      case "mov": return "🎥";
      case "zip":
      case "rar": return "📦";
      case "txt": return "📝";
      default: return "📄";
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredFiles = files.filter((f) => {
    const name = f.originalName || f.fileName;
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const canPreview = (fileName) => {
    if (!fileName) return false;
    const ext = fileName.split(".").pop().toLowerCase();
    return ["png", "jpg", "jpeg", "gif", "pdf", "mp4"].includes(ext);
  };

  // Preview fallback using secure API fetch (needs custom component or direct object URL)
  // For images and PDFs, fetching and setting Object URL is required if auth is mandatory
  const openPreview = async (file) => {
    try {
      const res = await API.get(`/files/download/${file._id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data], { type: file.mimeType }));
      setPreviewFile({ ...file, previewUrl: url });
    } catch (err) {
      console.error("Failed to load preview:", err);
      alert("Failed to load preview.");
    }
  };

  const closePreview = () => {
    if (previewFile?.previewUrl) {
      window.URL.revokeObjectURL(previewFile.previewUrl);
    }
    setPreviewFile(null);
  };

  return (
    <Layout>
      <div className="files-header">
        <div>
          <h1>Files</h1>
          <p>Share, organize, and preview assets across your teams and meetings.</p>
        </div>
      </div>

      <div className="team-selector-container" style={{ display: "flex", gap: "15px", alignItems: "center", marginBottom: "20px" }}>
        <div>
          <span style={{ fontWeight: "600", color: "#475569", marginRight: "10px" }}>Context:</span>
          <select
            className="team-selector"
            value={contextType}
            onChange={handleContextTypeChange}
          >
            <option value="team">Team Workspace</option>
            <option value="meeting">Meeting Room</option>
          </select>
        </div>

        <div>
          <span style={{ fontWeight: "600", color: "#475569", marginRight: "10px" }}>Select:</span>
          <select
            className="team-selector"
            value={selectedContextId}
            onChange={(e) => setSelectedContextId(e.target.value)}
            disabled={!selectedContextId && ((contextType === "team" && teams.length === 0) || (contextType === "meeting" && meetings.length === 0))}
          >
            {contextType === "team" ? (
              teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.name}
                </option>
              ))
            ) : (
              meetings.map((meeting) => (
                <option key={meeting._id} value={meeting._id}>
                  {meeting.title}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {selectedContextId ? (
        <div>
          {/* Drag & Drop Upload Zone */}
          <div
            className={`drag-drop-zone ${dragActive ? "active" : ""}`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
            style={{ position: "relative" }}
          >
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {uploadProgress > 0 ? (
              <div style={{ padding: "30px 0" }}>
                <h3 style={{ color: "#3b82f6" }}>Uploading... {uploadProgress}%</h3>
                <div style={{ width: "100%", height: "8px", background: "#334155", borderRadius: "4px", marginTop: "15px" }}>
                  <div style={{ width: `${uploadProgress}%`, height: "100%", background: "#3b82f6", borderRadius: "4px", transition: "width 0.2s" }} />
                </div>
              </div>
            ) : (
              <>
                <span style={{ fontSize: "40px" }}>📤</span>
                <h3>Drag & Drop File Here</h3>
                <p>or click to browse from your device</p>
                <p style={{ fontSize: "12px", color: "#64748b", marginTop: "10px" }}>
                  Supported: PDF, DOCX, PPTX, XLSX, ZIP, PNG, JPG, MP4 (Max: 50MB)
                </p>
              </>
            )}
          </div>

          <div style={{ marginBottom: "25px", display: "flex", justifyContent: "flex-end" }}>
            <input
              className="file-search"
              placeholder={`Search files in this ${contextType}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredFiles.length === 0 ? (
            <div className="files-empty">
              <span>📂</span>
              <h3>No files found</h3>
              <p>Upload a file using the dropzone above to get started.</p>
            </div>
          ) : (
            <div className="files-grid">
              {filteredFiles.map((file) => {
                const displayName = file.originalName || file.fileName;
                return (
                  <div key={file._id} className="file-card">
                    <div className="file-info-main">
                      <div className="file-icon">{getFileIcon(displayName)}</div>
                      <div className="file-details">
                        <h3 title={displayName}>{displayName}</h3>
                        <p>By: {file.uploadedBy?.username || "Unknown"} • {formatBytes(file.fileSize)}</p>
                        <p>{new Date(file.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="file-actions">
                      {canPreview(displayName) && (
                        <button
                          className="file-btn"
                          onClick={() => openPreview(file)}
                        >
                          👁️ Preview
                        </button>
                      )}
                      <button
                        className="file-btn download-btn"
                        onClick={() => handleSecureDownload(file)}
                      >
                        📥 Download
                      </button>
                      <button
                        className="file-btn delete-btn"
                        onClick={() => handleDelete(file._id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="files-empty">
          <span>👥</span>
          <h3>No {contextType}s available</h3>
          <p>Please create or join a {contextType} first to manage files.</p>
        </div>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <div className="preview-modal-overlay" onClick={closePreview}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal-header">
              <h2>{previewFile.originalName || previewFile.fileName}</h2>
              <button
                className="close-modal-btn"
                onClick={closePreview}
              >
                ✕
              </button>
            </div>
            <div className="preview-modal-content">
              {previewFile.mimeType === "application/pdf" ? (
                <iframe
                  src={previewFile.previewUrl}
                  title="PDF Preview"
                />
              ) : previewFile.mimeType === "video/mp4" ? (
                <video controls src={previewFile.previewUrl} style={{ width: "100%", maxHeight: "70vh" }} />
              ) : (
                <img
                  src={previewFile.previewUrl}
                  alt={previewFile.originalName}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Files;