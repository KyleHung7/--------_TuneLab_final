import React from "react";
const LibrarySong = ({
    song,
    songs,
    setCurrentSong,
    audioRef,
    isPlaying,
    setSongs,

}) => {
    const songSelectHandler = async () => {
        // Select the song that was clicked
        const selectedSong = song;
        
        // Update active states first
        const newSongs = songs.map((s) => ({
            ...s,
            active: s.id === song.id
        }));
        setSongs(newSongs);

        // Force the current song update
        await setCurrentSong({
            ...selectedSong,
            active: true,
        });

        // Play if needed
        if (isPlaying) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                try {
                    await playPromise;
                } catch (error) {
                    console.error("Playback failed:", error);
                }
            }
        }
    };

    return (
        <div
            onClick={songSelectHandler}
            className={`flex items-center p-4 px-8 hover:bg-[#78f8a0] ${song.active ? 'bg-[#ffe6ff]' : ''}`}
        >
            <img src={song.cover} alt={song.name} className="w-[30%]" />
            <div className="pl-4">
                <h3 className={`text-white text-base ${song.active ? 'text-[#306b26]' : ''}`}>
                    {song.name}
                </h3>
                <h4 className="text-gray-500 text-xs">
                    {song.artist}
                </h4>
            </div>
        </div>
    );
};

export default LibrarySong;
