import WavesurferPlayer from '@wavesurfer/react'
import {useMemo, useEffect, useState } from 'react'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js'
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.esm.js'
import audioBufferToWav from '../../utils'
import { Play, Pause } from 'lucide-react'

const random = (min, max) => Math.random() * (max - min) + min
const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.3)`


const WS = ({audio, id, setCutOuts, isSample, isInChannel}) => {
  const [wavesurfer, setWavesurfer] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [color, setColor] = useState()
  const [rate, setRate] = useState(1)
  const [loop, setLoop] = useState(true)
  const [activeRegion, setActiveRegion] = useState(null)
  const [regions] = useState(() => RegionsPlugin.create({ contentEditable: true, color: randomColor() }));
  const [editRegion, setEditRegion] = useState(null)
  const [volume, setVolume] = useState(1)

  const handleDragStart = (e) =>{
    e.dataTransfer.setData("audio-file", audio)
    console.log(audio)
  }
  const regionColor =randomColor()
  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause()
  }
   const plugins = useMemo(() => [
    ZoomPlugin.create({
    scale: 0.05,
    maxZoom: 200,
  }),
    Minimap.create({
      height: 20,
      waveColor: '#ddd',
      progressColor: '#999',
      // the Minimap takes all the same options as the WaveSurfer itself
    }),
    Hover.create({
      lineColor: '#ff0000',
      lineWidth: 2,
      labelBackground: '#555',
      labelColor: '#fff',
      labelSize: '11px',
      labelPreferLeft: false,
    }),
    TimelinePlugin.create({
      insertPosition: 'beforeBegin',
      container: `#timeline-${id}`,
      height: 30,
      primaryColor: 'blue',
      secondaryColor: 'red',
      primaryFontColor: 'blue',
      secondaryFontColor: 'red'
    }),regions
  ], [])


  const onReady = (ws) => {
    setWavesurfer(ws)
    regions.enableDragSelection({
      contentEditable: true,
      color: regionColor,
      loop: true,
      })
    ws.once('interaction', () => {
      ws.play()
    })
    regions.on('region-in', (region) => {
     
        setActiveRegion(region)

        
    })
    regions.on('region-out', (region) => {
    if (activeRegion === region) {
      if (loop) {
        wavesurfer.play(region.start, region.end);
      } else {
        setActiveRegion(null)
      }
    }
  })
  regions.on('region-clicked', (region, e) => {
    e.stopPropagation() // prevent triggering a click on the waveform
    setActiveRegion(region)
    region.play(true)
    region.setOptions({ color: randomColor() })
    setEditRegion(region.id)
  })
  
  // Reset the active region when the user clicks anywhere in the waveform
  ws.on('interaction', () => {
    setActiveRegion(null)
  })
  }

  useEffect(()=>{
    const handleDelete = (e) =>{
      if (!activeRegion){
        return
      }
      if (e.key === "Delete"){
        activeRegion.remove()
        setActiveRegion(null)
      }
    }
    window.addEventListener("keydown", handleDelete)
    return () => {
        window.removeEventListener("keydown", handleDelete)
      }
  }, [activeRegion])
  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.setPlaybackRate(rate);
    }
  }, [rate, wavesurfer]);
  

  const saveBufferToUrl = (sampleRate, channelBuffers) =>{
    const wavData = audioBufferToWav(sampleRate, channelBuffers)
    const blob = new Blob([wavData], { type: 'audio/wav' })
    const url = URL.createObjectURL(blob)
    setCutOuts((prevItems)=>[...prevItems, url])
    
  }

  const delRegion = () =>{
    const initialBuffer =  wavesurfer.getDecodedData()
      const sampleRate = initialBuffer.sampleRate
      
      const start = Math.floor(activeRegion.start * sampleRate)
      const end = Math.floor(activeRegion.end * sampleRate)
      // console.log(initialBuffer)
      const beforeLength = start;
      const afterLength = initialBuffer.length - end
      const newLength = beforeLength + afterLength; 

      const audioCtx = new (window.AudioContext)();
      const newBuffer = audioCtx.createBuffer(
        initialBuffer.numberOfChannels,
        newLength,
        sampleRate
      );

      // console.log(newBuffer)
      const channelBuffers = []
  
      for (let channel = 0; channel < initialBuffer.numberOfChannels; channel ++){
        const originalChannelData = initialBuffer.getChannelData(channel)
        const slicedChannelData = newBuffer.getChannelData(channel)
        for (let i = 0; i < beforeLength; i++) {
            slicedChannelData[i] = originalChannelData[i];
        }
        for (let i = 0; i < newLength; i++) {
            slicedChannelData[i+beforeLength] = originalChannelData[end+i];
        }
         
        channelBuffers.push(slicedChannelData)
      } 
      saveBufferToUrl(newBuffer.sampleRate, channelBuffers)


  }

  const cutoutRegion = ()=>{

      const initialBuffer =  wavesurfer.getDecodedData()
      const sampleRate = initialBuffer.sampleRate
      
      const start = Math.floor(activeRegion.start * sampleRate)
      const end = Math.floor(activeRegion.end * sampleRate) 

      const cutLength = end - start;
      const audioCtx = new (window.AudioContext)();

      const newBuffer = audioCtx.createBuffer(
        initialBuffer.numberOfChannels,
        cutLength,
        sampleRate
      );

      // console.log(newBuffer)
      const channelBuffers = []
  
      for (let channel = 0; channel < initialBuffer.numberOfChannels; channel ++){
        const originalChannelData = initialBuffer.getChannelData(channel)
        const slicedChannelData = newBuffer.getChannelData(channel)
        for (let i = 0; i < cutLength; i++) {
            slicedChannelData[i] = originalChannelData[start + i];
        }
        channelBuffers.push(slicedChannelData)
      } 
      saveBufferToUrl(newBuffer.sampleRate, channelBuffers)

      // console.log(cutOuts)
      
  }
  

  const handleFinish = () => {
    if (loop) {
      wavesurfer.play();
    }
  };

  useEffect(()=>{
    setColor(randomColor())
  }, [])

  useEffect(() => {
  if (wavesurfer) {
    wavesurfer.setVolume(volume);
  }
}, [volume, wavesurfer]);

  useEffect(() => {
  if (!wavesurfer) return;


  wavesurfer.on("finish", handleFinish);

  return () => {
    wavesurfer.un("finish", handleFinish);
  };
}, [wavesurfer, loop]);

  return (
    <>
    <div id="audioWorkshopWavesurfer">
    {!isInChannel?
        <div id="draggable_area" draggable  onDragStart={handleDragStart}>
        <WavesurferPlayer
          plugins={plugins}
          loop = {loop}
          height={isSample?60:100}
          cursorColor='pink'
          waveColor={color}
          progressColor="#6d466c"
          url={audio}
          onReady={onReady}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
      >
      </WavesurferPlayer>
      </div>
      :
      <>
        <WavesurferPlayer
          plugins={plugins}
          loop = {loop}
          height={isSample?60:100}
          cursorColor='pink'
          waveColor={color}
          progressColor="#6d466c"
          url={audio}
          onReady={onReady}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
      >
      </WavesurferPlayer>
      {/* <button>Add Another</button> */}
      </>
  }
     
      <div className="timelines" id={`timeline-${id}`}></div>
      <button onClick={onPlayPause}>
        {isPlaying ? <Pause color="gray" /> : <Play color="gray"/>}
      </button>
      <input
        type="range"
        step="0.01"
        min="0"
        max="1"
        value={volume}
        onChange={e => {
          setVolume(parseFloat(e.target.value))
        }}
      />
      
      <span>Volume: {volume.toFixed(2)*100}</span><br></br>
      <input type="checkbox" checked={loop} onChange={()=>{
        setLoop(!loop)
      }}></input>Loop Regions
      <input type='range' step="0.05" min="0" value={rate} onChange={e=>setRate(e.target.value)} max="2"></input>{rate}
    {editRegion&&
      <div>
      <p>Editing: <span id="editingRegion">{editRegion}</span></p>
      <button onClick={delRegion}>Delete Region</button>
      <button onClick={cutoutRegion}>Cutout Region</button>

      <input type="checkbox" checked={loop} onChange={()=>{
          setLoop(!loop)
        }}>
      </input>Loop Region
      </div>
    }
    </div>
    </>
  )
}

export default WS