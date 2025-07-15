import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import {useEffect,useRef } from "react";

const WaveFormEditor = ({audioUrl}) =>{
    const waveformRef = useRef(null)
    const wavesurfer = useRef(null)

    useEffect(()=>{
        if (!waveformRef.current){
            return
        }

        wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current,  // Where to render the waveform
            waveColor: '#aaa',               // Light grey for waveform
            progressColor: '#333',           // Darker grey for playback progress
            backend: 'WebAudio',             // Use Web Audio API (required for buffer access)
            plugins: [
                RegionsPlugin.create({
                dragSelection: {
                    slop: 0.001,                   // Tolerance (px) before region starts when dragging
                },
                }),
            ],
        })

        wavesurfer.current.load(audioUrl); 
        wavesurfer.current.on('region-created', (region) => {
        console.log(`Selected region: ${region.start} to ${region.end}`);
        });

        return () => {
            if (wavesurfer.current && wavesurfer.current.destroy) {
                wavesurfer.current.destroy();
                wavesurfer.current = null; // prevent repeated destroy calls
            }
        };
    }, [audioUrl])
    const playRegion = () => {
        const context = wavesurfer.current.backend.ac;
        if (context.state === 'suspended') {
            context.resume(); 
        }

        const region = Object.values(wavesurfer.current.regions.list)[0];
        if (region) {
            region.play();
        }
    };
    return (
        <div>
        <div ref={waveformRef} style={{ width: '100%', height: '128px' }} />
        <button onClick={playRegion}>Play Selection</button>
        </div>
    );

}
export default WaveFormEditor


