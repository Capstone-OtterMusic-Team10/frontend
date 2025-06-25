import * as Tone from "tone"
import { useState, useEffect, useRef } from 'react'

import { Play, Pause, Volume, Volume1, Volume2 } from "lucide-react"

const MusicPlayer = ({audio, audioRef}) =>{
    // const audioRef = useRef()
    const [isPlaying,  setIsPlaying] = useState(false)
    const [volume, setVolume] = useState(1)
    const [duration, setDuration] = useState(1);
    const [timePassed, setTimePassed ] = useState("")
    const [progress, setProgress] = useState(0)
    const togglePlay = () =>{
        const audio = audioRef.current
        if (!audio){
            return
        }
         if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    
    }
    
   useEffect(()=>{
    const audio = audioRef.current
    if(!audio)
        return
    
    const handleLoadedMetadata = () => {
        setDuration(audio.duration);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    
    audio.addEventListener('timeupdate', ()=>{
        const currentTime = audio.currentTime
        setProgress(currentTime)
        if (duration > 0) {
            setTimePassed(`${Math.floor(currentTime/60)}`.padStart(2, 0)+":"+`${Math.floor(currentTime%60)}`.padStart(2, 0))
        }})

    return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
   }, [])

    return (
        <>
                <div className="audio-player">
                    <audio ref={audioRef} src={audio} />
                    <button id="playButton" onClick={togglePlay}>
                        {isPlaying ? <Pause/> : <Play/>}
                    </button>
                    <div id="current-time">{timePassed || "00:00"}</div>
                    <input type="range" id="progressBar" min="0" max={duration} style={{width: `300px`}} step="0.01" value={progress} 
                    onInput={(e) => {
                        const newTime = parseFloat(e.target.value);
                        audioRef.current.currentTime = newTime;
                        setProgress(audioRef.current.currentTime); }}/>
                      
                    <div id="total-time">{`${Math.floor(duration/60)}`.padStart(2, '0')}:{`${Math.floor(duration%60)}`.padStart(2, '0')}</div>
                    {
                        volume == 0?
                        <Volume/>
                        : volume > 0 && volume <0.5 ?
                        <Volume1/>
                        :
                        <Volume2/>
                    }
                    <input type="range" id="volumeSlider" min="0" max="1" step="0.01" value={volume} onChange={(e)=>{
                        audioRef.current.volume = e.target.value
                        setVolume(parseFloat(e.target.value))
                    }}/>
                </div>
        </>
    )
}

export default MusicPlayer