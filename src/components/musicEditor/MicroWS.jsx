import WavesurferPlayer from '@wavesurfer/react'
import {useMemo, useEffect, useState } from 'react'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js'
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.esm.js'


const random = (min, max) => Math.random() * (max - min) + min
const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.3)`


const MicroWS = () =>{
  const [wavesurfer, setWavesurfer] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [color, setColor] = useState()
  const [rate, setRate] = useState(1)
  const [loop, setLoop] = useState(true)
  const [activeRegion, setActiveRegion] = useState(null)
  const [regions] = useState(() => RegionsPlugin.create({ contentEditable: true, color: randomColor() }));
  const [editRegion, setEditRegion] = useState(null)
}

export default MicroWS