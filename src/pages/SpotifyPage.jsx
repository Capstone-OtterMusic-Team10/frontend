import MusicSubChat from './MusicSubChat'
import { useState, useEffect } from 'react'
import { api } from '../utils'
import SpotiPlaylistView from '../components/SpotiPlaylistView'
const SpotifyPage =() =>{

    const [playLists, setPlayLists] = useState([])
    
    const getPlayLists = async()=>{
        const result = await api.get("get_spoti")
        console.log(result)
        setPlayLists(result.data.items)
    }
    useEffect(()=>{
        getPlayLists() 
    }, [])
    return (
        <>
            <div id="SpotifyPage">
                    {playLists && playLists.map((playList, idx)=>(
                        <SpotiPlaylistView key={playList.id || idx} playlist={playList}/>
                    ))}
            </div>
        </>
    )
}

export default SpotifyPage