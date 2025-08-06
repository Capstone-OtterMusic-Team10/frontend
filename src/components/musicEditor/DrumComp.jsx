import * as Tone from "tone"
import { useState, useEffect, useRef } from "react";
import Kick from "../../assets/music/kick.wav";
import Snare from "../../assets/music/snare.wav";
import Hihat from "../../assets/music/hihat.wav";
import Wacky_kick from "../../assets/music/wacky_kick.wav";
import Chrome_Clap from "../../assets/music/Chrome_Clap.wav"
import Chrome_Kick from "../../assets/music/Chrome_Kick.wav"
import Chrome_Hat from "../../assets/music/Chrome_Hat.wav"
import Chrome_Snare from "../../assets/music/Chrome_Snare.wav"
import Chrome_Tom from "../../assets/music/Chrome_Tom.wav"
import Flex_Tom from "../../assets/music/808_Flex_Tom.wav"
import Flex_Hat from "../../assets/music/808_Flex_Hat.wav"
import Flex_Snare from "../../assets/music/808_Flex_Snare.wav"
import Flex_Clap from "../../assets/music/808_Flex_Clap.wav"
import Flex_Kick from "../../assets/music/808_Flex_Kick.wav"
import Arcade_Frenzy_Snare from "../../assets/music/Arcade_Frenzy_Snare.wav"
import Arcade_Frenzy_Kick from "../../assets/music/Arcade_Frenzy_Kick.wav"
import Arcade_Frenzy_Tom from "../../assets/music/Arcade_Frenzy_Tom.wav"
import Arcade_Frenzy_Hat from "../../assets/music/Arcade_Frenzy_Hat.wav"
import Arcade_Frenzy_Clap from "../../assets/music/Arcade_Frenzy_Clap.wav"
import {Play, Pause, Trash2} from  "lucide-react"


