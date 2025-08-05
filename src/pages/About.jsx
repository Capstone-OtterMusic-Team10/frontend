import { useEffect, useState } from 'react'
import testtest from '../assets/audio2.wav'
import DrumComp from '../components/musicEditor/DrumComp'
const About = () => {
    const [show, setShow] = useState(null)
    const [callRandom, setCallRandom] = useState(false)

    const observer = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
            if (entry.isIntersecting){
                setShow(true)
                // entry.target.classList.add('show')
            }else{
                // entry.target.classList.remove('show')
                setShow(false)
            }
        })
    })
    useEffect(()=>{
        setShow(false)
    }, [])
    const hidden = document.querySelectorAll('.hidden')
    hidden.forEach(el=>observer.observe(el))
    return(
        <>
            <div id="aboutPage">
                <h1>About OtterMusic 🦦</h1>
                <p>
                OtterMusic is a user-friendly application that offers every user, 
                regardless of their music skills, a creative freedom for music generation 
                across different genres and purposes. It is a more carefree application that 
                targets anyone who enjoys music, much like music applications we see today, 
                relatively designed for recreational enjoyment. This application is 
                important for music lovers in general. Inspired to be a creative enjoyment
                of music appreciation, intertwined with our idea of including AI 
                generative integrations to convince the user to use the application 
                more out of their own curiosities.
                </p>
                <div id="about-chat">
                    <div className={`chat user ${show?"show":"hidden"}`}>Can you make LoFi beats for studying and concentration?</div>
                    <div className={`chat ai ${show?"show":"hidden"}`}><audio controls>
                        <source src={testtest} type="audio/mp3" />
                        Your browser does not support the audio element.
                    </audio></div>
                </div>     
            </div>
               
            <div id="drumAbout">
                
                <h2>Choose the sound and populate the squares!<span id="dice" className={show?"show":"hiddenDice"} onClick={()=>setCallRandom(!callRandom)}>🎲</span></h2>
                
                <DrumComp isMini={true} callRandom={callRandom}/>

                * Double-click a square to remove its sound
            </div>

        </>
    )
}

export default About