import WavesurferPlayer from '@wavesurfer/react'
import {useMemo, useEffect, useState } from 'react'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js'
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.esm.js'


const random = (min, max) => Math.random() * (max - min) + min
const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.3)`


const WS = ({audio, id}) => {
  const [wavesurfer, setWavesurfer] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [color, setColor] = useState()
  const [regionColor, setRegionColor] = useState(randomColor())
  const [loop, setLoop] = useState(true)
  const [activeRegion, setActiveRegion] = useState(null)
  const [regions, setRegions] = useState(RegionsPlugin.create({contentEditable: true}))
  const [editRegion, setEditRegion] = useState(null)

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
    // console.log(regions)
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
    console.log('region-in', region)
        setActiveRegion(region)
    })
    regions.on('region-out', (region) => {
    // console.log('region-out', region)
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
    console.log(region)
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
    setColor(randomColor())
  }, [])


  return (
    <>
      <WavesurferPlayer
        plugins={plugins}
        height={100}
        cursorColor='pink'
        waveColor={color}
        progressColor="#6d466c"
        url={audio}
        onReady={onReady}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
      </WavesurferPlayer>
      <div className="timelines" id={`timeline-${id}`}></div>
      <button onClick={onPlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      
      <input type="checkbox" checked={loop} onClick={()=>{
        setLoop(!loop)
      }}></input>Loop Regions
    {editRegion&&
    <div>
    <p>Editing: {editRegion}</p>
    <button>Cut Out</button>
    <button>Cut Out & Save</button>
    <button>Distort</button>
    <input type="checkbox" checked={loop} onClick={()=>{
        setLoop(!loop)
      }}>
    </input>Loop Region
    </div>
    }
    </>
  )
}

export default WS