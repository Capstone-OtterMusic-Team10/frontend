import audio1 from '../../assets/testtest.wav'
import audio2 from '../../assets/lyria_2_2.wav'
import { useState } from 'react'
import WS from './MyWaveSurfer'
const AudioWorkShop = () =>{

    const [audio, setAudio] = useState([audio1, audio2])

    const loadAudioBuffer = async (url, audioContext) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await audioContext.decodeAudioData(arrayBuffer);
    };

    const playConcat = async() =>{
        const audioContext = new AudioContext();
        const buffers = await Promise.all(
        audio.map((url) => loadAudioBuffer(url, audioContext))
        );

        let startTime = audioContext.currentTime;
            for (const buffer of buffers) {
                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);
                source.start(startTime);
                startTime += buffer.duration;
            }
    
    }

    const playMerged = async () =>{
        const audioContext = new AudioContext();

        const audioBuffer1 = await loadAudioBuffer(audio1, audioContext);
        const audioBuffer2 = await loadAudioBuffer(audio2, audioContext);

        const source1 = audioContext.createBufferSource();
        source1.buffer = audioBuffer1;
        source1.connect(audioContext.destination);

        const source2 = audioContext.createBufferSource();
        source2.buffer = audioBuffer2;
        source2.connect(audioContext.destination);

        source1.start(0);
        source2.start(0);
    }

    return (
        <>
        <div id="EditPage">
            <button onClick={playConcat}>Play Concatenated</button>
            <button onClick={playMerged}>Play Merged</button>
            <WS audio={audio1} id={1}/>
            {/* {
               audio && audio.map((song, id)=>
                
                )
            } */}


        </div>
        
        </>
    )
}

export default AudioWorkShop