import { useEffect, useState } from "react";
import { FileUp } from "lucide-react";
const DragAndDrop  =() =>{
    const [mp3Files, setMp3Files] = useState([])
    const [isDragging, setIsDragging] = useState(false)

    const handleDrop = (e) =>{
        e.preventDefault()
        const files = Array.from(e.dataTransfer.files)
        const mp3 = files.filter(f => f.type === 'audio/mpeg' || f.name.endsWith('.mp3'))
        setMp3Files(prev=>[...prev, ...mp3])
        console.log(mp3Files)
    }
    useEffect(()=>{
        console.log(mp3Files)
    }, [mp3Files])
    return (
        <>
            {/* <MusicPlayer/> */}
            <div className={isDragging?"dropMp3-dragging":"dropMp3"}
            onDrop={handleDrop}
            onDragOver={(e)=>{
                e.preventDefault()
            }}
            onDragEnter={()=>setIsDragging(true)}
            onDragExit={()=>setIsDragging(false)}>
                {
                    isDragging?
                    (
                    <>
                        <FileUp/>
                        
                    </>
                    )
                    :
                    <h4>Drag and drop a track</h4>
                }
                
            </div>
            {/* <button onClick={playFunc}>Play</button> */}

        </>
    )
}

export default DragAndDrop 