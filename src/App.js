import React, { useRef, useEffect, useState } from 'react';

function App() {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [stream, setStream] = useState(null);

  const getVideo = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const camera = devices.find(device => device.kind === 'videoinput');
      
      if (!camera) {
        throw new Error('No camera found');
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: camera.deviceId },
        audio: false
      });
      
      setStream(mediaStream);
      let video = videoRef.current;
      video.srcObject = mediaStream;
      video.play();
    } catch (err) {
      console.error(err);
    }
  };

  const takePhoto = () => {
    const width = 400;
    const height = width / (16/9);
    let video = videoRef.current;
    let photo = photoRef.current;
    photo.width = width;
    photo.height = height;
    let ctx = photo.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    setHasPhoto(true);
  };

  const closePhoto = () => {
    let photo = photoRef.current;
    let ctx = photo.getContext('2d');
    ctx.clearRect(0, 0, photo.width, photo.height);
    setHasPhoto(false);
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };
  useEffect(() => {
    getVideo();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }
  , []);   
  return (
    <div className="App">
      <div className="Camera">
        <video ref={videoRef} />
        <button onClick={takePhoto}>SNAP!</button>
      </div>
      <div className={'result' + (hasPhoto ? ' hasPhoto' : '')}>
        <canvas ref={photoRef} />
        <button onClick={closePhoto}>Close</button>
      </div>
    </div>
  );
}

export default App;
