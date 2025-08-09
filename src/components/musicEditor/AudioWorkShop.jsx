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
    const [channels, setChannels] = useState(0);
    const [DrumChannels, setDrumChannels] = useState(0);
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
                <WorkshopSideBar
                    musicFiles={musicFiles}
                    pickedAudio={pickedAudio}
                    setPickedAudio={setPickedAudio}
                    userId={userId}
                />
                <div id="editingSide">
                    <button
                        onClick={() => setChannels(channels + 1)}
                    >
                        Add New Track Channel
                    </button>
                    <button
                        onClick={() => setDrumChannels(DrumChannels + 1)}
                    >
                        Add Drum Channel
                    </button>
                    {Array.from({ length: channels }).map((_, id) => (
                        <DragAndDrop key={`drag-${id}`} setCutOuts={setCutOuts} />
                    ))}
                    <WS audio={pickedAudio} isSample={false} setCutOuts={setCutOuts} />
                    {cutOuts &&
                        cutOuts.map((sample, id) => (
                            <div key={id}>
                                <WS audio={sample} id={id} isSample={true} setCutOuts={setCutOuts} />
                                <Trash2
                                    className="trash"
                                    color="grey"
                                    onClick={() => deleteSample(sample)}
                                />
                            </div>
                        ))}
                    {Array.from({ length: DrumChannels }).map((_, id) => (
                        <DrumComp key={`drum-${id}`} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default AudioWorkShop;