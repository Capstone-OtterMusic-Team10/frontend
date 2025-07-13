import * as Tone from "tone"
import { useState, useEffect, useRef } from "react";
import kick from "../../assets/music/kick.wav";
import snare from "../../assets/music/snare.wav";
import hihat from "../../assets/music/hihat.wav";
import wacky_kick from "../../assets/music/wacky_kick.wav";
import {Play, Pause, Trash2} from  "lucide-react"
const DrumComp = () =>{
    const [isPlaying, setIsPlaying] = useState(false)
    const [pickedDrum, setPickedDrum] = useState(null)
    const [parts, setParts] = useState()
    const [vol, setVol] = useState(0)
    const [bpm, setBpm] = useState(150)

    const drumNames = ["kick", "snare", "hihat", "wacky_kick"];

    const players = useRef(null)
    const sequence = useRef(null)
    const volume = useRef(null)

    const changeVolume = (pts) =>{
        setVol(pts)
        if (volume.current) {
            volume.current.volume.value = pts;
        }
    }   
    const play = (type) =>{
        setPickedDrum(type)
        Tone.loaded().then(() => {
            players.current.player(type).start();
        })
    }
    
    const playSequence = () =>{
        if (sequence.current) {
            sequence.current.stop();
            sequence.current.dispose();
        }
        setIsPlaying(true)
        sequence.current = new Tone.Sequence(
            (time, step) => {
                
                
                if (step.sound.length > 0) {
                    step.sound.forEach((sound) => {
                        sound != "pause" &&
                        players.current.player(sound).start(time);
                    });
                }},
                parts,
                "8n"
            );
            
            Tone.Transport.bpm.value = bpm;
            
            sequence.current.start(0);
            Tone.Transport.start();
        }
        const stopSequence = () => {
            setIsPlaying(false)
            Tone.Transport.stop();
            sequence.current?.stop();
        };
        const setPart =(id) =>{
            
            const updatedParts = parts.map((part)=>{
                if (part.id == id && pickedDrum != null){
                    let sound_arr = part.sound
                    if (sound_arr[0] == "pause"){
                        sound_arr[0] = pickedDrum
                    }else{
                        sound_arr.push(pickedDrum)
                    }
                    return {...part, sound: sound_arr}
                }else{
                    return part
                }
            })
            setParts(updatedParts)
        }
        const clearPart = (id) =>{
            const updatedParts = parts.map((part)=>{
                if (part.id == id){
                    let sound_arr = ["pause"]
                    return {...part, sound: sound_arr}
                }else{
                    return part
                }
            })
            setParts(updatedParts)
        }
        const clearDrums= ()=>{
            const updatedParts = parts.map((part)=>{
                let sound_arr = ["pause"]
                return {...part, sound: sound_arr}
            })
            setParts(updatedParts)
        }
        
        useEffect(()=>{
            setParts(
                Array.from({ length: 16 }, (_, i) => ({
                    id: i + 1,
                    sound: ["pause"]
                }))
            )
            volume.current = new Tone.Volume(vol).toDestination();
            players.current = new Tone.Players(
                {
                    kick: kick,
                    hihat: hihat,
                    snare: snare,
                    wacky_kick: wacky_kick
                }
            ).connect(volume.current);
        }, [])

    useEffect(()=>{
        playSequence()
        console.log(parts)
    }, [parts])
    const pickedStyle = {
        backgroundColor: "blue",
        color: "white"
    }
    return (
        <div id="drumSection">
        {
            drumNames.map((drum, idx)=>(
                <button style={drum === pickedDrum ? pickedStyle : {}} key={idx} onClick={()=>play(drum)}>{drum}</button>
            ))
        }
        <input type="range" min="-100" max="0" step="1" value={vol}
        onChange={(e)=>changeVolume(parseInt(e.target.value, 10))}></input>
        <label for="drumBPM">BPM:</label> <input id="drumBPM" type="range" min="50" max="200" step="1" value={bpm}
        onChange={(e)=>setBpm(e.target.value)}></input>
        <div id="drums">
            <div className="p-4">
            {isPlaying ?
                <button onClick={stopSequence}> <Pause/> </button>
                :
                <button onClick={playSequence}  > <Play/> </button>
                }
            </div>
            {
                parts && parts.map((part, id)=>(
                    <div className={part.sound=="pause"?"drumPockets":"filledPockets"} key={id} id={id} 
                    onClick={()=>setPart(part.id)}
                    onDoubleClick={()=>clearPart(part.id)}>
                        {
                            part.sound.map((snd, id) =>(
                                <p className="drumList">{snd}</p>
                            ))
                        }
                    </div>
                ))
            }
            
            <Trash2 color="white" onClick={()=>clearDrums()}/>
            
        </div>
        </div>
    )
}


export default DrumComp