import React, { useState, useRef, useEffect } from 'react';
import './TrackMixer.css';

const TrackMixer = ({ filename, channels, onMixDownload, isMixing }) => {
  const [trackVolumes, setTrackVolumes] = useState({});
  const [masterVolume, setMasterVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackMutes, setTrackMutes] = useState({});

  const audioRefs = useRef({});
  const animationFrameRef = useRef(null);

  // Filter out vocals and initialize track states
  const nonVocalChannels = channels.filter(channel => channel !== 'vocals');

  useEffect(() => {
    const initialVolumes = {};
    const initialMutes = {};

    nonVocalChannels.forEach(channel => {
      initialVolumes[channel] = 1;
      initialMutes[channel] = false;
    });

    setTrackVolumes(initialVolumes);
    setTrackMutes(initialMutes);
  }, [channels]);

  // Update time display
  useEffect(() => {
    const updateTime = () => {
      const activeAudios = Object.values(audioRefs.current).filter(audio => audio && !audio.paused);
      if (activeAudios.length > 0) {
        setCurrentTime(activeAudios[0].currentTime);
        setDuration(activeAudios[0].duration);
      }
      animationFrameRef.current = requestAnimationFrame(updateTime);
    };

    if (isPlaying) {
      updateTime();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      // Stop all audio
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) audio.pause();
      });
      setIsPlaying(false);
    } else {
      // Start playing
      const activeChannels = nonVocalChannels.filter(channel => !trackMutes[channel]);

      if (activeChannels.length > 0) {
        activeChannels.forEach(channel => {
          const audio = audioRefs.current[channel];
          if (audio) {
            audio.currentTime = currentTime;
            audio.volume = trackVolumes[channel] * masterVolume;
            audio.play().catch(error => console.error(`Error playing ${channel}:`, error));
          }
        });
        setIsPlaying(true);
      }
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);

    Object.values(audioRefs.current).forEach(audio => {
      if (audio) audio.currentTime = newTime;
    });
  };

  const handleTrackVolumeChange = (channel, volume) => {
    setTrackVolumes(prev => ({
      ...prev,
      [channel]: volume
    }));

    const audio = audioRefs.current[channel];
    if (audio) {
      audio.volume = volume * masterVolume;
    }
  };

  const handleTrackMute = (channel) => {
    setTrackMutes(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));

    const audio = audioRefs.current[channel];
    if (audio) {
      if (trackMutes[channel]) {
        // Unmuting
        audio.volume = trackVolumes[channel] * masterVolume;
        if (isPlaying) audio.play().catch(error => console.error(`Error playing ${channel}:`, error));
      } else {
        // Muting
        audio.pause();
      }
    }
  };

  const handleMasterVolumeChange = (volume) => {
    setMasterVolume(volume);

    Object.entries(audioRefs.current).forEach(([channelName, audio]) => {
      if (audio && !trackMutes[channelName]) {
        audio.volume = trackVolumes[channelName] * volume;
      }
    });
  };

  const handleMixDownload = () => {
    onMixDownload(trackVolumes);
  };

  const getChannelIcon = (channelName) => {
    const icons = {
      'drums': '🥁',
      'bass': '🎸',
      'other': '🎹',
      'piano': '🎹',
      'guitar': '🎸',
      'strings': '🎻',
      'brass': '🎺',
      'woodwind': '🎷'
    };

    const lowerName = channelName.toLowerCase();
    for (const [key, icon] of Object.entries(icons)) {
      if (lowerName.includes(key)) {
        return icon;
      }
    }
    return '🎵';
  };

  const getChannelColor = (channelName) => {
    const colors = {
      'drums': '#ff6b6b',
      'bass': '#4ecdc4',
      'other': '#45b7d1',
      'piano': '#96ceb4',
      'guitar': '#feca57',
      'strings': '#ff9ff3',
      'brass': '#54a0ff',
      'woodwind': '#5f27cd'
    };

    const lowerName = channelName.toLowerCase();
    for (const [key, color] of Object.entries(colors)) {
      if (lowerName.includes(key)) {
        return color;
      }
    }
    return '#6c757d';
  };

  return (
      <div className="track-mixer">
        <div className="mixer-header">
          <h3>Track Mixer</h3>
          <div className="master-controls">
            <label>Master Volume:</label>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={masterVolume}
                onChange={(e) => handleMasterVolumeChange(parseFloat(e.target.value))}
                className="volume-slider master-slider"
            />
            <span>{Math.round(masterVolume * 100)}%</span>
          </div>
        </div>
        <div className="transport-controls">
          <button
              className={`play-button ${isPlaying ? 'playing' : ''}`}
              onClick={handlePlayPause}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <div className="time-display">
            <span>{formatTime(currentTime)}</span>
            <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="seek-slider"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div className="tracks-container">
          <div className="tracks-header">
            <span className="track-label">Track</span>
            <span className="track-mute">Mute</span>
            <span className="track-volume">Volume</span>
            <span className="track-level">Level</span>
          </div>

          <div className="tracks-list">
            {nonVocalChannels.map((channel) => (
                <div key={channel} className="track-row">
                  <div className="track-info">
                <span className="track-icon" style={{ color: getChannelColor(channel) }}>
                  {getChannelIcon(channel)}
                </span>
                    <span className="track-name">{channel}</span>
                  </div>

                  <div className="track-mute-control">
                    <button
                        className={`mute-button ${trackMutes[channel] ? 'muted' : ''}`}
                        onClick={() => handleTrackMute(channel)}
                        title={trackMutes[channel] ? 'Unmute' : 'Mute'}
                    >
                      {trackMutes[channel] ? '🔇' : '🔊'}
                    </button>
                  </div>

                  <div className="track-volume-control">
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={trackVolumes[channel] || 1}
                        onChange={(e) => handleTrackVolumeChange(channel, parseFloat(e.target.value))}
                        className="volume-slider"
                        style={{
                          '--track-color': getChannelColor(channel)
                        }}
                        disabled={trackMutes[channel]}
                    />
                    <span className="volume-value">{Math.round((trackVolumes[channel] || 1) * 100)}%</span>
                  </div>

                  <div className="track-level-meter">
                    <div
                        className="level-bar"
                        style={{
                          width: `${(trackVolumes[channel] || 1) * 100}%`,
                          backgroundColor: getChannelColor(channel)
                        }}
                    ></div>
                  </div>
                </div>
            ))}
          </div>
        </div>
        <div className="mixer-actions">
          <button
              className="download-mix-button"
              onClick={handleMixDownload}
              disabled={isMixing}
          >
            {isMixing ? '🎵 Mixing...' : '⬇️ Download Mixed Version'}
          </button>

          <div className="mixer-info">
            <p>🎵 Mix your tracks and download the final version with your volume settings applied.</p>
            <p>💡 Tip: Use the transport controls to preview your mix before downloading.</p>
          </div>
        </div>
        {/* Hidden audio elements for each track */}
        {nonVocalChannels.map((channel) => (
            <audio
                key={channel}
                ref={(el) => audioRefs.current[channel] = el}
                src={`http://127.0.0.1:5000/api/stream-channel/${encodeURIComponent(filename)}/${encodeURIComponent(channel)}`}
                preload="metadata"
            />
        ))}
      </div>
  );
};

export default TrackMixer;