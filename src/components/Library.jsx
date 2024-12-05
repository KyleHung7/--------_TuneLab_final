import React, { useEffect, useState } from "react";


const Library = ({
    songs,
    setCurrentSong,
    setLibraryStatus,
    libraryStatus,
}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const handleSongClick = (song) => {
        setCurrentSong(song);
        if (isMobile) {
            setLibraryStatus(false);
        }
        document.getElementById('music-player').scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const handleResize = () => {
            const mobileView = window.innerWidth < 768;
            setIsMobile(mobileView);
            if (mobileView) {
                setLibraryStatus(true);
            } else {
                setLibraryStatus(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [setLibraryStatus]);

    return (
        <div 
            className={`fixed top-0 left-0 h-full bg-[#42522b] shadow-[2px_2px_50px_rgba(0,0,0,0.205)] 
            overflow-scroll transform transition-all duration-200 ease-in-out 
            ${libraryStatus ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'} 
            ${isMobile ? 'w-full z-50' : 'w-1/5 z-40'}`}
        >
            <h2 className="text-center text-white mb-4 text-2xl font-bold">Library</h2>
            <div className="p-4">
                {songs.map((song) => (
                    <div 
                        key={song.id} 
                        className="flex items-center justify-between p-2 mb-2 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition duration-200"
                        onClick={() => handleSongClick(song)}
                    >
                        <div className="flex flex-col">
                            <span className="text-white font-semibold">{song.name}</span>
                            <span className="text-gray-400 text-sm">{song.artist}</span>
                        </div>
                        <span className="text-gray-400 text-sm">▶</span> {/* Play icon or indicator */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Library;