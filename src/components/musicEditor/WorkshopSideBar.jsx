import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../utils';
import { FileUp } from 'lucide-react';
import { useRef } from 'react';

const WorkshopSideBar = ({ musicFiles, setPickedAudio, userId }) => {
    const navigate = useNavigate();
    const uploadRef = useRef();
    const jwtToken = localStorage.getItem('token');

    const getAudio = async (name, chatId, promptId) => {
        try {
            const response = await api.get(`/get-audio/${chatId}/${promptId}`, {
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.size > 0) {
                const blob = new Blob([response.data], { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);
                setPickedAudio(url);
            }
        } catch (err) {
            console.error('Error fetching audio:', err);
        }
    };

    const handleUpload =(e)=>{
        const file = e.target.files[0]
        const url = URL.createObjectURL(file);
        setPickedAudio(url)
        // trying out something new with the indexed db 
        // const request = indexedDB.open("audioStore", 1)


    }
    return (
        <div id="sideBar">
            <button id="backButton" onClick={() => navigate('/')}>
                Back
            </button>
            {!jwtToken ? (
                <div className="no-files">
                    <p>No music clips found.</p>
                    <p id="side-bar-text">
                        <Link to="/signup">Sign up </Link> or <Link to="/login">Log in </Link>
                        to create music in the chat and get started.
                    </p>
                    <p>Or, upload your own!</p>
                    <FileUp
                        onClick={() => uploadRef.current.click()}
                        className="upload"
                        color="white"
                    />
                    <input
                        style={{ display: 'none' }}
                        type="file"
                        onChange={(e) => handleUpload(e)}
                        ref={uploadRef}
                    />
                </div>
            ) : !userId ? (
                <div className="no-files">
                    <p>Loading user data...</p>
                </div>
            ) : musicFiles.length === 0 ? (
                <div className="no-files">
                    <p>No music clips found.</p>
                    <p>Create some music in the chat to get started!</p>
                    <FileUp
                        onClick={() => uploadRef.current.click()}
                        className="upload"
                        color="white"
                    />
                    <input
                        style={{ display: 'none' }}
                        type="file"
                        onChange={(e) => handleUpload(e)}
                        ref={uploadRef}
                    />
                </div>
            ) : (
                <>
                    {musicFiles.map((file) => (
                        <div
                            onClick={() => getAudio(file.name, file.chat, file.prompt)}
                            className="musicSelect"
                            key={file.id}
                        >
                            {file.name}
                        </div>
                    ))}
                    <FileUp
                        onClick={() => uploadRef.current.click()}
                        className="upload"
                        color="white"
                    />
                    <input
                        style={{ display: 'none' }}
                        type="file"
                        onChange={(e) => handleUpload(e)}
                        ref={uploadRef}
                    />
                </>
            )}
        </div>
    );
};

export default WorkshopSideBar;