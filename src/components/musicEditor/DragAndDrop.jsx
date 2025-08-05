import { useEffect, useState, useRef } from "react";
import { FileUp } from "lucide-react";
import audioBufferToWav from '../../utils'
import WS from "./MyWaveSurfer";
const DragAndDrop  =({setCutOuts}) =>{
    const [mp3Files, setAudioFile] = useState([])
    const [isDragging, setIsDragging] = useState(false)
    const [concat, setConcat] = useState()
    const date = useRef(Date.now());
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
        <>
            <div className={isDragging?"dropMp3-dragging":"dropMp3"}
            onDrop={handleDrop}
            onDragOver={(e)=>{
                e.preventDefault()
            }}
            onDragEnter={()=>setIsDragging(true)}
            onDragLeave={()=>setIsDragging(false)}>
                {
                    isDragging?
                    (
                    <>
                        <FileUp/>
                    </>
                    )
                    :  concat ?
                    <>
                        <WS audio={concat} id={date.current} isSample={false} setCutOuts={setCutOuts} isInChannel={true}/>
                        <button>Add Overlay Channel</button>
                    </>

                    :
                    <h4>🎼 Drag samples here</h4>

                }       
                
            </div>
        </>
    )
}

export default DragAndDrop 