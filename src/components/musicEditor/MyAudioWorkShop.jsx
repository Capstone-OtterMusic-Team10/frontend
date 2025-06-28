// import { useState, useRef } from "react";
// import audio1 from '../../assets/testtest.mp3'
// import audio2 from '../../assets/chatgptlofi.mp3'
// import MusicPlayer from "./MusicPlayer";

// const AudioWorkShop = () =>{
//     const [myAudios, setMyAudios] = useState([audio1, audio2])
//     const [cutStart, setCutStart] = useState(0)
//     const [cutEnd, setCutEnd] = useState(0)

//     const [selectedAudio, setSelectedAudio] = useState()
//     const audioRef = useRef()

//     const defaultSelect = "-- Select an audio file to work with --"

//     return (
//         <div id="workshopSideBar">
//             <div id="sideBarContent">
//             <select defaultValue="default" value={selectedAudio} onChange={e=>setSelectedAudio(e.target.value)}>
//             <option value="default">{defaultSelect}</option>
//             {myAudios.map((audio, id)=>(
//                 <option value={audio} key={id}>{audio}</option>
//             ))}

//             </select>
//             <hr></hr>
//             {
//                 selectedAudio && selectedAudio!=="default" ?
//                 <>
//                     <MusicPlayer audio={selectedAudio} ref={audioRef}/>
//                     <div className="cutButtons">
//                         <button onClick={()=> {
                            
//                             setCutStart(audioRef.current.currentTime || 0)
//                             }}>Start Cut</button>
//                         <button>End Cut</button>
//                     </div>
//                 </>
//                 :
//                 <p>None selected</p>
//             }
//             </div>
//         </div>
//     )
// }

// export default AudioWorkShop