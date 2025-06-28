// import WaveSurfer from "wavesurfer.js";
// import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
// import { useState,useEffect,useRef } from "react";

// const WaveFormEditor = ({audioUrl}) =>{
//     const waveformRef = useRef(null)
//     const wavesurfer = useRef(null)

//     useEffect(()=>{
//         if (!waveformRef.current){
//             return
//         }

//         wavesurfer.current = WaveSurfer.create({
//             container: waveformRef.current,  // Where to render the waveform
//             waveColor: '#aaa',               // Light grey for waveform
//             progressColor: '#333',           // Darker grey for playback progress
//             backend: 'WebAudio',             // Use Web Audio API (required for buffer access)
//             plugins: [
//                 RegionsPlugin.create({
//                 dragSelection: {
//                     slop: 0.001,                   // Tolerance (px) before region starts when dragging
//                 },
//                 }),
//             ],
//         })

//         wavesurfer.current.load(audioUrl); 
//         wavesurfer.current.on('region-created', (region) => {
//         console.log(`Selected region: ${region.start} to ${region.end}`);
//         });

//         return () => {
//             if (wavesurfer.current && wavesurfer.current.destroy) {
//                 wavesurfer.current.destroy();
//                 wavesurfer.current = null; // prevent repeated destroy calls
//             }
//         };
//     }, [audioUrl])
//     const playRegion = () => {
//         const context = wavesurfer.current.backend.ac;
//         if (context.state === 'suspended') {
//             context.resume(); 
//         }

//         const region = Object.values(wavesurfer.current.regions.list)[0];
//         if (region) {
//             region.play();
//         }
//     };
//     return (
//         <div>
//         <div ref={waveformRef} style={{ width: '100%', height: '128px' }} />
//         <button onClick={playRegion}>Play Selection</button>
//         </div>
//     );
// }

// export default WaveFormEditor



    // const [audio, setAudio] = useState([audio1, audio2])

    // const loadAudioBuffer = async (url, audioContext) => {
    //     const response = await fetch(url);
    //     const arrayBuffer = await response.arrayBuffer();
    //     return await audioContext.decodeAudioData(arrayBuffer);
    // };

    // const playConcat = async() =>{
    //     const audioContext = new AudioContext();
    //     const buffers = await Promise.all(
    //     audio.map((url) => loadAudioBuffer(url, audioContext))
    //     );

    //     let startTime = audioContext.currentTime;
    //         for (const buffer of buffers) {
    //             const source = audioContext.createBufferSource();
    //             source.buffer = buffer;
    //             source.connect(audioContext.destination);
    //             source.start(startTime);
    //             startTime += buffer.duration;
    //         }
    
    // }

    // const playMerged = async () =>{
    //     const audioContext = new AudioContext();

    //     const audioBuffer1 = await loadAudioBuffer(audio1, audioContext);
    //     const audioBuffer2 = await loadAudioBuffer(audio2, audioContext);

    //     const source1 = audioContext.createBufferSource();
    //     source1.buffer = audioBuffer1;
    //     source1.connect(audioContext.destination);

    //     const source2 = audioContext.createBufferSource();
    //     source2.buffer = audioBuffer2;
    //     source2.connect(audioContext.destination);

    //     source1.start(0);
    //     source2.start(0);
    // }

    // return (
    //     <>
    //     <div id="EditPage">
    //         <button onClick={playConcat}>Play Concatenated</button>
    //         <button onClick={playMerged}>Play Merged</button>\
    //     </div>
    //     </>
    // )