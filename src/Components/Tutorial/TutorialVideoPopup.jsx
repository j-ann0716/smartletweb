import { useEffect, useRef } from 'react';

export default function TutorialVideoPopup({ onClose, videoSrc }) {
  const videoRef = useRef(null);

  // Stop video playback when popup is closed
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg overflow-hidden w-[90vw] max-w-xl shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-gray-300 hover:bg-gray-400 rounded-full p-1"
          aria-label="Close tutorial video"
        >
          ✕
        </button>

        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          controls={false}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}