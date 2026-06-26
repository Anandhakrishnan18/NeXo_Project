import { useState, useEffect, useRef } from "react";
import { Camera, Play, Square, RefreshCcw } from "lucide-react";

export default function VideoCard() {
  const [videoInputs, setVideoInputs] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    async function fetchDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(d => d.kind === "videoinput");
        setVideoInputs(cameras);
        
        const savedSettings = JSON.parse(localStorage.getItem("settings")) || {};
        if (savedSettings.camera && cameras.some(c => c.deviceId === savedSettings.camera)) {
          setSelectedCamera(savedSettings.camera);
        } else if (cameras.length > 0) {
          setSelectedCamera(cameras[0].deviceId);
        }
      } catch (e) {
        console.error("Error fetching cameras", e);
      }
    }
    
    // Request permission to get labels
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        stream.getTracks().forEach(track => track.stop());
        fetchDevices();
      })
      .catch(err => {
        console.warn("Permission denied for video, labels might be missing.", err);
        fetchDevices();
      });

    return () => stopCamera();
  }, []);

  const saveSetting = (key, value) => {
    try {
      const savedSettings = JSON.parse(localStorage.getItem("settings")) || {};
      savedSettings[key] = value;
      localStorage.setItem("settings", JSON.stringify(savedSettings));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCameraChange = (e) => {
    const val = e.target.value;
    setSelectedCamera(val);
    saveSetting("camera", val);
    if (isCameraActive) {
      // Switch active camera
      stopCamera();
      setTimeout(() => startCamera(val), 100);
    }
  };

  const startCamera = async (deviceId = selectedCamera) => {
    setErrorMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: deviceId ? { exact: deviceId } : undefined }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error starting camera", err);
      if (err.name === 'NotAllowedError') {
        setErrorMsg("Permission denied to access camera.");
      } else if (err.name === 'NotFoundError') {
        setErrorMsg("No camera detected.");
      } else {
        setErrorMsg("Camera unavailable.");
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const switchCamera = () => {
    if (videoInputs.length < 2) return;
    const currentIndex = videoInputs.findIndex(c => c.deviceId === selectedCamera);
    const nextIndex = (currentIndex + 1) % videoInputs.length;
    const nextCamera = videoInputs[nextIndex].deviceId;
    
    setSelectedCamera(nextCamera);
    saveSetting("camera", nextCamera);
    
    stopCamera();
    setTimeout(() => startCamera(nextCamera), 100);
  };

  return (
    <div className="settings-module-card">
      <div className="settings-module-header">
        <Camera size={20} />
        Video Settings
      </div>
      
      <div className="settings-control-group">
        <label>Camera Selection</label>
        <select className="settings-select" value={selectedCamera} onChange={handleCameraChange}>
          {videoInputs.length === 0 && <option value="">Default Camera</option>}
          {videoInputs.map(device => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera (${device.deviceId.slice(0,5)}...)`}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        {!isCameraActive ? (
          <button className="settings-action-btn" onClick={() => startCamera(selectedCamera)}>
            <Play size={16} /> Start Camera
          </button>
        ) : (
          <button className="settings-action-btn active" onClick={stopCamera}>
            <Square size={16} /> Stop Camera
          </button>
        )}
        
        {videoInputs.length > 1 && (
          <button className="settings-action-btn" onClick={switchCamera}>
            <RefreshCcw size={16} /> Switch Camera
          </button>
        )}
      </div>

      <div className="video-preview-container">
        {errorMsg ? (
          <div className="video-placeholder">
            <span style={{ color: "var(--danger)" }}>{errorMsg}</span>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              style={{ display: isCameraActive ? 'block' : 'none' }}
            />
            {!isCameraActive && (
              <div className="video-placeholder">
                <Camera size={32} opacity={0.5} />
                <span>Camera preview is off</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
