import WavesurferPlayer from '@wavesurfer/react'
import {useMemo, useEffect, useState } from 'react'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import Hover from 'wavesurfer.js/dist/plugins/hover.esm.js'
import Minimap from 'wavesurfer.js/dist/plugins/minimap.esm.js'
import ZoomPlugin from 'wavesurfer.js/dist/plugins/zoom.esm.js'
import * as Tone from "tone"


const random = (min, max) => Math.random() * (max - min) + min
const randomColor = () => `rgba(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)}, 0.3)`


const WS = ({audio, id, setCutOuts}) => {
    const [wavesurfer, setWavesurfer] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [color, setColor] = useState()
    const [rate, setRate] = useState(1)
    const [loop, setLoop] = useState(true)
    const [activeRegion, setActiveRegion] = useState(null)
    const [regions] = useState(() => RegionsPlugin.create({ contentEditable: true }));
    const [editRegion, setEditRegion] = useState(null)


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

    useEffect(() => {
        if (wavesurfer) {
            wavesurfer.setPlaybackRate(rate);
        }
    }, [rate, wavesurfer]);
    // https://gist.github.com/Daninet/22edc59cf2aee0b9a90c18e553e49297   -- idk what is happening but I like it
    function audioBufferToWav(sampleRate, channelBuffers) {
        const totalSamples = channelBuffers[0].length * channelBuffers.length;

        const buffer = new ArrayBuffer(44 + totalSamples * 2);
        const view = new DataView(buffer);

        const writeString = (view, offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        /* RIFF identifier */
        writeString(view, 0, "RIFF");
        /* RIFF chunk length */
        view.setUint32(4, 36 + totalSamples * 2, true);
        /* RIFF type */
        writeString(view, 8, "WAVE");
        /* format chunk identifier */
        writeString(view, 12, "fmt ");
        /* format chunk length */
        view.setUint32(16, 16, true);
        /* sample format (raw) */
        view.setUint16(20, 1, true);
        /* channel count */
        view.setUint16(22, channelBuffers.length, true);
        /* sample rate */
        view.setUint32(24, sampleRate, true);
        /* byte rate (sample rate * block align) */
        view.setUint32(28, sampleRate * 4, true);
        /* block align (channel count * bytes per sample) */
        view.setUint16(32, channelBuffers.length * 2, true);
        /* bits per sample */
        view.setUint16(34, 16, true);
        /* data chunk identifier */
        writeString(view, 36, "data");
        /* data chunk length */
        view.setUint32(40, totalSamples * 2, true);

        // floatTo16BitPCM
        let offset = 44;
        for (let i = 0; i < channelBuffers[0].length; i++) {
            for (let channel = 0; channel < channelBuffers.length; channel++) {
                const s = Math.max(-1, Math.min(1, channelBuffers[channel][i]));
                view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
                offset += 2;
            }
        }

        return buffer;
    }

    const saveBufferToUrl = (sampleRate, channelBuffers) =>{
        const wavData = audioBufferToWav(sampleRate, channelBuffers)
        const blob = new Blob([wavData], { type: 'audio/wav' })
        const url = URL.createObjectURL(blob)
        setCutOuts((prevItems)=>[...prevItems, url])

    }

    const die = () =>{
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

    const punch = ()=>{

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



    useEffect(()=>{
        setColor(randomColor())
    }, [])
    useEffect(() => {
        if (!wavesurfer) return;

        const handleFinish = () => {
            if (loop) {
                wavesurfer.play();
            }
        };

        wavesurfer.on("finish", handleFinish);

        return () => {
            wavesurfer.un("finish", handleFinish);
        };
    }, [wavesurfer, loop]);

    return (
        <>
            <WavesurferPlayer
                plugins={plugins}

                loop = {loop}
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

            <input type="checkbox" checked={loop} onChange={()=>{
                setLoop(!loop)
            }}></input>Loop Regions
            <input type='range' step="0.05" min="0" value={rate} onChange={e=>setRate(e.target.value)} max="2"></input>{rate}
            {editRegion&&
                <div>
                    <p>Editing: {editRegion}</p>
                    <button onClick={die}>Cut Out (Die)</button>
                    <button onClick={punch}>Cut Out (Punch)</button>

                    <input type="checkbox" checked={loop} onChange={()=>{
                        setLoop(!loop)
                    }}>
                    </input>Loop Region
                </div>
            }
            {/* {
      cutOuts && cutOuts.map((sample)=>(
        <audio controls src={sample}></audio>

      ))
    } */}
        </>
    )
}

export default WS