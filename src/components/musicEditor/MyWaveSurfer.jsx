import WavesurferPlayer from '@wavesurfer/react'
import { useRef, useMemo, useEffect, useState } from 'react'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js'


const random = (min, max) => Math.random() * (max - min) + min
const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.3)`


const WS = ({audio, id}) => {
  const [wavesurfer, setWavesurfer] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [regions, setRegions] = useState(RegionsPlugin.create({contentEditable: true}))
  const [color, setColor] = useState()
  const [regionColor, setRegionColor] = useState(randomColor())
  const [loop, setLoop] = useState(true)
  const [activeRegion, setActiveRegion] = useState(null)

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause()
  }

   const plugins = useMemo(() => [
    
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
    console.log(regions)
    setWavesurfer(ws)
    regions.enableDragSelection({
      color: regionColor,
      })
    ws.once('interaction', () => {
      ws.play()
    })
    regions.on('region-in', (region) => {
    console.log('region-in', region)
        setActiveRegion(region)
    })
    regions.on('region-out', (region) => {
    console.log('region-out', region)
    if (activeRegion === region) {
      if (loop) {
        region.play()
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

    {/* <input type='checkbox' id='repeat' checked={loop} onChange={
      ()=>{
        setLoop(!loop)
      }
    }></input><label for='repeat'>Loop All Selections</label> */}
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

    </>
  )
}

export default WS