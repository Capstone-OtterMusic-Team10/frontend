import testtest from '../assets/testtest.wav'
import Footer from '../components/Footer'
import { useEffect } from 'react'


const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
        if (entry.isIntersecting){
            entry.target.classList.add('show')
        }else{
            entry.target.classList.remove('show')
        }
    })
})

const hidden = document.querySelectorAll('.hidden')
hidden.forEach(el=>observer.observe(el))

const About = () => {
    // useEffect(() => {
    //     window.scrollTo(0, 0)
    // }, [])
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
                    <div className="chat user hidden">Can you make LoFi beats for studying and concentration?</div>
                    <div className="chat ai hidden"><audio controls>
                        <source src={testtest} type="audio/mp3" />
                        Your browser does not support the audio element.
                    </audio></div>
                </div>
                
 
            </div>
        </>
    )
}

export default About