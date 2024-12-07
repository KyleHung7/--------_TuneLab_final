import React from "react";

const Song = ({ currentSong, isPlaying }) => {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <img 
                src={currentSong.cover} 
                alt={currentSong.name} 
                className={`mt-[-25px] w-[20%] md:w-[16%] ${isPlaying ? 'animate-spin-slow' : ''}`}
            />
            <h2 className="text-2xl font-bold pt-12 px-4 pb-4">{currentSong.name}</h2>
            <h3 className="text-base text-gray-800">{currentSong.artist}</h3>
        </div>
    );
};

export default Song;