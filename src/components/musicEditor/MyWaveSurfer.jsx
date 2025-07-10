import WavesurferPlayer from '@wavesurfer/react'
import { useRef, useMemo, useEffect, useState } from 'react'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js'
const random = (min, max) => Math.random() * (max - min) + min
const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.5)`
const WS = ({audio, id}) => {
  const [wavesurfer, setWavesurfer] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [region, setRegion] = useState([])
  // const regions = RegionsPlugin.create()
  
  // regions.enableDragSelection({
  //   color: 'rgba(88, 206, 19, 0.1)',
  // })

  // regions.on('region-updated', (region) => {
  //   console.log('Updated region', region)
  // })
  // console.log(regions)
  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause()
  }

   const plugins = useMemo(() => [
    RegionsPlugin.create({
    dragSelection: {
      color: 'rgba(88, 206, 19, 0.1)',
    },
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
    })
  ], [])


   const onReady = (ws) => {
    setWavesurfer(ws)

  ws.on('region-created', (region) => {
    console.log('✅ Region created:', region)
  })

  ws.on('ready', () => {
    console.log('WaveSurfer is ready with regions:', ws.regions?.list)
  })

  ws.on('decode', () => {
    ws.addRegion({
      start: 9,
      end: 10,
      content: 'Cramped region',
      color: randomColor(),
      minLength: 1,
      maxLength: 10,
    })
  })
  }

  
  return (
    <>
    <div id="audioWorkshopWavesurfer">
      <WavesurferPlayer
        plugins={plugins}
        height={100}
        cursorColor='pink'
        waveColor="violet"
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
      </div>
    </>
  )
}

export default WS