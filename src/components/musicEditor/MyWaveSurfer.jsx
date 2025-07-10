import WavesurferPlayer from '@wavesurfer/react'
import { useRef, useMemo, useEffect, useState } from 'react'
import RegionsPlugin from 'wavesurfer.js/plugins/regions';
import TimelinePlugin from "wavesurfer.js/plugins/timeline";

const WS = ({audio, id}) => {
  const [wavesurfer, setWavesurfer] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [region, setRegion] = useState([])
  const onReady = (ws) => {
  setWavesurfer(ws)

  ws.on('region-created', (region) => {
    console.log('✅ Region created:', region)
  })

  // optional: log all current regions
  ws.on('ready', () => {
    console.log('WaveSurfer is ready with regions:', ws.regions?.list)
  })
}

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause()
  }

   const plugins = useMemo(() => [
    RegionsPlugin.create({
      dragSelection: true,
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
  ], [id])
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