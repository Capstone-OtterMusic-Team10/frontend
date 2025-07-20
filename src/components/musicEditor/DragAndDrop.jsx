// import { useEffect, useState } from "react";
// import { FileUp } from "lucide-react";
// const DragAndDrop  =() =>{
//     const [mp3Files, setAudioFile] = useState([])
//     const [isDragging, setIsDragging] = useState(false)
//
//     const handleDrop = (e) =>{
//         e.preventDefault()
//         setIsDragging(false);
//         const file = e.dataTransfer.files[0]
//         if (file && (file.type === "audio/mpeg" || file.name.endsWith(".mp3") || file.name.endsWith(".wav"))) {
//             const url = URL.createObjectURL(file);
//             console.log(url)
//             setAudioFile(prev=>[...prev, {name: file.name, url}])
//         }
//
//         console.log(mp3Files)
//     }
//     useEffect(()=>{
//         console.log(mp3Files)
//     }, [mp3Files])
//     return (
//         <>
//             <div className={isDragging?"dropMp3-dragging":"dropMp3"}
//                  onDrop={handleDrop}
//                  onDragOver={(e)=>{
//                      e.preventDefault()
//                  }}
//                  onDragEnter={()=>setIsDragging(true)}
//                  onDragLeave={()=>setIsDragging(false)}>
//                 {
//                     isDragging?
//                         (
//                             <>
//                                 <FileUp/>
//                                 <p>Drop files here</p>
//                             </>
//                         )
//                         :
//                         <h4>Drag and drop a track</h4>
//                 }
//
//             </div>
//             <ul>
//                 {mp3Files&& mp3Files.map((file, idx) => (
//                     <li key={idx}>{file.name}
//                         <audio controls src={file.url} />
//                     </li>
//
//                 ))}
//             </ul>
//             {/* <button onClick={playFunc}>Play</button> */}
//
//         </>
//     )
// }
//
// export default DragAndDrop