import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlay,
    faAngleLeft,
    faAngleRight,
    faPause,
    faSyncAlt,
    faSync,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";

const Player = ({
    currentSong,
    isPlaying,
    setIsPlaying,
    audioRef,
    setSongInfo,
    songInfo,
    skipTrackHandler,
}) => {
    // Event Handlers
    const dragHandler = (e) => {
        audioRef.current.currentTime = e.target.value;
        setSongInfo({ ...songInfo, currentTime: e.target.value });
    };

    const playSongHandler = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause(); // 暫停當前播放
                setIsPlaying(false);
            } else {
                audioRef.current.play(); // 播放當前歌曲
                setIsPlaying(true);
            }
        }
    };

    const getTime = (time) =>
        Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2);

    // Adding the styles
    const trackAnim = {
        transform: `translateX(${songInfo.animationPercentage}%)`,
    };

    const [isLooping, setIsLooping] = useState(false);

    const toggleLoop = () => {
        const audio = audioRef.current;
        if (audio) {
            audio.loop = !audio.loop;
            setIsLooping(audio.loop);
        }
    };

    return (
        <div className="mt-[-20px] min-h-[20vh] flex flex-col items-center justify-between">
            {/* Time Control */}
            <div className="w-full flex items-center md:w-[58%]">
                <p className="p-2 font-bold text-sm md:text-lg">
                    {getTime(songInfo.currentTime)}
                </p>
                <div
                    style={{
                        background: `linear-gradient(to right, ${currentSong.color[0]}, ${currentSong.color[1]})`,
                    }}
                    className="relative min-w-[200px] w-full h-3 rounded-full overflow-hidden bg-lightblue"
                >
                    <input
                        min={0}
                        max={songInfo.duration || 0}
                        value={songInfo.currentTime}
                        onChange={dragHandler}
                        type="range"
                        className="absolute top-0 left-0 w-full h-full bg-transparent cursor-pointer appearance-none focus:outline-none
                        [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 
                        [&::-webkit-slider-track]:h-full"
                        style={{ height: "100%" }}
                    />
                    <div
                        style={trackAnim}
                        className="absolute top-0 left-0 w-full h-full bg-[rgb(204,204,204)] pointer-events-none"
                    ></div>
                </div>
                <p className="p-2 font-bold text-sm md:text-lg">
                    {songInfo.duration ? getTime(songInfo.duration) : "00:00"}
                </p>
            </div>

            {/* Play Control */}
            <div className="mt-[-8px] flex justify-center items-center p-2 w-full">
                <FontAwesomeIcon
                    onClick={() => skipTrackHandler("skip-back")}
                    size="2x"
                    className="cursor-pointer mx-4 w-40"
                    icon={faAngleLeft}
                />
                {!isPlaying ? (
                    <FontAwesomeIcon
                        onClick={playSongHandler}
                        size="2x"
                        className="cursor-pointer mx-2"
                        icon={faPlay}
                    />
                ) : (
                    <FontAwesomeIcon
                        onClick={playSongHandler}
                        size="2x"
                        className="cursor-pointer mx-2"
                        icon={faPause}
                    />
                )}
                <FontAwesomeIcon
                    onClick={() => skipTrackHandler("skip-forward")}
                    size="2x"
                    className="cursor-pointer mx-4 w-40"
                    icon={faAngleRight}
                />
            </div>

            {/* Player Song */}
            <div className="flex flex-col items-center justify-center p-5">
                <button
                    onClick={toggleLoop}
                    className="mt-[-8px] px-4 py-2 text-sm md:text-base text-white bg-[#4b0082] rounded 
                    cursor-pointer transition-colors duration-300 hover:bg-[#3a0066] 
                    flex items-center border-none"
                >
                    <FontAwesomeIcon
                        icon={isLooping ? faSyncAlt : faSync}
                        className="mr-2"
                    />
                    {isLooping ? "Looping" : "Not Looping"}
                </button>
            </div>
        </div>
    );
};

export default Player;
