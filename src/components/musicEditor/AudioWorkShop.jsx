import audio2 from '../../assets/audio2.wav'
import { useState, useEffect } from 'react';
import WS from './MyWaveSurfer'
import { api } from '../../utils';
import DragAndDrop from './DragAndDrop'
import DrumComp from './DrumComp'
import {Trash2} from "lucide-react"
import WorkshopSideBar from './WorkshopSideBar'

const AudioWorkShop = () =>{
    const [musicFiles, setMusicFiles] = useState([]);
    const [pickedAudio, setPickedAudio] = useState(audio2)
    const [channels, setChannels] = useState([])
    const [DrumChannels, setDrumChannels] = useState(0)
    const [cutOuts, setCutOuts] = useState([])

    
    const fetchMusicFiles = async () => {
        try {
            const response = await api.get('api/music-files');
            if (!response.status === 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            console.log()
            setMusicFiles(response.data.files);
        } catch (err) {
            console.error('Error fetching music files:', err);
        }
    };
    const deleteSample = (sample) =>{
        const newCuts = cutOuts.filter(x=> x!= sample)
        setCutOuts(newCuts)
    }
    useEffect(() => {
        fetchMusicFiles();
    }, []);
    console.log(pickedAudio)
    return (
        <>
      
        <div id="EditPage">
        <WorkshopSideBar musicFiles={musicFiles} pickedAudio={pickedAudio} setPickedAudio={setPickedAudio}/>
        <div id='editingSide'>
            <button onClick={()=>{
            let holder = [...channels]
            if (holder.length === 0) {
                holder.push(0);
            } else {
                holder.push(holder[holder.length - 1] + 1);
            }
            setChannels(holder)}
            }>Add New Track Channel</button>
            <button onClick={()=>setDrumChannels(DrumChannels+1)
            }>Add Drum Channel</button>
            {
                channels.map((_, id) => (
                    <div className="inLineSimpleDiv">

                    <DragAndDrop key={`drag-${id}`} cutOuts={cutOuts} setCutOuts={setCutOuts}/><Trash2 onClick={
                        ()=>{
                            let holder = [...channels]
                            holder.pop(id-1)
                            setChannels(holder)
                        }
                    } color="grey"/>
                    </div>
                ))
            }
            {
                <WS audio={pickedAudio} isSample={false} setCutOuts={setCutOuts}/> 
            }
            {
                cutOuts && cutOuts.map((sample, id)=>(
                <>
                    <WS audio={sample} id={id} key={id} isSample={true} setCutOuts={setCutOuts}/> <Trash2 className="trash" color="grey" onClick={()=>deleteSample(sample)}/>
                </>
                ))
            }
            {
                Array.from({ length: DrumChannels }).map((_, id) => (
                    <DrumComp key={`drum-${id}`} />

                ))
            }
        </div>
        </div>
        </>
    )
}

export default AudioWorkShop