const DrumComp = ({isMini, callRandom}) =>{
    const [isPlaying, setIsPlaying] = useState(false)
    const [pickedDrum, setPickedDrum] = useState(null)
    const [preset, setPreset] = useState("default")
    const [parts, setParts] = useState()
    const [vol, setVol] = useState(0)
    const [bpm, setBpm] = useState(150)
    const presets = [
        "Arcade_Frenzy","default","808","Chrome"
    ]
    const drumNames = {
        "default":["Kick", "Snare", "Hihat", "Wacky_kick"],
        "808": ['Flex_Tom', 'Flex_Snare', 'Flex_Hat', 'Flex_Clap', 'Flex_Kick'],
        "Arcade_Frenzy": ['Arcade_Frenzy_Snare', 'Arcade_Frenzy_Kick', 'Arcade_Frenzy_Tom', 'Arcade_Frenzy_Hat', 'Arcade_Frenzy_Clap'],
        "Chrome": ['Chrome_Clap', 'Chrome_Kick', 'Chrome_Hat', 'Chrome_Snare', 'Chrome_Tom']};

    const players = useRef(null)
    const sequence = useRef(null)
    const volume = useRef(null)
    const divRef = useRef()
    const preDefinedDrum = [[
        {id: 1,sound: ['Kick']},
        {id: 2,sound: ['Kick']},
        {id: 3,sound: ['Kick']},
        {id: 4,sound: ['Kick']},
        {id: 5,sound: ['Snare']},
        {id: 6,sound: ['Kick']},
        {id: 7,sound: ['pause']},
        {id: 8,sound: ['Snare']},
    ],
[
        {id: 1,sound: ["Hihat"]},
        {id: 2,sound: ["Hihat"]},
        {id: 3,sound: ["Hihat"]},
        {id: 4,sound: ["Hihat"]},
        {id: 5,sound: ['pause']},
        {id: 6,sound: ["Hihat"]},
        {id: 7,sound: ['pause']},
        {id: 8,sound: ['Snare']},
    ],
    [ { id: 1, sound: ['Kick', 'Hihat'] },
    { id: 2, sound: ['Hihat'] },
    { id: 3, sound: ['Wacky_kick'] },
    { id: 4, sound: ['Snare', 'Hihat'] },
    { id: 5, sound: ['Kick'] },
    { id: 6, sound: ['Hihat'] },
    { id: 7, sound: ['pause'] },
    { id: 8, sound: ['Snare', 'Hihat'] },
  ],

  // Pattern 2: Hihat constant, layered kick/snare
  [
    { id: 1, sound: ['Kick', 'Hihat'] },
    { id: 2, sound: ['Hihat'] },
    { id: 3, sound: ['Snare', 'Hihat'] },
    { id: 4, sound: ['Hihat'] },
    { id: 5, sound: ['Wacky_kick', 'Hihat'] },
    { id: 6, sound: ['Hihat'] },
    { id: 7, sound: ['Snare'] },
    { id: 8, sound: ['Kick', 'Hihat'] },
  ],

  // Pattern 3: Sparse but punchy
  [
    { id: 1, sound: ['Wacky_kick'] },
    { id: 2, sound: ['pause'] },
    { id: 3, sound: ['Snare'] },
    { id: 4, sound: ['Hihat'] },
    { id: 5, sound: ['Kick'] },
    { id: 6, sound: ['pause'] },
    { id: 7, sound: ['Snare', 'Hihat'] },
    { id: 8, sound: ['pause'] },
  ],

  // Pattern 4: Driving beat
  [
    { id: 1, sound: ['Kick', 'Hihat'] },
    { id: 2, sound: ['Kick', 'Hihat'] },
    { id: 3, sound: ['Snare', 'Hihat'] },
    { id: 4, sound: ['Hihat'] },
    { id: 5, sound: ['Wacky_kick'] },
    { id: 6, sound: ['Snare', 'Hihat'] },
    { id: 7, sound: ['Kick'] },
    { id: 8, sound: ['Snare'] },
  ],

  // Pattern 5: Wacky hat groove
  [
    { id: 1, sound: ['Kick', 'Hihat'] },
    { id: 2, sound: ['Hihat'] },
    { id: 3, sound: ['Wacky_kick', 'Hihat'] },
    { id: 4, sound: ['Snare'] },
    { id: 5, sound: ['Kick', 'Hihat'] },
    { id: 6, sound: ['Wacky_kick'] },
    { id: 7, sound: ['pause'] },
    { id: 8, sound: ['Snare', 'Hihat'] },
  ]
]
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
        // console.log(parts)
        
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
            setPickedDrum(null)
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
        const rand = Math.floor(Math.random()*preDefinedDrum.length)
        console.log(preDefinedDrum[rand])

        const updatedParts = parts && parts.map((_, idx) => preDefinedDrum[rand][idx]);
        setParts(updatedParts)
        
        console.log(parts)
    }, [callRandom])
    useEffect(()=>{
            setParts(
                Array.from({ length: isMini?8:16 }, (_, i) => ({
                    id: i + 1,
                    sound: ["pause"]
                }))
            )
            volume.current = new Tone.Volume(vol).toDestination();
            // console.log(preset)
            preset === "Arcade_Frenzy"?
                players.current = new Tone.Players(
                    {
                        Arcade_Frenzy_Kick,
                        Arcade_Frenzy_Hat,
                        Arcade_Frenzy_Snare,
                        Arcade_Frenzy_Clap,
                        Arcade_Frenzy_Tom
                    }
                ).connect(volume.current)
            : preset === "808"?
             players.current = new Tone.Players(
                    {
                        Flex_Kick,
                        Flex_Hat,
                        Flex_Snare,
                        Flex_Clap,
                        Flex_Tom
                    }
                ).connect(volume.current)
            : preset === "Chrome"?
             players.current = new Tone.Players(
                    {
                        Chrome_Kick,
                        Chrome_Hat,
                        Chrome_Snare,
                        Chrome_Clap,
                        Chrome_Tom
                    }
                ).connect(volume.current)
                :
                 players.current = new Tone.Players(
                    {
                        Kick,
                        Hihat,
                        Snare,
                        Wacky_kick
                    }
                ).connect(volume.current)
        }, [preset])

    useEffect(()=>{
        playSequence()
    }, [parts, bpm])


    const pickedStyle = {
        backgroundColor: "blue",
        color: "white"
    }

    return (

        <div id="drumSection">
            {
                drumNames[preset].map((drum, idx)=>(
                    <button ref={divRef} style={drum === pickedDrum ? pickedStyle : {}}  key={idx} onClick={()=>play(drum)}>{drum}</button>
                ))
            }
            { !isMini&&
            <>
                <input type="range" min="-100" max="0" step="1" value={vol}
                onChange={(e)=>changeVolume(parseInt(e.target.value, 10))}></input>
                <label htmlFor="drumBPM">BPM: {bpm}</label> <input id="drumBPM" type="range" min="50" max="300" step="1" value={bpm}
                onChange={(e)=>setBpm(e.target.value)}></input>
            </>
            }
            <select value={preset} onChange={e=>setPreset(e.target.value)}>
                {presets.map((preset)=>(
                    <option value={preset}>{preset}</option>
                ))}
            </select>

            Export time <input type="text"></input>
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
                            <div className={part.sound.includes(pickedDrum)?"filledPockets":part.sound[0] !=="pause"? "allFilled":"drumPockets"} key={id} id={id} 
                                onClick={()=>setPart(part.id)}
                                onDoubleClick={()=>clearPart(part.id)}>
                            </div>
                        )
                    )
                }
                <Trash2 className="trash" color={isMini?"white":"grey"} onClick={()=>clearDrums()}/>
            </div>
            
        </div>
    )
}


export default DrumComp
