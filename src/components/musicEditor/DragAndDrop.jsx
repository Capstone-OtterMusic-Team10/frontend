import { useEffect, useState, useRef } from "react";
import { Download, FileUp, Trash2 } from "lucide-react";
import audioBufferToWav from '../../utils'
import WS from "./MyWaveSurfer";
import DrumComp from "./DrumComp";
const DragAndDrop  =({setCutOuts}) =>{
    const [mp3Files, setAudioFile] = useState([])
    const [mp3FilesLayer, setAudioFileLayer] = useState([])
    const [isDragging, setIsDragging] = useState(false)
    const [concat, setConcat] = useState()
    const [merged, setMerged] = useState()
    const [drumChnls, setDrumChnls] = useState([])
    const [dragAdd, setDragAdd] = useState(false)
    const [playAll, setPlayAll] = useState(false)
    // const [soundChnls, setSoundChnls] = useState([])
    // needed date to make the id work for wavesurfer - avoided conflicts
    const date = useRef(Date.now());

    // handle drop allows for drag + drop from local as well as from cutout selected region
    const handleDrop = (e) =>{
        e.preventDefault()
        setIsDragging(false);
        let file = null
        if (e.dataTransfer.files){
            file = e.dataTransfer.getData("audio-file");
            console.log("First check ", typeof file)
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0 || file === ""){
                console.log(e.dataTransfer.files)
                file = URL.createObjectURL(e.dataTransfer.files[0]);
            }
        }

        if (file) {
            console.log('success')
            setAudioFile(prev=>[...prev, file])
        }
    }

    const handleMergeDrop = (e) =>{
        e.stopPropagation()
        e.preventDefault()
        setIsDragging(false);
        let file = null
        if (e.dataTransfer.files){
            file = e.dataTransfer.getData("audio-file");
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0 || file === ""){
                console.log(e.dataTransfer.files)
                file = URL.createObjectURL(e.dataTransfer.files[0]);
            }
        }

        if (file) {
            setAudioFileLayer(prev=>[...prev, file])
        }
    }

    const playMerged = async () =>{
        const audioContext = new AudioContext();
        let urls = [];
        if (concat) urls.push(concat);
        mp3FilesLayer.forEach(url => urls.push(url));

        // Step 1: Fetch and decode all audio files
        const audioBuffers = await Promise.all(
            urls.map(async (url) => {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                return await audioContext.decodeAudioData(arrayBuffer);
            })
        );

        // Step 2: Use the longest track length
        const maxLength = Math.max(...audioBuffers.map(buf => buf.length));
        const numberOfChannels = Math.max(...audioBuffers.map(buf => buf.numberOfChannels));
        const sampleRate = audioBuffers[0].sampleRate;

        // Step 3: Create merged buffer
        const mergedBuffer = audioContext.createBuffer(
            numberOfChannels,
            maxLength,
            sampleRate
        );

        // Step 4: Mix all buffers together
        for (const buffer of audioBuffers) {
            for (let channel = 0; channel < numberOfChannels; channel++) {
                const outputData = mergedBuffer.getChannelData(channel);
                const inputData = buffer.getChannelData(channel % buffer.numberOfChannels);

                for (let i = 0; i < inputData.length; i++) {
                    // Add sample values for layering
                    outputData[i] += inputData[i];

                    // Prevent clipping distortion
                    if (outputData[i] > 1) outputData[i] = 1;
                    else if (outputData[i] < -1) outputData[i] = -1;
                }
            }
        }

        // Step 5: Prepare channel buffers for WAV encoding
        const channelBuffers = [];
        for (let channel = 0; channel < numberOfChannels; channel++) {
            channelBuffers.push(mergedBuffer.getChannelData(channel));
        }

        // Step 6: Encode to WAV
        const newSong = audioBufferToWav(sampleRate, channelBuffers);
        const blob = new Blob([newSong], { type: 'audio/wav' });
        const blobURL = URL.createObjectURL(blob);

        // Step 7: Set as concat (download/play URL)
        setMerged(blobURL);

    }


    const DownloadAudio = () =>{
        const link = document.createElement('a');
        link.href = merged;

        link.download = 'ottermusic_audio.mp3'; // Provide a default filename if none is given

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    }

    const PlayAll = () =>{
        playMerged()
        let audio = new Audio(merged);
        console.log(audio)
        if (playAll){
            audio.play();
        }else{
            audio.pause()
        }
    }
    useEffect(()=>{
        console.log(mp3Files)
    }, [mp3Files])


     const loadAudioBuffer = async (url, audioContext) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return await audioContext.decodeAudioData(arrayBuffer);
    };

    const combineBuffers = (buffers, sampleRate) =>{
        const totalLength = buffers.reduce((sum, buf) => sum + buf.length, 0)
        const numberOfChannels = buffers[0].numberOfChannels

        const output = new AudioBuffer({
            length: totalLength,
            numberOfChannels,
            sampleRate,
        });

        let offset = 0;
        for (const buffer of buffers) {
            for (let channel = 0; channel < numberOfChannels; channel++) {
            output
                .getChannelData(channel)
                .set(buffer.getChannelData(channel), offset);
            }
            offset += buffer.length;
        }

        return output;
    }

    useEffect(()=>{
        const playConcat = async() =>{
            const audioContext = new AudioContext();
            const buffers = await Promise.all(
                mp3Files.map((url) => loadAudioBuffer(url, audioContext))
            );
            console.log(`${buffers} - buffers`)
            
            const combinedBuffer = combineBuffers(buffers, audioContext.sampleRate)
            const channelBuffers = []
            for (let i = 0; i < combinedBuffer.numberOfChannels; i++) {
                channelBuffers.push(combinedBuffer.getChannelData(i))
            }
            const wavBlob = audioBufferToWav(combinedBuffer.sampleRate, channelBuffers)
            const blob = new Blob([wavBlob], { type: 'audio/wav' })
            const blobURL = URL.createObjectURL(blob)
            console.log(blobURL)
            setConcat(blobURL)
        }
        playConcat()
    }, [mp3Files])
    
    return (
        <div className="inLineSimpleDiv">
            
            <div className={isDragging?"dropMp3-dragging":"dropMp3"}
            onDrop={handleDrop}
            onDragOver={(e)=>{
                e.preventDefault()
            }}
            onDragEnter={()=>setIsDragging(true)}
            onDragLeave={()=>setIsDragging(false)}>
                {
                    isDragging && !dragAdd?
                    (
                    <>
                        <FileUp/>
                    </>
                    )
                    :  concat ?
                    <>
                        <button onClick={()=>{
                            setPlayAll(!playAll)
                            PlayAll()}}>{playAll?"P L A Y":"P A U S E"}</button>
                        <button onClick={DownloadAudio}>S A V E</button>
                        <WS audio={concat} id={date.current} isSample={false} setCutOuts={setCutOuts} isInChannel={true}/>
                        {
                            drumChnls.map((_, indx)=>(
                                <div key={indx}>
                                    <DrumComp/><Trash2 color="grey" onClick={()=>{
                                        let holder = [...drumChnls]
                                        holder.pop(indx-1)
                                        setDrumChnls(holder)
                                    }}/>
                                </div>
                            )
                        )
                        }
                        {
                            mp3FilesLayer && mp3FilesLayer.map((audio, idx)=>(
                                <WS key={idx} audio={audio} id={date.current} isSample={false} setCutOuts={setCutOuts} isInChannel={true}/>
                            ))
                        }
                        <button onClick={()=>{
                            let holder = [...drumChnls];
                            if (holder.length === 0) {
                                holder.push(0);
                            } else {
                                holder.push(holder[holder.length - 1] + 1);
                            }
                            setDrumChnls(holder);
                        }}>Add Drum Channel</button>
                        <button onClick={()=>setDragAdd(!dragAdd)}>Add Sound Channel</button>
                        {

                            dragAdd&&
                            <div onDrop={handleMergeDrop}
                            onDragOver={(e)=>{
                                e.preventDefault()
                            }}>
                                <h4>🎼 Drag samples here</h4>
                            </div>

                        }
                    </>
                    :
                    <h4>🎼 Drag multitrack samples here</h4>

                }       
                
            </div>
        </div>
    )
}

export default DragAndDrop 