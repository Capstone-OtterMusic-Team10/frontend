import audio2 from '../../assets/audio2.wav';
import { useState, useEffect } from 'react';
import WS from './MyWaveSurfer';
import { api } from '../../utils';
import DragAndDrop from './DragAndDrop';
import DrumComp from './DrumComp';
import { Trash2 } from 'lucide-react';
import WorkshopSideBar from './WorkshopSideBar';

const AudioWorkShop = () => {
    const [musicFiles, setMusicFiles] = useState([]);
    const [pickedAudio, setPickedAudio] = useState(audio2);
    const [channels, setChannels] = useState([]);
    const [DrumChannels, setDrumChannels] = useState([]);
    const [cutOuts, setCutOuts] = useState([]);
    const [userId, setUserId] = useState(null);

    const fetchUserId = async () => {
        try {
            const response = await api.get('/auth/me');
            if (response.status === 200 && response.data.id) {
                setUserId(response.data.id);
            } else {
                console.error('No user ID found');
            }
        } catch (err) {
            console.error('Error fetching user ID:', err);
        }
    };

    const fetchMusicFiles = async () => {
        if (!userId) return;
        try {
            const response = await api.get(`/all-audios/${userId}`);
            if (response.status === 200) {
                setMusicFiles(response.data);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (err) {
            console.error('Error fetching music files:', err);
        }
    };

    const deleteSample = (sample) => {
        const newCuts = cutOuts.filter((x) => x !== sample);
        setCutOuts(newCuts);
    };

    useEffect(() => {
        fetchUserId();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchMusicFiles();
        }
    }, [userId]);

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
            <button onClick={()=>{
                let holder = [...DrumChannels]
                if (holder.length === 0) {
                    holder.push(0);
                } else {
                    holder.push(holder[holder.length - 1] + 1);
                }
                setDrumChannels(holder)
            }
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
                DrumChannels.map((_, id) => (
                    <div className='inLineSimpleDiv'>
                    <DrumComp key={`drum-${id}`} />
                    <Trash2 color="grey" onClick={()=>{
                        let holder = [...DrumChannels]
                        holder.pop(id-1)
                        setDrumChannels(holder)
                    }}/>
                    </div>
                ))
            }
        </div>
        </div>
        </>
    );
};

export default AudioWorkShop;