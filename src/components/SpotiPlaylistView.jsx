

const SpotiPlaylistView = ({playlist}) =>{
    console.log(playlist)
    return (
        <>
        
            <div className="playListBox">
                <img className="playlistImage" src={playlist.images[1].url}></img>

                <h4 className="playlistName">{playlist.name}</h4>
                <p>By {playlist.owner.display_name}</p>
                <button className="playlistButton">Suggest</button>
            </div>
        </>
    )
}

export default SpotiPlaylistView