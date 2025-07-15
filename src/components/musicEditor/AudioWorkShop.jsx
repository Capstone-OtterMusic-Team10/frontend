// import audio1 from '../../assets/testtest.wav'
import audio2 from '../../assets/lyria_2_2.wav'
import { useState } from 'react'
import WS from './MyWaveSurfer'
import DragAndDrop from './DragAndDrop'
import DrumComp from './DrumComp'
const AudioWorkShop = () =>{

    // const [audio, setAudio] = useState([audio2])
    const [channels, setChannels] = useState(0)
    const [DrumChannels, setDrumChannels] = useState(0)
    const audio = [audio2]
    const [cutOuts, setCutOuts] = useState([])
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

    return (
        <>
        <div id="EditPage">
            <button onClick={()=>setChannels(channels+1)
            }>Add Channel</button>
            <button onClick={()=>setDrumChannels(DrumChannels+1)
            }>Add Drum Channel</button>
            {
               audio && audio.map((song, id)=>
                <div id="audioWorkshopWavesurfer">
                    <WS audio={song} id={id} key={id} cutOuts={cutOuts} setCutOuts={setCutOuts}/>
                </div>
                )
            }
            {
                cutOuts && cutOuts.map((sample, id)=>(
                    <div id="audioWorkshopWavesurfer">
                    <WS audio={sample} id={id} key={id} cutOuts={cutOuts} setCutOuts={setCutOuts}/>
                    </div>
                ))
            }
            {
                Array.from({ length: channels }).map((_, id) => (
                    <DragAndDrop key={`drag-${id}`} />
                ))
            }
            {
                Array.from({ length: DrumChannels }).map((_, id) => (
                    <DrumComp key={`drum-${id}`} />
                ))
            }
        </div>
        
        </>
    )
}

export default AudioWorkShop