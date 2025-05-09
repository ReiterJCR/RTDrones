'use client';
import { useState, useEffect, useCallback } from 'react';

const VIDEO_FILE = 'dronefootage.mp4';

export default function VideoBackground() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadVideo = useCallback(async () => {
    try {
      const res = await fetch(`/api/signed-url?video=${encodeURIComponent(VIDEO_FILE)}`);
      const contentType = res.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Expected JSON, got: ${text.slice(0, 100)}`);
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unknown error');
      if (!data.url) throw new Error('No URL returned');

      setVideoUrl(data.url);
      setError(null);
    } catch (err) {
      console.error('Video load error:', err);
      setError('Failed to load background video');
    }
  }, []);

  useEffect(() => {
    loadVideo();
  }, [loadVideo]);

  if (error) {
    console.warn(error);
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-green-800 to-green-600" />
    );
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {videoUrl ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setError('Video playback failed')}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : null}
      <div className="absolute inset-0 bg-green-900/30" />
    </div>
  );
}