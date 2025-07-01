import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// =======================================================================
// الأيقونات (SVG Icons)
// =======================================================================
const UsersIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a3.001 3.001 0 015.288 0M12 14a4 4 0 100-8 4 4 0 000 8z" />
    </svg>
);

const CrownIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-2.458a9.337 9.337 0 00-2.458-4.121m-2.458 4.121L15 19.128M15 19.128A9.37 9.37 0 0112 21.75c-2.676 0-5.141-.959-7.071-2.586m7.071-2.586a9.37 9.37 0 00-2.586-7.071m2.586 7.071a9.37 9.37 0 01-7.071-2.586m0 0A9.37 9.37 0 014.93 5.07c1.93-.93 4.395-.93 6.326 0m2.146 11.058a9.37 9.37 0 002.586-7.071M4.93 5.07a9.37 9.37 0 00-2.586 7.071m0 0c.93 1.93 2.999 3.46 5.518 3.46" />
    </svg>
);

const MicrophoneIcon = (props) => (
     <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);

const MutedMicrophoneIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5l14 14" />
    </svg>
);


// =======================================================================
// المكون الرئيسي للميزة
// =======================================================================
export default function Spaces() {
    const [selectedSpaceId, setSelectedSpaceId] = useState(null);

    const goBackToList = () => {
        setSelectedSpaceId(null);
    };

    // Load Agora SDK script dynamically
    useEffect(() => {
        const scriptId = 'agora-sdk-script';
        if (document.getElementById(scriptId)) return;
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://download.agora.io/sdk/release/AgoraRTC_N-4.20.2.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <div className="bg-white min-h-screen font-sans mt-20">
            {selectedSpaceId ? (
                <SpaceRoom spaceId={selectedSpaceId} onLeave={goBackToList} />
            ) : (
                <SpacesList onSelectSpace={setSelectedSpaceId} />
            )}
        </div>
    );
}

// =======================================================================
// مكون قائمة المساحات (SpacesList)
// =======================================================================
function SpacesList({ onSelectSpace }) {
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newSpaceTitle, setNewSpaceTitle] = useState('');
    const userToken = localStorage.getItem("userToken");

    useEffect(() => {
        const fetchSpaces = async () => {
            if (!userToken) {
                setError("يرجى تسجيل الدخول لعرض الغرف المتاحة.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get("https://boookify.runasp.net/api/Spaces", {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                setSpaces(res.data);
            } catch (err) {
                console.error("Error fetching spaces:", err);
                setError("فشل تحميل قائمة الغرف. يرجى المحاولة مرة أخرى.");
            } finally {
                setLoading(false);
            }
        };
        fetchSpaces();
    }, [userToken]);

    const handleCreateSpace = async (e) => {
        e.preventDefault();
        if (!newSpaceTitle.trim() || !userToken) return;

        try {
            const res = await axios.post("https://boookify.runasp.net/api/Spaces/create", 
                { title: newSpaceTitle },
                { headers: { Authorization: `Bearer ${userToken}` } }
            );
            alert("تم إنشاء الغرفة بنجاح!");
            onSelectSpace(res.data.id);
        } catch (error) {
            console.error("Error creating space:", error);
            alert("فشل إنشاء الغرفة.");
        }
    };

    return (
        <div className="bg-[#F6F4DF] min-h-screen">
             <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-[#8B3302]">Spaces</h1>
                    <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-[#8B3302] text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-[#722801] transition disabled:bg-gray-400"
                        disabled={!userToken}
                    >
                        Create Space
                    </button>
                </div>
                
                {loading ? (
                    <p className="text-center text-gray-600">Loading spaces...</p>
                ) : error ? (
                    <div className="text-center text-red-600 bg-red-100 p-6 rounded-lg border border-red-400">{error}</div>
                ) : spaces.length === 0 ? (
                    <p className="text-center text-gray-600 bg-white/50 p-6 rounded-lg">No active spaces right now. Why not create one?</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {spaces.map(space => (
                            <div key={space.id} onClick={() => onSelectSpace(space.id)} className="bg-white p-6 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300">
                                <h2 className="text-2xl font-bold text-gray-800 truncate">{space.title}</h2>
                                <p className="text-gray-500 mt-2">Hosted by: <span className="font-semibold">{space.hostUserName}</span></p>
                                <div className="flex items-center text-gray-600 mt-4">
                                    <UsersIcon className="w-6 h-6 mr-2" />
                                    <span>{space.participantCount} participating</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Create a New Space</h2>
                        <form onSubmit={handleCreateSpace}>
                            <input
                                type="text"
                                value={newSpaceTitle}
                                onChange={(e) => setNewSpaceTitle(e.target.value)}
                                placeholder="Enter space title"
                                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#8B3302]"
                            />
                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="text-gray-600">Cancel</button>
                                <button type="submit" className="bg-[#8B3302] text-white font-bold py-2 px-6 rounded-lg">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// =======================================================================
// مكون غرفة المحادثة (SpaceRoom) - معالجة كاملة للصوت وإدارة المشاركين
// =======================================================================
function SpaceRoom({ spaceId, onLeave }) {
    const [spaceDetails, setSpaceDetails] = useState(null);
    const [isMuted, setIsMuted] = useState(true);
    const [activeSpeakers, setActiveSpeakers] = useState({});
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("Initializing...");

    const agoraClientRef = useRef(null);
    const localAudioTrackRef = useRef(null);
    
    const userToken = localStorage.getItem("userToken");
    const APP_ID = "a9d020f1607a4c349da33a88d19ba505";

    useEffect(() => {
        let isMounted = true;
        let client = null;

        const setupAgora = async () => {
            if (!window.AgoraRTC || !userToken) {
                setError("يرجى تسجيل الدخول والمحاولة مرة أخرى.");
                return;
            }

            client = window.AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
            agoraClientRef.current = client;

            client.on('user-published', async (user, mediaType) => {
                await client.subscribe(user, mediaType);
                if (mediaType === 'audio') {
                    user.audioTrack.play();
                }
            });

            client.on("volume-indicator", (volumes) => {
                if (!isMounted) return;
                const speakers = {};
                volumes.forEach((volume) => {
                    if (volume.level > 5) speakers[volume.uid] = true;
                });
                setActiveSpeakers(prev => ({...prev, ...speakers}));
            });

            try {
                setStatus("Joining channel...");
                const response = await axios.post(`https://boookify.runasp.net/api/Spaces/${spaceId}/join`, {}, {
                    headers: { 'Authorization': `Bearer ${userToken}` }
                });
                const { rtcToken, channelName, agoraUid } = response.data;
                
                await client.join(APP_ID, channelName, rtcToken, agoraUid);
                
                if (!isMounted) return;
                setStatus("Publishing microphone...");
                const audioTrack = await window.AgoraRTC.createMicrophoneAudioTrack();
                localAudioTrackRef.current = audioTrack;
                await client.publish([audioTrack]);
                audioTrack.setEnabled(false);
                setIsMuted(true);
                
                if (isMounted) {
                    setError(null);
                    setStatus("Connected");
                }
            } catch (err) {
                console.error("====== AGORA JOIN FAILED ======", err);
                let userMessage = `Could not join the audio channel. Error: ${err.message}.`;
                if (err.code === 'UID_CONFLICT') {
                    userMessage = 'This user ID is already in the channel. Please try again after a few moments.';
                }
                setError(userMessage);
                setStatus("Failed");
            }
        };

        setupAgora();

        return () => {
            isMounted = false;
            const leaveChannel = async () => {
                if (localAudioTrackRef.current) {
                    localAudioTrackRef.current.stop();
                    localAudioTrackRef.current.close();
                }
                if (agoraClientRef.current) {
                    agoraClientRef.current.removeAllListeners();
                    await agoraClientRef.current.leave();
                }
                console.log("Cleanly left Agora channel.");
            }
            leaveChannel();
        };
    }, [spaceId, userToken]);

    const toggleMute = () => {
        if (localAudioTrackRef.current) {
            const nextMutedState = !isMuted;
            localAudioTrackRef.current.setEnabled(!nextMutedState);
            setIsMuted(nextMutedState);
        }
    };
    
    useEffect(() => {
        if (!userToken) return;
        const fetchDetails = async () => {
            try {
                const res = await axios.get(`https://boookify.runasp.net/api/Spaces/${spaceId}`, { headers: { Authorization: `Bearer ${userToken}` }});
                setSpaceDetails(res.data);
            } catch (err) { console.error("Could not fetch space details", err); }
        };
        fetchDetails();
        const interval = setInterval(fetchDetails, 3000);
        return () => clearInterval(interval);
    }, [spaceId, userToken]);


    const Participant = ({ user, isHost = false, isSpeaking = false }) => (
        <div className="flex flex-col items-center text-center gap-2">
            <div className={`relative w-20 h-20 rounded-full flex items-center justify-center ${isHost ? 'bg-yellow-100' : 'bg-gray-200'}`}>
                <img src={user.profilePictureFullUrl || `https://i.pravatar.cc/150?u=${user.userId}`} alt={user.userName} className={`w-full h-full rounded-full object-cover transition-all duration-300 ${isSpeaking ? 'ring-4 ring-green-500 p-1' : 'ring-2 ring-transparent'}`} />
                {isHost && <CrownIcon className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500" />}
            </div>
            <span className="font-semibold text-gray-800 truncate w-24">{user.userName}</span>
        </div>
    );
    
    if (status !== "Connected" && !spaceDetails) {
         return (
            <div className="text-center p-10">
                <p className="text-gray-600 mb-4">{status}</p>
                {error && <div className="text-red-600 bg-red-100 p-4 rounded-lg border border-red-400">{error}</div>}
            </div>
         );
    }
    
    if (!spaceDetails) return <p className="text-center text-gray-600 p-10">Loading space details...</p>;
    
    const { host, speakers = [], listeners = [] } = spaceDetails;
    
    // Create a map to check if a user is a speaker to avoid duplication in listener list
    const speakerIdMap = new Set(speakers.map(s => s.userId));
    if(host) speakerIdMap.add(host.userId);
    
    return (
        <div className="bg-[#F6F4DF] min-h-screen">
            <div className="container mx-auto p-4 sm:p-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 relative pb-28">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{spaceDetails.title}</h1>
                            <p className="text-gray-500">Total Participants: {spaceDetails.totalParticipants}</p>
                        </div>
                        <button onClick={onLeave} className="text-gray-600 hover:text-black font-semibold">Leave</button>
                    </div>

                    {host && (
                         <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-500 border-b pb-2 mb-4">Host</h2>
                            <div className="flex justify-center">
                               <Participant user={host} isHost={true} isSpeaking={!!activeSpeakers[host.agoraUid]} />
                            </div>
                        </div>
                    )}
                    
                    {speakers.filter(s => s.userId !== host?.userId).length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-500 border-b pb-2 mb-4 flex items-center gap-2"><MicrophoneIcon className="w-6 h-6"/> Speakers</h2>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                               {speakers.filter(s => s.userId !== host?.userId).map(user => <Participant key={user.userId} user={user} isSpeaking={!!activeSpeakers[user.agoraUid]} />)}
                            </div>
                        </div>
                    )}

                    {listeners.filter(l => !speakerIdMap.has(l.userId)).length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-gray-500 border-b pb-2 mb-4 flex items-center gap-2"><UsersIcon className="w-6 h-6"/> Listeners</h2>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                               {listeners.filter(l => !speakerIdMap.has(l.userId)).map(user => <Participant key={user.userId} user={user} isSpeaking={!!activeSpeakers[user.agoraUid]} />)}
                            </div>
                        </div>
                    )}

                    <div className="absolute bottom-0 left-0 w-full bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] flex justify-center rounded-b-2xl">
                        <button onClick={toggleMute} className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-red-500' : 'bg-green-500'}`}>
                            {isMuted ? <MutedMicrophoneIcon className="w-8 h-8 text-white" /> : <MicrophoneIcon className="w-8 h-8 text-white" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
