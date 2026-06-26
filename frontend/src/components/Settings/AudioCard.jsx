import { useState, useEffect, useRef } from "react";
import { Volume2, Mic, Play, Square } from "lucide-react";

export default function AudioCard() {
  const [audioOutputs, setAudioOutputs] = useState([]);
  const [audioInputs, setAudioInputs] = useState([]);
  
  const [selectedSpeaker, setSelectedSpeaker] = useState("");
  const [selectedMic, setSelectedMic] = useState("");
  const [volume, setVolume] = useState(100);
  
  const [isTestingSpeaker, setIsTestingSpeaker] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micError, setMicError] = useState("");
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);
  const silenceTimerRef = useRef(null);
  
  const audioBarRef = useRef(null);
  const statusRef = useRef(null);
  const audioTestRef = useRef(new Audio("/sounds/Testing Music.mp3"));

  useEffect(() => {
    async function fetchDevices() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          setMicError("Your browser does not support media devices.");
          return;
        }
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const outputs = devices.filter(d => d.kind === "audiooutput");
        const inputs = devices.filter(d => d.kind === "audioinput");
        setAudioOutputs(outputs);
        setAudioInputs(inputs);
        
        const savedSettings = JSON.parse(localStorage.getItem("settings")) || {};
        if (savedSettings.speaker && outputs.some(o => o.deviceId === savedSettings.speaker)) {
          setSelectedSpeaker(savedSettings.speaker);
        } else if (outputs.length > 0) {
          setSelectedSpeaker(outputs[0].deviceId);
        }
        
        if (savedSettings.microphone && inputs.some(i => i.deviceId === savedSettings.microphone)) {
          setSelectedMic(savedSettings.microphone);
        } else if (inputs.length > 0) {
          setSelectedMic(inputs[0].deviceId);
        }
      } catch (e) {
        console.error("Error fetching devices", e);
      }
    }
    
    // Request permission to ensure we get labels
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          stream.getTracks().forEach(track => track.stop());
          fetchDevices();
        })
        .catch(err => {
          console.warn("Permission denied for audio, labels might be missing.", err);
          fetchDevices();
        });
    } else {
      fetchDevices();
    }

    const audio = audioTestRef.current;
    const handleEnded = () => {
      setIsTestingSpeaker(false);
      setAudioProgress(0);
    };
    const handleTimeUpdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      stopMicTest();
      
      // Also stop audio if unmounted
      audio.pause();
    };
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

  const handleSpeakerChange = (e) => {
    const val = e.target.value;
    setSelectedSpeaker(val);
    saveSetting("speaker", val);
  };

  const handleMicChange = (e) => {
    const val = e.target.value;
    setSelectedMic(val);
    saveSetting("microphone", val);
    if (isTestingMic) {
      stopMicTest();
      setTimeout(() => startMicTest(val), 100);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    audioTestRef.current.volume = val / 100;
  };

  const testSpeaker = async () => {
    if (audioOutputs.length === 0 && !selectedSpeaker) {
      alert("No speaker device detected.");
      return;
    }
    
    setIsTestingSpeaker(true);
    setAudioProgress(0);
    const audio = audioTestRef.current;
    
    try {
      console.log("Audio Source:", audio.src);
      console.log("Ready State:", audio.readyState);
      console.log("Current Time:", audio.currentTime);
      console.log("Duration:", audio.duration);

      if (typeof audio.setSinkId === 'function' && selectedSpeaker) {
        await audio.setSinkId(selectedSpeaker).catch(e => {
           console.warn("setSinkId failed, gracefully falling back.", e);
        });
      }
      audio.currentTime = 0;
      await audio.play();
    } catch (e) {
      console.error("Browser autoplay error or Promise rejection:", e);
      alert("Unable to load speaker test audio.");
      setIsTestingSpeaker(false);
      setAudioProgress(0);
    }
  };

  const stopSpeakerTest = () => {
    const audio = audioTestRef.current;
    audio.pause();
    audio.currentTime = 0;
    setIsTestingSpeaker(false);
    setAudioProgress(0);
  };

  const startMicTest = async (deviceId = selectedMic) => {
    setMicError("");
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("NotSupportedError");
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: deviceId ? { exact: deviceId } : undefined }
      });
      
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const microphone = audioCtx.createMediaStreamSource(stream);
      
      analyser.smoothingTimeConstant = 0.5; // more responsive
      analyser.fftSize = 256;
      
      microphone.connect(analyser);
      
      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;
      microphoneRef.current = stream;
      
      setIsTestingMic(true);
      
      // Reset visual state
      if (statusRef.current) statusRef.current.innerText = "Listening...";
      
      // Start loop
      checkAudioLevel();
    } catch (err) {
      console.error("Error accessing microphone", err);
      setIsTestingMic(false);
      if (err.name === 'NotAllowedError') {
        setMicError("Microphone permission denied.");
      } else if (err.name === 'NotFoundError') {
        setMicError("No microphone detected.");
      } else if (err.message === 'NotSupportedError') {
        setMicError("Your browser does not support microphone testing.");
      } else {
        setMicError("An error occurred while accessing the microphone.");
      }
    }
  };

  const stopMicTest = () => {
    setIsTestingMic(false);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (microphoneRef.current) {
      microphoneRef.current.getTracks().forEach(track => track.stop());
      microphoneRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.warn);
      audioContextRef.current = null;
    }
    
    // Reset bar
    if (audioBarRef.current) {
      audioBarRef.current.style.width = "0%";
    }
  };

  const checkAudioLevel = () => {
    if (!analyserRef.current) return;
    
    const array = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(array);
    let values = 0;
    const length = array.length;
    for (let i = 0; i < length; i++) {
      values += array[i];
    }
    const average = values / length;
    
    // Scale for visual meter. Average is typically low (0-50). 
    // Multiply by 3 to make it reach 100% easier on normal speaking volumes.
    const level = Math.min(100, Math.round(average * 3));
    
    // Update DOM directly for smooth 60fps performance without React re-renders
    if (audioBarRef.current) {
      audioBarRef.current.style.width = `${level}%`;
    }
    
    if (level > 10) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (statusRef.current && statusRef.current.innerText !== "Listening...") {
        statusRef.current.innerText = "Listening...";
      }
    } else {
      if (!silenceTimerRef.current) {
        silenceTimerRef.current = setTimeout(() => {
          if (statusRef.current) {
            statusRef.current.innerText = "No voice detected.";
          }
        }, 1500); // 1.5 seconds of silence
      }
    }
    
    // Continue loop
    animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
  };

  return (
    <div className="settings-module-card">
      <div className="settings-module-header">
        <Volume2 size={20} />
        Audio Settings
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Speaker Section */}
        <div>
          <div className="settings-control-group">
            <label>Speaker</label>
            <select className="settings-select" value={selectedSpeaker} onChange={handleSpeakerChange}>
              {audioOutputs.length === 0 && <option value="">Default Speaker</option>}
              {audioOutputs.map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Speaker (${device.deviceId.slice(0,5)}...)`}
                </option>
              ))}
            </select>
          </div>
          
          <div className="settings-control-group">
            <label>Volume</label>
            <input 
              type="range" 
              min="0" max="100" 
              value={volume} 
              onChange={handleVolumeChange} 
              style={{ width: "100%", accentColor: "var(--primary)" }}
            />
          </div>
          
          {!isTestingSpeaker ? (
            <button 
              className="settings-action-btn" 
              onClick={testSpeaker}
            >
              <Play size={16} /> Test Speaker
            </button>
          ) : (
            <button 
              className="settings-action-btn active" 
              onClick={stopSpeakerTest}
            >
              <Square size={16} /> Stop Test
            </button>
          )}

          {isTestingSpeaker && (
             <div style={{ marginTop: "12px" }}>
               <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                 Playing...
               </span>
               <div className="audio-level-container" style={{ background: "var(--bg-dark)", marginTop: "8px" }}>
                 <div className="audio-level-bar" style={{ width: `${audioProgress}%`, background: "var(--primary)", transition: "width 0.1s linear" }}></div>
               </div>
             </div>
          )}
        </div>

        {/* Microphone Section */}
        <div>
          <div className="settings-control-group">
            <label>Microphone</label>
            <select className="settings-select" value={selectedMic} onChange={handleMicChange}>
              {audioInputs.length === 0 && <option value="">Default Microphone</option>}
              {audioInputs.map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Microphone (${device.deviceId.slice(0,5)}...)`}
                </option>
              ))}
            </select>
          </div>
          
          {!isTestingMic ? (
            <button className="settings-action-btn" onClick={() => startMicTest(selectedMic)}>
              <Mic size={16} /> Test Microphone
            </button>
          ) : (
            <button className="settings-action-btn active" onClick={stopMicTest}>
              <Square size={16} /> Stop Test
            </button>
          )}

          {micError && (
            <div style={{ marginTop: "12px", color: "var(--danger)", fontSize: "13px" }}>
              {micError}
            </div>
          )}

          <div style={{ marginTop: "12px", display: isTestingMic && !micError ? "block" : "none" }}>
            <span ref={statusRef} style={{ fontSize: "13px", color: "var(--text-muted)", transition: "color 0.2s" }}>
              Listening...
            </span>
            <div className="audio-level-container" style={{ background: "var(--bg-dark)", marginTop: "8px" }}>
              <div 
                ref={audioBarRef}
                className="audio-level-bar" 
                style={{ 
                  width: "0%", 
                  background: "linear-gradient(90deg, #10b981 0%, #f59e0b 70%, #ef4444 100%)",
                  transition: "width 0.05s ease-out" 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
