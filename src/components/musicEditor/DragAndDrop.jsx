import { useEffect, useState, useRef } from "react";
import { FileUp, Trash2 } from "lucide-react";
import audioBufferToWav from '../../utils'
import WS from "./MyWaveSurfer";
import DrumComp from "./DrumComp";
const DragAndDrop  =({setCutOuts}) =>{
    const [mp3Files, setAudioFile] = useState([])
    // const [mp3FilesLayer, setAudioFileLayer] = useState([])
    const [isDragging, setIsDragging] = useState(false)
    const [concat, setConcat] = useState()
    const [drumChnls, setDrumChnls] = useState([])
    const [dragAdd, setDragAdd] = useState(false)
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

    // concat
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
                    isDragging?
                    (
                    <>
                        <FileUp/>
                    </>
                    )
                    :  concat ?
                    <>
                        <WS audio={concat} id={date.current} isSample={false} setCutOuts={setCutOuts} isInChannel={true}/>
                        {
                            drumChnls.map((_, indx)=>(
                                <div key={indx}>
                                    <DrumComp/><Trash2 color="red" onClick={()=>{
                                        let holder = [...drumChnls]
                                        holder.pop(indx-1)
                                        setDrumChnls(holder)
                                    }}/>
                                </div>
                            )
                        )
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
                            <>
                                <h4>🎼 Drag samples here</h4>
                            </>
                        }
                    </>
                    :
                    <h4>🎼 Drag samples here</h4>

                }       
                
            </div>
        </div>
    )
}

export default DragAndDrop 